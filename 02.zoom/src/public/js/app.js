const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById('cameras');

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;
let myDataChannel;

async function getCameras() {
    try {
        const devices =await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        const currentCamera = myStream.getVideoTracks()[0];

        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera.label === camera.label){
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        })
        console.log(cameras);
    }catch (e){
        console.log(e);
    }
}

async function getMedia(deviceId){
    const  initialConstraints = {
        audio : true,
        video : {facingMode : 'user'},
    };
    const cameraConstraints = {
        audio : true,
        video : {
            deviceId : { exact : deviceId } 
        }
    }
    try{
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstraints
        );
        myFace.srcObject = myStream;
        //최초진입시
        if(!deviceId){
            await getCameras();
        }
        } catch(e){
        console.log(e);
    }
}

function handleMuteClick () {
    console.log(myStream.getAudioTracks());
    myStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled       
    });
    if(!muted){
        muteBtn.innerText = "Unmute";
        muted = true;
    }else {
        muteBtn.innerText = "Mute";
        muted = false;
    }
}
function handleCameraClick () {
    console.log(myStream.getVideoTracks());
    myStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled       
    });
    if(cameraOff){
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}

async function handleCameraChange() {
    await getMedia(camerasSelect.value);
    // 여기 이후 부터는 내가 변경한 video 트랙을 받게 된다. 
    if(myPeerConnection){
        const videoTrack = myStream.getVideoTracks()[0];
        const videoSender = myPeerConnection
            .getSenders()
            .find(sender => sender.track.kind === 'video');
        videoSender.replaceTrack(videoTrack);
        //Sender 는 다른 브라우저로 보내진 비디오와 오디오 데이터를 컨트롤 하는 방법.
    }
}

muteBtn.addEventListener('click' , handleMuteClick);
cameraBtn.addEventListener('click' , handleCameraClick);
camerasSelect.addEventListener('input' , handleCameraChange);


//Welcome Form (join a room)

const welcome = document.getElementById('welcome');
const call = document.getElementById('call');

call.hidden = true;

welcomeForm  = welcome.querySelector('form');

async function initCall(){
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

async function handleWelcomeSubmit (e){
    e.preventDefault();
    const input = welcomeForm.querySelector('input');
    await initCall();
    socket.emit('join_room' , input.value );
    roomName = input.value;
    input.value = '';

}
welcomeForm.addEventListener('submit' , handleWelcomeSubmit);

//Socket Code

socket.on('welcome' , async () => {
    myDataChannel = myPeerConnection.createDataChannel("chat");
    myDataChannel.addEventListener('message' , console.log);
    console.log('made data channel');
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log('sent the offer');
    socket.emit('offer' , offer , roomName);
})

socket.on('offer' , async (offer) => {
    myPeerConnection.addEventListener('datachannel', (event) => {
        myDataChannel = event.channel;
        myDataChannel.addEventListener('message' , console.log);
    })
    console.log('received the offer');
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit('answer' , answer , roomName) ;
    console.log('sent the answer');
})

socket.on('answer' , answer=> {
    console.log('recevied the answer');
    myPeerConnection.setRemoteDescription(answer);
})

socket.on('ice' , ice =>{
    console.log('received candidate');
    myPeerConnection.addIceCandidate(ice);
})

socket.on('receivedMsg' , msg => {
    console.log('receivedMsg : ' , msg);
});

///RTC Code

function makeConnection(){
    myPeerConnection = new RTCPeerConnection({
        iceServers : [
            {
                urls : [
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                    "stun:stun4.l.google.com:19302"
                ]
            }
        ]
    });
    myPeerConnection.addEventListener('icecandidate', handleIce);
    myPeerConnection.addEventListener('addstream' , handleAddStream);
    myStream.getTracks().forEach(track => myPeerConnection.addTrack(track,myStream));
}

function handleIce(data){
    console.log('send candidate');
    socket.emit('ice' , data.candidate , roomName);
}

function handleAddStream(data){
    const peerFace  = document.getElementById('peerFace');
    peerFace.srcObject = data.stream;
}

function sendChat (msg){
    socket.emit('chatMsg' , msg , roomName);
}