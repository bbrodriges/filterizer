# filterizer
Simple multifilter plugin for jQuery. Looks just like iTunes smart playlists form filters.

![alt text](http://img.leprosorium.com/2480847 "example")

# Dependencies
* jQuery 1.11 and higher (though it can work well with older versions)

# Basic example
See `example.html` and `example.js`

# Options
``` javascript
{
    'filters': [ // filters themself
        {
            'value': 'id', // will be placed in "value" attribute of html tag
            'title': 'ID', // will be displayed
            'type': 'number', // input type (allowed: 'text', 'number', 'select')
            'attrs': { // any valid html attributes to be added to field
                'min': 1,
                'max': 1024
            }
        },
        {
            'value': 'retailer',
            'title': 'Retailer',
            'type': 'select',
            'data': [ // data field is used only in 'select filter types'
                {
                    'value': 1, // will be placed in "value" attribute of html tag
                    'title': 'Walmart' // will be displayed
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
            'multiple': false, // prevents more than one filter to have this value
            'data': 'http://mysite.com/activity_states.json' // you can also define URL to get data from
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
    'modifiers': [ // modifiers are what placed between filter and its value (e.g id = 1)
        {
            'value': '=', // will be placed in "value" attribute of html tag
            'title': '=', // will be displayed
            'validFor': 'number' // only shows if 'number' filter selected (remove to show with any filter type)
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
}
```

# Methods
> **``create_filter() -> void``**

> Creates and immediately appends new filter to parent.

> **``get_new_filter() -> Object``**

> Creates and returns jQuery object of new filter.

> **``save_state() -> boolean``**

> Saves HTML representation of filters to localStorage.

> **``load_state() -> boolean``**

> Loads HTML representation of filters form localStorage and immediately appends it parent.

> **``clear_state() -> void``**

> Clears HTML representation of filters from localStorage.

> **``get_location_search() -> String``**

> Returns a string of URI encoded GET params with filters data.

> **``restore_filters() -> void``**

> Restores filters from GET params and immediately appends them to parent.

Example:
```javascript
filterizer.clear_state();
```

# Events

> **``filterizer.init``**

> Triggers on plugin initialization.

> **``filterizer.filtercreate``**

> Triggers when filter object is created. Passes filter object to binded function.

> **``filterizer.filterappend``**

> Triggers when filter appended to parent. Passes filter object to binded function.

> **``filterizer.filterremove``**

> Triggers when filter removed (by pressing cross button). Passes filter object to binded function.

> **``filterizer.filterchange``**

> Triggers when filter type changes. Passes filter object to bind function.

> **``filterizer.savestate``**

> Triggers after state saved to localStorage. Passes boolean representation of saving result to binded function.

> **``filterizer.loadstate``**

> Triggers after state loaded from localStorage. Passes boolean representation of loading result to binded function.

> **``filterizer.clearstate``**

> Triggers after state cleared from localStorage.

> **``filterizer.filterrestore``**

> Triggers after each individual filter has been restored from GET params. Passes filter object to binded function.

> **``filterizer.restorecomplete``**

> Triggers after all filters have been restored from GET params.

Example:
```javascript
$('.filterizer').bind('filterizer.filtercreate', function(e) {
    console.log(e.filterizerData);
});
```

# Pass filters to GET params and restore from them

```javascript
$(function() {
    var filterizer = $('.filterizer').filterizer({...});

    // submit
    $('.filterizer').on('click', '.filterizer-submit', function() {
        var filters_get_params = filterizer.get_location_search(),
            joiner = window.location.search.substring(1) ? '&' : '?';

        window.location.search = joiner + filters_get_params;
    });

    // restoring filters from GET params
    if (window.location.search.substring(1)) {
        filterizer.restore_filters();
    }
});
```