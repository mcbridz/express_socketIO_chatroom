const port = 8000
const MESSAGES_PATH = './messages.txt'

const app = require('./server')({ messagesPath: MESSAGES_PATH })

app.listen(port)

console.log('server listening on port: ', port)
