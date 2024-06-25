
  // Open chat on button click
  alert("testui");
  $('#openChat').click(function() {
    $('#chatPopup').show();
  });

  // Close chat on outside click
  $(document).click(function(e) {
    if (!$(e.target).closest('#chatPopup, #openChat').length) {
      $('#chatPopup').hide();
    }
  });

  // Send message
  $('#sendMessage').click(function() {
    let userInput = $('#userInput').val();
    if (userInput !== '') {
      $('#messages').append('<div>You: ' + userInput + '</div>');
      // Here, you can process the user's input and generate a bot response
      // For demonstration purposes, let's simulate a bot response after a short delay
      setTimeout(function() {
        $('#messages').append('<div>Bot: Hi! I am a chatbot.</div>');
        // Scroll to the bottom of the chat content
        $('.chat-content').scrollTop($('.chat-content')[0].scrollHeight);
      }, 500);
      $('#userInput').val('');
    }
  });