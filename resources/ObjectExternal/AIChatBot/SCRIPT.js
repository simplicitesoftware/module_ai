var AIChatBot = AIChatBot || (function() {
	let specialisation="";
	const app = $ui.getApp();
	let botTemplate;
	let userTemplate;
	let userName ="user";
	function render(params,spe,dataDisclaimer) {
		let ctn=params[0];
		botTemplate = $("#botTemplate").html();
		setBotName();
		if(app.getGrant().firstname ){
			userName =app.getGrant().firstname;
		}else{
			userName =app.getGrant().login;
		}
		if(dataDisclaimer){
			$(ctn).find('#data_warn').html(dataDisclaimer);
			$(ctn).find('#data_warn').show();
		}
		userTemplate = $("#userTemplate").html();
		specialisation = spe;
		ctn.querySelector('#chatbot_input_message').addEventListener('keyup', function(event) {
			if (event.key === 'Enter' && event.target.matches('#chatbot_input_message')) {
				chatbotSendMessage(ctn);
			}
		});
		ctn.querySelector('#chatbot_send_button').onclick = function() {
			AIChatBot.chatbotSendMessage(ctn);
		};

		
	}
	function chatbotSendMessage(ctn) {
		let userMessage = ctn.querySelector('#chatbot_input_message').value;
		let chatMessages = ctn.querySelector('#chatbot_messages');
		desableChatbot(ctn);
		// Ajoutez ici la logique de votre chatbot pour générer une réponse en fonction de userMessage
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
		// Affichez la question de l'utilisateur et la réponse du chatbot dans le chat
		
		
		chatMessages.innerHTML += Mustache.render(userTemplate, {user:userName,ask:userMessage});
		chatMessages.innerHTML += botTemplate;
		// Params
		let useAsync = true; // use async callback pattern
		let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
		let postParams = {prompt:userMessage, specialisation: specialisation, historic: JSON.stringify(historic)}; // post params
		
		// Efface le champ de saisie utilisateur
		ctn.querySelector('#chatbot_input_message').value = '';
	
		// Faites défiler vers le bas pour afficher les messages les plus récents
		chatMessages.scrollTop = chatMessages.scrollHeight;
		// Call Webservice (POST requests only)
	
		app._call(useAsync, url, postParams, function callback(botResponse){
			if(!(botResponse.hasOwnProperty('type') && botResponse.type == 'error')){
				let result = botResponse.response.choices[0].message.content;
				result = escapeHtml(result);
				result = $view.markdownToHTML(result).html();
				$(ctn).find(".bot-messages:last-child span").html(result);	
				
			}else{
				$(ctn).find(".bot-messages:last-child span").text("Sorry, an error occurred");
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
	function setBotName(){
		let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
		let postParams = {"reqType":"BOT_NAME"};
		app._call(false, url, postParams, function callback(botResponse){
			let param = botResponse.botName;
			botTemplate = Mustache.render(botTemplate, {botName:param});
			return true;
		});
		return false;
	}
	function desableChatbot(ctn){
		$(ctn).find("#chatbot_send_button").prop("disabled", true);
		$(ctn).find("#chatbot_input_message").prop("disabled", true);
	}
	function enableChatbot(ctn){
		$(ctn).find("#chatbot_send_button").prop("disabled", false);
		$(ctn).find("#chatbot_input_message").prop("disabled", false);
	}
	return { render: render, chatbotSendMessage: chatbotSendMessage};

})();