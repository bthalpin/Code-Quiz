const titleEl = document.querySelector('.title-container');
const mainEl = document.querySelector('.main-container'); 
const timeCounter = document.querySelector('.timer');
const resultEl = document.querySelector('.result');
const highScoreEl = document.querySelector('.high-score');
const scoreContainerEl = document.querySelector('.score-container');
let mainList;

let highScores = [];
let gameTime;
let timer;
let resultTimer;
let currentQuestionAndAnswer;
let questionIndex = 0;

// Pool of questions
const questionPool = [['Which HTML tag is used to enclose javascript? ','<html>','<link>','<script>','<head>','<script>'],
                    ['Which of the following is NOT a primitive data type in JavaScript? ','Variable','Number','Undefined','Boolean','Variable'],
                    ['What is the function of the pop() method? ','Remove first element of an array','Delete an entire array','pop() is not a method in JavaScript','Remove the last element of an array','Remove the last element of an array'],
                    ['Which of the following is not like the others? ','variable++','variable += 1','variable ^= 1','variable = variable + 1','variable ^= 1'],
                    ['What is the range of Math.random()? ','0 to just less than 1','Any range you select','0 to 1, including 1','0 to 10, not including 10','0 to just less than 1']]

// Copies array to keep original array intact to allow the game to be played again
let currentQuestionPool = [...questionPool]

// Adds an element to a parent element and updates text
function addElement(child,parent,text,callBackFunction=null) {
    let childEl = document.createElement(child);
    childEl.textContent = text;

    // Adds on click function if one was provided
    if (callBackFunction){
        childEl.onclick = callBackFunction;
    }
    parent.appendChild(childEl)
}

// Removes all the elements of the parent element
function removeElement(parent) {
    let numberOfChildren = parent.childElementCount;
    for (let i=0;i<numberOfChildren;i++){
        parent.removeChild(parent.firstElementChild)
    }
    
}

// Displays winning game page and shows an input box to save your name for high score
function winGame() {
    addElement('h2',titleEl,'Congratulations!')
    addElement('p',mainEl,'You completed the quiz with ' + gameTime + ' seconds remaining')
    let input = document.createElement('input');
    input.setAttribute('placeholder','Enter your name (max 30 characters)')
    input.setAttribute('maxlength','30');
    mainEl.appendChild(input)
    addElement('button',mainEl,'Submit',saveScores)
    clearInterval(timer)
    timer=null;    
}

// Displays losing game page
function endGame() {
    clearQuizBoard()
    addElement('h2',titleEl,'You lost')
    addElement('p',mainEl,'Keep studying and try again')
    addElement('button',mainEl,'Go Back',showMainPage)
}



// Removes the high scores from local storage
function clearScores() {
    clearQuizBoard()
    highScores = [];
    localStorage.setItem('highScores',JSON.stringify(highScores))
    showHighScore()
}

// Displays the high scores on the screen if there are any
function showHighScore() {
    if (timer){
        clearInterval(timer)
        timer=null;
    }
    clearQuizBoard()
    timeCounter.textContent = '';
    if (!highScores || !highScores.length){
        addElement('p',scoreContainerEl,'No scores to display')
        
    }
    else {
        for (let i=0;i<highScores.length;i++){
            addElement('p',scoreContainerEl,highScores[i].name + ':' + highScores[i].score)
        }
    }
    addElement('button',mainEl,'Go Back',showMainPage)
    addElement('button',mainEl,'Clear High Score',clearScores)
}

// Loads the high scores from local storage
function loadScores() {
    highScores = JSON.parse(localStorage.getItem('highScores'))

    // Sets high scores to empty array if there are no scores in local storage
    if (!highScores){
        highScores = []
    }
}

// Saves high scores to local storage
function saveScores() {
    let name = document.querySelector('input').value
    let newScore = {name:name,score:gameTime}
    highScores.push(newScore)
    highScores.sort(function (a,b){
        return b.score -a.score;
    })
    localStorage.setItem('highScores',JSON.stringify(highScores))
    showHighScore()
}

// Displays if the answer selected was right or wrong at the bottom for 1 second when an answer is selected
function showResult(result){
    if (resultTimer){
        clearTimeout(resultTimer)
        resultEl.firstElementChild.textContent = result;
    }
    else {
        addElement('p',resultEl,result);
    }

    resultTimer = setTimeout(function(){
        removeElement(resultEl)
        resultTimer=null
    },1000);
}

// Checks if answer is correct and removes 15 seconds for a wrong answer
function checkAnswer(){
    let result;
    if(this.textContent === currentQuestionAndAnswer[5]){
        result = 'Correct';
    }
    else {
        result = 'WRONG!';

        // Ends game if wrong answer penalty causes time to run out
        if (gameTime <= 15) {
            gameTime = 0;
            showResult(result)
            endGame()
            return
        }
        else {
            gameTime-=15;
        }
        timeCounter.textContent = 'Time: ' + gameTime;
    }
    showResult(result)
    questionIndex++;

    // Will update quiz board if there are questions left or ends game if that was the last question 
    if (currentQuestionPool.length){       
        updateQuizBoard()
    }
    else {
        clearQuizBoard()
        winGame()
        clearInterval(timer)
    }
    
}

// Updates the quiz board with a new random question and loads corresponding answers
function updateQuizBoard(){
    const question = document.querySelector('h3')
    const listEl = document.querySelectorAll('li');

    currentQuestionAndAnswer = currentQuestionPool.splice(Math.random()*currentQuestionPool.length,1)[0]
    question.textContent = currentQuestionAndAnswer[0]

    for (let i=0;i<4;i++){
        listEl[i].textContent = currentQuestionAndAnswer[i+1]
    }
}

// Clears the page of all elements
function clearQuizBoard(){
    removeElement(titleEl)
    removeElement(mainEl)
    removeElement(scoreContainerEl)
    questionIndex=0;
}

// Starts the timer for the quiz
function quizStart() {
    // Resets game timer
    gameTime = 75;
    timer =  setInterval(function(){
        timeCounter.textContent = 'Time: ' + gameTime;
       
        // Removes timer when time runs out
        if (gameTime <= 0){
            clearInterval(timer)
            timer=null;
            endGame()
        }
        gameTime--;
    },1000)
}

// Makes the layout for the quiz
function makeQuizBoard() {
    clearQuizBoard()
    addElement('h3',mainEl,'')
    addElement('ol',mainEl,'')
    mainList = document.querySelector('ol')
    for (let i=0;i<4;i++){
        addElement('li',mainList,'',checkAnswer)
    }    
    quizStart()
    updateQuizBoard()
}

// Clears the page and displays the main page information
function showMainPage() {
    clearQuizBoard()
    addElement('h1',mainEl,'Code Quiz Challenge')
    addElement('p',mainEl,'Answer the following questions to help practice for your coding interview.  Try to answer as fast as your can to get a higher score, but remember your time will be reduced by fifteen seconds for a wrong answer.')
    addElement('button',mainEl,'Start Quiz',makeQuizBoard)
    currentQuestionPool = [...questionPool]
    timeCounter.textContent = '';
}

// Makes high score link, loads the scores from local storage, and calls function to display main page
function init() {
    highScoreEl.onclick = showHighScore;
    loadScores()
    showMainPage()
}


init()


