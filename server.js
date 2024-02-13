const path=require('path');
const http=require('http')
const express=require('express');
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');
const userInfo=require('./utils/users');

const app=express();
const server=http.createServer(app);
const io=socketio(server);
const botname="Community Bot";
//setting static folders for frontend
app.use(express.static(path.join(__dirname,'public')));

    //running when client connects
    io.on('connection',socket=>{

        socket.on('joinRoom',({username,room})=>{
            const user=userInfo.userjoin(socket.id,username,room);
            socket.join(user.roomname);

        //emit to a single user that is connecting 
        socket.emit('message',formatMessage(botname,"Welcome to the Community"))

        //when user connects telling others about it
        socket.broadcast.to(user.roomname).emit('message',formatMessage(botname,`${user.username} has Joined the Community`));


        //Room Info for sidebar
        io.to(user.roomname).emit('roominfo',{
            room:user.roomname,
            users:userInfo.getRoomusers(user.roomname)
        })
    });
    


    //listening to message from chat submission
    socket.on('chatmessage',(msg)=>{
        const user=userInfo.getCurrentUser(socket.id);
        io.to(user.roomname).emit('message',formatMessage(user.username,msg));
    })

    //when client disconnects
    socket.on('disconnect',()=>{
        const user=userInfo.userLeave(socket.id);
        if(user){
            io.to(user.roomname).emit('message',
                formatMessage(botname,
                    `${user.username} has left the Community`));
                    
            io.to(user.roomname).emit('roominfo',{
                room:user.roomname,
                users:userInfo.getRoomusers(user.roomname)
            })
        }
    })

})

const PORT=3000 || process.env.PORT;
server.listen(PORT,()=>console.log(`server running on port ${3000}`));
