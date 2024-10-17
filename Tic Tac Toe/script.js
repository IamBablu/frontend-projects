const boxes = document.querySelectorAll(".btn");
const winnerbox = document.querySelector("#winner");
const winner = document.querySelector("#winneris");
const gamebox = document.querySelector("#gamebox");

let count = 0;
let turn = true;//for "O" player turn is true and now for "X" player turn is false

const winPattern = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

const resetgame = ()=>{
    count = 0;
    let turn = true;
    enableboxes();
    winnerbox.classList.add("hide");
    gamebox.classList.remove("hide");

}

boxes.forEach((box)=>{
    box.addEventListener("click", ()=>{
        if(turn){
            box.innerText = "O";
            turn = false;
        }else{
            box.innerText = "X";
            turn = true;
        }
        box.disabled = true;
        checkWinner();
        count ++;
        if(count == 9){
            Draw();
        }

    });
});

const Draw = ()=>{
    winner.innerText = `Game Draw`;
    winnerbox.classList.remove("hide");
    gamebox.classList.add("hide");
}

const disableboxes = ()=>{
    for(let box of boxes){
        box.disabled = true;
    }
}
const enableboxes = ()=>{
    for(let box of boxes){
        box.disabled = false;
        box.innerText = "";
    }
}
const checkWinner = ()=> {
 for(pattern of winPattern){
    let pos1val = boxes[pattern[0]].innerText;
    let pos2val = boxes[pattern[1]].innerText;
    let pos3val = boxes[pattern[2]].innerText;
    if(pos1val != "" && pos2val != "" && pos3val != ""){
        if(pos1val === pos2val && pos2val === pos3val){
            winner.innerText = `Congratulations, Winner is ${pos1val}`;
            winnerbox.classList.remove("hide");
            gamebox.classList.add("hide");
            disableboxes();
        }
    }
 };

}