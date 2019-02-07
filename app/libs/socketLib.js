const socketio = require('socket.io');
const mailService = require('../libs/sendMail');

let setServer = (server)=>{

    console.log("User Connected")
    let io = socketio.listen(server);
    let myIo = io.of('');

    myIo.on('connection',(socket)=>{
        socket.emit('verify-user')

        socket.on('event-created',(data)=>{
        })

        socket.on('snooze',(data)=>{
        })

        socket.on('event-edited',(data)=>{
        })
    })
}

module.exports = {
    setServer
}