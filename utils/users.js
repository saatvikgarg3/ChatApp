const users=[];

//User Join to Chat
function userjoin(id,username,roomname){
    const user={id,username,roomname};

    users.push(user);
    return user;
}

//Getting current user
function getCurrentUser(id){
    return users.find(user=>user.id===id);
}

//For user leaving the chat
function userLeave(id){
    const index=users.findIndex(user=>user.id===id);
    if(index!==-1){
        return users.splice(index,1)[0];
    }
}

//to get room users
function getRoomusers(room){
    return users.filter(user=>user.roomname===room);
    
}

module.exports={
    userjoin,
    getCurrentUser,
    userLeave,
    getRoomusers,
}