const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext('2d');
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const body = document.getElementsByTagName("body")[0];


const INITIAL_COLOR="#2c2c2c";
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "white";
ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth= 5;


let filling = false;
let painting = false;

function stopPainting(){
    painting = false;
}
function startPainting(event){
   painting = true; 
}

function onMouseMove(event){
    const x = event.offsetX;
    const y = event.offsetY;

    if(filling == false && painting == false){
        ctx.beginPath();
        ctx.moveTo(x,y);
    } else if (filling == false && painting == true){
        ctx.lineTo(x,y);
        ctx.stroke();
    }
}

function onMouseDown(event){
    painting = true;
}

function handleColorClick(event){
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    clearBtnSelect();
    event.target.style.border = "3px solid black";
}

function handleRangeChange(event){
    ctx.lineWidth = event.target.value;
}

function handleModeClick(event){
    if(filling == true){
        filling = false;
        mode.innerText = "fill";
    } else {
        filling = true;
        mode.innerText = "paint";
    }
}
function handleCanvasClick(){
    if(filling){
        ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE);
    }
}

function handleCM(event){
    event.preventDefault();
}

function handleSaveClick(event){
    const image = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = image;
    link.download = 'PaintJS[🎨]';
    link.click();
}

function handleCursorLeave(event){
    body.style.cursor = "auto";
    if(filling == false && painting == true){
        const x = event.offsetX;
        const y = event.offsetY;
        ctx.lineTo(x,y);
        ctx.stroke();
        
    }
}

function handleCursorEnter(event){
    //body.style.cursor = "CrossHair";
    body.style.cursor = "url('pen_emoji.png'), auto";
    body.style.cursor = " col-resiez:5px ; row-resize : 5px"
    if(filling == false && painting == true){
        let x = event.offsetX;
        let y = event.offsetY;
        if( x >= CANVAS_SIZE - 10 )
            x = CANVAS_SIZE;
        else if( x <= 10 )
            x = 0;
        if( y >= CANVAS_SIZE - 10 )
            y = CANVAS_SIZE;
        else if( y <=  10 )
            y = 0;
        console.log( x , y);
        ctx.beginPath();
        ctx.moveTo(x,y);
    }
}

function clearBtnSelect(){
    Array.from(colors).forEach(color => color.style.border = "0px")
}

if(canvas){
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    //canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave",handleCursorLeave);
    canvas.addEventListener("mouseenter",handleCursorEnter);
    canvas.addEventListener("click",handleCanvasClick);
    canvas.addEventListener("contextmenu", handleCM);
}

Array.from(colors).forEach(color => color.addEventListener("click",handleColorClick))

if(range){
    range.addEventListener("input", handleRangeChange);
}

if(mode) {
    mode.addEventListener("click", handleModeClick)
}

if(saveBtn){
    saveBtn.addEventListener("click", handleSaveClick);
}

body.addEventListener('mouseup', stopPainting);