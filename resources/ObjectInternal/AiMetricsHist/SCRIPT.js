// AiMetricsHist front side hook
(function(ui) {
	const app = ui.getApp();
	// Hook called by each object instance
	Simplicite.UI.hooks.AiMetricsHist = function(o, cbk) {
		try {
			console.log("AiMetricsHist hooks loading...");
			const p = o.locals.ui;
			if (p && o.isMainInstance()) {
				p.form.onload = function(ctn, obj, params) {
					eval(obj.getFieldValue("aiMhMetrics"));
				};
			}
			//...
		} catch (e) {
			app.error("Error in Simplicite.UI.hooks.AiMetricsHist: " + e.message);
		} finally {
			console.log("AiMetricsHist hooks loaded.");
			if (cbk) cbk(); // final callback
		}
	};
})(window.$ui);