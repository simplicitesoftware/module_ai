var AIChatBot = AIChatBot || (function() {
	console.log("chatbot");
	let specialisation="";
	const app = $ui.getApp();
	//addImg,takeImg,Speech
	let addImgVisible = true;
	let takeImgVisible = true;
	let SpeechVisible = true;
	let historicObject;

	function render(params,isAdaContext,spe,dataDisclaimer) {
		let ctn = params[0];
		if(dataDisclaimer){
			$(ctn).find('#data_warn').html(dataDisclaimer);
			$(ctn).find('#data_warn').show();
		}
		specialisation = spe;
		ctn.querySelector('#chatbot_input_message').addEventListener('keyup', function(event) {
			if (event.key === 'Enter' && event.target.matches('#chatbot_input_message')) {
				chatbotSendMessage(ctn);
			}
		});
		console.log("AIJSTooL");
		$ui.loadScript({url: $ui.getApp().dispositionResourceURL("AiJsTools", "JS"),onload: function(){ AiJsTools.addChatOption(ctn.querySelector('.ai-user-input'),addImgVisible,takeImgVisible,SpeechVisible);console.log(AiJsTools.provider);}});
		
		ctn.querySelector('#chatbot_send_button').onclick = function() {
			AIChatBot.chatbotSendMessage(ctn);
		};
		if(isAdaContext){
			historicObject= app.getBusinessObject("AdaPromptHistory");
			historicObject.getForCreate(createHistoric);
		}
		
		
	}
	function createHistoric(item){
		historicObject.save((newItem)=>{console.log("historic created",newItem)},item);
	}
	function chatbotSendMessage(ctn) {
		let userMessage = ctn.querySelector('#chatbot_input_message').value;
		let chatMessages = ctn.querySelector('#chatbot_messages');
		desableChatbot(ctn);
		
		let historic =[];
		$(ctn).find(".user-messages").each(function() {
			let text ={};
			text.role = "user";
			text.content = $(this).find(".msg").text();
			historic.push(JSON.stringify(text));
			text={};
			text.role = "assistant";
			text.content = $(this).next(".bot-messages").find(".msg").text();
			historic.push(JSON.stringify(text));
			
		});
		
		// Params
		let useAsync; // use async callback pattern
		if(AiJsTools){
			useAsync = AiJsTools.useAsync;
		}else{
			useAsync = true;
		}
		let url;
		if(AiJsTools){
			url = AiJsTools.url;
		}else{
			url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
		}
		let postParams;
		if(AiJsTools){
			postParams =  AiJsTools.getPostParams(ctn,specialisation);
		}else{
			postParams = {prompt:userMessage, specialisation: specialisation, historic: JSON.stringify(historic),reqType:"chatBot"};
		}
		
		// Affichez la question de l'utilisateur et la réponse du chatbot dans le chat
		if(AiJsTools){
			chatMessages.append(AiJsTools.getDisplayUserMessage(ctn));
			chatMessages.append(AiJsTools.getDisplayBotMessage());	
		}



		// Efface le champ de saisie utilisateur
		if(AiJsTools){
			AiJsTools.resetInput(ctn.querySelector('.ai-chat-input-area'));
		}else{
			ctn.querySelector('#chatbot_input_message').value = '';
		}
		
	
		// Faites défiler vers le bas pour afficher les messages les plus récents
		chatMessages.scrollTop = chatMessages.scrollHeight;
		// Call Webservice (POST requests only)
	
		app._call(useAsync, url, postParams, function callback(botResponse){
			if(!(botResponse.hasOwnProperty('type') && botResponse.type == 'error')){
				let result = botResponse.response.choices[0].message.content;
				result = escapeHtml(result);
				result = $view.markdownToHTML(result).html();
				$(ctn).find(".bot-messages:last-child span").html(result);	
				addHistoric(userMessage,result,$grant.getLogin());
			}else{
				$(ctn).find(".bot-messages:last-child span").text("Sorry, an error occurred");
				addHistoric(userMessage,"Sorry, an error occurred",$grant.getLogin());
			}
			enableChatbot(ctn);
			chatMessages.scrollTop = chatMessages.scrollHeight;
		 });
	
			 
	}
	function escapeHtml(text) {
		let map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};
		return text.replace(/[&<>"']/g, function(m) { return map[m]; });
	}
	function desableChatbot(ctn){
		$(ctn).find("#chatbot_send_button").prop("disabled", true);
		$(ctn).find("#chatbot_input_message").prop("disabled", true);
	}
	function enableChatbot(ctn){
		$(ctn).find("#chatbot_send_button").prop("disabled", false);
		$(ctn).find("#chatbot_input_message").prop("disabled", false);
	}
	function addHistoric(userMessage,botMessage,login){
		if(!historicObject) return;
		let botn = "bot";
		if(AiJsTools){
			botn = AiJsTools.botName;
		}
		let message = "";
		if(historicObject.item.adaPhyChat){
			message = historicObject.item.adaPhyChat;
		}
		message += `\n# ${login}\n${userMessage}\n\n# ${botn}\n${botMessage}\n\n`;
		historicObject.item.adaPhyChat = message;
		historicObject.item[`adaPhyUserPrompts`] = userMessage;
		historicObject.save();
	}
	return { render: render, chatbotSendMessage: chatbotSendMessage};

})();