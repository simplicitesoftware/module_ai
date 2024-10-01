var AiJsTools = AiJsTools || (function() {
	let useAsync = true; 
	let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
	let app = $ui.getApp();
	let isSpeechRecognitionSupported = null;
	
	botName= "SimpliBot";
	getBotName();
	userName = app.getGrant().login;
	if(app.getGrant().firstname ){
		userName =app.getGrant().firstname;
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
			console.log(botResponse+" && "+botResponse.isSpeechRecognitionSupported,(botResponse && botResponse.isSpeechRecognitionSupported));
			if (botResponse && botResponse.isSpeechRecognitionSupported) {
				isSpeechRecognitionSupported =  botResponse.isSpeechRecognitionSupported;
			}else{
				isSpeechRecognitionSupported = false;
			}
			
		});
	}
	function addButton(ctn, id) {
        let htmlButton = document.createElement('button');
        htmlButton.id = id;
        switch (id) {
            case "add-img":
                htmlButton.className = "chat-icon-button fas fa-upload";
                htmlButton.onclick = function() {
                    AiJsTools.addImage(this.parentElement);
                };
				htmlButton.title =$T("AI_ICON_ADD_IMG");
                break;
            case "take-img":
                htmlButton.className = "chat-icon-button fas fa-camera";
                htmlButton.onclick = function() {
                    AiJsTools.takeImage(this.parentElement);
                };
				htmlButton.title =$T("AI_ICON_TAKE_IMG");
                break;
            case "speech":
                htmlButton.className = "chat-icon-button fas fa-microphone";
                htmlButton.onclick = function() {
                    AiJsTools.getSpeech(this);
                };
				htmlButton.title =$T("AI_ICON_SPEECH");
                break;
        }
        ctn.insertBefore(htmlButton, ctn.firstChild);
    }
	
    async function addChatOption(ctn,addImg,takeImg,Speech){
		if(!ctn){
			console.log("ctn is null");
			return;
		}
		
        await checkSpeechRecognitionSupported();		
		if(Speech && isSpeechRecognitionSupported){
			addButton(ctn,"speech");
		}
        if(takeImg){
            addButton(ctn,"take-img");
        }
        if(addImg){
            addButton(ctn,"add-img");
        }
		
		
		$(window).resize(function() {
			resizeUp($(ctn).parent(),$(ctn).parent().parent().find(".chat-messages"));
		});
		resizeUp($(ctn).parent(),$(ctn).parent().parent().find(".chat-messages"));
		
		
    }
	function addImage(inputCtn){
		
		inputCtn = $(inputCtn);
		let input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/jpeg';
		input.onchange = function(event) {
			let file = event.target.files[0];
			let reader = new FileReader();
			reader.onload = function(event) {
				image_base64 = event.target.result;
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
		console.log("resizeUp: bodyH: "+bodyH+" maxbodyH: "+maxbodyH);
		if (maxbodyH && bodyH > maxbodyH) {
			bodyH = maxbodyH;
			console.log("resizeUp max exept: bodyH: "+bodyH+" maxbodyH: "+maxbodyH);
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
		console.log("scrollbar visible: "+isScrollbarVisible+": scorllH" + textheight + " innerH: "+usermsg.innerHeight());
		if (!isScrollbarVisible) {
			
			textheight = usermsg.innerHeight();
		}
		let areaheight = messagesArea.parent().height();
        imgCtn =inputArea.find("#input-img");
		let imgheight = imgCtn.is(':hidden')?0: (imgCtn.height());
		console.log("minH "+ minHeight+"> textheight: "+textheight+"< maxH: "+maxHeight+" - imgheight: "+imgheight);
		if(textheight >maxHeight-imgheight){
			textheight = maxHeight-imgheight;
		}else if(textheight < minHeight){
			textheight = minHeight;
		}
		usermsg.innerHeight(textheight);
		for (butCtn of inputArea.find(".chat-icon-button")){
			$(butCtn).css("height", textheight);
		}
		inputArea.find("#send-button").css("height", textheight);
		areaheight = areaheight - (textheight+30)-imgheight;
        
        inputArea.css("height",  textheight+10+imgheight);
		messagesArea.css("height", areaheight);
		
	}
/* 	function getdisplayUserMessage(ctn,userName,userTemplate){
	    inputCtn=$(ctn).find(".ai-chat-input-area");
	    let userMessage = inputCtn.find(".user-message").val();
	    let userImage = inputCtn.find("#input-img img").attr("src");
	    if(userImage){
	        userImage = "<img class='ai-chat-img' src='"+userImage+"' >";
	    }else{
	        userImage = "";
	    }
	    params = {user:userName,msg:userMessage,img:userImage};
	    return Mustache.render(userTemplate, params);
	} */
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
			text.content = contents
			historic.push(JSON.stringify(text));
			text={};
			text.role = "assistant";
			text.content = $(this).next(".bot-messages").find(".msg").text();
			historic.push(JSON.stringify(text));
			
		});
		inputCtn=$(ctn).find(".ai-chat-input-area");
	    let userMessage = inputCtn.find(".user-message").val();
		let userImage = inputCtn.find("#input-img img").attr("src");
		let prompt =[];
		prompt.push({"type":"text","text":userMessage});
		if(userImage){
			prompt.push({"type":"image_url","image_url":{"url":userImage}});
		}
		return {prompt:JSON.stringify(prompt), specialisation:specialisation, historic: JSON.stringify(historic)}; // post params
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
					audio64 = audio64.split(",")[1];
					const jsonData = {
						file: audio64,
						reqType: 'audio'
					};
					app._call(useAsync, url, jsonData, function callback(botResponse){
						console.log(botResponse.msg);
						let json = JSON.parse(botResponse.msg);
						console.log(json.text);
						messageCtn.val(json.text);
						messageCtn.focus();
					});
				});
				
				
			}else{
				isCancelled = false;

			}
			stream.getTracks().forEach(track => track.stop());
		};

		mediaRecorder.start();
	}
	function convertBlobToBase64(blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = function() {
				resolve(reader.result);  // Extraire la partie Base64 de la chaîne data URL
			};
			reader.onerror = function(error) {
				reject(error);
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
		$ui.confirm({content:"<i class='fas fa-microphone-on big-icon'></i>", onOk:function(){stopRecording();}, onCancel:function(){cancelRecording();}});
	}
	function loadResultInAceEditor(ctn,divId){
		$ui.loadAceEditor(function(){
			var aceEditor = window.ace.edit(divId);
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
		inputCtn=$(ctn).find(".ai-chat-input-area");
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
		loadResultInAceEditor:loadResultInAceEditor 
	};
})();
