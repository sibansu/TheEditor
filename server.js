const express = require('express')
const app = express()
const http = require('http')
const ACTIONS = require('./editor-project/src/Actions')
const { Server } = require('socket.io')

const server = http.createServer(app)
const io = new Server(server)

const userSocketmap = {}

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketmap[socketId]
        }
    })
}

io.on('connection', (socket) => {
    // console.log('Socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketmap[socket.id] = username
        socket.join(roomId)
        const clients = getAllConnectedClients(roomId)
        // console.log(clients);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            })
        })
    })
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code })  
    })
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code })  
    })

    socket.on(ACTIONS.CURSOR_POSITION, ({ roomId, position, username }) => {
        socket.in(roomId).emit(ACTIONS.CURSOR_POSITION, { position, username });
    });
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms]
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketmap[socket.id],
            })
        })
        delete userSocketmap[socket.id]
        socket.leave()
    })

})


const port = 5000

server.listen(port, () => console.log(`Listening on port ${port}`))