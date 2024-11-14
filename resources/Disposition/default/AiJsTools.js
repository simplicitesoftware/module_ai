var AiJsTools = AiJsTools || (function(param) {
	let useAsync = true; 
	let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
	let app = $ui.getApp();
	let isSpeechRecognitionSupported = null;
	let provider = "Open AI";//param;
	let providerObj;
	let providerParams;

	getProviderParams();
	let botName= "SimpliBot";
	getBotName();
	let userName = app.getGrant().login;
	if(app.getGrant().firstname ){
		userName =app.getGrant().firstname;
	}
	async function getProviderParams() {
		let obj = app.getBusinessObject("AIProvider");
		obj.search(function(r) {
			if (r && r.length > 0) {
				obj.select(function(params) {
					providerObj = obj;
					providerParams=obj.getUserParameters()// Affiche les paramètres sélectionnés
					console.log(providerParams);
				}, r[0].row_id, null);
			} else {
				console.log("Aucun résultat trouvé.");
			}
		}, {'aiPrvProvider': 'Open AI'}, null);
	}
	function getUserProviderParams(){
		return providerParams;
	}
	function getBotName(){
		let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
		let postParams = {"reqType":"BOT_NAME"};
		app._call(false, url, postParams, function callback(botResponse){
			botName = botResponse.botName;
		});
		return null;
	}
	// used for speech recognition
	async function checkSpeechRecognitionSupported() {
		if(isSpeechRecognitionSupported != null)return;
		let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
		let postParams = {"reqType":"CHECK_SPEECH_RECOGNITION"};
		await app._call(false, url, postParams, function callback(botResponse){
			isSpeechRecognitionSupported = botResponse?.isSpeechRecognitionSupported ?? false;
		});
	}
	function addButton(ctn, id,onclick, fa_icon, title) {
		let htmlButton = document.createElement('button');
        htmlButton.id = id;
		htmlButton.className = "chat-icon-button fas "+fa_icon;
		htmlButton.onclick = onclick;
		htmlButton.title = title;
		ctn.insertBefore(htmlButton, ctn.querySelector('.user-message'));

	}
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
	
    async function addChatOption(ctn,addImg,takeImg,Speech){
		if(!ctn){
			console.log("ctn is null");
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
		addLLMParams(provider,ctn);
		$(window).resize(function() {
			resizeUp($(ctn).parent(),$(ctn).parent().parent().find(".chat-messages"));
		});
		resizeUp($(ctn).parent(),$(ctn).parent().parent().find(".chat-messages"));
		
		
    }
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

	function isContainerFollowedByDiv(container) {
		let nextElement = $(container).next();
		return nextElement.length > 0 && nextElement.is('div');
	}
	async function takeImage(inputCtn){
		inputCtn = $(inputCtn);
		let input =await $view.widget.takePicture({title: $T('TAKE_PICT'),facingMode: "environment"});
		inputCtn.parent().find("#input-img img").attr("src", input);
		inputCtn.parent().find("#input-img").show();
		resizeUp(inputCtn.parent(),inputCtn.parent().parent().find(".chat-messages"));
	}

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

	function resetInput(ctn){
		ctn = $(ctn);
		ctn.find(".user-message").val("");
		ctn.find("#input-img img").removeAttr("src");
		ctn.find("#input-img").hide();
		resizeUp(ctn,$(ctn).parent().find(".chat-messages"));
	}
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
	// Fonction pour démarrer l'enregistrement
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
	function convertBlobToBase64(blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = function() {
				resolve(reader.result);  // Extraire la partie Base64 de la chaîne data URL
			};
			reader.onerror = function(error) {
				reject(new Error(error));
			};
			reader.readAsDataURL(blob);
		});
	}
	// Fonction pour arrêter l'enregistrement
	function stopRecording() {
		mediaRecorder.stop();
	}
	
	function cancelRecording() {
		isCancelled = true;
		mediaRecorder.stop();
	}
	function getSpeech(inputCtn){
		startRecording(inputCtn);
		disableUi(inputCtn);
	}
	function removeimg(ctn){
		ctn = $(ctn).parent();
		ctn.find("img").removeAttr("src");
		ctn.hide();
		ctn = ctn.parent();
		resizeUp(ctn,ctn.parent().find(".chat-messages"));
	}
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
	function getDisplayBotMessage(msg){
		//<div class="bot-messages"><strong>{{botName}}: </strong><span class="msg"><div class="ai-chat-ellipsis">Chargement</div>
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
	function addLLMParams(provider,ctn){
		
		if(provider == "Open AI"){
			let htmlButton = document.createElement('button');
			htmlButton.id = "params";
			htmlButton.className = "chat-icon-button fas fa-cog";
			htmlButton.onclick = () => {updateLLMParams(provider);};
			htmlButton.title = "llm parameters";
			$(ctn).find('.user-message').after(htmlButton);
		}
	}
	function updateLLMParams(provider){
		console.log("params: ",providerParams);
		// Créez un formulaire HTML à partir des gptParams
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
	
	function saveLLMParams(){
		const formData = new FormData(document.getElementById('llmParamsForm'));
		const updatedParams = {};
		formData.forEach((value, key) => {
			console.log(key,": ",value);
			updatedParams[key] = value;
		});
		providerParams = updatedParams;
		console.log("save: ", gptParams);
		

	}
	return { 
		useAsync: useAsync,
		url: url,
		resizeUp: resizeUp,
		addChatOption: addChatOption,
		addImage: addImage, 
		takeImage: takeImage, 
		getSpeech: getSpeech, 
		resetInput: resetInput,
		getPostParams: getPostParams,
		getDisplayUserMessage: getDisplayUserMessage,
		getDisplayBotMessage: getDisplayBotMessage,
		loadResultInAceEditor:loadResultInAceEditor,
		removeimg:removeimg,
		getUserProviderParams:getUserProviderParams
	};
})();
