var objContext="";
var GptChatBot = (function() {
	var botTemplate = $("#botTemplate").html();
	var userTemplate = $("#userTemplate").html();
	function render(params,context) {
		//$('#gptchatbot').append(context);
		objContext = context;
	}

	return { render: render };
})();
function sendMessage() {
	var userMessage = document.getElementById('user-message').value;
	var chatMessages = document.getElementById('chat-messages');
	var botTemplate = $("#botTemplate").html();
	var userTemplate = $("#userTemplate").html();
	// Ajoutez ici la logique de votre chatbot pour générer une réponse en fonction de userMessage
	var historic =[];
	$(".user-messages").each(function() {
		var text ={};
		text.role = "user";
		text.content = $(this).find(".msg").text();
		historic.push(JSON.stringify(text));
		text={};
		text.role = "assistant";
		text.content = $(this).next(".bot-messages").find(".msg").text();
		historic.push(JSON.stringify(text));
		
	});
	//console.log(historic);

	// Affichez la question de l'utilisateur et la réponse du chatbot dans le chat
	
	var app = $ui.getApp();
	chatMessages.innerHTML += Mustache.render(userTemplate, {user:app.getGrant().login,ask:userMessage});
	chatMessages.innerHTML += botTemplate;
	// Params
	var useAsync = true; // use async callback pattern
	var url = Simplicite.ROOT+"/ext/GptRestAPI"; // authenticated webservice
	var postParams = {prompt:userMessage, specialisation: objContext, historic: JSON.stringify(historic)}; // post params
	
	// Efface le champ de saisie utilisateur
	document.getElementById('user-message').value = '';

	// Faites défiler vers le bas pour afficher les messages les plus récents
	chatMessages.scrollTop = chatMessages.scrollHeight;
	// Call Webservice (POST requests only)
	//console.log(JSON.stringify(postParams));
	app._call(useAsync, url, postParams, function callback(botResponse){
		if(!(botResponse.hasOwnProperty('type') && botResponse.type == 'error')){
			var result = botResponse.response.choices[0].message.content;
			result = result.replaceAll("\n","<br>");
			$(".bot-messages:last-child span").html(result);	
		}else{
			//console.log(botResponse);
			$(".bot-messages:last-child span").text("Sorry, an error occurred");
		}
			
		chatMessages.scrollTop = chatMessages.scrollHeight;
	 });
	
}