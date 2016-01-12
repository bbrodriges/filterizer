$(function() {
    
    $('.filterizer').bind('filterizer.init', function() {
        console.log('filterizer has been inited');
    });

    var filterizer = $('.filterizer').filterizer({
        'filters': [
            {
                'value': 'id',
                'title': 'ID',
                'type': 'number',
                'attrs': {
                    'min': 1,
                    'max': 1024
                }
            },
            {
                'value': 'retailer',
                'title': 'Retailer',
                'type': 'select',
                'data': [
                    {
                        'value': 1,
                        'title': 'Walmart'
                    },
                    {
                        'value': 2,
                        'title': 'Amazon'
                    },
                    {
                        'value': 3,
                        'title': 'Apple'
                    },
                    {
                        'value': 4,
                        'title': 'Best Buy'
                    },
                ]
            },
            {
                'value': 'description',
                'title': 'Description',
                'type': 'text'
            },
            {
                'value': 'isActive',
                'title': 'State',
                'type': 'select',
                'multiple': false,
                'data': [
                    {
                        'value': 1,
                        'title': 'Active'
                    },
                    {
                        'value': 0,
                        'title': 'Inactive'
                    }
                ]
            },
            {
                'value': 'created_by',
                'title': 'Created by',
                'type': 'select',
                'multiple': false,
                'data': [
                    {
                        'value': 0,
                        'title': 'Anyone'
                    },
                    {
                        'value': 1,
                        'title': 'Only me'
                    }
                ]
            }
        ],
        'modifiers': [
            {
                'value': '=',
                'title': '=',
                'validFor': 'number'
            },
            {
                'value': '<>',
                'title': '!=',
                'validFor': 'number'
            },
            {
                'value': '<',
                'title': '<',
                'validFor': 'number'
            },
            {
                'value': '>',
                'title': '>',
                'validFor': 'number'
            },
            {
                'value': '<=',
                'title': '&le;',
                'validFor': 'number'
            },
            {
                'value': '>=',
                'title': '&ge;',
                'validFor': 'number'
            },
            {
                'value': 'cont',
                'title': 'contains',
                'validFor': 'text'
            },
            {
                'value': 'dncont',
                'title': 'does not contain',
                'validFor': 'text'
            }
        ]
    });

    /** STATE METHODS */
    $('.filterizer').on('click', '.filterizer-save-state', function() {
        filterizer.save_state();
    });

    $('.filterizer').on('click', '.filterizer-clear-state', function() {
        filterizer.clear_state();
    });
    $('.filterizer').on('click', '.filterizer-load-state', function() {
        filterizer.load_state();
    });

    /** FILTERIZER EVENTS */
    $('.filterizer').bind('filterizer.filtercreate', function(e) {
        console.log(e.filterizerData);
    });

    $('.filterizer').bind('filterizer.filterchange', function(e) {
        console.log(e);
    });

    $('.filterizer').bind('filterizer.filterremove', function(e) {
        console.log(e);
    });

    $('.filterizer').bind('filterizer.savestate', function(e) {
        console.log(e);
    });

    $('.filterizer').bind('filterizer.loadstate', function(e) {
        console.log(e);
    });

    $('.filterizer').bind('filterizer.clearstate', function() {
        console.log('cleared');
    });

    // restore filters from get params (see filterizer.get_location_search())
    if (window.location.search.substring(1)) { 
        filterizer.restore_filters();
    }

});