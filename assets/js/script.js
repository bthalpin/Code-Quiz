const cardEl = document.querySelector('.main-board');
const titleEl = document.querySelector('.title-container');
const mainEl = document.querySelector('.main-container'); 
const footerEl = document.querySelector('.footer'); 
const mainList = document.querySelector('ol');
const timeCounter = document.querySelector('.timer');
const resultEl = document.querySelector('.result');
const highScoreEl = document.querySelector('.high-score');
const scoreContainerEl = document.querySelector('.score-container');

let correctAnswers = 0;
let highScores = [];
let gameTime;
let timer;
let currentQuestionAndAnswer;

// Pool of questions
let questionIndex = 0;
const questionPool = [['Common used data types DO NOT inclue: ','a2','a3','a4','a5','a2'],
                    ['q2','asd2','aasd3','adh4','ahgk5','ahgk5'],
                    ['q3','azx2','afd3','ea4','ay5','ea4'],
                    ['q4','az2','xa3','acv4','amvb5','acv4'],
                    ['q5','aq2','aw3','ae4','ra5','ra5']]

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
    console.log(parent)
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
    footerEl.appendChild(input)
    addElement('button',footerEl,'Submit',saveScores)
    clearInterval(timer)
    timer=null;    
}

// Displays losing game page
function endGame() {
    clearQuizBoard()
    addElement('h2',titleEl,'You lost')
    addElement('p',mainEl,'Keep studying and try again')
    addElement('button',footerEl,'Go Back',showMainPage)
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
    clearQuizBoard()
    if (highScores.length){
        for (let i=0;i<highScores.length;i++){
            addElement('p',scoreContainerEl,highScores[i].name + ':' + highScores[i].score)
            }
    }
    else {
        addElement('p',scoreContainerEl,'No scores to display')
    }
    addElement('button',footerEl,'Go Back',showMainPage)
    addElement('button',footerEl,'Clear High Score',clearScores)
}

// Loads the high scores from local storage
function loadScores() {
    highScores = JSON.parse(localStorage.getItem('highScores'))
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
    addElement('p',resultEl,result);
    setTimeout(function(){
        removeElement(resultEl)
    },1000);
}

// Checks if answer is correct and removes 15 seconds for a wrong answer
function checkAnswer(){
    let result;
    // if(this.textContent === questionPool[questionIndex][5]){
        if(this.textContent === currentQuestionAndAnswer[5]){
        result = 'Correct';
        correctAnswers++;
    }else{
        result = 'WRONG!';
        if (gameTime <= 15){
            gameTime = 0;
            endGame()
            return
        }else{
            gameTime-=15;
        }
        timeCounter.textContent = 'Time: ' + gameTime;
    }
    showResult(result)
    questionIndex++;

    // Will update quiz board if there are questions left or end game if that was the last question
    // if (questionIndex<questionPool.length){  
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
    removeElement(mainList)
    removeElement(mainEl)
    removeElement(footerEl)
    removeElement(scoreContainerEl)
    questionIndex=0;
}

// Starts the timer for the quiz
function quizStart() {
    // Resets game timer
    gameTime = 75;
    
    timer =  setInterval(function(){
        timeCounter.textContent = 'Time: ' + gameTime;
        console.log(timeCounter)
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
    for (let i=0;i<4;i++){
        addElement('li',mainList,'',checkAnswer)
    }    
    quizStart()
    updateQuizBoard()
}

// Clears the page and displays the main page information
function showMainPage() {
    clearQuizBoard()
    addElement('h1',titleEl,'Code Quiz Challenge')
    addElement('p',mainEl,'dsfdfsdfsdfsdfsdfsdfsdf')
    addElement('button',footerEl,'Start Quiz',makeQuizBoard)
    currentQuestionPool = [...questionPool]
    timeCounter.textContent = '';
    console.log(questionPool)
}

// Makes high score link, loads the scores from local storage, and calls function to display main page
function init() {
    highScoreEl.onclick = showHighScore;
    loadScores()
    showMainPage()
}


init()


