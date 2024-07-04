
var AIPromptTool = AIPromptTool || (function() {
	let objectID;
	let objectName;
	function render(params,json) {
		let template = $("#selector").html();
		objectID = json.objectID;
		objectName = json.objectName;
		$('#AIprompttool').html(Mustache.render(template, json.fields));
	}
	function selected(self){
		let val = self.value;
		if( val ) {
			$('#result').html("[VALUE:"+val+"]");
		}else{
			$('#result').html("");
		}
		
	
		
	}
	function sendPrompt(){
		let prompt = $('#prompt').val();
		callApi(prompt,null, $('#AIAnswer'));
	}
	function callApi(prompt,specialisation=null,ctn=null){
		let app = $ui.getApp();
			 // Params
			let useAsync = true; // use async callback pattern
			let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
			let postParams = {prompt:prompt,objectName:objectName,objectID:objectID , specialisation: specialisation}; // post params
			// Call Webservice (POST requests only)
			ctn.text("");
			$('#AIProcess').show();
	
			app._call(useAsync, url, postParams, function callback(rslt){
				ctn.text(rslt.response.choices[0].message.content);
				$('#AIProcess').hide();
			 });
	
	}
	return { render: render ,sendPrompt:sendPrompt,selected:selected};
})();