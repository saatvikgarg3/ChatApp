const socket=io();
const chatform=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');

//Getting username and room from url
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true,
})

//Community Join 
socket.emit('joinRoom',{username,room});

//Get room and users
socket.on('roominfo',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message',message=>{
    //Chat Message
    outputMessage(message);

    //scroll end whenever message sent
    chatMessages.scrollTop=chatMessages.scrollHeight;
})

//Submission Message for form
chatform.addEventListener('submit',(e)=>{
    e.preventDefault();

    const msg=e.target.elements.msg.value;

    //sending message to server
    socket.emit('chatmessage',msg)

    //clearing input after message submit
    e.target.msg.value="";
    e.target.msg.focus();
})

function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}

//Adding Room name
function outputRoomName(roomname){
    roomName.innerText=roomname;
}

//Adding user to userlist sidebar
function outputUsers(users){
    userList.innerHTML=`
        ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}