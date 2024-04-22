var app = $ui.getApp();
var data = app.getBusinessProcess("GPTModuleCreate").activity.data.Data;
var moduleID = data.moduleId.values[0];
function gptNewModel() {
	var idsData = data.allIds;
	var ids = null;
	if (idsData != null){
		ids = data.allIds.values;	
	}
	console.log("ids",ids);
	if(!ids || !ids.length || ids.length==0) {
		ids = data.createdIds.values;
		newModel(ids);
	}else{
		var obj = app.getBusinessObject("Model");
		obj.searchForList(function(list) {
			if(list.length>0){
				$ui.confirm({
					name: "modeler",
					title: "modeler",
					content: "Do you want to create a new model or add to the existing model?",
					okLabel: "New",
					cancelLabel: "Add",
					onOk: function() {
						newModel(ids);
					},
					onCancel: function() {
						choiceModel(list);
					}
				});
			}else{
				newModel(ids);
			}
		}, 
		{
			row_module_id: moduleID,
		},
		null)
		
	}


}
function newModel(ids){
	console.log("newModel",ids);
	let moduleName = data.moduleName.values[0];
	var list = [];
	// Needs objects to insert
	if (!ids || !ids.length || ids.length==0) {
		$ui.alert("no selection");
		return;
	}

	$(ids).each(function(i,id) {
		console.log("id",id);
		list.push({
			object: "ObjectInternal", // node object
			id: id, // node row_id
			template: "BusinessObject" , // node template name
			x: i*50 + 30, // dummy position
			y: i*30 + 30,
			//container: null // no container 
		});
	});
	// Load SVG engine
	$ui.loadDiagramEngine(false, function() {
		try {
			// Create the model in silent mode
			let currentDate = new Date();
			let formattedDate = currentDate.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/[/:\s]/g, '-');
			let name = moduleName + "IaGeneratedObjects" + formattedDate;
			$ui.diagram.create("ModelBusinessObject", name, {
				hidden: true, // hide the modeler
				docked: false,
				nodes: list,  // nodes to insert
				module: moduleID,
				fetch: false,
				silent: true
			},
			function(diagram) {
				// auto-placement
				if(diagram.layoutSprings) diagram.layoutSprings({
					stiffness: 0,
					repulsion: 750,
					damping: 0,
					remoteness: 75,
					gravity: 70,
					maxDuration: 5000, // 5sec
					
					callback: function() {
						// Save and close					
						diagram.save(function() {
							
							diagram.close();
							// Re-open in a window
							$ui.displayModeler(null, diagram.modelId, {
								svg: true,
								docked: false,
								popup: false
							});
						},true);
					}
				});
			});
			
		}
		catch(e) {
			alert("error see log");
			console.log(e);
		}
	});
}
function choiceModel(list){
	$(".extern").append("<div id='modeler' class='modeler_picker'></div>");
	$("#modeler").append("<div id='choice' class='items'></div>");
	$("#choice").css("display","grid");
	$("#choice").css("grid-gap","10px");
	$("#choice").css("grid-template-columns", "repeat(4, 1fr)");
	var row=1;
	var col=1;
	for(var i=0; i<list.length; i++){
		console.log("list",list[i]);
		var row_id = list[i].row_id;
		$("#choice").append("<div class='item'><div class='mdl' id='"+row_id+"'><div class='title'>"+list[i].mod_name+"</div></div></div>");
		$("#"+row_id).css("grid-column",col);
		$("#"+row_id).css("grid-row",row);
		$("#"+row_id).css("height","100%");
		var url = app.imageURL("Model", "mod_image", row_id, list[i].mod_image, true);
		$("#"+row_id).append("<img src='"+url+"' sty/>");
		col++;
		if(col>4){
			col=1;
			row++;
		}
		$("#"+row_id).click(function(){
			$("#modeler").remove();
			updateModel($(this).attr("id"));
		});

	}	
}
function updateModel(modelId){ 
 	let ids = data.createdIds.values;
 	let moduleName = data.moduleName.values[0];
	$ui.loadDiagramEngine(false, function() {
		console.log($ui.diagram);
		$ui.diagram.open(modelId, {
			svg: true,
			docked: false,
			hidden: true
		}, function(diagram) {
			var list = [];
			$(ids).each(function(i,id) {
				console.log("id",id);
				list.push({
					object: "ObjectInternal", // node object
					id: id, // node row_id
					template: "BusinessObject" , // node template name
					x: i*50 + 30, // dummy position
					y: i*30 + 30,
					//container: null // no container 
				});
			});
			diagram.insertNodes(list, function() {
				diagram.save(function() {
					diagram.close();
					$ui.displayModeler(null, modelId, {
						svg: true,
						docked: false,
						popup: false
					});
				},true);
			});

		});
/* 		} */
	});

}