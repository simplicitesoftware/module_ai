<!--
 ___ _            _ _    _ _    __
/ __(_)_ __  _ __| (_)__(_) |_ /_/
\__ \ | '  \| '_ \ | / _| |  _/ -_)
|___/_|_|_|_| .__/_|_\__|_|\__\___|
            |_| 
-->
![](https://docs.simplicite.io//logos/logo250.png)
* * *

`ChatGPT` module definition
===========================

Exploratory module on the use of AI

`GptExemple` business object definition
---------------------------------------

Test object

### Fields

| Name                                                         | Type                                     | Required | Updatable | Personal | Description                                                                      |
|--------------------------------------------------------------|------------------------------------------|----------|-----------|----------|----------------------------------------------------------------------------------|
| `gptExPrompt`                                                | text(750)                                |          | yes       |          | -                                                                                |
| `gptExResponse`                                              | text(20000)                              |          |           |          | -                                                                                |
| `gptExType`                                                  | enum(100) using `GPT_EX_TYPE` list       | yes      | yes       |          | -                                                                                |
| `gptExSpecification`                                         | char(100)                                |          | yes       |          | -                                                                                |
| `gptExOldPrompt`                                             | char(750)                                |          |           |          | -                                                                                |
| `gptExName`                                                  | char(100)                                | yes*     | yes       |          | -                                                                                |

### Lists

* `GPT_EX_TYPE`
    - `CODE` Code
    - `OTHER` Other

`GptTest` business object definition
------------------------------------

Test object

### Fields

| Name                                                         | Type                                     | Required | Updatable | Personal | Description                                                                      |
|--------------------------------------------------------------|------------------------------------------|----------|-----------|----------|----------------------------------------------------------------------------------|
| `gptTestId`                                                  | int(11)                                  | yes*     | yes       |          | -                                                                                |
| `gptNotepad`                                                 | notepad(1000)                            |          | yes       |          | -                                                                                |
| `gptTestLongString`                                          | text(1000)                               |          | yes       |          | -                                                                                |

### Custom actions

* `GPT_CLEAR_HIST`: 

`GPTGenData` business process definition
----------------------------------------



### Activities

* `Begin`: 
* `End`: 
* `SelectModule`: 
* `GenData`: 

`GPTModuleCreate` business process definition
---------------------------------------------

Auomatic model generation process

### Activities

* `Begin`: 
* `End`: 
* `SelectModule`: Selection module
* `SelectGroup`: Selection group
* `SelectDomain`: Selection Domain
* `interaction`: Chat with the AI
* `Prompt`: Direct chat with the AI
* `GPT`: AI for modeling
* `Generation`: Module generation based on ia feedback
* `RemoveModule`: Remove module

`GptChatBot` external object definition
---------------------------------------

Chat interface


`GptExpTool` external object definition
---------------------------------------

Front tool


`GptProcessResource` external object definition
-----------------------------------------------

Process resource


`GptPromptTool` external object definition
------------------------------------------

Tool


`GptRestAPI` external object definition
---------------------------------------

Local API


`GptShortcut` external object definition
----------------------------------------

Chat in shortcut


