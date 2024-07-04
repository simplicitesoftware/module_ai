var AIChatBot = AIChatBot || (function() {
	let specialisation="";
	const app = $ui.getApp();
	let botTemplate;
	let userTemplate;
	let userName ="user";
	
	function render(params,spe,dataDisclaimer) {
		console.log("AIChatBot render");
		botTemplate = $("#botTemplate").html();
		app.getSysParam(function(param){
			botTemplate = Mustache.render(botTemplate, {botName:param});
		},"AI_CHAT_BOT_NAME");
		
		if(app.getGrant().firstname ){
			userName =app.getGrant().firstname;
		}else{
			userName =app.getGrant().login;
		}
		if(dataDisclaimer){
			$('#data_warn').html(dataDisclaimer);
			$('#data_warn').show();
		}
		userTemplate = $("#userTemplate").html();
		specialisation = spe;
		document.getElementById('chatbot_input_message').addEventListener('keyup', function(event) {
			if (event.key === 'Enter' && event.target.matches('#chatbot_input_message')) {
				chatbotSendMessage();
			}
		});

		
	}
	function chatbotSendMessage() {
		let userMessage = document.getElementById('chatbot_input_message').value;
		let chatMessages = document.getElementById('chatbot_messages');
		// Ajoutez ici la logique de votre chatbot pour générer une réponse en fonction de userMessage
		let historic =[];
		$(".user-messages").each(function() {
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
		document.getElementById('chatbot_input_message').value = '';
	
		// Faites défiler vers le bas pour afficher les messages les plus récents
		chatMessages.scrollTop = chatMessages.scrollHeight;
		// Call Webservice (POST requests only)
	
		app._call(useAsync, url, postParams, function callback(botResponse){
			if(!(botResponse.hasOwnProperty('type') && botResponse.type == 'error')){
				let result = botResponse.response.choices[0].message.content;
				result = escapeHtml(result);
				result = $view.markdownToHTML(result).html();
				result = result.replaceAll("\n","<br>");
				
				$(".bot-messages:last-child span").html(result);	
				
			}else{
				$(".bot-messages:last-child span").text("Sorry, an error occurred");
			}
				
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
	return { render: render, chatbotSendMessage: chatbotSendMessage};

})();