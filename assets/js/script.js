const cardEl = document.querySelector('.main-board');
const headEl = document.querySelector('.title-container');
const mainEl = document.querySelector('.main-container'); 
const footerEl = document.querySelector('.footer'); 
const titleEl = document.querySelector('.title');
const mainList = document.querySelector('ol');
const timeCounter = document.querySelector('.timer');
const resultEl = document.querySelector('.result');
const highScoreEl = document.querySelector('.high-score');
const scoreContainerEl = document.querySelector('.score-container');

let correctAnswers = 0;
let highScores = [];
let gameTime = 100;
let timer;

// Pool of questions
let questionIndex = 0;
const questionPool = [['q1','a2','a3','a4','a5','a2'],
                    ['q2','asd2','aasd3','adh4','ahgk5','ahgk5'],
                    ['q3','azx2','afd3','ea4','ay5','ea4'],
                    ['q4','az2','xa3','acv4','amvb5','acv4'],
                    ['q5','aq2','aw3','ae4','ra5','ra5']]
                    

function addElement(child,parent,text,callBack=null) {
    let childEl = document.createElement(child);
    childEl.textContent = text;
    if (callBack){
        childEl.onclick = callBack;
    }
    parent.appendChild(childEl)
}

function removeElement(parent) {
    console.log(parent)
    let numberOfChildren = parent.childElementCount;
    for (let i=0;i<numberOfChildren;i++){
        parent.removeChild(parent.firstElementChild)
    }
    
}


function endGame() {
    clearQuizBoard()
    addElement('p',mainEl,'You lose, better luck next time')
    addElement('button',footerEl,'Go Back',mainPage)
}

function quizStart() {

        if (timer===null){
            gameTime = 100;
        }

        // displays the time
        timer =  setInterval(function(){
        timeCounter.textContent = gameTime + ' seconds remaining';
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

function showResult(result){
    addElement('p',resultEl,result);
    setTimeout(function(){
        removeElement(resultEl)
    },750);
}

function clearScores() {
    clearQuizBoard()
    highScores = [];
    localStorage.setItem('highScores',JSON.stringify(highScores))
    showHighScore()
}

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
    addElement('button',footerEl,'Go Back',mainPage)
    addElement('button',footerEl,'Clear High Score',clearScores)
}

function saveGame() {
    let name = document.querySelector('input').value
    let newScore = {name:name,score:gameTime}
    highScores.push(newScore)
    highScores.sort(function (a,b){
        return b.score -a.score;
    })
    localStorage.setItem('highScores',JSON.stringify(highScores))
    showHighScore()
}

function loadScores() {
    highScores = JSON.parse(localStorage.getItem('highScores'))
}

function winGame() {
    addElement('p',mainEl,'You WON!!!! You completed the quiz with ' + gameTime + ' seconds remaining')
    let input = document.createElement('input');
    input.setAttribute('placeholder','Enter your name')
    footerEl.appendChild(input)
    addElement('button',footerEl,'Submit',saveGame)
    clearInterval(timer)
    timer=null;    
}

function checkAnswer(){
    let result;
    if(this.textContent === questionPool[questionIndex][5]){
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
        timeCounter.textContent = gameTime + ' seconds remaining';
    }
    showResult(result)
    questionIndex++;
    if (questionIndex<questionPool.length){        
        updateQuizBoard()
    }
    else {
        clearQuizBoard()
        winGame()
        clearInterval(timer)
    }
    
}

function updateQuizBoard(){
    const listEl = document.querySelectorAll('li');

    for (let i=0;i<4;i++){
        listEl[i].textContent = questionPool[questionIndex][i+1]
    }
}

function clearQuizBoard(){
    removeElement(mainList)
    removeElement(mainEl)
    removeElement(footerEl)
    removeElement(scoreContainerEl)
    questionIndex=0;

}

function makeQuizBoard() {
    clearQuizBoard()
    for (let i=0;i<4;i++){
        addElement('li',mainList,questionPool[questionIndex][i+1],checkAnswer)
    }    
    updateQuizBoard()
    quizStart()
}

function getQuestions () {
    if (questionIndex===questionPool.length){
        clearInterval(timer)
        timer = null;
        questionIndex = 0;
        return
    }
    const allListEl = document.getElementById('list')
    console.log(allListEl)
    titleEl.textContent = questionPool[questionIndex][0];
    for (let i=0;i<4;i++){        
        allListEl[i].textContent = questionPool[questionIndex][i+1]
    }
    questionIndex++;
}

function mainPage() {
    clearQuizBoard()
    addElement('button',footerEl,'Start Quiz',makeQuizBoard)
    addElement('p',mainEl,'dsfdfsdfsdfsdfsdfsdfsdf')
    titleEl.textContent = 'Code Quiz Challenge';    
    timeCounter.textContent = '';
    loadScores()
}

highScoreEl.onclick = showHighScore;
mainPage()


