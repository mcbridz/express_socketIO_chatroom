const fs = require('fs')
const path = require('path')
const express = require('express')


module.exports = function (deps) {
    const app = express()

    //link static files
    app.use('/static', express.static(path.join(__dirname, 'static')))

    app.use(express.json())

    app.get('/messages', (req, res) => {
        fs.readFile(deps.messagesPath, 'utf8', (err, text) => {
            if (err) {
                res.statusCode = 500
                return res.end('Error reading messages')
            }

            const messages = text
                .split('\n')
                .filter(txt => txt) // will filter out empty string
                .map(JSON.parse)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(messages))
        })
    })
    app.post('/messages', (req, res) => {
        let new_message = req.body
        fs.appendFile(deps.messagesPath, '\n' + JSON.stringify(new_message), err => {
            if (err) {
                res.statusCode = 500
                return res.end(err)
            }
            res.statusCode = 200
            res.end('Message posted successfully')
        })
    })

    const server = require('http').createServer(app)
    return server
}