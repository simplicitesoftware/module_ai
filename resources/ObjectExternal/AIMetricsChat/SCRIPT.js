var AIMetricsChat = AIMetricsChat || (function() {
	const app = $ui.getApp();
	const histObj = app.getBusinessObject("AiMetricsHist");
	let swagger="";
	let moduleName = "";
	let lastScript = "";
	let lastText ="";
	let moduleId = "";
	let url = Simplicite.ROOT+"/ext/AIRestAPI"; // authenticated webservice
	let useAsync = true;
	let addImgVisible = false;
	let takeImgVisible = false;
	let SpeechVisible = true;
	let defaultSchema = document.createElement('div');
	defaultSchema.className = "ai-default-schema";
	defaultSchema.textContent = "your schema will be displayed here";
	let defaultSchemaDiv = document.createElement('div');
	defaultSchemaDiv.className = "ai-default-schema-content";
	defaultSchemaDiv.appendChild(defaultSchema);
	let buttons = {};
	function render(params,id,module,s) {
		let ctn = params[0];
		let printicon = document.createElement('i');
		let printbutton = document.createElement('button');
		printbutton.className = "btn btn-secondary";
		printicon.className = "fa fa-print icon";
		printbutton.appendChild(printicon);
		printbutton.onclick = function(){
			let canvas = document.querySelector('canvas');
			if (canvas) {
				let link = document.createElement('a');
				link.href = canvas.toDataURL('image/png');
				link.download = 'chart.png';
				link.click();
			} else {
				console.log("No chart found to print.");
			}
		};
		$("#work .actions").prepend(printbutton);
		displayHist();
		moduleId = id;
		// set button text
		moduleName = module;
		
		
		app.getTexts(function(textes){
			let actLabel = textes?.AiSaveAsCrosstableAction||"";
			let sendText = textes?.AI_BUTTON_SEND ||"Send";
			let cancelText = textes?.AI_BUTTON_CANCEL || "Cancel";
			if(actLabel != "")$("#work .actions").prepend('<button class="btn btn-secondary" type="button" onclick="AIMetricsChat.saveAsCrosstable()"><span>'+actLabel+'</span></button>');
			$('#metrics_send_button').text(sendText);
			$('#metrics_cancel_button').text(cancelText);
		},null);
		swagger=s;
		$ui.loadScript({url: $ui.getApp().dispositionResourceURL("AiJsTools", "JS"),onload: function(){ 
			AiJsTools.addChatOption(ctn.querySelector('.ai-user-input'),addImgVisible,takeImgVisible,SpeechVisible).then(() => {setShowWarn(ctn);});
		}});
		resetChat();
		
		$('#metrics_user_text').keypress(function(e) {
			if (e.which === 13) {
				sendMetricsMessage();
			}
		});
		
	}
	
	function sendMetricsMessage(){
		let isCancelled = false;
		$('#metrics_cancel_button').show();
		$('#metrics_cancel_button').click(function() {
			isCancelled = true;
			resetChat();
		});
		let input = '';
		$('#metrics_messages').html('');
		let canvas = $('canvas');
		canvas.each(function(canva) {
			let id = canvas[canva].id;
			let graph = Chart.getChart(id);
			if(graph) graph.destroy();
			
			
		});
		$('#metrics_messages').append(AiJsTools.getDisplayUserMessage($('#AIchatbotMetrics')));
		$('#metrics_messages').append(AiJsTools.getDisplayBotMessage());
		$('#ia_html').html(defaultSchemaDiv);
		input = $('#metrics_user_text').val();
		$('#metrics_user_text').val('');
		$('#metrics_send_button').prop('disabled', true);
		$('#metrics_send_button').hide();
		$('#metrics_user_text').prop('disabled', true);
		let params = {prompt:input, reqType:"metrics",swagger:swagger,lang:app.grant.lang};
		lastText = "";
		app._call(useAsync, url, params, function callback(botResponse){
			processResponse(botResponse,true,isCancelled,params);
			// Définir les options globales pour Chart.js
			Chart.defaults.responsive = true;
			Chart.defaults.maintainAspectRatio = false;
			
	
		});
		
	}
	function reOpenChat(){
		$('#metrics_user_text').prop('disabled', false);
		$('#metrics_send_button').show();
		$('#metrics_send_button').prop('disabled', false);
		$('#metrics_cancel_button').hide();
		$('#metrics_cancel_button').onclick = null;
	}
	function resetChat(){
		$('#metrics_messages').html('');
		$('#ia_html').html(defaultSchemaDiv);
		reOpenChat();
	
	}
	function setShowWarn(ctn){
		ctn.querySelectorAll('.chat-icon-button').forEach(button => {
			buttons[button.id] = button.onclick;
			button.onclick = function(){
				showWarn();
			};
		});
		
		$("#metrics_send_button").click(function() { AIMetricsChat.showWarn();});
		$('#metrics_user_text').click(function() { showWarn();});
	}
	function showWarn(){
		console.log("showwarn");
		app.getTexts(function(textes){
			$ui.alert(app.getText(textes?.AI_GRAPH_DISCLAIMER, false));
			$('#metrics_user_text').unbind('click');
			$('#metrics_send_button').unbind('click');
			$("#metrics_send_button").click(function() { sendMetricsMessage();});

			document.getElementById("aimetricschat").querySelectorAll('.chat-icon-button').forEach(button => {
				button.onclick = buttons[button.id];
				console.log(button,button.onclick);
			});
		});
	}
	function saveAsCrosstable(){
		
		let func = lastScript;
		let params = {reqType:"saveMetrics",swagger:swagger,moduleName:moduleName,function:func,ctx:"$('#ia_html')"};
		app._call(useAsync, url, params, function callback(botResponse){
			eval(botResponse.script);
		});
		
	}

	function processResponse(botResponse,recall,isCancelled,params){
		botResponse.text = $view.markdownToHTML(botResponse.text).html();
		if(isCancelled){
			return;
		}
		if(!hasJS(botResponse)){
			return;
		}
		if(botResponse.text == null){
			botResponse.text = "";
		}else if(botResponse.text != "" && lastText == ""){
			lastText = botResponse.text;
		}
		$('#ia_html').html(botResponse.html);
		
		if(botResponse.js != ""){
			try {
				eval(botResponse.js);
				
				//check if function is auto call
				if(botResponse.js.indexOf(botResponse.function) == -1) {
					eval(botResponse.function);
				}
				lastScript = botResponse.js;
				
				$('#metrics_messages .bot-messages:last .msg').html(lastText);
				saveHist(botResponse,params.prompt);
				reOpenChat();
			}catch(e){
				console.log("Error on script: "+botResponse.js);
				console.log("Error: "+e);
				if(recall){
					
					console.log("Recall process with errorMetricsSolver");
					params.reqType = "errorMetricsSolver";
					params.error = e.toString();
					params.script = botResponse.js;
					params.html = botResponse.html;
					app._call(useAsync, url, params, function callback(botResponse){
						processResponse(botResponse,false,isCancelled);
					});
				}else{
					console.log("Error on script: "+botResponse.js);
					$('#metrics_messages .bot-messages:last .msg').text("Sorry, I can't understand your request. Please try again.");
					reOpenChat();
				}
			}
		}else{
			lastScript = $("#ia_html script").text();
			saveHist(botResponse,params.prompt);
			reOpenChat();
		}
		
	}
	function hasJS(botResponse){
		if(botResponse.error !=null || ((botResponse.js == null && !botResponse?.html?.includes("script")))){
			console.log("Error on script in hasjs: "+botResponse.js);
			$('#metrics_messages .bot-messages:last .msg').text("Sorry, I can't understand your request. Please try again.");
			return false;
		}
		
		if(botResponse.html == null && botResponse.js == null && botResponse.text != null){
			$('#metrics_messages .bot-messages:last .msg').html(botResponse.text);
			return false;
		}

		return true;
	}
	function saveHist(botResponse,prompt){
		
		let js = botResponse.js;
		//check if function is auto call
		if(botResponse.js.indexOf(botResponse.function) == -1) {
			js+= "\n"+botResponse.function;
		}
		histObj.selectForCreate(item=>createHist(item,js,prompt,botResponse));
	}
	function createHist(item,js,prompt,botResponse){
		item.aiMhModuleId = moduleId;
		item.aiMhPreview = botResponse.html; 
		item.aiMhMetrics = js;
		item.aiMhSimpleuserId = ''+$grant.userid+'';
		item.aiMhPrompt = prompt;
		histObj.populate(res => histObj.create(c =>addHist(c,document.getElementById("metrics_hist_list")),res),item);
	}
	function displayHist(){
		let histList = document.getElementById("metrics_hist_list");
		histObj.resetFilters();
		histObj.getFiltersForSearch(function(filters){
			filters.aiMhSimpleuserId = ''+$grant.userid+'';
			filters.order__aiMhCreateOn = 1;
			filters.order__aiMhSimpleuserId = 0;
			histObj.search(function(res){
				for(const item of res){
					addHist(item, histList);
				}

			},filters);
		});
		let purgeButton = document.createElement('button');
		purgeButton.className = "btn btn-secondary";
		purgeButton.textContent = "Purge History";
		purgeButton.onclick = function() {
			$ui.confirm({
				content: "Are you sure you want to purge the history?",
				onOk: function() {
					for(const item of histList.children){
						let id = item.id.split("_")[1];
						deleteObj(id);
					}
				}
			});
		};
		histList.parentNode.appendChild(purgeButton);
	}
	
	function addHist(res,histList){
		prompt = res.aiMhPrompt;
		let htmlListItems = document.createElement('li');
		htmlListItems.id = "hist_"+res.row_id;
		let viewicon = document.createElement('i');
		let deleteicon = document.createElement('i');
		
		viewicon.className = "fa fa-eye";
		viewicon.style.marginLeft = "10px";
		deleteicon.className = "fa fa-trash";
		deleteicon.style.marginLeft = "10px";
		
		viewicon.onclick = function(){
			displayHistItem(res.aiMhPreview,res.aiMhMetrics);
		};
		deleteicon.onclick = function(){
			$('#metrics_messages').html('');
			$('#ia_html').html(defaultSchemaDiv);
			let content = $T('AI_CONFIRM_DEL')+"<script>AIMetricsChat.displayHistItemById("+res.row_id+",$('#confirm_ia_chart'))</script>";
			$ui.confirm({content:content,onOk:function(){
				deleteObj(res.row_id);
			}});
				
		};
		
		htmlListItems.innerHTML = prompt;
		htmlListItems.appendChild(viewicon);
		htmlListItems.appendChild(deleteicon);
		
		histList.insertBefore(htmlListItems, histList.firstChild);
	}
	function deleteObj(id){
		histObj.resetFilters();
		histObj.getForDelete(function(item){
			histObj.del(function(res){
				$("#hist_"+id).remove();
			},item,{error:function(err){}});
		},id,null);
	}
	function displayHistItem(html,js,ctn){
		if(ctn == null) ctn = $('#ia_html');
		ctn.html(html);
		eval(js);
	}
	function displayHistItemById(id,ctn){
		histObj.select(function(item){
			displayHistItem(item.aiMhPreview,item.aiMhMetrics,ctn);
		},id);
	}
	
	return { 
		render: render,
		sendMetricsMessage: sendMetricsMessage,
		showWarn: showWarn,
		saveAsCrosstable: saveAsCrosstable,
		displayHistItemById: displayHistItemById
	};
})();