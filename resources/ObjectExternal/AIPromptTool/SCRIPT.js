var objectID;
var objectName;
var AIPromptTool = (function() {
	function render(params,json) {
		var template = $("#selector").html();
		objectID = json.objectID;
		objectName = json.objectName;
		$('#AIprompttool').html(Mustache.render(template, json.fields));
		//callApi("[VALUE:aiTestLongString]",json.objectName,json.objectID,"tu est un chatbot d'aide a la décisition dans le domaine de l'informatique.");
		
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
	callApi(prompt,null, $('#AIAnswer'));
}
function callApi(prompt,specialisation=null,ctn=null){
	var app = $ui.getApp();
		 // Params
		var useAsync = true; // use async callback pattern
		var url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
		var postParams = {prompt:prompt,objectName:objectName,objectID:objectID , specialisation: specialisation}; // post params
		// Call Webservice (POST requests only)
		ctn.text("");
		$('#AIProcess').show();

		app._call(useAsync, url, postParams, function callback(rslt){
			ctn.text(rslt.response.choices[0].message.content);
			$('#AIProcess').hide();
		 });

}