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

            'create_filter': function () {
                holder.append(createFilter());
            },
            'save_state': function () {
                saveState();
            },
            'load_state': function () {
                loadState();
            },
            'clear_state': function () {
                clearState();
            }
        };

        /**
         * Creates new filter
         *
         * @return object
         */
        function createFilter() {
            var filter = $(itemTemplate);

            filter.data('id', plugin.filter_index);

            filter.find('.filterizer-item-field select').append(getFiltersOptions());
            filter.find('.filterizer-item-field select').attr('name', 'filterizer[' + plugin.filter_index + '][field]');

            filter.find('.filterizer-item-modifier select').append(getModifiersOptions(plugin.settings.filters[0].type));
            filter.find('.filterizer-item-modifier select').attr('name', 'filterizer[' + plugin.filter_index + '][modifier]');

            filter.find('.filterizer-item-value').append(getFilterValue(filter));
            filter.find('.filterizer-item-value').children().attr('name', 'filterizer[' + plugin.filter_index + '][value]');

            if (getType(filter) == 'select') {
                filter.find('.filterizer-item-modifier select').remove();
                filter.find('.filterizer-item-modifier').addClass('hidden');
            }

            filter.addClass('filter-' + plugin.filter_index);
            plugin.filter_index++;

            return filter;
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
            $.each(plugin.settings.modifiers, function(index, modifier) {
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

                return true;
            }

            return false;
        }

        /**
         * Loads filters state from localStorage
         */
        function loadState() {
            if (localStorageAvailable()) {
                var state = localStorage.getItem('filterizer-' + window.location);
                if (state) {
                    $(holder).append($(state));
                }
            }
        }

        /**
         * Clears filters state from localStorage
         */
        function clearState() {
            if (localStorageAvailable()) {
                localStorage.removeItem('filterizer-' + window.location);
            }
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

        /** EVENTS */

        // create new filter
        $(holder).on('click', plugin.settings.newItemButton, function() {
            plugin.create_filter();
        });

        // remove filter
        $(holder).on('click', '.filterizer-item-remove-link', function() {
            var filter = $(this).closest('.filterizer-item'),
                index  = getIndex(filter);

            if (plugin.settings.filters[index].multiple === false) {
                $('.filterizer-item-field option[data-index="' + index + '"]').show();
            }

            $(this).closest('.filterizer-item').remove();
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
            if (type !== 'select') {
                var modifier = $('<select name="filterizer[' + id + '][modifier]"></select>');
                    modifier.append(getModifiersOptions(type));
                filter.find('.filterizer-item-modifier').append(modifier);
                filter.find('.filterizer-item-modifier').removeClass('hidden');
            }

            checkHiddenFilters();

            // checking for multiple = false
            if (plugin.settings.filters[index].multiple === false) {
                $('.filterizer-item-field option:not(:selected)[data-index="' + index + '"]').hide();
                plugin.settings.filters[index].hidden = true;
            }
        });

        return plugin;
    };

}(jQuery));