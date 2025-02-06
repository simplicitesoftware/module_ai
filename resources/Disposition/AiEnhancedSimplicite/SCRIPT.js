
/* Specific client script */

(function($) {
	$(document).on("ui.loaded", function() {
		// customize UI here before home page	
	});

	$(document).on("ui.ready", function() {
		// customize UI here
		console.log("-------------------------------AI DISP LOAD---------------------------------------");
	});
	
	$(document).on("ui.beforeunload", function() {
		// window will be unloaded
	});
	
	$(document).on("ui.unload", function() {
		// window is unloaded
	});
})(jQuery);