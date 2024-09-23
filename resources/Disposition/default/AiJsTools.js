var AiJsTools = AiJsTools || (function() {
	function addButton(ctn, id) {
        let htmlButton = document.createElement('button');
        htmlButton.id = id;
        switch (id) {
            case "add-img":
                htmlButton.className = "chat-button fas fa-upload";
                htmlButton.onclick = function() {
                    AiJsTools.addImage(this.parentElement);
                };
                break;
            case "take-img":
                htmlButton.className = "chat-button fas fa-camera";
                htmlButton.onclick = function() {
                    AiJsTools.takeImage(this.parentElement);
                };
                break;
            case "speech":
                htmlButton.className = "chat-button fas fa-microphone";
                htmlButton.onclick = function() {
                    AiJsTools.getSpeech(this.parentElement);
                };
                break;
        }
        ctn.insertBefore(htmlButton, ctn.firstChild);
    }
    function addChatOption(ctn,addImg,takeImg,Speech){
    	console.log("addChatOption");
            if(Speech){
                addButton(ctn,"speech");
            }
            if(takeImg){
                addButton(ctn,"take-img");
            }
            if(addImg){
                addButton(ctn,"add-img");
            }
    }
	function addImage(inputCtn){
		inputCtn = $(inputCtn);
		let input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/jpeg';
		input.onchange = function(event) {
			let file = event.target.files[0];
			let reader = new FileReader();
			reader.onload = function(event) {
				image_base64 = event.target.result;
				$("#input-img img").attr("src", image_base64);
				$("#input-img").show();
				resizeUp(inputCtn.parent(),inputCtn.parent().parent().find(".chat-messages"));
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}
	function takeImage(inputCtn){
		console.log(inputCtn);
		console.log('test take img ia chat');
	}
	function getSpeech(inputCtn){
		console.log('test get speech ia chat');
	}
	function resizeUp(inputArea, messagesArea){
		const vh = window.innerHeight * 0.01;
		const maxHeight = `${45 * vh - 250}px`;
		const minHeight = `50px`;
		
		inputArea.css("height", minHeight);
		let textheight = inputArea.find(".user-message").prop('scrollHeight') - 5;
		let areaheight = messagesArea.parent().height();
        imgCtn =inputArea.find("#input-img");
		let imgheight = imgCtn.is(':hidden')?0: imgCtn.height();
		if(textheight >maxHeight-imgheight){
			textheight = maxHeight-imgheight;
			
		}else if(textheight < minHeight){
			textheight = minHeight;
		}

		//inputArea.find(".user-message").css("height", textheight);
		areaheight = areaheight - (textheight +30)-imgheight;
        
        inputArea.css("height",  (textheight +30)+imgheight);
		messagesArea.css("height", areaheight);
		
	}
	function getdisplayUserMessage(inputCtn){
	    inputCtn=$(inputCtn);
	    let userMessage = inputCtn.find(".user-message").val();
	    let userImage = inputCtn.parent().find("#input-img img").attr("src");
	    if(userImage){
	        userImage = "<img class='img' src='"+userImage+"' >";
	    }else{
	        userImage = "";
	    }
	    params = {user:userName,msg:userMessage,img:userImage};
	    return Mustache.render(userTemplate, params);
	}
	
	return {addChatOption: addChatOption, addImage: addImage, takeImage:takeImage,  getSpeech:getSpeech, getdisplayUserMessage:getdisplayUserMessage};
})();
