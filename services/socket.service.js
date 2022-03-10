const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null

function connectSockets(http, session) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        console.log('New socket', socket.id)

        socket.on('draw arrived', () => {
            socket.broadcast.emit('draw arrived')
        })
        socket.on('guess arrived', () => {
            socket.broadcast.emit('guess arrived')
        })
        socket.on('draw ready', isReady => {
            socket.broadcast.emit('draw ready', isReady)
        })
        socket.on('guess ready', isReady => {
            socket.broadcast.emit('guess ready', isReady)
        })

        socket.on('draw selected a work', word => {
            socket.broadcast.emit('draw selected a work', word);
        })
        socket.on('send drawing', img => {
            socket.broadcast.emit('send drawing', img);
        })
        socket.on('new game', game => {
            socket.broadcast.emit('new game', game);
        })
        socket.on('game ended', game => {
            socket.broadcast.emit('game ended', game);
        })
        socket.on('disconnect', socket => {
            console.log('Someone disconnected')
        })
    });
}

module.exports = {
    connectSockets,
}
