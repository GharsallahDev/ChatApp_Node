document.addEventListener("DOMContentLoaded", function() {
    var socket = io();
    var storedUsername = localStorage.getItem("username");
    const usernameContainer = document.getElementById("usernameContainer");
    const chatContainer = document.getElementById("chatContainer");
    const usernameInput = document.getElementById("usernameInput");
    const usernameButton = document.getElementById("usernameButton");
    const chatWindow = document.getElementById("chatWindow");
    const messageInput = document.getElementById("messageInput");
    const sendMessageButton = document.getElementById("sendMessage");
    const typingMessage = document.getElementById("typing");

    storedUsername ? showChatInterface() : showUsernameInterface();

    function showUsernameInterface() {
        usernameContainer.style.display = "block";
        chatContainer.style.display = "none";
    }

    function showChatInterface() {
        usernameContainer.style.display = "none";
        chatContainer.style.display = "block";
    }

    function displayMessage(message) {
        const messageElement = document.createElement("div");
        messageElement.textContent = message;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function sendMessage() {
        const message = messageInput.value.trim();

        if (message) {
            const messageObject = {
                username: storedUsername,
                content: message,
            };

            socket.emit("userMessage", messageObject);

            socket.emit("typingEnded", storedUsername);

            displayMessage(`${storedUsername}: ${message}`);

            messageInput.value = "";

            saveMessageToDatabase(messageObject);
        }
    }


    function saveMessageToDatabase(messageObject) {
        fetch('/chat/save-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageObject),
            })
            .then((response) => {
                if (response.ok) {
                    console.log('Message saved in the database');
                } else {
                    console.error('Error saving message in the database');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    messageInput.addEventListener("input", function(event) {
        if (messageInput.value) {
            socket.emit("typingStarted", storedUsername);
        } else {
            socket.emit("typingEnded", storedUsername);
        }
    });

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = "block";
    }

    function hideNotification() {
        notification.style.display = "none";
    }

    sendMessageButton.addEventListener("click", sendMessage);

    function handleSubmit() {
        const username = usernameInput.value.trim();

        if (username) {
            localStorage.setItem("username", username);
            storedUsername = username;
            showChatInterface();
        } else {
            alert("Please enter a valid username.");
        }
    }

    usernameButton.addEventListener("click", handleSubmit);
    sendMessageButton.addEventListener("click", sendMessage);

    socket.on("connected", function(message) {
        showNotification(message);
        setTimeout(hideNotification, 5000);
    });

    socket.on("disconnected", function(message) {
        showNotification(message);
        setTimeout(hideNotification, 5000);
    });

    socket.on("userMessage", function(data) {
        try {
            const sender = data.username;
            const messageText = data.content;

            if (sender != storedUsername) {
                displayMessage(`${sender}: ${messageText}`);
            }

        } catch (error) {
            console.error("Error parsing user message:", error);
        }
    });

    socket.on("typingStarted", function(username) {
        if (username != storedUsername) {
            typingMessage.style.display = "block";
            typingMessage.textContent = `${username} is typing ...`;
        }
    });

    socket.on("typingEnded", function(username) {
        if (username != storedUsername) {
            typingMessage.style.display = "none";
            typingMessage.textContent = '';
        }
    });

});