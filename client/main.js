/* globals prompt */
const { getMessages, postMessage } = require('./fetch-messages')
const { Chat } = require('./components')
const yo = require('yo-yo')
const io = require('../node_modules/socket.io/client-dist/socket.io.js')


var socket = io()

const nickname = prompt('Enter your nickname:')

const sendForm = document.getElementById('send-message')
const messageTextField = document.getElementById('message-text')

const state = {
  room: '',
  messages: []
}

sendForm.onsubmit = evt => {

  evt.preventDefault()
  // postMessage(messageTextField.value, nickname, state.room)
  let text = messageTextField.value
  let room = state.room
  let message = JSON.stringify({ text, "nick": nickname, room, date: new Date() })
  socket.emit('new message', message)
}

function updateState(key, value) {
  state[key] = value
  yo.update(el, Chat(state.messages, state.room, updateState))
}

const el = Chat(state.messages, state.room, updateState)
const chatContainer = document.getElementById('chat-container')
chatContainer.appendChild(el)

// setInterval(() => getMessages(updateState), 1000)

socket.on('message', (jsonString) => {
  console.log(jsonString)
  let messages = JSON.parse(jsonString)
  state.messages = messages
  yo.update(el, Chat(state.messages, state.room, updateState))
})

socket.on('new message', (jsonString) => {
  let new_message = JSON.parse(jsonString)
  state.messages.push(new_message)
  yo.update(el, Chat(state.messages, state.room, updateState))
})