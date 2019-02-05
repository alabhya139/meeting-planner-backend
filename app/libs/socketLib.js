const socketio = require('socket.io');

let setServer = (server)=>{

    console.log("USer COnnected")
    let io = socketio.listen(server);
    let myIo = io.of('');

    myIo.on('connection',(socket)=>{
        socket.emit('verify-user')
    })
}

module.exports = {
    setServer
}