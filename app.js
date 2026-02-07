const messagesEl = document.getElementById('messages');
const input = document.getElementById('input');
const sendBtn = document.getElementById('sendBtn');
const newChat = document.getElementById('newChat');
const convs = document.getElementById('convs');
const plusBtn = document.getElementById('plusBtn');

function appendMessage(text, cls='bot'){
  const el = document.createElement('div');
  el.className = 'msg ' + cls;
  el.textContent = text;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight - messagesEl.clientHeight;
}

async function send(){
  const text = input.value.trim();
  if(!text) return;
  appendMessage(text, 'user');
  input.value='';

  // Show placeholder
  const waitingEl = document.createElement('div');
  waitingEl.className = 'msg bot';
  waitingEl.textContent = "[Thinking...]";
  messagesEl.appendChild(waitingEl);

  try {
    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });


    if(!res.ok){
      messagesEl.removeChild(waitingEl);
      appendMessage("❌ Server error: " + res.status, 'bot');
      return;
    }

    let data;
    try {
      data = await res.json();
    } catch(e){
      messagesEl.removeChild(waitingEl);
      appendMessage("⚠️ Invalid JSON from server", 'bot');
      return;
    }

    messagesEl.removeChild(waitingEl);
    appendMessage(data.reply || ("⚠️ Error: " + (data.error || "No reply")), 'bot');
  } catch(err){
    messagesEl.removeChild(waitingEl);
    appendMessage("⚠️ Network error: " + err.message, 'bot');
  }
}

sendBtn.addEventListener('click', send);
input.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); send(); }
});

newChat.addEventListener('click', ()=>{
  const n = convs.children.length + 1;
  const tile = document.createElement('div');
  tile.className = 'conv active';
  tile.textContent = 'Chat ' + n;
  Array.from(convs.children).forEach(c=>c.classList.remove('active'));
  convs.appendChild(tile);
  messagesEl.innerHTML = '';
  appendMessage('Hello! New chat created.');
});

plusBtn.addEventListener('click', ()=>{
  alert('Plus button pressed — attach files or images here in future.');
});

messagesEl.addEventListener('DOMNodeInserted', ()=>messagesEl.focus());
input.focus();
