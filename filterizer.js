(function ($) {

    var defaults = {
        'newItemButton': '.filterizer-new-item',
        'filters': [],
        'modifiers': []
    };

    var itemTemplate = '' +
        '<div class="filterizer-item">' +
            '<div class="filterizer-item-field">' +
                '<select name="field"></select>' +
            '</div>' +
            '<div class="filterizer-item-modifier">' +
                '<select name="modifier"></select>' +
            '</div>' +
            '<div class="filterizer-item-value"></div>' +
            '<div class="filterizer-item-actions">' +
                '<a class="filterizer-item-remove-link">&#10060;</a>' +
            '</div>' +
        '</div>';

    $.fn.filterizer = function(options) {
        var holder = this;

        var plugin = {
            'filter_index': 0,
            'settings': $.extend(defaults, options),

            'create_filter': function() {
                holder.append(createFilter());
            },
            'get_new_filter': function() {
                return createFilter();
            },
            'save_state': function() {
                saveState();
            },
            'load_state': function() {
                loadState();
            },
            'clear_state': function() {
                clearState();
            },
            'get_location_search': function() {
                return getLocationSearch();
            },
            'restore_filters': function() {
                restoreFilters();
            }
        };

        /**
         * Creates new filter
         *
         * @return object
         */
        function createFilter() {
            var filter = $(itemTemplate),
                index  = 0,
                type   = plugin.settings.filters[index].type,
                id     = plugin.filter_index;

            filter.data('id', id);

            filter.find('.filterizer-item-field select').append(getFiltersOptions());
            filter.find('.filterizer-item-field select').attr('name', 'filterizer[' + id + '][field]');

            filter.find('.filterizer-item-modifier select').append(getModifiersOptions(type));
            filter.find('.filterizer-item-modifier select').attr('name', 'filterizer[' + id + '][modifier]');

            filter.find('.filterizer-item-value').append(getFilterValue(filter));
            filter.find('.filterizer-item-value').children().attr('name', 'filterizer[' + id + '][value]');

            if (type == 'select') {
                filter.find('.filterizer-item-modifier').addClass('hidden');
            }

            filter.addClass('filter-' + id);
            plugin.filter_index++;

            triggerEvent('filterizer.filtercreate', {
                'filter': filter,
                'index': index,
                'type': type,
                'id': id
            });

            return filter;
        }

        /**
         * Restores filters from GET params
         */
        function restoreFilters() {
            var get_params = parseLocationSearch();

            $.each(get_params, function(index, params) {
                var filter = $(itemTemplate),
                    id = plugin.filter_index;

                filter.data('id', id);

                filter.find('.filterizer-item-field select').append(getFiltersOptions());
                filter.find('.filterizer-item-field select option').removeAttr('selected');
                filter.find('.filterizer-item-field select option[value="' + params.field + '"]').attr('selected', 'selected');
                filter.find('.filterizer-item-field select').attr('name', 'filterizer[' + id + '][field]');

                var type = getType(filter);

                filter.find('.filterizer-item-modifier select').append(getModifiersOptions(type));
                filter.find('.filterizer-item-modifier select').attr('name', 'filterizer[' + id + '][modifier]');

                if (type == 'select') {
                    filter.find('.filterizer-item-modifier').addClass('hidden');
                } else {
                    filter.find('.filterizer-item-modifier select option').removeAttr('selected');
                    filter.find('.filterizer-item-modifier select option[value="' + params.modifier + '"]').attr('selected', 'selected');
                }

                filter.find('.filterizer-item-value').append(getFilterValue(filter));
                filter.find('.filterizer-item-value').children().attr('name', 'filterizer[' + id + '][value]');

                if (type == 'select') {
                    filter.find('.filterizer-item-value select option').removeAttr('selected');
                    filter.find('.filterizer-item-value select option[value="' + params.value + '"]').attr('selected', 'selected');
                } else {
                    filter.find('.filterizer-item-value input').val(decodeURI(params.value));
                }

                plugin.filter_index++;

                triggerEvent('filterizer.filterrestore', {
                    'filter': filter,
                    'index': getIndex(filter),
                    'type': type,
                    'id': id
                });

                holder.append(filter);
            });

            triggerEvent('filterizer.restorecomplete');
        }

        /**
         * Get filters to field select
         *
         * @return Array
         */
        function getFiltersOptions() {
            var options = [],
                filter_index = 0;
            $.each(plugin.settings.filters, function(index, filter) {
                var option = $('<option value="' + filter.value + '" data-type="' + filter.type + '" data-index="' + index + '">' + filter.title + '</option>');

                if (filter.multiple === false && filterIsActive(index)) {
                    option.hide();
                } else {
                    if (filter_index === 0) {
                        option.attr('selected', 'selected');
                    }
                    filter_index++;
                }

                options.push(option);
            });

            return options;
        }

        /**
         * Get modifiers for current filter
         *
         * @param {string} type Type of field
         *
         * @return Array
         */
        function getModifiersOptions(type) {
            var modifier_index = 0,
                options = [];

            if (type == 'select') {
                var option = $('<option value="=">=</option>');
                option.attr('selected', 'selected');
                options.push(option);
            } else {
                $.each(plugin.settings.modifiers, function (index, modifier) {
                    // if modifier type is valid for current selected filter type or modifier is valid for everything
                    if (modifier.validFor === undefined || modifier.validFor.indexOf(type) >= 0) {
                        var option = $('<option value="' + modifier.value + '">' + modifier.title + '</option>');
                        if (modifier_index === 0) {
                            option.attr('selected', 'selected');
                        }
                        options.push(option);
                        modifier_index++;
                    }
                });
            }

            return options;
        }

        /**
         * Get options for current select filter
         *
         * @param {Array} data Data for select
         *
         * @return Array
         */
        function getSelectOptions(data) {
            var options = [];
            $.each(data, function (index, record) {
                var option = $('<option value="' + record.value + '">' + record.title + '</option>');
                if (index === 0) {
                    option.attr('selected', 'selected');
                }

                options.push(option);
            });

            return options;
        }

        /**
         * Returns value field depending on filter info
         *
         * @param {object} filter jQuery DOM object
         *
         * @return object
         */
        function getFilterValue(filter) {
            var type  = getType(filter),
                index = getIndex(filter),
                data  = plugin.settings.filters[index].data,
                attrs = plugin.settings.filters[index].attrs,
                result_object;

            if (type === 'select') {
                result_object = $('<select name="value"></select>');
                result_object.append(getSelectOptions(data));
            } else {
                result_object = $('<input type="' + type + '" name="value">');
            }

            if (attrs !== undefined) {
                $.each(attrs, function (attr, value) {
                    result_object.attr(attr, value);
                });
            }

            return result_object;
        }

        /**
         * Checks if filter is selected in any instances
         *
         * @return boolean
         */
        function filterIsActive(index) {
            return $('.filterizer-item-field option[data-index="' + index + '"]:selected').length > 0;
        }

        /**
         * Get filter type
         *
         * @param {object} filter Filter instance
         *
         * @return string
         */
        function getType(filter) {
            return filter.find('.filterizer-item-field option:selected').data('type');
        }

        /**
         * Get filter index
         *
         * @param {object} filter Filter instance
         *
         * @return int
         */
        function getIndex(filter) {
            return filter.find('.filterizer-item-field option:selected').data('index');
        }

        /**
         * Get filter id
         *
         * @param {object} filter Filter instance
         *
         * @return int
         */
        function getId(filter) {
            return filter.data('id');
        }

        /**
         * Checks if there are hidden inactive filters
         */
        function checkHiddenFilters() {
            $.each(plugin.settings.filters, function(index) {
                if (!filterIsActive(index)) {
                    $('.filterizer-item-field option[data-index="' + index + '"]').show();
                    plugin.settings.filters[index].hidden = false;
                }
            });
        }

        /**
         * Saves filters state to localStorage
         *
         * @return boolean
         */
        function saveState() {
            var success = false;

            if (localStorageAvailable()) {
                var state = '';
                $('.filterizer-item').each(function () {
                    // saving values for inputs
                    $(this).find('input').each(function() {
                        $(this).val($(this).val());
                    });

                    // selecting selects
                    $(this).find('select').each(function() {
                        var selected = $(this).find('option:selected');
                        $(this).find('option').removeAttr('selected');
                        selected.attr('selected', 'selected');
                    });

                    state = state + $(this).prop('outerHTML');
                });
                localStorage.setItem('filterizer-' + window.location, state);

                success = true;
            }

            triggerEvent('filterizer.savestate', {'result': success});

            return success;
        }

        /**
         * Loads filters state from localStorage
         */
        function loadState() {
            var success = false;

            if (localStorageAvailable()) {
                var state = localStorage.getItem('filterizer-' + window.location);
                if (state) {
                    $(holder).append($(state));

                    success = true;
                }
            }

            triggerEvent('filterizer.loadstate', {'result': success});

            return success;
        }

        /**
         * Clears filters state from localStorage
         */
        function clearState() {
            if (localStorageAvailable()) {
                localStorage.removeItem('filterizer-' + window.location);
            }

            triggerEvent('filterizer.clearstate');
        }

        /**
         * Checks if localStorage available
         *
         * @return boolean
         */
        function localStorageAvailable() {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false
            }
        }

        /**
         * Triggers custom event
         *
         * @param {string} eventName Event name
         * @param {Object} values    Event values
         */
        function triggerEvent(eventName, values) {
            var event = $.Event(eventName);

            if (values && values !== undefined) {
                event.filterizerData = values;
            }

            holder.trigger(event);
        }

        /**
         * Compiles filters into GET http parameters
         *
         * @return string
         */
        function getLocationSearch() {
            var location_search = [];

            $('.filterizer-item').each(function() {
                var id = getId($(this)),
                    type  = getType($(this)),
                    location_part = [];

                var field = $(this).find('.filterizer-item-field option:selected').val(),
                    modifier = $(this).find('.filterizer-item-modifier option:selected').val(),
                    value = type == 'select'
                        ? $(this).find('.filterizer-item-value option:selected').val()
                        : $(this).find('.filterizer-item-value input').val();

                location_part.push('filterizer[' + id + '][field]=' + encodeURI(field));
                if (modifier && modifier !== undefined) {
                    location_part.push('filterizer[' + id + '][modifier]=' + encodeURI(modifier));
                }
                location_part.push('filterizer[' + id + '][value]=' + encodeURI(value));

                location_search.push(location_part.join('&'));
            });

            return location_search.join('&');
        }

        /**
         * Parses http GET params to extract filters data
         *
         * @return Array
         */
        function parseLocationSearch() {
            var origin_string = location.search.substring(1),
                origin_array  = origin_string.split('&'),
                result_array  = [];

            var re = /filterizer\[(\d*)\]\[(.*?)\]=(.*)/i;

            $.each(origin_array, function(index, record) {
                if (record.indexOf('filterizer') === 0) {
                    var found = record.match(re),
                        num = found[1],
                        title = found[2],
                        value = found[3];

                    if (!result_array[num] || result_array === undefined) {
                        result_array[num] = {};
                    }

                    var info_obj = {};
                    info_obj[title] = value;

                    $.extend(result_array[num], info_obj);
                }
            });

            return result_array;
        }

        /** EVENTS */

        // create new filter
        $(holder).on('click', plugin.settings.newItemButton, function() {
            var filter = createFilter(),
                index  = getIndex(filter),
                type   = getType(filter),
                id     = getId(filter);

            holder.append(filter);
        });

        // remove filter
        $(holder).on('click', '.filterizer-item-remove-link', function() {
            var filter = $(this).closest('.filterizer-item'),
                index  = getIndex(filter),
                type   = getType(filter),
                id     = getId(filter);

            if (plugin.settings.filters[index].multiple === false) {
                $('.filterizer-item-field option[data-index="' + index + '"]').show();
            }

            // triggered just before delete
            triggerEvent('filterizer.filterremove', {
                'filter': filter,
                'index': index,
                'type': type,
                'id': id
            });

            filter.remove();
        });

        // field select changed
        $(holder).on('change', '.filterizer-item-field select', function() {
            var filter = $(this).closest('.filterizer-item'),
                index  = getIndex(filter),
                type   = getType(filter),
                id     = getId(filter);

            // clearing old data
            filter.find('.filterizer-item-modifier select').remove();
            filter.find('.filterizer-item-modifier').addClass('hidden');
            filter.find('.filterizer-item-value').empty();

            // refilling data
            filter.find('.filterizer-item-value').append(getFilterValue(filter));
            filter.find('.filterizer-item-value').children().attr('name', 'filterizer[' + id + '][value]');

            var modifier = $('<select name="filterizer[' + id + '][modifier]"></select>');
            modifier.append(getModifiersOptions(type));
            filter.find('.filterizer-item-modifier').append(modifier);
            if (type !== 'select') {
                filter.find('.filterizer-item-modifier').removeClass('hidden');
            }

            checkHiddenFilters();

            // checking for multiple = false
            if (plugin.settings.filters[index].multiple === false) {
                $('.filterizer-item-field option:not(:selected)[data-index="' + index + '"]').hide();
                plugin.settings.filters[index].hidden = true;
            }

            triggerEvent('filterizer.filterchange', {
                'filter': filter,
                'index': index,
                'type': type,
                'id': id
            });
        });

        return plugin;
    };

}(jQuery));