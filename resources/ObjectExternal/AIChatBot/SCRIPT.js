var AIChatBot = AIChatBot || (function() {
    console.log("chatbot");
    let specialisation = "";
    const app = $ui.getApp();
    //addImg,takeImg,Speech
    let addImgVisible = true;
    let takeImgVisible = true;
    let SpeechVisible = true;
    let historicObject;
    let currentTools = null;

    function render(params, isAdaContext, spe, dataDisclaimer) {

        let ctn = params[0];
        if(!ctn)ctn = $('#AIchatbot');
        if (dataDisclaimer) {
            $(ctn).find('#data_warn').html(dataDisclaimer);
            $(ctn).find('#data_warn').show();
        }
        specialisation = spe;
        ctn.querySelector('#chatbot_input_message').addEventListener('keyup', function(event) {
            if (event.key === 'Enter' && event.target.matches('#chatbot_input_message')) {
                chatbotSendMessage(ctn);
            }
        });
        console.log("AIJSTooL");
        if (AiJsTools) {
            AiJsTools.addChatOption(ctn.querySelector('.ai-user-input'), addImgVisible, takeImgVisible, SpeechVisible);
            console.log(AiJsTools.provider);

        } else {
            console.log("cannot loaded AiJsTools");

        }
        ctn.querySelector('#chatbot_send_button').onclick = function() {
            AIChatBot.chatbotSendMessage(ctn);
        };
        if (isAdaContext) {
            historicObject = app.getBusinessObject("AdaPromptHistory");
            historicObject.getForCreate(createHistoric);
        }

    }

    function createHistoric(item) {
        historicObject.save((newItem) => {
            console.log("historic created", newItem);
        }, item);
    }

    function chatbotSendMessage(ctn) {
        let userMessage = ctn.querySelector('#chatbot_input_message').value;
        let chatMessages = ctn.querySelector('#chatbot_messages');
        desableChatbot(ctn);

        let historic = [];
        $(ctn).find(".user-messages").each(function() {
            let text = {};
            text.role = "user";
            text.content = $(this).find(".msg").text();
            historic.push(JSON.stringify(text));
            text = {};
            text.role = "assistant";
            // Following siblings may include .tools: use the first .bot-messages after this user turn
            text.content = $(this).nextAll(".bot-messages").first().find(".msg").text();

            historic.push(JSON.stringify(text));

        });

        // Params
        let useAsync; // use async callback pattern
        if (AiJsTools) {
            useAsync = AiJsTools.useAsync;
        } else {
            useAsync = true;
        }

        let postParams;
        if (AiJsTools) {
            postParams = AiJsTools.getPostParams(ctn, specialisation);
        } else {
            console.log("ERROR no AiJsTools");
        }

        // Affichez la question de l'utilisateur et la réponse du chatbot dans le chat
        if (AiJsTools) {
            chatMessages.append(AiJsTools.getDisplayUserMessage(ctn));
            chatMessages.append(AiJsTools.getDisplayBotMessage());
        }

        let userImg = $(ctn).find("#input-img img")?.attr("src");
        // Efface le champ de saisie utilisateur
        if (AiJsTools) {
            AiJsTools.resetInput(ctn.querySelector('.ai-chat-input-area'));
        } else {
            ctn.querySelector('#chatbot_input_message').value = '';
        }

        // Faites défiler vers le bas pour afficher les messages les plus récents
        chatMessages.scrollTop = chatMessages.scrollHeight;
        // Call Webservice (POST requests only)
        AiJsTools.callApi(AiJsTools.apiName, "POST", postParams, function(botResponse) {
            parseResponseAndDisplay(botResponse, ctn, postParams);
        });

    }

    function parseResponseAndDisplay(botResponse, ctn, postParams) {
        let userMessage = ctn.querySelector('#chatbot_input_message').value;
        let chatMessages = ctn.querySelector('#chatbot_messages');
        let userImg = $(ctn).find("#input-img img")?.attr("src");
        console.log("response ", botResponse);
        if (!(botResponse.hasOwnProperty('type') && botResponse.type == 'error')) {
            if (botResponse.tools && botResponse.tools.length > 0) {
                const tools = botResponse.tools || botResponse.response?.tools || [];
                // ask if user wants to use tools
                addToolsDialog(ctn, tools, postParams);
            } else {
                let result = botResponse.response.choices[0].message.content;
                result = escapeHtml(result);
                $view.markdownToHTML(result, 0,resulthtml => {
                    displayAnswer(resulthtml, ctn);
                    console.log("addHistoric(", userMessage, ",", resulthtml, ",", userImg, ",", botResponse.response.usage, ",", $grant.getLogin(), ")");
                    addHistoric(userMessage, result, userImg, botResponse.response.usage, $grant.getLogin());
                });
            }
        } else {
            displayAnswer("Sorry, an error occurred", ctn);
            addHistoric(userMessage, "Sorry, an error occurred", null, null, $grant.getLogin());
        }
        enableChatbot(ctn);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function displayAnswer(html, ctn) {
        console.log("displayAnswer", html);
        console.log("ctn", ctn);
        const $lastBot = $(ctn).find(".bot-messages").last();
        const $msg = $lastBot.find("span.msg");
        console.log("lastBot", $lastBot);
        // Dernière bulle bot suivie d'une zone outils : retirer le placeholder et afficher la réponse sous le dernier bloc .tools
        if ($lastBot.length && $lastBot.next().hasClass("tools")) {
            $lastBot.remove();
            console.log("bot placeholder removed");
            $(ctn).find(".tools").last().after(
                $("<div/>").addClass("bot-messages").append($("<span/>").addClass("msg").html(html))
            );
            console.log("answer added below tools");
        } else {
            $msg.html(html);
        }

    }

    function addToolsDialog(ctn, tools, postParams, ) {
        currentTools = {};
        console.log("addToolsDialog", tools);
        if (tools.length == 0) return;

        const isFr = $grant.langiso == "fr";
        const toolTag = isFr ? "Outil" : "Tool";

        // Une zone horizontale par outil : libellé à gauche, boutons à droite, fond plus clair que la bulle.
        const $toolsBox = $("<div/>").addClass("tools tools-per-tool");
        tools.forEach(tool => {
            console.log("tool", tool);

            const toolName = tool?.function?.name || tool?.description || "";
            currentTools[toolName] = {
                response: null,
                tool: tool
            };
            console.log("toolName", toolName);
            const detailText = tool?.function?.description || tool?.description || toolName || "";

            const $bar = $("<div/>").addClass("ai-tool-bar");
            const $label = $("<div/>").addClass("ai-tool-bar-label");
            $label.append($("<span/>").addClass("ai-tool-bar-tag").text(toolTag));
            $label.append($("<span/>").addClass("ai-tool-bar-name").text(detailText || "—"));

            const $actions = $("<div/>").addClass("ai-tool-actions").attr("data-tool-name", toolName);
            const $btnRefuse = $("<button/>", {
                    type: "button"
                })
                .addClass("ai-tool-btn ai-tool-btn-outline")
                .attr("title", isFr ? "Refuser l'exécution de l'outil" : "Refuse tool execution")
                .attr("aria-label", isFr ? "Refuser l'exécution de l'outil" : "Refuse tool execution")
                .append($("<i/>").addClass("fa fa-times").attr("aria-hidden", "true"))
                .on("click", function(e) {
                    e.preventDefault();
                    console.log("refuse tool", tool);
                    refuseTool(tool, $actions, isFr, ctn, postParams);
                });

            const $btnAccept = $("<button/>", {
                    type: "button"
                })
                .addClass("ai-tool-btn ai-tool-btn-outline ai-tool-bar-accept")
                .attr("aria-label", isFr ? "Autoriser l'exécution des outils" : "Allow tools to run")
                .attr("title", isFr ? "Autoriser l'exécution des outils" : "Allow tools to run")
                .append($("<i/>").addClass("fa fa-check").attr("aria-hidden", "true"))
                .on("click", function(e) {
                    e.preventDefault();
                    acceptTool(tool, $actions, isFr, ctn, postParams);
                });

            $actions.append($btnRefuse, $btnAccept);
            $bar.append($label, $actions);
            $toolsBox.append($bar);
        });
        console.log("ctn: ",ctn);
      const $lastBot = $(ctn).find(".bot-messages").last();
        const $toolsAfterLastBot = $lastBot.nextAll(".tools").last();
        console.log("last ",$lastBot, "tools ",$toolsAfterLastBot);
        if ($lastBot.length && $toolsAfterLastBot.length > 0) {
            const $lastToolBlock = $(ctn).find(".tools").last();
            $toolsBox.addClass("tools-below");
            $lastToolBlock.after($toolsBox);
        } else {
            const botHint = isFr ? "Des outils sont proposés ci-dessous." : "Tools are proposed below.";
            $lastBot.find("span.msg").empty().text(botHint);
            $toolsBox.addClass("tools-below");
            $lastBot.after($toolsBox);
        }
    }

    function refuseTool(tool, ctn, isFr, ctnGlobal, postParams) {
        console.log("refuse tool", ctn?.attr("data-tool-name"));
        currentTools[ctn?.attr("data-tool-name")].response = "refused";
        const $iconRefused = $("<i/>").addClass("fa fa-times").attr("aria-hidden", "true")
            .attr("aria-label", isFr ? "Outil refusé" : "Tool refused")
            .attr("title", isFr ? "Outil refusé" : "Tool refused");

        ctn.html("");
        ctn.removeClass("ai-tool-actions");
        ctn.addClass("ai-tool-state");
        ctn.append($iconRefused);
        console.log("refuse tool", tool);
        if (isAllToolsAnswered()) {
            callApiWithAcceptedTools(postParams, ctnGlobal);
        }
    }

    function acceptTool(tool, ctn, isFr, ctnGlobal, postParams) {
        console.log("accept tool", ctn?.attr("data-tool-name"));
        currentTools[ctn?.attr("data-tool-name")].response = "accepted";
        const $iconAccepted = $("<i/>").addClass("fa fa-check").attr("aria-hidden", "true")
            .attr("aria-label", isFr ? "Outil accepté" : "Tool accepted")
            .attr("title", isFr ? "Outil accepté" : "Tool accepted");
        ctn.append($iconAccepted);
        ctn.html("");
        ctn.removeClass("ai-tool-actions");
        ctn.addClass("ai-tool-state");
        ctn.append($iconAccepted);
        console.log("accept tool", tool);
        if (isAllToolsAnswered()) {
            callApiWithAcceptedTools(postParams, ctnGlobal);
        }
    }
    // check if all tools have been answered
    function isAllToolsAnswered() {
        for (let toolName in currentTools) {
            if (currentTools[toolName].response === null) {
                return false;
            }
        }
        return true;
    }

    function callApiWithAcceptedTools(postParams, ctnGlobal) {
        let acceptedTools = [];
        let refusedTools = [];
        for (let toolName in currentTools) {
            if (currentTools[toolName].response === "accepted") {
                acceptedTools.push(currentTools[toolName].tool);
            } else {
                refusedTools.push(currentTools[toolName].tool);
            }
        }

        console.log("acceptedTools", acceptedTools);
        console.log("refusedTools", refusedTools);
        console.log("postParams", postParams);

        AiJsTools.callApiWithTools(postParams, acceptedTools, refusedTools, function(response) {
            parseResponseAndDisplay(response, ctnGlobal, postParams);
        });

        currentTools = null;
    }

    function escapeHtml(text) {
        let map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) {
            return map[m];
        });
    }

    function desableChatbot(ctn) {
        $(ctn).find("#chatbot_send_button").prop("disabled", true);
        $(ctn).find("#chatbot_input_message").prop("disabled", true);
    }

    function enableChatbot(ctn) {
        $(ctn).find("#chatbot_send_button").prop("disabled", false);
        $(ctn).find("#chatbot_input_message").prop("disabled", false);
    }

    function addHistoric(userMessage, botMessage, userImg, cost, login) {
        if (!historicObject) return;
        let botn = "bot";
        if (AiJsTools) {
            botn = AiJsTools.botName;
        }
        let promptHist = $app.getBusinessObject("AdaPromptsLogger");
        promptHist.getForCreate((item) => {

            item.adaPlogPhyId = historicObject.getRowId();
            item.adaPlogPrompt = userMessage;
            item.adaPlogResponse = botMessage;
            item.adaPlogCost = cost;
            if (userImg) item.adaPlogImage = userImg;
            console.log("item to create", item);

            AiJsTools.callApi("AdaSavePrompt", "POST", {
                obj: item
            }, function(botResponse) {
                if (!(botResponse.hasOwnProperty('type') && botResponse.type == 'error')) {
                    console.log("prompt saved");
                } else {
                    console.log("error prompt save", botResponse);
                }
            });
        });
        /*oldhist
        let message = "";
        if(historicObject.item.adaPhyChat){
            message = historicObject.item.adaPhyChat;
        }

        message += `\n# ${login}\n${userMessage}\n\n# ${botn}\n${botMessage}\n\n`;
        historicObject.item.adaPhyChat = message;
        historicObject.item[`adaPhyUserPrompts`] = userMessage;
        historicObject.save();
        */
    }
    return {
        render: render,
        chatbotSendMessage: chatbotSendMessage
    };

})();