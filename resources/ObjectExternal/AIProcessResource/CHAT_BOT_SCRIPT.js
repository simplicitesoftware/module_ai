var botTemplate;
var userTemplate;
var app;
console.log("var");
function clickPress(event) {
    if (event.keyCode == 13) {
        sendMessage();
    }
}
$(".btn-validate").remove();
function resizeUp(){
	const vh = window.innerHeight * 0.01;
	const maxHeight = `${60 * vh - 250}px`;
	var textheight = $("#user-message").height();
	var areaheight = $("#chat-container").height();
	
	if(textheight >maxHeight){
		textheight = maxHeight;
		$("#user-message").css("height", textheight);
	}
	areaheight = areaheight - (textheight +30);
	$("#chat-messages").css("height", areaheight);
}
$(document).ready(function() {
	console.log("ready");
	botTemplate = $("#botTemplate").html();
	userTemplate = $("#userTemplate").html();
	app = $ui.getApp();
	app.getSysParam(function(param){
		
		botTemplate = botTemplate.replace("{{botName}}",param);
		$("#AIchatbotProcess").html($("#AIchatbotProcess").html().replaceAll("{{botName}}",param));
	},"AI_CHAT_BOT_NAME");

});
new ResizeObserver(resizeUp).observe(document.querySelector("#user-message"));
function sendMessage() {
	var userMessage = document.getElementById('user-message').value;
	var chatMessages = document.getElementById('chat-messages');
	var historic = [];
	console.log("here");
	if ($("#context").length >0) {
		text = {};
		text.role = "assistant";
		text.content = $("#context").text();
		historic.push(JSON.stringify(text));
	}

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
	userTemplate=userTemplate.replace('{{user}}', app.getGrant().login);
	userTemplate=userTemplate.replace('{{msg}}', userMessage.replaceAll("\n","<br>"));
	chatMessages.innerHTML +=userTemplate;
	//Mustache.render(userTemplate, {user:app.getGrant().login,ask:userMessage});
	chatMessages.innerHTML += botTemplate;
	$("#send-button").attr("disabled", "disabled");
	// Params
	var useAsync = true; // use async callback pattern
	var url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
	var postParams = {prompt:userMessage, specialisation: "You help design uml for object-oriented applications. Without function and whith relation description. Respond with a text", historic: JSON.stringify(historic)}; // post params
	
	// Efface le champ de saisie utilisateur
	document.getElementById('user-message').value = '';

	// Faites défiler vers le bas pour afficher les messages les plus récents
	chatMessages.scrollTop = chatMessages.scrollHeight;
	// Call Webservice (POST requests only)
	//console.log(JSON.stringify(postParams));
	app._call(useAsync, url, postParams, function callback(botResponse){
		var text ={};
		text.role = "user";
		text.content = userMessage;
		historic.push(JSON.stringify(text));
		if(!(botResponse.hasOwnProperty('type') && botResponse.type == 'error')){
			var result = botResponse.response.choices[0].message.content;
			result = result.replaceAll("\n","<br>");
			$(".bot-messages:last-child span").html(result);
			
			text={};
			text.role = "assistant";
			text.content =result;
			historic.push(JSON.stringify(text));
			
			
		}else{
			//console.log(botResponse);
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