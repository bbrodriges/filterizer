# filterizer
Simple multifilter plugin for jQuery. Looks just like iTunes smart playlists form filters&

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