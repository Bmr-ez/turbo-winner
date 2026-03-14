const csInterface = new CSInterface();

const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

// Hardcoded Railway Server URL
let serverUrl = "https://turbo-winner-production.up.railway.app";


// Auto-expand textarea
userInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

sendBtn.addEventListener('click', handleSend);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

async function handleSend() {
    const prompt = userInput.value.trim();

    if (!prompt) return;

    addMessage(prompt, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';

    setLoading(true);

    try {
        let response = await callRailway(prompt, serverUrl);
        const script = extractScript(response);

        if (script) {
            addMessage("Executing action in After Effects...", "system");
            executeAEScript(script);
        } else {
            addMessage(response, "system");
        }
    } catch (error) {
        console.error(error);
        addMessage("Error: " + error.message, "error");
    } finally {
        setLoading(false);
    }
}

function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerHTML = `<div class="message-content">${text.replace(/\n/g, '<br>')}</div>`;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function setLoading(isLoading) {
    if (isLoading) {
        statusDot.className = 'busy';
        statusText.innerText = 'Thinking...';
        sendBtn.disabled = true;
    } else {
        statusDot.className = 'idle';
        statusText.innerText = 'Ready';
        sendBtn.disabled = false;
    }
}

async function callGemini(prompt, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const context = `You are an After Effects expert assistant. The user will ask you to perform tasks in After Effects.
    Your task is to generate Adobe ExtendScript (JSX) code that accomplishes the user's request.
    
    CRITICAL RULES:
    1. Only output legal ExtendScript for After Effects.
    2. Wrap your code in <SCRIPT> tags like this: <SCRIPT>Your Code Here</SCRIPT>.
    3. If the user is just chatting, respond normally without tags.
    4. Assume 'app.project' is available.
    5. Be efficient and follow AE scripting best practices.
    
    Example:
    User: "Create a 1080p comp called 'Main'"
    Response: "Sure, I'll create that for you. <SCRIPT>app.project.items.addComp('Main', 1920, 1080, 1, 10, 24);</SCRIPT>"`;

    const body = {
        contents: [
            {
                parts: [
                    { text: context + "\n\nUser Question: " + prompt }
                ]
            }
        ]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    return data.candidates[0].content.parts[0].text;
}

async function callRailway(prompt, url) {
    // Ensure URL ends correctly
    const endpoint = url.endsWith('/') ? url + 'api/chat' : url + '/api/chat';

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.text;
}


function extractScript(text) {
    const match = text.match(/<SCRIPT>([\s\S]*?)<\/SCRIPT>/);
    return match ? match[1] : null;
}

function executeAEScript(script) {
    // We wrap the script in a try-catch for the JSX environment
    const wrappedScript = `
        try {
            ${script}
        } catch(e) {
            alert("AE Script Error: " + e.toString());
        }
    `;

    csInterface.evalScript(wrappedScript, (result) => {
        if (result && result !== "undefined") {
            addMessage("Result: " + result, "system");
        }
    });
}
