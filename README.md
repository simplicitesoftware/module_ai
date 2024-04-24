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

`AIExemple` business object definition
--------------------------------------

Test object

### Fields

| Name                                                         | Type                                     | Required | Updatable | Personal | Description                                                                      |
|--------------------------------------------------------------|------------------------------------------|----------|-----------|----------|----------------------------------------------------------------------------------|
| `aiExPrompt`                                                 | text(750)                                |          | yes       |          | -                                                                                |
| `aiExResponse`                                               | text(20000)                              |          |           |          | -                                                                                |
| `aiExType`                                                   | enum(100) using `AI_EX_TYPE` list        | yes      | yes       |          | -                                                                                |
| `aiExSpecification`                                          | char(100)                                |          | yes       |          | -                                                                                |
| `aiExOldPrompt`                                              | char(750)                                |          |           |          | -                                                                                |
| `aiExName`                                                   | char(100)                                | yes*     | yes       |          | -                                                                                |

### Lists

* `AI_EX_TYPE`
    - `CODE` Code
    - `OTHER` Other

`AITest` business object definition
-----------------------------------

Test object

### Fields

| Name                                                         | Type                                     | Required | Updatable | Personal | Description                                                                      |
|--------------------------------------------------------------|------------------------------------------|----------|-----------|----------|----------------------------------------------------------------------------------|
| `aiTestId`                                                   | int(11)                                  | yes*     | yes       |          | -                                                                                |
| `aiNotepad`                                                  | notepad(1000)                            |          | yes       |          | -                                                                                |
| `aiTestLongString`                                           | text(1000)                               |          | yes       |          | -                                                                                |

### Custom actions

* `AI_CLEAR_HIST`: Clear history in notePad for test object

`AIGenData` business process definition
---------------------------------------



### Activities

* `Begin`: 
* `End`: 
* `SelectModule`: Selection module
* `GenData`: AI call for data gen

`AIModuleCreate` business process definition
--------------------------------------------

Auomatic model generation process

### Activities

* `Begin`: 
* `End`: 
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


