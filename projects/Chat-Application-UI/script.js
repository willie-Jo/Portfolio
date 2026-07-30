/*******************************************************
 * Chat Application UI
 * Author: William Adejoh
 * Description:
 *   Handles sending messages, auto-reply simulation,
 *   and typing indicator animation.
 *******************************************************/

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');

// Initial chat history
let messages = [
    {text: "Hey William! How's the portfolio going?", sender: "received"},
    {text: "Going great! Just finished Project 2", sender: "sent"}
];

/*
 * renderMessages: Loops through messages array and renders bubbles
 */
function renderMessages(){
    chatMessages.innerHTML = messages.map(msg => `
        <div class="message ${msg.sender}">
            ${msg.text}
        </div>
    `).join('');
    scrollToBottom(); // Always scroll to latest message
}

/*
 * scrollToBottom: Keeps chat scrolled to the newest message
 */
function scrollToBottom(){
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/*
 * sendMessage: Adds user message and triggers fake auto-reply
 */
function sendMessage(){
    const text = messageInput.value.trim();
    if(text === "") return; // Don't send empty messages

    // 1. Add user message
    messages.push({text, sender: "sent"});
    renderMessages();
    messageInput.value = "";

    // 2. Show typing indicator and fake reply
    showTyping();
    setTimeout(() => {
        hideTyping();
        const replies = [
            "That's awesome! 🔥",
            "Can I see a demo?",
            "Keep it up!",
            "Love the UI"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        messages.push({text: randomReply, sender: "received"});
        renderMessages();
    }, 1500); // 1.5s delay to simulate typing
}

/*
 * showTyping / hideTyping: Controls typing indicator
 */
function showTyping(){
    typingIndicator.style.display = "flex";
    scrollToBottom();
}

function hideTyping(){
    typingIndicator.style.display = "none";
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') sendMessage(); // Send on Enter key
});

// Initial render
renderMessages();