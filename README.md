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

Exploratory module on the use of AI  
Use AI_API_PARAM, AI_API_KEY and AI_API_URL to configure the IA endpoint

`AiSettings` business object definition
---------------------------------------



### Fields

| Name                                                         | Type                                     | Required | Updatable | Personal | Description                                                                      |
|--------------------------------------------------------------|------------------------------------------|----------|-----------|----------|----------------------------------------------------------------------------------|
| `aiSetActive`                                                | boolean                                  | yes      | yes       |          | -                                                                                |
| `aiSetModele`                                                | enum(100) using `AI_CONF_MODELE` list    | yes*     | yes       |          | -                                                                                |
| `aiSetConfig`                                                | text(1000)                               |          |           |          | -                                                                                |
| `aiSetUrl`                                                   | url(100)                                 |          | yes       |          | -                                                                                |

### Lists

* `AI_CONF_MODELE`
    - `MISTRAL` Mistral
    - `OPENAI` OpenAI

### Custom actions

* `AI_ACTIVE_SETTINGS`: 

`AIGenData` business process definition
---------------------------------------



### Activities

* `Begin`: 
* `End`: 
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
* `SelectModule`: Selection module
* `SelectGroup`: Selection group
* `SelectDomain`: Selection Domain
* `interaction`: Chat with the AI
* `Prompt`: Direct chat with the AI
* `AI`: AI for modeling
* `Generation`: Module generation based on ia feedback
* `RemoveModule`: Remove module

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


