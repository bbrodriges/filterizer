$(function() {
    $('.filterizer').filterizer({
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

});