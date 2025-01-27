<!--
 ___ _            _ _    _ _    __
/ __(_)_ __  _ __| (_)__(_) |_ /_/
\__ \ | '  \| '_ \ | / _| |  _/ -_)
|___/_|_|_|_| .__/_|_\__|_|\__\___|
            |_| 
-->
![](https://platform.simplicite.io/logos/standard/logo250.png)
* * *

`AIBySimplicite` module definition
==================================

### Introduction
Exploratory module on the use of AI in Simplicite

---

### Import
To import this module, you have two options:

#### Option 1: Git Repository

1. Create a module named `AIBySimplicite`.
2. Set the settings as:
```json
{
	"origin": {
		"uri": "https://github.com/simplicitesoftware/module_ai.git"
	},
	"type": "git",
	"branch": "6.1"
}
```
3. Click on the Import module button.

#### Option 2: App Store

1. Navigate to the App Store in the Project domain.
2. Go to the Tools tab.
3. Select "AI integrations" from the list.
4. Follow the on-screen instructions to import the module.

---

### Configure
To configure the AI connection, utilize the `configuring the wizard` process in the `AI assistant` domain in extended mode.

Select the model (LLM) you wish to use, configure the API key, and the URL of your API.

**Follow the process:**

After configuring, you will obtain the details of your now active configuration. This summary is available on the homepage of the domain.

<details>
  <summary>Parameters details</summary>

##### hist_depth
Defines the number of messages in the history used for the context. The greater this number, the more tokens the request uses, but the more relevant is the response.

##### max_token
*optional*  
Limits the number of tokens in the AI response.

###### default_max_token
Maximum number of tokens in a usual context.

###### code_max_token
Maximum number of tokens for technical calls.

</details>

---

### wizzard
#### Module generation
Use AI to co-create or update a module based on your business needs
`Module generation` in `AI assistant` domain.

#### Data generation
Use AI to generate test data for a module.
`Data generation` in `AI assistant` domain.

#### Business chatbot
A shortcut to a chatbot contextualized according to the form on which it is opened.
The user must have `AI_BUSINESS` rights.
The `Personal data`, `Confidential data` and `Intimate` fields are not sent to the AI.


#### Metrics
Generating AI graphs on a module's data
In a `view` add an `external page` of source `External object`: `AIMetricsChat?module=<you_module_name>`

For detailed examples on how to generate modules, interact with business chatbots, and visualize metrics, please refer to the example available at the following link:
[Explore AI Assistant Prompt Examples](https://github.com/simplicitesoftware/module_ai/blob/51425242c08e8f224ecc8d15ebcd80ca8b205d4c/EXAMPLE.md)

`AiGroupGuiDesc` business object definition
-------------------------------------------



### Fields

| Name                                                         | Type                                     | Required | Updatable | Personal | Description                                                                      |
|--------------------------------------------------------------|------------------------------------------|----------|-----------|----------|----------------------------------------------------------------------------------|
| `aiGgdDescription`                                           | text(50000)                              | yes      |           |          | -                                                                                |
| `aiGgdViewhomeId` link to **`ViewHome`**                     | id                                       | yes*     | yes       |          | -                                                                                |
| _Ref. `aiGgdViewhomeId.viw_name`_                            | _char(100)_                              |          |           |          | -                                                                                |
| `aiGgdLang`                                                  | enum(100) using `LANG` list              | yes*     |           |          | -                                                                                |

### Lists

* `LANG`
    - `ENU` English language
    - `FRA` French language

### Custom actions

* `AI_UPDATE_DESC`: 
* `AI_UPDATE_DESC_GLOBAL`: 

`AiGroupView` business object definition
----------------------------------------



### Fields

| Name                                                         | Type                                     | Required | Updatable | Personal | Description                                                                      |
|--------------------------------------------------------------|------------------------------------------|----------|-----------|----------|----------------------------------------------------------------------------------|
| `aiGroupGuiDescId` link to **`AiGroupGuiDesc`**              | id                                       | yes*     | yes       |          | -                                                                                |
| _Ref. `aiGroupGuiDescId.aiGgdViewhomeId`_                    | _id_                                     |          |           |          | -                                                                                |
| _Ref. `aiGgdViewhomeId.viw_name`_                            | _char(100)_                              |          |           |          | -                                                                                |
| _Ref. `aiGroupGuiDescId.aiGgdLang`_                          | _enum(100) using `LANG` list_            |          |           |          | -                                                                                |
| `aiGroupId` link to **`Group`**                              | id                                       | yes*     | yes       |          | -                                                                                |
| _Ref. `aiGroupId.grp_name`_                                  | _regexp(100)_                            |          |           |          | -                                                                                |
| `aiAigroupviewUsed`                                          | boolean                                  | yes      | yes       |          | -                                                                                |

### Lists

* `LANG`
    - `ENU` English language
    - `FRA` French language

`AiMetricsHist` business object definition
------------------------------------------



### Fields

| Name                                                         | Type                                     | Required | Updatable | Personal | Description                                                                      |
|--------------------------------------------------------------|------------------------------------------|----------|-----------|----------|----------------------------------------------------------------------------------|
| `aiMhSimpleuserId` link to **`User`**                        | id                                       | yes*     | yes       |          | -                                                                                |
| _Ref. `aiMhSimpleuserId.usr_login`_                          | _regexp(100)_                            |          |           | yes      | _Login_                                                                          |
| `aiMhCreateOn`                                               | datetime                                 | yes*     | yes       |          | -                                                                                |
| `aiMhModuleId` link to **`Module`**                          | id                                       | yes*     | yes       |          | -                                                                                |
| _Ref. `aiMhModuleId.mdl_name`_                               | _regexp(100)_                            |          |           |          | _Module name_                                                                    |
| `aiMhMetrics`                                                | text(10000)                              |          | yes       |          | -                                                                                |
| `aiMhPreview`                                                | html(10000)                              |          |           |          | -                                                                                |
| `aiMhPrompt`                                                 | char(1000)                               |          | yes       |          | -                                                                                |

`AIProvider` business object definition
---------------------------------------



### Fields

| Name                                                         | Type                                     | Required | Updatable | Personal | Description                                                                      |
|--------------------------------------------------------------|------------------------------------------|----------|-----------|----------|----------------------------------------------------------------------------------|
| `aiPrvProvider`                                              | char(100)                                | yes*     | yes       |          | -                                                                                |
| `aiPrvDefaultUrl`                                            | url(100)                                 | yes      | yes       |          | -                                                                                |
| `aiPrvDataModel`                                             | text(1000)                               | yes      |           |          | -                                                                                |
| `aiPrvModelsUrl`                                             | url(100)                                 | yes      | yes       |          | -                                                                                |
| `aiPrvHelp`                                                  | text(5000)                               |          | yes       |          | -                                                                                |
| `aiPrvCompletionUrl`                                         | url(100)                                 | yes      | yes       |          | -                                                                                |
| `aiPrvPingUrl`                                               | url(100)                                 |          | yes       |          | -                                                                                |
| `aiPrvSttUrl`                                                | url(100)                                 |          | yes       |          | -                                                                                |
| `aiPrvUserParameters`                                        | text(5000)                               |          | yes       |          | -                                                                                |

### Custom actions

* `AIProvidersImport`: 

`AIGenData` business process definition
---------------------------------------



### Activities

* `GoToSettings`: 
* `Begin`: 
* `End`: 
* `IsParam`: 
* `NoParam`: 
* `SelectModule`: Selection module
* `Confirm`: 
* `GenData`: AI call for data gen

`AIModuleCreate` business process definition
--------------------------------------------

Auomatic model generation process

### Activities

* `Begin`: 
* `End`: 
* `Choice`: 
* `CreateModule`: 
* `TranslateDomain`: 
* `NewScope`: 
* `GrantUser`: 
* `isParam`: 
* `NoParam`: 
* `SelectModule`: Selection module
* `SelectGroup`: Selection group
* `SelectDomain`: Selection Domain
* `interaction`: Chat with the AI
* `Prompt`: Direct chat with the AI
* `AI`: AI for modeling
* `Generation`: Module generation based on ia feedback
* `RemoveModule`: Remove module
* `GoToSettings`: 

`AiSettingsProcess` business process definition
-----------------------------------------------



### Activities

* `isGlobalParam`: 
* `Global`: 
* `SelectProvider`: 
* `Auth`: 
* `OtherParam`: 
* `AddShortCut`: 
* `Begin`: 
* `End`: 

`AIChatBot` external object definition
--------------------------------------

Chat interface


`AIExpTool` external object definition
--------------------------------------

Front tool


`AIMetricsChat` external object definition
------------------------------------------

AI contextual chat for personalised metrics. 
Use parameter "module" to specify context.


`AiMonitoring` external object definition
-----------------------------------------




`AIProcessResource` external object definition
----------------------------------------------

Process resource


`AIPromptTool` external object definition
-----------------------------------------

Tool


`AIRestAPI` external object definition
--------------------------------------

Local API


`AIShortcut` external object definition
---------------------------------------

Chat in shortcut


