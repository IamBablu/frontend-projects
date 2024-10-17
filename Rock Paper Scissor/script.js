const choices = document.querySelectorAll(".choice");
const userScoreBox = document.querySelector("#user-score");
const compScoreBox = document.querySelector("#comp-score");
const smg = document.querySelector("#msg");


let userScore = 0;
let compScore = 0;

function StartGame(){
    choices.forEach((choice) => {
        choice.addEventListener("click", ()=>{
            let userChoice = choice.getAttribute("id");
            let compChoice = genCompChoice();
            playGame(userChoice,compChoice);
        })
    })
}

function genCompChoice(){
    const Arr = ["Rock", "Paper", "Scissor"];
    let rand = genRandom();
    return Arr[rand];
}

function genRandom(){
    return Math.floor(Math.random()*3);
}

function playGame(user, computer){
    if(user === computer){
        displayDraw(user);
    }else{
        let win = true;
        if(user == "Rock"){
            win = computer == "Paper"?false:true;
        }else if(user == "Paper"){
            win = computer == "Rock"?true:false;
        }
        else{
            win = computer == "Rock"?false:true;
        }
        displayScore(win, user, computer);
    }
}

function displayScore(win, user, computer){
    if(win){
        smg.innerText = `You win!, ${user} beats ${computer}`;
        userScore++;
        userScoreBox.innerText = userScore;
        compScore--;
        compScoreBox.innerText = compScore;
        smg.style.backgroundColor = "green";
    }else{
        smg.innerText = `You lost!, ${computer} beats ${user}`;
        compScore++;
        compScoreBox.innerText = compScore;
        userScore--;
        userScoreBox.innerText = userScore;
        smg.style.backgroundColor = "red";
    }
}

function displayDraw(user){
    smg.innerText = `Draw!, both are Chose ${user}`;
    smg.style.backgroundColor = "#555";

}
StartGame();
