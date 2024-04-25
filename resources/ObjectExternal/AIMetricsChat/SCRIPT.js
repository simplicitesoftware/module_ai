var app = $ui.getApp();
var botTemplate = "<div class=\"bot-messages\"><strong>{{botName}}: </strong><span class=\"msg\">...</span></div>";
var userTemplate ="<div class=\"user-messages\"><strong>{{user}}: </strong><span class=\"msg\">{{msg}}</span></div>";
var swagger;
var userName = "user";
var AIMetricsChat = (function() {
	function render(params,s) {
		swagger=s;
		console.log("swagger",swagger);
		if(app.getGrant().firstname ){
			userName =app.getGrant().firstname;
		}else{
			userName =app.getGrant().login;
		}
		userTemplate=userTemplate.replace('{{user}}', userName);
		app.getSysParam(function(param){
			botTemplate = botTemplate.replace("{{botName}}",param);
		},"AI_CHAT_BOT_NAME");
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
	var url = Simplicite.ROOT+"/ext/AIRestAPI";
	var useAsync = true;
	app._call(useAsync, url, params, function callback(botResponse){
		$('#user-text').prop('disabled', false);
		$('#send-button').prop('disabled', false);
		if(botResponse.error !=null || ((botResponse.js == null && (botResponse.html == null || !botResponse.html.includes("script"))))){
			console.log("error in answer botResponse.error !=null || ((botResponse.js == null && (botResponse.html == null || !botResponse.html.includes(\"script\"))))"+botResponse.error !=null+" || (("+botResponse.js == null+" && ("+botResponse.html == null+" || "+!botResponse.html.includes("script")+")))");
			$('#messages .bot-messages:last .msg').text("Sorry, I can't understand your request. Please try again.");
			return;
		}
		console.log("sendMessage",botResponse);
		if(botResponse.text == null){
			botResponse.text = "";
		}
		$('#messages .bot-messages:last .msg').text(botResponse.text.replace(/\\n/g, "<br>"));
		$('#ia_html').html(botResponse.html);
		try {
			eval(botResponse.js + "\n" + botResponse.function); 
		}catch(e){
			console.log("error in eval botResponse.js",e);
			$('#messages .bot-messages:last .msg').text("Sorry, I can't understand your request. Please try again.");
		}
		

	});
	
}