var objectID;
var objectName;
var GptPromptTool = (function() {
	function render(params,json) {
		var template = $("#selector").html();
		objectID = json.objectID;
		objectName = json.objectName;
		$('#gptprompttool').html(Mustache.render(template, json.fields));
		//callApi("[VALUE:gptTestLongString]",json.objectName,json.objectID,"tu est un chatbot d'aide a la décisition dans le domaine de l'informatique.");
		
	}

	return { render: render };
})();
function selected(self){
	var val = self.value;
	if( val ) {
		$('#result').html("[VALUE:"+val+"]");
	}else{
		$('#result').html("");
	}
	

	
}
function sendPrompt(){
	var prompt = $('#prompt').val();
	callApi(prompt,null, $('#GptAnswer'));
}
function callApi(prompt,specialisation=null,ctn=null){
	var app = $ui.getApp();
		 // Params
		var useAsync = true; // use async callback pattern
		var url = Simplicite.ROOT+"/ext/GptRestAPI"; // authenticated webservice
		var postParams = {prompt:prompt,objectName:objectName,objectID:objectID , specialisation: specialisation}; // post params
		// Call Webservice (POST requests only)
		ctn.text("");
		$('#GptProcess').show();

		app._call(useAsync, url, postParams, function callback(rslt){
			//console.log(rslt);
			ctn.text(rslt.response.choices[0].message.content);
			$('#GptProcess').hide();
		 });

}