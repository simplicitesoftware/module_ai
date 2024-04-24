var app = $ui.getApp();
var botTemplate = "<div class=\"bot-messages\"><strong>Chatbot: </strong><span class=\"msg\">...</span></div>";
var userTemplate ="<div class=\"user-messages\"><strong>{{user}}: </strong><span class=\"msg\">{{msg}}</span></div>";
var swagger;
var AIMetricsChat = (function() {
	function render(params,s) {
		userTemplate.replace('{{user}}', app.getGrant().login);
		swagger=s;
		console.log("swagger",swagger);
		userTemplate=userTemplate.replace('{{user}}', app.getGrant().login);
		$('#user-text').keypress(function(e) {
			if (e.which === 13) {
				sendMessage(swagger);
			}
		});
		
	}

	return { render: render };
})();
function sendMessage(){
	var input = '';
	$('#messages').html('');
	canvas = $('canvas');
	canvas.each(function(canva) {
		eval(canvas[canva].id+".remove();");
	});
	$('#ia_html').html('');
	input = $('#user-text').val();
	$('#user-text').val('');
	$('#send-button').prop('disabled', true);
	$('#user-text').prop('disabled', true);
	var params = {prompt:input, reqType:"metrics",swagger:swagger,lang:app.grant.lang};
	console.log(params);
	$('#messages').append(userTemplate.replace('{{msg}}',input));
	$('#messages').append(botTemplate);
	var url = Simplicite.ROOT+"/ext/GptRestAPI";
	var useAsync = true;
	app._call(useAsync, url, params, function callback(botResponse){
		if(botResponse.error !=null || ((botResponse.js == null && (botResponse.html == null || !botResponse.html.contains("script"))))){
			$('#messages .bot-messages:last .msg').text("Sorry, I can't understand your request. Please try again.");
			return;
		}
		$('#user-text').prop('disabled', false);
		$('#send-button').prop('disabled', false);
		console.log("sendMessage",botResponse);
		if(botResponse.text == null){
			botResponse.text = "";
		}
		$('#messages .bot-messages:last .msg').text(botResponse.text.replace(/\\n/g, "<br>"));
		$('#ia_html').html(botResponse.html);
		try {
			eval(botResponse.js + "\n" + botResponse.function); 
		}catch(e){
			$('#messages .bot-messages:last .msg').text("Sorry, I can't understand your request. Please try again.");
		}
		

	});
	
}