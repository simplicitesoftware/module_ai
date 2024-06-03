var app = $ui.getApp();
var botTemplate = "<div class=\"bot-messages\"><strong>{{botName}}: </strong><span class=\"msg\">...</span></div>";
var userTemplate ="<div class=\"user-messages\"><strong>{{user}}: </strong><span class=\"msg\">{{msg}}</span></div>";
var swagger;
var userName = "user";
var AIMetricsChat = (function() {
	function render(params,s) {
		// set button text
		app.getTexts(function(textes){
			sendText = textes?.AI_BUTTON_SEND ||"Send";
			cancelText = textes?.AI_BUTTON_CANCEL || "Cancel";
			var length = Math.max(sendText.length, cancelText.length);
			$('.chat-button').css('min-width', length + 'em');
			$('.user-message').css('width', 'calc(100% - ' + (length + 1) + 'em)');
			$('#metrics_send_button').text(sendText);
			$('#metrics_cancel_button').text(cancelText);
		},null);
		swagger=s;
		if(app.getGrant().firstname ){
			userName =app.getGrant().firstname;
		}else{
			userName =app.getGrant().login;
		}
		userTemplate=userTemplate.replace('{{user}}', userName);
		app.getSysParam(function(param){
			botTemplate = botTemplate.replace("{{botName}}",param);
		},"AI_CHAT_BOT_NAME");
		$('#metrics_user_text').keypress(function(e) {
			if (e.which === 13) {
				sendMetricsMessage(swagger);
			}
		});
		
	}

	return { render: render };
})();
function sendMetricsMessage(){
	let isCancelled = false;
	$('#metrics_cancel_button').show();
	$('#metrics_cancel_button').click(function() {
		isCancelled = true;
		resetChat();
	});
	let input = '';
	$('#metrics_messages').html('');
	canvas = $('canvas');
	canvas.each(function(canva) {
		eval(canvas[canva].id+".remove();");
	});
	$('#ia_html').html('');
	input = $('#metrics_user_text').val();
	$('#metrics_user_text').val('');
	$('#metrics_send_button').prop('disabled', true);
	$('#metrics_send_button').hide();
	$('#metrics_user_text').prop('disabled', true);
	var params = {prompt:input, reqType:"metrics",swagger:swagger,lang:app.grant.lang};
	$('#metrics_messages').append(userTemplate.replace('{{msg}}',input));
	$('#metrics_messages').append(botTemplate);
	var url = Simplicite.ROOT+"/ext/AIRestAPI";
	var useAsync = true;
	app._call(useAsync, url, params, function callback(botResponse){
		if(isCancelled){
			
			return;
		}
		reOpenChat();
		if(botResponse.html == null && botResponse.js == null && botResponse.text != null){
			$('#metrics_messages .bot-messages:last .msg').text(botResponse.text.replace(/\\n/g, "<br>"));
			return;
		}
		if(botResponse.error !=null || ((botResponse.js == null && (botResponse.html == null || !botResponse.html.includes("script"))))){
			$('#metrics_messages .bot-messages:last .msg').text("Sorry, I can't understand your request. Please try again.");
			return;
		}
		if(botResponse.text == null){
			botResponse.text = "";
		}
		$('#metrics_messages .bot-messages:last .msg').text(botResponse.text.replace(/\\n/g, "<br>"));
		$('#ia_html').html(botResponse.html);
		try {
			eval(botResponse.js + "\n" + botResponse.function); 
		}catch(e){
			$('#metrics_messages .bot-messages:last .msg').text("Sorry, I can't understand your request. Please try again.");
		}
		

	});
	
}
function reOpenChat(){
	$('#metrics_user_text').prop('disabled', false);
	$('#metrics_send_button').show();
	$('#metrics_send_button').prop('disabled', false);
	$('#metrics_cancel_button').hide();
	$('#metrics_cancel_button').onclick = null;
}
function resetChat(){
	$('#metrics_messages').html('');
	reOpenChat();

}