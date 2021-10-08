# Switch Vscode Keys
```json
{
  "description": "switch vscode keys",
  "manipulators": [
    {
      "type": "basic",
      "from": {
        "key_code": "left_command"
      },
      "to": [
        {
          "key_code": "left_option"
        }
      ],
      "conditions": [
        {
          "type": "frontmost_application_unless",
          "bundle_identifiers": ["^com\\.microsoft\\.VSCode$"]
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "left_option"
      },
      "to": [
        {
          "key_code": "left_command"
        }
      ],
      "conditions": [
        {
          "type": "frontmost_application_unless",
          "bundle_identifiers": ["^com\\.microsoft\\.VSCode$"]
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "left_command"
      },
      "to": [
        {
          "key_code": "left_option"
        }
      ],
      "conditions": [
        {
          "type": "frontmost_application_if",
          "bundle_identifiers": ["^com\\.microsoft\\.VSCode$"]
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "left_control"
      },
      "to": [
        {
          "key_code": "left_command"
        }
      ],
      "conditions": [
        {
          "type": "frontmost_application_if",
          "bundle_identifiers": ["^com\\.microsoft\\.VSCode$"]
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "left_option"
      },
      "to": [
        {
          "key_code": "left_control"
        }
      ],
      "conditions": [
        {
          "type": "frontmost_application_if",
          "bundle_identifiers": ["^com\\.microsoft\\.VSCode$"]
        }
      ]
    }
  ]
}
```
