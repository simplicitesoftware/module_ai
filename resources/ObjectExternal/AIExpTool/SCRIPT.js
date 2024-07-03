function getValueFormat(){
	let field=$("#fields-select").val();
	let value="[VALUE:"+field+"]";
	$('#result').val(value);
	
}