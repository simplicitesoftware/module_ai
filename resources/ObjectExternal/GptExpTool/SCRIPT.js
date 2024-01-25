function getValueFormat(){
	var field=$("#fields-select").val();
	var value="[VALUE:"+field+"]";
	//console.log($("#fields-select").val());
	$('#result').val(value);
	
}