/**
 * AI JavaScript Tools 
 * Provides AI-powered front functionality for chat, speech recognition, image handling, and code commenting
 * @namespace AiJsTools
 */
var AiJsTools = AiJsTools || (function(param) {
	/** Development mode flag */
	/** @type {boolean} */
	let devMode = false;
	/** Use async flag for API calls */
	/** @type {boolean} */
	let useAsync = true; 
	/** URL for authenticated webservice */
	/** @type {string} */
	let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
	/** Application instance */
	/** @type {Object} */
	let app = $ui.getApp();
	/** Speech recognition support flag */
	/** @type {boolean|null} */
	let isSpeechRecognitionSupported = null;
	/** AI provider name */
	/** @type {string} */
	let provider;//param;
	/** Provider ID */
	/** @type {string} */
	let providerID;
	/** Provider user parameters, all chat parameters like t-pop, temperature, etc. */
	/** @type {Object} */
	let providerParams;
	/** Specialization for UML chat */
	/** @type {string} */
	let chatUmlSpecialisation = "You help design uml for object-oriented applications. Without function and whith relation description. Respond with a text";
	/** Specialization for UML JSON generation */
	/** @type {string} */
	let umlJsonGenSpecialisation = "you help to create UML in json for application, your answers are automatically processed in java";
	getProvider();
	let botName= "SimpliBot";
	getBotName();
	let userName = app.getGrant().login;
	if(app.getGrant().firstname ){
		userName =app.getGrant().firstname;
	}
	/**
	 * Retrieves provider user parameters from the AIProvider business object
	 * @async
	 * @returns {Promise<void>}
	 */
	async function getProviderParams() {
		let obj = app.getBusinessObject("AIProvider");
		obj.resetFilters();
		obj.search(function(r) {
			if (r && r.length > 0) {
				obj.select(function(params) {
					providerID = obj.row_id;
					providerParams=obj.getUserParameters();// Display selected parameters
				}, r[0].row_id, null);
			} else {
				console.log("No results found.",provider);
			}
		}, {'aiPrvProvider': provider}, null);
	}
	/**
	 * Gets the current provider parameters
	 * @returns {Object} The provider parameters object
	 */
	function getUserProviderParams(){
		return providerParams;
	}
	/**
	 * Retrieves the current AI provider from the server
	 * Initiates the provider parameters variables
	 */
	function getProvider(){
		let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
		let postParams = {"reqType":"provider"};
		app._call(false, url, postParams, function callback(botResponse){
			provider = botResponse.provider;
			getProviderParams();
			
		});
		
	}
	/**
	 * Retrieves the bot name from the server
	 * Initiates the bot name variable
	 */
	function getBotName(){
		let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
		let postParams = {"reqType":"BOT_NAME"};
		app._call(false, url, postParams, function callback(botResponse){
			botName = botResponse.botName;
		});
	}
	/**
	 * Checks if speech recognition is supported by the server
	 * @async
	 * @returns {Promise<void>} Initiates the speech recognition support variable
	 */
	async function checkSpeechRecognitionSupported() {
		if(isSpeechRecognitionSupported != null)return;
		let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
		let postParams = {"reqType":"CHECK_SPEECH_RECOGNITION"};
		await app._call(false, url, postParams, function callback(botResponse){
			isSpeechRecognitionSupported = botResponse?.isSpeechRecognitionSupported ?? false;
		});
	}
	/**
	 * Adds a button to the chat interface
	 * @param {HTMLElement} ctn - The container element
	 * @param {string} id - The button ID
	 * @param {Function} onclick - The click handler function
	 * @param {string} fa_icon - The FontAwesome icon class
	 * @param {string} title - The button title
	 */
	function addButton(ctn, id,onclick, fa_icon, title) {
		let htmlButton = document.createElement('button');
        htmlButton.id = id;
		htmlButton.className = "chat-icon-button fas "+fa_icon;
		htmlButton.onclick = onclick;
		htmlButton.title = title;
		ctn.insertBefore(htmlButton, ctn.querySelector('.user-message'));

	}
	/**
	 * Creates default buttons for chat interface
	 * @param {HTMLElement} ctn - The container element
	 * @param {string} id - The button type identifier
	 */
	function defaultButton(ctn, id) {
        switch (id) {
            case "add-img":
				addButton(ctn,"add-img",function() {
                    AiJsTools.addImage(this.parentElement);
                },"fa-upload",$T("AI_ICON_ADD_IMG"));
                break;
            case "take-img":
				addButton(ctn,"take-img",function() {
                    AiJsTools.takeImage(this.parentElement);
                }, "fa-camera",$T("AI_ICON_TAKE_IMG"));
                break;
            case "speech":
				addButton(ctn,"speech",function() {
                    AiJsTools.getSpeech(this);
                }, "fa-microphone",$T("AI_ICON_SPEECH"));
                break;
			default:
				
				break;
        }
    }
	
    /**
     * Adds chat options and buttons to the chat interface
     * @async
     * @param {HTMLElement} ctn - The chat container element
     * @param {boolean} addImg - Whether to add image upload button
     * @param {boolean} takeImg - Whether to add camera button
     * @param {boolean} Speech - Whether to add speech recognition button
     */
    async function addChatOption(ctn,addImg,takeImg,Speech){
		if(!ctn){
			return;
		}

		ctn.querySelector(".chat-button").innerHTML = $T("AI_BUTTON_SEND");
		
        await checkSpeechRecognitionSupported();
		if(addImg){
            defaultButton(ctn,"add-img");
        }
		if(takeImg){
            defaultButton(ctn,"take-img");
        }
		if(Speech && isSpeechRecognitionSupported){
			defaultButton(ctn,"speech");
		}
		addLLMParams(ctn);
		$(window).resize(function() {
			resizeUp($(ctn).parent(),$(ctn).parent().parent().find(".chat-messages"));
		});
		resizeUp($(ctn).parent(),$(ctn).parent().parent().find(".chat-messages"));
		
		
    }
	/**
	 * Get an image from user and add it to the chat input area
	 * @param {HTMLElement} inputCtn - The input container element
	 */
	function addImage(inputCtn){
		
		inputCtn = $(inputCtn);
		let input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/jpeg, image/png';
		input.onchange = function(event) {
			let file = event.target.files[0];
			let reader = new FileReader();
			reader.onload = function(event) {
				let image_base64 = event.target.result;
				inputCtn.parent().find("#input-img img").attr("src", image_base64);
				inputCtn.parent().find("#input-img").show();
				resizeUp(inputCtn.parent(),inputCtn.parent().parent().find(".chat-messages"));
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}

	/**
	 * Checks if a container is followed by a div element
	 * @param {HTMLElement} container - The container to check
	 * @returns {boolean} True if followed by a div, false otherwise
	 */
	function isContainerFollowedByDiv(container) {
		let nextElement = $(container).next();
		return nextElement.length > 0 && nextElement.is('div');
	}
	/**
	 * Takes a picture using the device camera
	 * @async
	 * @param {HTMLElement} inputCtn - The input container element
	 */
	async function takeImage(inputCtn){
		inputCtn = $(inputCtn);
		let input =await $view.widget.takePicture({title: $T('TAKE_PICT'),facingMode: "environment"});
		inputCtn.parent().find("#input-img img").attr("src", input);
		inputCtn.parent().find("#input-img").show();
		resizeUp(inputCtn.parent(),inputCtn.parent().parent().find(".chat-messages"));
	}

	/**
	 * Resizes the chat interface elements dynamically
	 * @param {jQuery} inputArea - The input area jQuery object
	 * @param {jQuery} messagesArea - The messages area jQuery object
	 * @param {number} [maxbodyH] - Maximum body height
	 */
	function resizeUp(inputArea, messagesArea,maxbodyH) {
		if(!inputArea || !messagesArea){console.log("resizeUp: ctn is null");return;}
		let bodyH = messagesArea.closest(".card-body").height();
		if (maxbodyH && bodyH > maxbodyH) {
			bodyH = maxbodyH;
		}
		let container = messagesArea.parent();
		if(!isContainerFollowedByDiv(container)){
			
			container.css("height", bodyH);
		}
		
		const maxHeight = bodyH - 250;
		const minHeight = `40px`;
		let usermsg = inputArea.find(".user-message");
		usermsg.css("height", minHeight);
		let textheight = usermsg.prop('scrollHeight');
		let isScrollbarVisible = textheight > usermsg.innerHeight();
		if (!isScrollbarVisible) {
			
			textheight = usermsg.innerHeight();
		}
		let areaheight = messagesArea.parent().height();
        let imgCtn =inputArea.find("#input-img");
		let imgheight = imgCtn.is(':hidden')?0: (imgCtn.height());
		if(textheight >maxHeight-imgheight){
			textheight = maxHeight-imgheight;
		}else if(textheight < minHeight){
			textheight = minHeight;
		}
		usermsg.innerHeight(textheight);
		for (let butCtn of inputArea.find(".chat-icon-button")){
			$(butCtn).css("height", textheight);
		}
		inputArea.find("#send-button").css("height", textheight);
		areaheight = areaheight - (textheight+30)-imgheight;
        
        inputArea.css("height",  textheight+10+imgheight);
		messagesArea.css("height", areaheight);
		
	}

	/**
	 * Resets the chat input area to its initial state
	 * @param {HTMLElement} ctn - The container element
	 */
	function resetInput(ctn){
		ctn = $(ctn);
		ctn.find(".user-message").val("");
		ctn.find("#input-img img").removeAttr("src");
		ctn.find("#input-img").hide();
		resizeUp(ctn,$(ctn).parent().find(".chat-messages"));
	}
	/**
	 * Builds the parameters for AI chat API calls
	 * @param {HTMLElement} ctn - The chat container element
	 * @param {string} specialisation - The AI specialization prompt
	 * @returns {Object} The formatted parameters for the API call
	 */
	function getPostParams(ctn,specialisation){
		let historic = [];
		$(ctn).find(".user-messages").each(function() {
			let text ={};
			text.role = "user";
			let contents =[];
			let content = {"type":"text","text":$(this).find(".msg").text()};
			contents.push(content);
			let img = $(this).find(".ai-chat-img");
			if(img.length >0){
				content = {"type":"image_url","image_url":{"url":img.attr("src")}};
				contents.push(content);
			}
			text.content = contents;
			historic.push(JSON.stringify(text));
			text={};
			text.role = "assistant";
			text.content = $(this).next(".bot-messages").find(".msg").text();
			historic.push(JSON.stringify(text));
			
		});
		let inputCtn=$(ctn).find(".ai-chat-input-area");
	    let userMessage = inputCtn.find(".user-message").val();
		let userImage = inputCtn.find("#input-img img").attr("src");
		let prompt =[];
		prompt.push({"type":"text","text":userMessage});
		if(userImage){
			prompt.push({"type":"image_url","image_url":{"url":userImage}});
		}
		return {prompt:JSON.stringify(prompt), specialisation:specialisation, historic: JSON.stringify(historic), providerParams: providerParams,reqType:"chatBot"}; // post params
	}

	//speech recognition
	let mediaRecorder;
	let audioChunks = [];
	let isCancelled = false; 
	/**
	 * Starts audio recording for speech recognition
	 * @async
	 * @param {HTMLElement} messageCtn - The message container element
	 */
	async function startRecording(messageCtn) {
		messageCtn = $(messageCtn).parent().find(".user-message");
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		
		mediaRecorder = new MediaRecorder(stream);

		mediaRecorder.ondataavailable = function(event) {
			audioChunks.push(event.data);
		};

		mediaRecorder.onstop = function() {
			if(!isCancelled){
				const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
				audioChunks = [];
				const formData = new FormData();
				formData.append('file', audioBlob, 'audio.webm');
				formData.append('reqType', 'audio');
				convertBlobToBase64(audioBlob).then(function(audio64) {
					callSTTAi(messageCtn, audio64);
				});
				
				
			}else{
				isCancelled = false;

			}
			stream.getTracks().forEach(track => track.stop());
		};

		mediaRecorder.start();
	}
	/**
	 * Calls the speech-to-text AI service
	 * @param {HTMLElement} messageCtn - The message container element
	 * @param {string} audio64 - Base64 encoded audio data
	 */
	function callSTTAi(messageCtn, audio64) {
		audio64 = audio64.split(",")[1];
		const jsonData = {
			file: audio64,
			reqType: 'audio'
		};
		app._call(useAsync, url, jsonData, function callback(botResponse){
			let json = JSON.parse(botResponse.msg);
			messageCtn.val(json.text);
			messageCtn.focus();
		});
	}
	/**
	 * Converts a Blob to Base64 string
	 * @param {Blob} blob - The blob to convert
	 * @returns {Promise<string>} Promise that resolves to Base64 string
	 */
	function convertBlobToBase64(blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = function() {
				resolve(reader.result);  // Extract the Base64 part from the data URL string
			};
			reader.onerror = function(error) {
				reject(new Error(error));
			};
			reader.readAsDataURL(blob);
		});
	}
	/**
	 * Stops the current audio recording
	 */
	function stopRecording() {
		mediaRecorder.stop();
	}
	
	/**
	 * Cancels the current audio recording
	 */
	function cancelRecording() {
		isCancelled = true;
		mediaRecorder.stop();
	}
	/**
	 * Initiates speech recognition for the input container
	 * @param {HTMLElement} inputCtn - The input container element
	 */
	function getSpeech(inputCtn){
		startRecording(inputCtn);
		disableUi(inputCtn);
	}
	/**
	 * Removes an image from the chat input area
	 * @param {HTMLElement} ctn - The container element
	 */
	function removeimg(ctn){
		ctn = $(ctn).parent();
		ctn.find("img").removeAttr("src");
		ctn.hide();
		ctn = ctn.parent();
		resizeUp(ctn,ctn.parent().find(".chat-messages"));
	}
	/**
	 * Disables the UI during speech recording
	 * @param {HTMLElement} inputCtn - The input container element
	 */
	function disableUi(inputCtn){
		let messageCtn = $(inputCtn).parent().find(".user-message");
		let sendButton = $(inputCtn).parent().find(".chat-button");
		$(sendButton).prop('disabled', true);
		messageCtn.val( $T("AI_RECORDING_TITLE"));
		messageCtn.prop('readonly', true);
		inputCtn.className = "chat-icon-button fas fa-microphone ai-microphone-ellipsis";
		inputCtn.title = $T("AI_RECORDING_TITLE");
		addButton(inputCtn.parentElement,"cancel-recording",function() {
			cancelRecording();
			resetButtons(inputCtn, messageCtn, sendButton);
		},"fa-times",$T("AI_CANCEL_RECORDING"));
		addButton(inputCtn.parentElement,"stop-recording",function() {
			stopRecording();
			resetButtons(inputCtn, messageCtn, sendButton);
		}, "fa-check",$T("AI_STOP_RECORDING"));
		inputCtn.onclick = function() {
			resetButtons(inputCtn, messageCtn, sendButton);
			stopRecording();
		};
	}
	/**
	 * Resets the UI buttons after speech recording
	 * @param {HTMLElement} inputCtn - The input container element
	 * @param {jQuery} messageCtn - The message container jQuery object
	 * @param {jQuery} sendButton - The send button jQuery object
	 */
	function resetButtons(inputCtn, messageCtn, sendButton){
			$(inputCtn.parentElement).find("#cancel-recording").remove();
			$(inputCtn.parentElement).find("#stop-recording").remove();
			messageCtn.prop('readonly', false);
			messageCtn.val("");
			inputCtn.className = "chat-icon-button fas fa-microphone";
			inputCtn.onclick = function() {
				getSpeech(inputCtn);
			};
			sendButton.prop('disabled', false);
	}
	
	/**
	 * Loads an Ace editor with the content from a container
	 * @param {jQuery} ctn - The container with the content
	 * @param {string} divId - The ID of the div where the editor will be loaded
	 */
	function loadResultInAceEditor(ctn,divId){
		$ui.loadAceEditor(function(){
			let aceEditor = window.ace.edit(divId);
			aceEditor.setOptions({
			   //enableBasicAutocomplete: true, // the editor completes the statement when you hit Ctrl + Space
			   //enableLiveAutocomplete: true, // the editor completes the statement while you are typing
			   showPrintMargin: false, // hides the vertical limiting strip
			   maxLines: 25,
			   fontSize: "100%" // ensures that the editor fits in the environment
			});
			
			// defines the style of the editor
			aceEditor.setTheme("ace/theme/eclipse");
			// hides line numbers (widens the area occupied by error and warning messages)
			aceEditor.renderer.setOption("showGutter", true); 
			// ensures proper autocomplete, validation and highlighting of JavaScript code
			aceEditor.getSession().setMode("ace/mode/json");
			aceEditor.getSession().setValue(ctn.val(), 0);
			aceEditor.getSession().on('change', function() {
				let val=aceEditor.getSession().getValue();
				ctn.val(val);
			});
			
		});
	}
	/**
	 * Creates a display element for user messages
	 * @param {HTMLElement} ctn - The container element
	 * @returns {HTMLElement} The created user message display element
	 */
	function getDisplayUserMessage(ctn){
		let inputCtn=$(ctn).find(".ai-chat-input-area");
	    let msg = inputCtn.find(".user-message").val();
	    let imgb64 = inputCtn.find("#input-img img").attr("src");
		let div= document.createElement("div");
		div.className ="user-messages";
		let strong = document.createElement("strong");
		strong.textContent = userName + ": ";
		div.append(strong);
		if(imgb64){
			let img = document.createElement("img");
			img.className = "ai-chat-img";
			img.src =imgb64;
			img.alt = "your image";
			div.append(img);
		}
		let span = document.createElement("span");
		span.className = "msg";
		span.textContent = msg;
		div.append(span);
		return div;
	}
	/**
	 * Creates a display element for bot messages
	 * @param {string} msg - The bot message content
	 * @returns {HTMLElement} The created bot message display element
	 */
	function getDisplayBotMessage(msg){
		let div= document.createElement("div");
		div.className = "bot-messages";
		let strong = document.createElement("strong");
		strong.textContent= botName+": ";
		div.append(strong);
		let span = document.createElement("span");
		span.className = "msg";
		
		if(msg){
			span.innerHTML = msg;
		}else{
			let loading = document.createElement("div");
			loading.className = "ai-chat-ellipsis";
			loading.textContent = $T("AI_THINKING");
			span.append(loading);
		}
		div.append(span);
		return div;
	}
	/**
	 * Adds LLM parameters button to the chat interface
	 * @param {HTMLElement} ctn - The container element
	 */
	function addLLMParams(ctn){
		if(provider == "Open AI" || provider == "Mistral AI"){
			let htmlButton = document.createElement('button');
			htmlButton.id = "params";
			htmlButton.className = "chat-icon-button fas fa-cog";
			htmlButton.onclick = () => {updateLLMParams();};
			htmlButton.title = "llm parameters";
			$(ctn).find('.user-message').after(htmlButton);
		}
	}
	/**
	 * Updates LLM parameters through a dialog interface
	 */
	function updateLLMParams(){
		console.log("updateLLMParams sonar update");
		let providerObj = app.getBusinessObject("AIProvider");
		providerObj.resetFilters();
		providerObj.select(providerID);
		// Create an HTML form from providerParams
		let formHtml = providerObj.getUserParametersForm(providerParams);

		$ui.confirm({
			"name": "params",
			"title":"Parameters",
			"content": formHtml,
			"dontAskAgain" : false,
			"moveable": true,
			"onOk":() => {saveLLMParams();}
		});
	}
	
	/**
	 * Saves the updated LLM parameters from the form
	 */
	function saveLLMParams(){
		let formData = document.getElementById('llmParamsForm');
		const updatedParams = {};
		for (const [key] of Object.entries(providerParams)) {
			updatedParams[key] = formData.querySelector(`#${key}`).value;
		}
		providerParams = updatedParams;
	}
	/**
	 * Validates and constrains input values to min/max range
	 * @param {number} min - Minimum allowed value
	 * @param {number} max - Maximum allowed value
	 * @param {HTMLInputElement} input - The input element to validate
	 */
	function checkMinMAx(min,max,input){
		let value = parseFloat(input.value); // Get the value of the input element
		if (value > max) {
			input.value = max; // Limit to maximum value
		} else if (value < min) {
			input.value = min; // Limit to minimum value
		}
	}
	
	/**
	 * Comments code using AI assistance with diff view
	 */
	function commentCode(){
		let activeTab = $tools.getTabActive($('.code-editor')).data("data");
		let dlg;
		let diff;
	    let left_code;
		let right_code;
		//call the AI API
		$ui.loadLocalEditor((e)=>{
			console.log("editor",e);
			e.loadAceDiff();
			console.log(e.active);
			displayDiffCode(e,activeTab);
		});
		
		function close(){
			console.log("close",diff);
			diff.destroy();
			$tools.dialogClose(dlg);
		}
		function displayDiffCode(editor,activeTab){
			const aceEditor = ace.edit(activeTab.div[0]);
			console.log("selected:",aceEditor.getSelectedText());
			let selected = aceEditor.getSelectedText();
			let range = selected?aceEditor.getSelectionRange():null;
			const code = selected || aceEditor.getValue();
			console.log("code",code);
			let div = $('<div class="acediff"/>').css("min-height", $(window).height()-125),
				bar = $('<div class="actions"/>'),
				title = $('<div class="title"/>').text($T("COMPARE")).append(bar);
			let postParams =  {
				reqType: 'commentCode',
				content: code
			};
			// apply the ai comment to the code
			bar.append($tools.button({ label:$T("ACCEPT_ALL"), level:"primary", size:"sm", click:() => {
				left_code.setValue(right_code.getValue());
			}}));
			// discard the modified code and close
			bar.append($tools.button({ label:$T("RESTORE"), level:"action", size:"sm", click:() => {
				console.log("RESTORE");
				close();
			}}));
			// save the code and close
			bar.append($tools.button({ label:$T("SAVE"), level:"action", size:"sm", click:() => {
				if(selected){
					aceEditor.session.replace(range,left_code.getValue());
				}else{
					aceEditor.setValue(left_code.getValue());
				}
				editor.saveActive();
				console.log("CLOSE");
				close();
			} }));

			dlg = $tools.dialog({
				content: $('<div class="diff-body"/>')
					.append(title)
					.append($('<div class="header"/>')
						.append($('<div/>').text("Original code "))
						.append($('<div/>').text("AI Commented Code")))
					.append(div),
				width: "90%",
				onload:() =>{
					$view.showLoading($(".diff-body"));
					if(!devMode){
						app._call(true, url, postParams, function callback(botResponse){
							console.log("botResponse",botResponse,botResponse.choices[0],botResponse.choices[0]?.message,botResponse.choices[0]?.message?.content);
							let newCode = botResponse.choices[0]?.message?.content;
							console.log("newCode",newCode);
							if(!newCode){
								$ui.alert("no code return");
								return;
							} 
							newCode = newCode?.replace(/(?:.*\n)*```.*?\n([\s\S]*?)```(?:.*\n)*/,'$1');
							displayResult(code,newCode,activeTab);
						});
					}else{
						let newCode = code+"\n// AI Commented Code";
						displayResult(code,newCode,activeTab);
					}
					
				}
			}).addClass("code-diff");
		}
		function displayResult(oldCode,newCode,activeTab){
			console.log("displayResult activeTab",activeTab);
			let aceMode = getAceModeOfTab(activeTab);
			console.log("displayResult mime type",aceMode);
			
			diff =new AceDiff({
				element: '.acediff',
				theme: "ace/theme/eclipse",
				left: {
					title: 'Code original',
					editable: true,
					content: oldCode,
					mode: aceMode
				},
				right: {
					title: 'AI Commented Code',
					editable: true,
					content: newCode,
					mode: aceMode
				}
			});
			console.log("diff",diff);
			left_code = diff.editors.left.ace;
			right_code = diff.editors.right.ace;
			console.log("left",left_code);
			$view.hideLoading($(".diff-body"));
			$('.acediff__left .ace_scrollbar-v').scroll(() =>
				right_code.session.setScrollTop(left_code.session.getScrollTop()));
			$('.acediff__right .ace_scrollbar-v').scroll(() =>
				left_code.session.setScrollTop(right_code.session.getScrollTop()));
		}
		function getAceModeOfTab(activeTab){
			let mode = activeTab?.mode;
			console.log("getAceModeOfTab mode",mode);
			if(!mode){
				return "ace/mode/text";
			}
			return "ace/mode/"+mode;
		}
	}
	
	/**
	 * Adds a comment code button to the interface
	 * @param {HTMLElement} ctn - The container element
	 * @param {string} [nextAction] - The next action identifier
	 */
	function addCommentCodeButton(ctn,nextAction){
		let button = $('<button>Comment code</button>').addClass("btn btn-secondary btn-ai"); // Create a new button with jQuery
		button.click(function() {
			AiJsTools.commentCode();
		});
		let nextBtn = nextAction?ctn.find(`button[data-action="${nextAction}"]`):null;
		if(nextBtn){
			nextBtn.before(button); 
		}else{
			$(ctn).append(button); // Add button to the edit bar
		}
	}
		
	return { 
		/** Use async calls flag */
		/** @type {boolean} */
		useAsync: useAsync,
		/** URL for authenticated webservice */
		/** @type {string} */
		url: url,
		/** Bot name */
		/** @type {string} */
		botName: botName,
		/** Specialization for UML chat */
		/** @type {string} */
		chatUmlSpecialisation:chatUmlSpecialisation,
		/** Specialization for UML JSON generation */
		/** @type {string} */
		umlJsonGenSpecialisation:umlJsonGenSpecialisation,
		/**
		 * Resizes the chat interface elements dynamically
		 * @function resizeUp
		 * @param {jQuery} inputArea - The input area jQuery object
		 * @param {jQuery} messagesArea - The messages area jQuery object
		 * @param {number} [maxbodyH] - Maximum body height
		 */
		resizeUp: resizeUp,
		/**
		 * Adds chat options and buttons to the chat interface
		 * @function addChatOption
		 * @param {HTMLElement} ctn - The chat container element
		 * @param {boolean} addImg - Whether to add image upload button
		 * @param {boolean} takeImg - Whether to add camera button
		 * @param {boolean} Speech - Whether to add speech recognition button
		 */
		addChatOption: addChatOption,
		/**
		 * Get an image from user and add it to the chat input area
		 * @function addImage
		 * @param {HTMLElement} inputCtn - The input container element
		 */
		addImage: addImage, 
		/**
		 * Takes a picture using the device camera
		 * @function takeImage
		 * @param {HTMLElement} inputCtn - The input container element
		 */
		takeImage: takeImage, 
		/**
		 * Initiates speech recognition for the input container
		 * @function getSpeech
		 * @param {HTMLElement} inputCtn - The input container element
		 */
		getSpeech: getSpeech, 
		/**
		 * Resets the chat input area to its initial state
		 * @function resetInput
		 * @param {HTMLElement} ctn - The container element
		 */
		resetInput: resetInput,
		/**
		 * Builds the parameters for AI chat API calls
		 * @function getPostParams
		 * @param {HTMLElement} ctn - The chat container element
		 * @param {string} specialisation - The AI specialization prompt
		 * @returns {Object} The formatted parameters for the API call
		 */
		getPostParams: getPostParams,
		/**
		 * Creates a display element for user messages
		 * @function getDisplayUserMessage
		 * @param {HTMLElement} ctn - The container element
		 * @returns {HTMLElement} The created user message display element
		 */
		getDisplayUserMessage: getDisplayUserMessage,
		/**
		 * Creates a display element for bot messages
		 * @function getDisplayBotMessage
		 * @param {string} msg - The bot message content
		 * @returns {HTMLElement} The created bot message display element
		 */
		getDisplayBotMessage: getDisplayBotMessage,
		/**
		 * Loads an Ace editor with the content from a container
		 * @function loadResultInAceEditor
		 * @param {jQuery} ctn - The container with the content
		 * @param {string} divId - The ID of the div where the editor will be loaded
		 */
		loadResultInAceEditor:loadResultInAceEditor,
		/**
		 * Removes an image from the chat input area
		 * @function removeimg
		 * @param {HTMLElement} ctn - The container element
		 */
		removeimg:removeimg,
		/**
		 * Gets the current provider parameters
		 * @function getUserProviderParams
		 * @returns {Object} The provider parameters object
		 */
		getUserProviderParams:getUserProviderParams,
		/**
		 * Validates and constrains input values to min/max range
		 * @function checkMinMAx
		 * @param {number} min - Minimum allowed value
		 * @param {number} max - Maximum allowed value
		 * @param {HTMLInputElement} input - The input element to validate
		 */
		checkMinMAx:checkMinMAx,
		/**
		 * Comments code using AI assistance with diff view
		 * @function commentCode
		 */
		commentCode:commentCode,
		/**
		 * Adds a comment code button to the interface
		 * @function addCommentCodeButton
		 * @param {HTMLElement} ctn - The container element
		 * @param {string} [nextAction] - The next action identifier
		 */
		addCommentCodeButton:addCommentCodeButton
	};
})();