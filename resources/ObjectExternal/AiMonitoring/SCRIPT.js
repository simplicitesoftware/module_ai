var AiMonitoring = (function() {
	let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
	let useAsync = true; // use async callback pattern
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
		let buttonText = $T('AI_SETTING_BUTTON');
		if(buttonText === 'AI_SETTING_BUTTON') buttonText = "Setting AI";
		let button = $("<button>", {
		    id: "btn-AIStartParam",
		    class: "btn btn-action",
		    text:  buttonText,
		    css: {
        		float: "right" // Aligne le bouton à droite
    		}
		    
		}).on("click", function() {
		    $ui.displayWorkflow(null,"AiSettingsProcess","start",null,null); 
		}).appendTo("#ctnSettings"); 
		
		
	}
	function ping(){
		let postParams = {"reqType":"ping"};
		$ui.getApp()._call(useAsync, url, postParams, function callback(response){
			renderPingBannerAndChatBot(response.msg);
		});
	}
	function renderPingBannerAndChatBot(msg){
		console.log(msg);
		msg = msg.replaceAll("&#x2F;", "/");
		msg = msg.replaceAll("&#39;", "'");
		msg = msg.replaceAll("&lt;", "<");
		msg = msg.replaceAll("&gt;", ">");
		let jsonMsg = $ui.getApp().messageToJson(msg);
		
        let ctn = $("#ping_banner");
        ctn.removeClass("loading_ping_banner");
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
	return { render: render,renderAINotParam:renderAINotParam,ping:ping};
	
})();