
var AIWfChatBot = AIWfChatBot || (function() {
	let botTemplate;
	let userTemplate;
	const app = $ui.getApp();
	let userName ="user";
	let image_base64 ="";
	// Params
	let useAsync = true; // use async callback pattern
	let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
	function resizeUp(){
		const vh = window.innerHeight * 0.01;
		const maxHeight = `${45 * vh - 250}px`;
		const minHeight = `40px`;
		
		$("#module_user_message").css("height", minHeight);
		let textheight = $("#module_user_message").prop('scrollHeight')-5 ;
		let areaheight = $("#chat-container").height();
		let imgheight = $("#input-img").is(':hidden')?0: $("#input-img").height();
		if(textheight >maxHeight-imgheight){
			textheight = maxHeight-imgheight;
			
		}else if(textheight < minHeight){
			textheight = minHeight;
		}
		$("#module_user_message").css("height", textheight);
		areaheight = areaheight - (textheight +30)-imgheight;
		$("#module_chat_messages").css("height", areaheight);
	}
	

	function render() {
		$(".btn-validate").remove();
		$(window).resize(function() {
			resizeUp();
		});
		$("#add-img").addClass("fas fa-upload");
		$("#take-img").addClass("fas fa-camera");
		$("#speech").addClass("fas fa-microphone");
		console.log("Render chat");
		botTemplate = $("#botTemplate").html();
		userTemplate = $("#userTemplate").html();
		setBotName();
		
		if(app.getGrant().firstname ){
			userName =app.getGrant().firstname;
		}else{
			userName =app.getGrant().login;
		}
		userTemplate=userTemplate.replace('{{user}}', userName);
	}
	function sendModuleMessage() {
		let userMessage = document.getElementById('module_user_message').value;
		let userImage = $("#input-img img").attr("src");
		let chatMessages = document.getElementById('module_chat_messages');
		let historic = [];
		if ($("#context").length >0) {
			let text = {};
			text.role = "assistant";
			text.content = $("#context").text();
			historic.push(JSON.stringify(text));
		}

		$(".user-messages").each(function() {
			let text ={};
			text.role = "user";
			let contents =[];
			let content = {"type":"text","text":$(this).find(".msg").text()};
			contents.push(content);
			let img = $(this).find(".img");
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

		// Affichez la question de l'utilisateur et la réponse du chatbot dans le chat
		let userCompletMessage =userTemplate.replace('{{msg}}', userMessage.replaceAll("\n","<br>"));
		if(userImage){
			userCompletMessage = userCompletMessage.replace('{{img}}', "<img class='img' src='"+userImage+"' >");
		}else{
			userCompletMessage = userCompletMessage.replace('{{img}}', "");
		
		}
		chatMessages.innerHTML += userCompletMessage;
		chatMessages.innerHTML += botTemplate;
		$("#send-button").attr("disabled", "disabled");
		
		let prompt =[];
		prompt.push({"type":"text","text":userMessage});
		if(userImage){
			prompt.push({"type":"image_url","image_url":{"url":userImage}});
		}
		let postParams = {prompt:JSON.stringify(prompt), specialisation: "You help design uml for object-oriented applications. Without function and whith relation description. Respond with a text", historic: JSON.stringify(historic)}; // post params
		
		// Efface le champ de saisie utilisateur
		document.getElementById('module_user_message').value = '';
		$("#input-img img").removeAttr("src");
		$("#input-img").hide();
		resizeUp();

		// Faites défiler vers le bas pour afficher les messages les plus récents
		chatMessages.scrollTop = chatMessages.scrollHeight;
		// Call Webservice (POST requests only)
		
		app._call(useAsync, url, postParams, function callback(botResponse){
			let text ={};
			text.role = "user";
			text.content = userMessage;
			historic.push(JSON.stringify(text));
			if(!(botResponse.hasOwnProperty('type') && botResponse.type == 'error')){
				let result = botResponse.response.choices[0].message.content;
				result = result.replaceAll("\n","<br>");
				$(".bot-messages:last-child span").html(result);
				
				text={};
				text.role = "assistant";
				text.content =result;
				historic.push(JSON.stringify(text));
				
				
			}else{
				$(".bot-messages:last-child span").text("Sorry, an error occurred");
				
				text={};
				text.role = "assistant";
				text.content ="Sorry, an error occurred";
				historic.push(JSON.stringify(text));
			}
			$("#AI_data").html(JSON.stringify(historic));
			$("#send-button").removeAttr("disabled");
			chatMessages.scrollTop = chatMessages.scrollHeight;
		});
		
	}
	function addImage(){
		let input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/jpeg';
		input.onchange = function(event) {
			let file = event.target.files[0];
			let reader = new FileReader();
			reader.onload = function(event) {
				image_base64 = event.target.result;
				$("#input-img img").attr("src", image_base64);
				$("#input-img").show();
				resizeUp();
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}
	async function takeImage(){
		let input =await $view.widget.takePicture({title: $T('TAKE_PICT'),facingMode: "environment"});
		$("#input-img img").attr("src", input);
		$("#input-img").show();
		resizeUp();
	}
	function setBotName(){
		let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
		let postParams = {"reqType":"BOT_NAME"};
		app._call(false, url, postParams, function callback(botResponse){
						let param = botResponse.botName;
			botTemplate = botTemplate.replace("{{botName}}",param);
			$("#AIchatbotProcess").html($("#AIchatbotProcess").html().replace("{{botName}}",param));
			return true;
		});
		return false;
	}
	let mediaRecorder;
	let audioChunks = [];
	let isCancelled = false;  
	// Fonction pour démarrer l'enregistrement
	async function startRecording() {
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
						console.log(botResponse);
						console.log(botResponse.msg);
						let json = JSON.parse(botResponse.msg);
						console.log(json.text);
						$("#module_user_message").val(json.text);
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
	function getSpeech(){
		startRecording();
		$ui.confirm({content:"<i class='fas fa-microphone-on big-icon'></i>", onOk:function(){stopRecording();}, onCancel:function(){cancelRecording();}});
	}
	return {
		sendModuleMessage: sendModuleMessage,
		addImage: addImage,
		takeImage: takeImage,
		getSpeech: getSpeech,
		render: render,
		resizeUp: resizeUp
	};
})();
$(document).ready(function() {
	AIWfChatBot.render();
	
});