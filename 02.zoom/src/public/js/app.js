const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById("room");

room.hidden = true;

let roomName;
let nickName;

function addMessage(message){
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector('form#message input');
    const value = input.value;
    socket.emit('new_message' ,  value , roomName , () => {
        addMessage(`You: ${value}`);
    });
    input.value = '';
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector('form#nickname input');
    const value = input.value;
    socket.emit('nickname' ,  value , roomName , () => {
        addMessage(`You: ${value}`);
    });
    input.value = '';
}


function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room : ${roomName} You : ${nickName}`;
    const msgForm = room.querySelector('form#message');
    //const nameForm = room.querySelector('form#nickname');
    msgForm.addEventListener('submit' , handleMessageSubmit);
    //nameForm.addEventListener('submit' , handleNicknameSubmit);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const roomNameInput = form.querySelector('input#roomName');
    const nickNameInput = form.querySelector('input#nickName');
    socket.emit('enter_room', roomNameInput.value , nickNameInput.value ,showRoom);
    roomName = roomNameInput.value;
    nickName = nickNameInput.value;
    roomNameInput.value="";
    nickNameInput.value="";
}

form.addEventListener('submit', handleRoomSubmit);

socket.on("welcome" , (user) => {
    addMessage(`${user} joined!`);
})

socket.on('bye' , (left) =>{
    addMessage(`${left} left ㅠㅠ!`);
})

socket.on('new_message' , addMessage);
