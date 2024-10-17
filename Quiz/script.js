const questions = [
    {
        question: "which is largest animal in the world?",
        answers: [
            {text: "Shark", correct: false},
            {text: "Blue whale", correct: true},
            {text: "Elephant", correct: false},
            {text: "Giraffe", correct: false},
        ]
    },
    {
        question: "What is the capital of Australia?",
        answers: [
            {text: "Sydney", correct: false},
            {text: "Melbourne", correct: false},
            {text: "Canberra", correct: true},
            {text: "Perth", correct: false},
        ]
    },
    {
        question: "Who painted the Mona Lisa?",
        answers: [
            {text: "Vincent van Gogh", correct: false},
            {text: "Pablo Picasso", correct: true},
            {text: "Leonardo da Vinci", correct: false},
            {text: "Michelangelo", correct: false},
        ]
    },
    {
        question: "What is the largest ocean in the world?",
        answers: [
            {text: "Atlantic Ocean", correct: false},
            {text: "Indian Ocean", correct: false},
            {text: "Arctic Ocean", correct: false},
            {text: "Pacific Ocean", correct: true},
        ]
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: [
            {text: "Venus", correct: false},
            {text: "Mars", correct: true},
            {text: "Jupiter", correct: false},
            {text: "Saturn", correct: false},
        ]
    },
    {
        question: "Who wrote the play Romeo and Juliet?",
        answers: [
            {text: "William Shakespeare", correct: true},
            {text: "Jane Austen", correct: false},
            {text: "Charles Dickens", correct: false},
            {text: "F. Scott Fitzgerald", correct: false},
        ]
    },
    {
        question: "What is the currency of Japan?",
        answers: [
            {text: "Yen", correct: true},
            {text: "Euro", correct: false},
            {text: "Dollar", correct: false},
            {text: "Rupee", correct: false},
        ]
    },
    {
        question: "Which country is home to the famous ancient monument Stonehenge?",
        answers: [
            {text: "France", correct: false},
            {text: "United Kingdom", correct: true},
            {text: "Italy", correct: false},
            {text: "Egypt", correct: false},
        ]
    },
    {
        question: "Who is the author of the Harry Potter book series?",
        answers: [
            {text: "J.R.R. Tolkien", correct: false},
            {text: "J.K. Rowling", correct: true},
            {text: "George R.R. Martin", correct: false},
            {text: "Dan Brown", correct: false},
        ]
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        answers: [
            {text: "China", correct: false},
            {text: "South Korea", correct: false},
            {text: "Japan", correct: true},
            {text: "Thailand", correct: false},
        ]
    }
];

const questionElement = document.getElementById("question");
const ansBtn = document.getElementById("answer-btn");
const nextBtn = document.getElementById("next");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextBtn.innerText = "Next";
    showQuestion();
}
function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + " . " +currentQuestion.question;

    currentQuestion.answers.forEach(answer =>{
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        ansBtn.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    })

}
function resetState(){
    nextBtn.style.display = "none";
    while(ansBtn.firstChild){
        ansBtn.removeChild(ansBtn.firstChild);
    }
}

function selectAnswer(e){
    const selectBtn = e.target;
    const isCorrect = selectBtn.dataset.correct === "true";
    if(isCorrect){
        selectBtn.classList.add("correct");
        score++;
    }else{
        selectBtn.classList.add("incorrect");
    }
    Array.from(ansBtn.children).forEach(button =>{
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextBtn.style.display = "block";
}

function showScore(){
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}`
    nextBtn.innerHTML = "Play Again"
    nextBtn.style.display = "block";
}

function hanleNextBtn(){
    currentQuestionIndex++;
    if(currentQuestionIndex<questions.length){
        showQuestion();
    }
    else{
        showScore();
    }
}

nextBtn.addEventListener("click", ()=>{
    if(currentQuestionIndex<questions.length){
        hanleNextBtn();
    }
    else{
        startQuiz();
    }
})
startQuiz();