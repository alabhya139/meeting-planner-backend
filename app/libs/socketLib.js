const socketio = require('socket.io');
const mailService = require('../libs/sendMail');

let setServer = (server)=>{

    console.log("User Connected")
    let io = socketio.listen(server);
    let myIo = io.of('');
    let clients =[];

    io.on('connection',(socket)=>{
        socket.emit('verify-user',()=>{
            console.log("Verify User")
        })

        socket.on('set-user',(data)=>{
            console.log(data)
            socket.id = data.userId;
            clients.push(socket.id);
        })

        

        socket.on('event-created',(data)=>{
            let response = data.data;
            let emitData = data;
            emitData.isCreated = true;
            io.emit(response.userId,emitData)
            let mailOptions = {
                from: 'meetingplannerapp@gmail.com',
                to: data.email,
                subject: 'New Event created',
                text: `A new event is created today by ${response.adminName} on ${new Date(response.startDate)}`
            };
            mailService.sendMail(mailOptions)
             .then(resolve=>{
                console.log(resolve)
                 console.log(`email sent to ${data.email}`)
             })
             .catch(error=>{
                 console.log(error)
             })
        });

        socket.on('snooze',(data)=>{
            
        });

        socket.on('event-edited',(data)=>{
            let response = data.data;
            let emitData = data;
            emitData.isCreated = false;
            io.emit(response.userId,emitData)
            let mailOptions = {
                from: 'meetingplannerapp@gmail.com',
                to: data.email,
                subject: 'New Event created',
                text: `Your meeting ${response.meetingTitle} is edited today by ${response.adminName}`
            };
            mailService.sendMail(mailOptions)
             .then(resolve=>{
                 res.send("Email Sent")
             })
             .catch(error=>{
                 res.send(error)
             })
        });
    })
}

module.exports = {
    setServer
}