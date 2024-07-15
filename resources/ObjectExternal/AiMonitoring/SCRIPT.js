var AiMonitoring = (function() {
	function render(params,aiParams) {
		
		let templateContent = $('#AiMonitoringTemplate').html();
		
		$('#aimonitoring').html(Mustache.render(templateContent, aiParams));
		if($("#AiTestingChatbot").length === 0){
			$('#aimonitoring').append('<div class = "card-body"><div id="AiTestingChatbot"/></div>');
		}
		if(aiParams?.error){
			console.log("AiMonitoring render error ",aiParams.error);
			console.log($ui.getApp().messageToJson(aiParams.error ));
			if(aiParams?.ping_url != ""){
				$ui.displayView($("#AiTestingChatbot"),"AIChatVue",null,null);
			}
		}else{
			$ui.displayView($("#AiTestingChatbot"),"AIChatVue",null,null);
		}
	}
	function renderAINotParam(params){
		$('#panel_AIMonitoring_3').hide();
		$('#aimonitoring').append($T('AI_SETTING_NEED'));
		
	}
	return { render: render,renderAINotParam:renderAINotParam};
	
})();;