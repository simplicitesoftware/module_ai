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

### Import
To import this module:

Create a module named `AIBySimplicite`
Set the settings as:
```json
{
	"origin": {
		"uri": "https://github.com/simplicitesoftware/module_ai.git"
	},
	"type": "git"
}
```
Click on the Import module button
### Configure
To configure the ia connection, use the `Configuring the wizard`  object in `AI assistant` domain.

Select the model (LLM) you wish to use, configure the parameters and the url of your API.  

<details>
  <summary>LLM spesific configuration exemple</summary>

#### OpenAI:
```json
{
    'model':'<gpt_model_to_use>',
    'OpenAI-Project': "<my_openai_project_id>", // Optional
    'OpenAI-Organization': "<my_openai_organization_id>", //Optional
    'hist_depth' : 3,
    'code_max_token' : 2000,
    'default_max_token':1500,
    'trigger':''
}
```
#### Mistral  
```json
{
    'hist_depth' : 3,
    'code_max_token' : 2000,
    'default_max_token':1500,
    'trigger':''
}
```
</details>


<details>
  <summary>Parrameters details</summary>

##### hist_depth
Defines the number of messages in the history used for the context.
The greater this number, the more tokens the request uses, but the more relevant is the response. 
##### max_token
*optional*  
Limits the number of tokens in the ia response
###### default_max_token
Maximum number of tokens in a usual context.
###### code_max_token
Maximum number of tokens for thecnical calls.
##### trigger
To define a trigger for ia calls in fields (under development)

</details>  
  
  
Use the `Activate` action to save your settings and enter your API key if required.

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

`AIProvider` business object definition
---------------------------------------



### Fields

| Name                                                         | Type                                     | Required | Updatable | Personal | Description                                                                      |
|--------------------------------------------------------------|------------------------------------------|----------|-----------|----------|----------------------------------------------------------------------------------|
| `aiPrvProvider`                                              | char(100)                                | yes*     | yes       |          | -                                                                                |
| `aiPrvDefaultUrl`                                            | url(100)                                 | yes      | yes       |          | -                                                                                |
| `aiPrvDataModel`                                             | text(1000)                               | yes      | yes       |          | -                                                                                |
| `aiPrvModelsUrl`                                             | url(100)                                 | yes      | yes       |          | -                                                                                |
| `aiPrvHelp`                                                  | text(5000)                               |          | yes       |          | -                                                                                |
| `aiPrvCompletionUrl`                                         | url(100)                                 | yes      | yes       |          | -                                                                                |
| `aiPrvPingUrl`                                               | url(100)                                 |          | yes       |          | -                                                                                |

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

`AiSettingsProcess` business process definition
-----------------------------------------------



### Activities

* `SelectProvider`: 
* `Auth`: 
* `OtherParam`: 
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


