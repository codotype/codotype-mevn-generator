# codotype-mevn-generator
Codotype generator for Vue.js, Vue Router, Vuex, & Bootstrap 4

## SCRATCHPAD FOR GENERATOR OPTIONS

```
{
  option_groups: [
    {
      id: '123',
      order: 0,
      type: 'MODEL_ADDON',
      "label": "API Actions",
      "label_plural": "API Actions",
      "identifier": "api_action",
      "identifier_plural": "api_actions",
      "class_name": "ApiAction",
      "class_name_plural": "ApiActions",
      "description": "Generate UI components and REST API endpoints for individual models in your Blueprint",
      "more_info_url": null,
      "attributes": [
        {
          "label": "VERB",
          "identifier": "verb",
          "datatype": "TEXT",
          "help": "The REST API verb for this API Action",
          "default_value": "GET",
          "required": true,
          "unique": false
        },
        {
          "label": "Route",
          "identifier": "route",
          "datatype": "TEXT",
          "help": "The route of this page (prefix with /)",
          "default_value": "/stats",
          "required": true,
          "unique": false
        },
        {
          "label": "Scope",
          "identifier": "scope",
          "datatype": "TEXT",
          "help": "The scope of the route (model root, or model instance)",
          "default_value": "INSTANCE",
          "required": true,
          "unique": false
        },
        {
          "label": "Label",
          "identifier": "Label",
          "datatype": "TEXT",
          "help": "The label for the API Action",
          "default_value": "About",
          "required": true,
          "unique": false
        }
      ]
    },
    {
      id: '222',
      order: 1,
      type: 'ADDON',
      ....
    },
    {
      id: '333',
      order: 2,
      type: 'OPTION',
      label: 'Global Options',
      identifier: 'global_options',
      ....
    },
    {
      id: '444',
      order: 3,
      type: 'MODEL_OPTION',
      label: 'Model Configuration',
      identifier: 'model_configuration'
      ....
    },
    {
      id: '555',
      order: 4,
      type: 'SEED_DATA',
      label: 'Seed Data',
      identifier: 'seed_data'
      ....
    },
  ]
}
```