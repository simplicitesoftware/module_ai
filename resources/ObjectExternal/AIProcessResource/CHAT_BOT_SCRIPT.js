var botTemplate;
var userTemplate;
var app;
var userName ="user";

$(window).resize(function() {
	resizeUp();
});
var image_base64 ="";
$(".btn-validate").remove();
function resizeUp(){
	const vh = window.innerHeight * 0.01;
	const maxHeight = `${45 * vh - 250}px`;
	const minHeight = `40px`;
	
	$("#module_user_message").css("height", minHeight);
	var textheight = $("#module_user_message").prop('scrollHeight')-5 ;
	var areaheight = $("#chat-container").height();
	var imgheight = $("#input-img").is(':hidden')?0: $("#input-img").height();
	if(textheight >maxHeight-imgheight){
		textheight = maxHeight-imgheight;
		
	}else if(textheight < minHeight){
		textheight = minHeight;
	}
	$("#module_user_message").css("height", textheight);
//$("#user-input").css("height", textheight);
	areaheight = areaheight - (textheight +30)-imgheight;
	$("#module_chat_messages").css("height", areaheight);
}
$(document).ready(function() {
	// add url to img bootstrap $ui.getApp().getIconURL("icon/color/camera");
	$("#add-img-icon").attr("src", $ui.getApp().getIconURL("icon/color/camera"));
	botTemplate = $("#botTemplate").html();
	userTemplate = $("#userTemplate").html();
	app = $ui.getApp();
	app.getSysParam(function(param){
		
		botTemplate = botTemplate.replace("{{botName}}",param);
		$("#AIchatbotProcess").html($("#AIchatbotProcess").html().replaceAll("{{botName}}",param));
	},"AI_CHAT_BOT_NAME");
	
	if(app.getGrant().firstname ){
		userName =app.getGrant().firstname;
	}else{
		userName =app.getGrant().login;
	}
	userTemplate=userTemplate.replace('{{user}}', userName);
	
});


function sendModuleMessage() {
	var userMessage = document.getElementById('module_user_message').value;
	var userImage = $("#input-img img").attr("src");
	var chatMessages = document.getElementById('module_chat_messages');
	var historic = [];
	if ($("#context").length >0) {
		text = {};
		text.role = "assistant";
		text.content = $("#context").text();
		historic.push(JSON.stringify(text));
	}

	$(".user-messages").each(function() {
		var text ={};
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
	userCompletMessage =userTemplate.replace('{{msg}}', userMessage.replaceAll("\n","<br>"));
	if(userImage){
		userCompletMessage = userCompletMessage.replace('{{img}}', "<img class='img' src='"+userImage+"' >");
	}else{
		userCompletMessage = userCompletMessage.replace('{{img}}', "");
	
	}
	chatMessages.innerHTML += userCompletMessage;
	chatMessages.innerHTML += botTemplate;
	$("#send-button").attr("disabled", "disabled");
	// Params
	var useAsync = true; // use async callback pattern
	var url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
	let prompt =[];
	prompt.push({"type":"text","text":userMessage});
	if(userImage){
		prompt.push({"type":"image_url","image_url":{"url":userImage}});
	}
	var postParams = {prompt:JSON.stringify(prompt), specialisation: "You help design uml for object-oriented applications. Without function and whith relation description. Respond with a text", historic: JSON.stringify(historic)}; // post params
	
	// Efface le champ de saisie utilisateur
	document.getElementById('module_user_message').value = '';
	$("#input-img img").removeAttr("src");
	$("#input-img").hide();
	resizeUp();

	// Faites défiler vers le bas pour afficher les messages les plus récents
	chatMessages.scrollTop = chatMessages.scrollHeight;
	// Call Webservice (POST requests only)
	
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
	var input = document.createElement('input');
	input.type = 'file';
	input.accept = 'image/jpeg';
	input.onchange = function(event) {
		var file = event.target.files[0];
		var reader = new FileReader();
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