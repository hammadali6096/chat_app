const socket = io('http://localhost:4000')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
console.log("formData ="+messageForm);
function makeConnection(){
  console.log("makeConnection");
  socket.emit('user', userName)
}
if (messageForm != null) {
  appendMessage('You joined')
  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', reciever,userName, message)
    messageInput.value = ''
  })
}

socket.on('message', data => {
    console.log("New Message from : " + data.name + " and msg is : " + data.msg);
  appendMessage(`${data.name}: ${data.msg}`)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

