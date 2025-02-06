/* Specific client script */
(function($) {
	// Event handler for when the UI is loaded
	$(document).on("ui.loaded", function() {
		// Customize UI here before the home page is displayed
	});

	// Event handler for when the UI is ready
	$(document).on("ui.ready", function() {
		// Customize UI here
		console.log("-------------------------------S_AI DISP LOAD---------------------------------------");

		// Load a specific script for AI tools
		$ui.loadScript({
			url: $ui.getApp().dispositionResourceURL("AiJsTools", "JS"), // URL to load the script from
			onload: _ => { console.log("AiJsTools loaded"); } // Callback function when the script is loaded
		});

		// Event handler for keyup events
		$(document).on("keyup", (e) => {
			
			if (e.ctrlKey /*&& e.altKey*/ && e.key === 'q' && $('.code-editor').length > 0) { // Check if Ctrl (and Alt) key and 'q' key are pressed and a code editor is present
				e.preventDefault(); // Prevent the default action
				e.stopPropagation(); // Stop the event from propagating
				AiJsTools.commentCode(); // Call the function to comment the code
			}
		});
	});

	// Event handler for before unload
	$(document).on("ui.beforeunload", function() {
		// Code to execute before the window is unloaded
	});

	// Event handler for unload
	$(document).on("ui.unload", function() {
		// Code to execute when the window is unloaded
	});
})(jQuery);
//These comments should help clarify the purpose and functionality of each section of the code.