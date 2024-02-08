function gptNewModel(ids,moduleName,moduleID) {
	
	var list = [];
	// Needs objects to insert
	if (!ids || !ids.length) {
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
			var name = moduleName + "Objects";
			$ui.diagram.create("GPTModelBusinessObject", name, {
				hidden: true, // hide the modeler
				docked: false,
				nodes: list,  // nodes to insert
				module: moduleID,
				fetch: false
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
						diagram.canClose(false, function() { // confirm=false means auto-save
							
							diagram.close();
							// Re-open in a window
							$ui.displayModeler(null, diagram.modelId, {
								svg: true,
								docked: true,
								popup: false
							});
						});
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