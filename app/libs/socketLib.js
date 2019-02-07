const socketio = require('socket.io');
const mailService = require('../libs/sendMail');

let setServer = (server)=>{

    console.log("User Connected")
    let io = socketio.listen(server);
    let myIo = io.of('');

    myIo.on('connection',(socket)=>{

        socket.on('set-user',(data)=>{
            socket.userId = data.userId;

            socket.name = `${data.firstName} ${data.lastName}`
        })

        socket.on('event-created',(data)=>{
            console.log(data);
            myIo.emit(data.userId,"New Event Created")
            let mailOptions = {
                from: 'meetingplannerapp@gmail.com',
                to: data.email,
                subject: 'New Event created',
                text: `A new event is created today by ${data.adminName}`
            };
            mailService.sendMail(mailOptions)
             .then(resolve=>{
                 res.send("Email Sent")
                 console.log(`email sent to ${data.email}`)
             })
             .catch(error=>{
                 res.send(error)
             })
        });

        socket.on('snooze',(data)=>{
            
        });

        socket.on('event-edited',(data)=>{
            myIo.emit(data.userId,"Meeting Edited")
            let mailOptions = {
                from: 'meetingplannerapp@gmail.com',
                to: email,
                subject: 'New Event created',
                text: `Your meeting ${data.meetingTitle} is edited today by ${data.adminName}`
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