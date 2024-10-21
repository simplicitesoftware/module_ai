var aiGenModel = aiGenModel || (function() {
	const app = $ui.getApp();
	const data = app.getBusinessProcess("AIModuleCreate").activity.data.Data;
	const moduleID = data.moduleId.values[0];
	function AINewModel() {
		let deletebutton = $(".btn[data-action='AIDeleteModule']");
		let nextbutton = $(".btn[data-action='validate']");
		deletebutton.removeClass("btn-action");
		deletebutton.addClass("btn-secondary");
		let parentDiv = $(".btn[data-action='AIDeleteModule']").parent();
		parentDiv.css("flex-direction", "row-reverse");
		deletebutton.css("border-top-right-radius", "0px");
		deletebutton.css("border-bottom-right-radius", "0px");
		nextbutton.css("border-top-right-radius", ".25rem");
		nextbutton.css("border-bottom-right-radius", ".25rem");

		let idsData = data.allIds;
		let ids = null;
		if (idsData != null){
			ids = data.allIds.values;	
		}
		if (!ids?.length || ids.length==0) {
			ids = data.createdIds.values;
			newModel(ids);
		}else{
			let obj = app.getBusinessObject("Model");
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
			null);
			
		}
	
	
	}
	function newModel(ids){
		let moduleName = data.moduleName.values[0];
		
		// Needs objects to insert
		if (!ids?.length || ids.length==0){
			$ui.alert("No objects to insert.");
			return;
		}
		let list = construcNodesList(ids);
		// Load SVG engine
		$ui.loadDiagramEngine().then(function() {
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
						callback: saveOpenModeler(diagram)
					});
				});
				
			}
			catch(e) {
				alert("error see log");
			}
		});
	}
	function choiceModel(list){ 
		$(".extern").append("<div id='modeler' class='modeler_picker'></div>");
		$("#modeler").append("<div id='choice' class='items'></div>");
		$("#choice").css("display","grid");
		$("#choice").css("grid-gap","10px");
		$("#choice").css("grid-template-columns", "repeat(4, 1fr)");
		let row=1;
		let col=1;
		for(let item of list){
			let row_id = item.row_id;
			$("#choice").append("<div class='item'><div class='mdl' id='"+row_id+"'><div class='title'>"+item.mod_name+"</div></div></div>");
			$("#"+row_id).css("grid-column",col);
			$("#"+row_id).css("grid-row",row);
			$("#"+row_id).css("height","100%");
			let url = app.imageURL("Model", "mod_image", row_id, item.mod_image, true);
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
		$ui.loadDiagramEngine().then(() => openAndUpdateModel(modelId));
	}
	function openAndUpdateModel(modelId){
		let ids = data.createdIds.values;
		$ui.diagram.open(modelId, {
			svg: true,
			docked: false,
			hidden: true
		}, function(diagram) {
			let list = construcNodesList(ids);
			diagram.insertNodes(list, saveOpenModeler(diagram));

		});
	}
	function saveOpenModeler(diagram) {
		// Save and Re-open					
		return function(){
			diagram.save(function() {
				diagram.close();
				
				$ui.displayModeler(null, diagram.modelId, {
					svg: true,
					docked: false,
					popup: false
				});
			},true);
		};
	}
	function construcNodesList(ids){
		let list = [];
		$(ids).each(function(i,id) {
			list.push({
				object: "ObjectInternal", // node object
				id: id, // node row_id
				template: "BusinessObject" , // node template name
				x: i*50 + 30, // dummy position
				y: i*30 + 30,
				//container: null // no container 
			});
		});
		return list;
	}
	return{AINewModel:AINewModel};
})();