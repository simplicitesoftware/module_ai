var AIMetricsChat = AIMetricsChat || (function() {
	const app = $ui.getApp();
	let botTemplateMetrics = "<div class=\"bot-messages\"><strong>{{botName}}: </strong><span class=\"msg\">...</span></div>";
	let userTemplateMetrics ="<div class=\"user-messages\"><strong>{{user}}: </strong><span class=\"msg\">{{msg}}</span></div>";
	let swagger="";
	let userName = "user";
	let moduleName = "";
	let lastScript = "";
	let lastText ="";
	let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
	let useAsync = true;
	function render(params,module,s) {
		// set button text
		moduleName = module;
		$('#metrics_user_text').click(function() { showWarn();});
		app.getTexts(function(textes){
			let actLabel = textes?.AiSaveAsCrosstableAction||"";
			let sendText = textes?.AI_BUTTON_SEND ||"Send";
			let cancelText = textes?.AI_BUTTON_CANCEL || "Cancel";
			let length = Math.max(sendText.length, cancelText.length);
			if(actLabel != "")$("#work .actions").prepend('<button class="btn btn-secondary" type="button" onclick="AIMetricsChat.saveAsCrosstable()"><span>'+actLabel+'</span></button>');
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
		userTemplateMetrics=userTemplateMetrics.replace('{{user}}', userName);
		setBotName();
		$('#metrics_user_text').keypress(function(e) {
			if (e.which === 13) {
				sendMetricsMessage();
			}
		});
		
	}
	function sendMetricsMessage(){
		let isCancelled = false;
		$('#metrics_cancel_button').show();
		$('#metrics_cancel_button').click(function() {
			isCancelled = true;
			resetChat();
		});
		let input = '';
		$('#metrics_messages').html('');
		let canvas = $('canvas');
		canvas.each(function(canva) {
			let id = canvas[canva].id;
			let graph = Chart.getChart(id);
			if(graph) graph.destroy();
			
			
		});
		$('#ia_html').html('');
		input = $('#metrics_user_text').val();
		$('#metrics_user_text').val('');
		$('#metrics_send_button').prop('disabled', true);
		$('#metrics_send_button').hide();
		$('#metrics_user_text').prop('disabled', true);
		let params = {prompt:input, reqType:"metrics",swagger:swagger,lang:app.grant.lang};
		$('#metrics_messages').append(userTemplateMetrics.replace('{{msg}}',input));
		$('#metrics_messages').append(botTemplateMetrics);
		lastText ="";
		app._call(useAsync, url, params, function callback(botResponse){
			processResponse(botResponse,true,isCancelled,params);
			// Définir les options globales pour Chart.js
			Chart.defaults.responsive = true;
			Chart.defaults.maintainAspectRatio = false;
			
	
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
	function showWarn(){
		app.getTexts(function(textes){
			$ui.alert(app.getText(textes?.AI_GRAPH_DISCLAIMER, false));
			$('#metrics_user_text').unbind('click');
		});
	}
	function saveAsCrosstable(){
		
		let func = lastScript;
		console.log("callProcess: "+func);
		let params = {reqType:"saveMetrics",swagger:swagger,moduleName:moduleName,function:func,ctx:"$('#ia_html')"};
		app._call(useAsync, url, params, function callback(botResponse){
			console.log(botResponse);
			eval(botResponse.script);
		});
		
	}
	function setBotName(){
		let postParams = {"reqType":"BOT_NAME"};
		app._call(false, url, postParams, function callback(botResponse){
			let param = botResponse.botName;
			botTemplateMetrics = botTemplateMetrics.replace("{{botName}}",param);
			return true;
		});
		return false;
	}
	function processResponse(botResponse,recall,isCancelled,params){
		if(isCancelled){
			return;
		}
		if(!hasJS(botResponse)){
			return;
		}
		if(botResponse.text == null){
			botResponse.text = "";
		}else if(botResponse.text != "" && lastText == ""){
			lastText = botResponse.text;
		}
		$('#ia_html').html(botResponse.html);
		
		if(botResponse.js != ""){
			try {
				eval(botResponse.js);
				
				//check if function is auto call
				if(botResponse.js.indexOf(botResponse.function) == -1) {
					eval(botResponse.function);
				}
				lastScript = botResponse.js;
				
				$('#metrics_messages .bot-messages:last .msg').text(lastText.replace(/\\n/g, "<br>"));
				reOpenChat();
			}catch(e){
				console.log("Error on script: "+botResponse.js);
				console.log("Error: "+e);
				if(recall){
					
					console.log("Recall process with errorMetricsSolver");
					params.reqType = "errorMetricsSolver";
					params.error = e.toString();
					params.script = botResponse.js;
					params.html = botResponse.html;
					console.log(params);
					app._call(useAsync, url, params, function callback(botResponse){
						processResponse(botResponse,false,isCancelled);
					});
				}else{
					$('#metrics_messages .bot-messages:last .msg').text("Sorry, I can't understand your request. Please try again.");
					reOpenChat();
				}
			}
		}else{
			lastScript = $("#ia_html script").text();
			reOpenChat();
		}
		
	}
	function hasJS(botResponse){
		if(botResponse.error !=null || ((botResponse.js == null && !botResponse?.html?.includes("script")))){
			$('#metrics_messages .bot-messages:last .msg').text("Sorry, I can't understand your request. Please try again.");
			return false;
		}
		
		if(botResponse.html == null && botResponse.js == null && botResponse.text != null){
			$('#metrics_messages .bot-messages:last .msg').text(botResponse.text.replace(/\\n/g, "<br>"));
			return false;
		}

		return true;
	}
	return { render: render ,sendMetricsMessage:sendMetricsMessage,saveAsCrosstable:saveAsCrosstable};
})();