var AiMonitoring = (function() {
	function render(params,aiParams) {
		let templateContent = $('#AiMonitoringTemplate').html();
		
		$('#aimonitoring').html(Mustache.render(templateContent, aiParams));
		
	}
	function renderAINotParam(params){
		$('#panel_AIMonitoring_3').hide();
		if($T('AI_SETTING_NEED')==='AI_SETTING_NEED'){
			$ui.getApp().getTexts((texts) => $('#aimonitoring').append(parseMsg(texts.AI_SETTING_NEED)));
		}else{
			$('#aimonitoring').append($T('AI_SETTING_NEED'));
		}
		
		
	}
	function renderPingBannerAndChatBot(msg){
		
		msg = msg.replaceAll("&#x2F;", "/");
		msg = msg.replaceAll("&#39;", "'");
		msg = msg.replaceAll("&lt;", "<");
		msg = msg.replaceAll("&gt;", ">");
		let jsonMsg = $ui.getApp().messageToJson(msg);
		
        let ctn = $("#ping_banner");
        if(jsonMsg?.level == "I"){
            ctn.addClass("alert-success");
			displayChatbot(true);
        }else if(jsonMsg?.level == "W"){
            ctn.addClass("alert-warning");
			displayChatbot(true);
        
        }else{
			ctn.addClass("alert-danger");
			displayChatbot(false);
		}
		if(jsonMsg?.code == jsonMsg?.label){
			$ui.getApp().getTexts((texts) => ctn.html(parseMsg(texts[jsonMsg.code])));
		}else{
			ctn.html(parseMsg(jsonMsg?.label));
		}
        
    }
	function parseMsg(msg){
		let urlPatern =/(https?:\/\/(?:[\w#:?+=&%@!\\-]+\.)+\w+(?:\/[\w#:?+=&%@!\\-]+)*)/g;
		msg = msg.replaceAll(urlPatern, '<a class="ping_banner_url" href="$&" target="_blank">$&</a>');
				

		return msg;
	}
	function displayChatbot(display){
		if(display){
			if($("#AiTestingChatbot").length === 0){
				$('#aimonitoring').append('<div class = "card-body"><div id="AiTestingChatbot"/></div>');
			}
			$ui.displayView($("#AiTestingChatbot"),"AIChatVue",null,null);
		}else if($("#panel_AIMonitoring_3").length !== 0){
			$("#panel_AIMonitoring_3").hide();
		}
	}
	return { render: render,renderAINotParam:renderAINotParam,renderPingBannerAndChatBot:renderPingBannerAndChatBot};
	
})();