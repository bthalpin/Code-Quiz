const cardEl = document.querySelector('.main-board');
const headEl = document.querySelector('.title-container');
const mainEl = document.querySelector('.main-container'); 
const footerEl = document.querySelector('.footer'); 
// const mainButton = document.querySelector('.start-button');
const titleEl = document.querySelector('.title');
const mainList = document.querySelector('ol');
const timeCounter = document.querySelector('.timer');
const resultEl = document.querySelector('.result');
const highScoreEl = document.querySelector('.high-score');

let correctAnswers = 0;
// const testButton = document.querySelector('.test');
// h1El = document.createElement('h1');
// h1El.textContent = 'Test';
// headEl.appendChild(h1El);
// h1El.textContent = 'testing';
// headEl.appendChild(h1El);
let highScores = [];
let gameTime = 100;
let timer;

function makeBackButton() {
    let backBtn = document.createElement('button');
    backBtn.textContent = 'Go Back';
    backBtn.onclick = mainPage;
    footerEl.appendChild(backBtn);
}

function endGame() {
    clearQuizBoard()
    let endMessage = document.createElement('p')
    endMessage.textContent = "You lose, better luck next time"
    mainEl.appendChild(endMessage)

}

function quizStart() {

    // Prevents timer from running more than once
    // if (timer === undefined || timer === null){

        // If timer is complete it resets the clock
        if (timer===null){
            gameTime = 100;
        }

        // displays the time
        timer =  setInterval(function(){
        timeCounter.textContent = gameTime + ' seconds remaining';
        
        // Removes timer when time runs out
        if (gameTime <= 0){
            
            clearInterval(timer)
            timer=null;
            endGame()
        }
        gameTime--;
    },1000)
}

// Pool of questions
let questionIndex = 0;
const questionPool = [['q1','a2','a3','a4','a5','a2'],
                    ['q2','asd2','aasd3','adh4','ahgk5','ahgk5'],
                    ['q3','azx2','afd3','ea4','ay5','ea4'],
                    ['q4','az2','xa3','acv4','amvb5','acv4'],
                    ['q5','aq2','aw3','ae4','ra5','ra5']]

function showResult(result){
    let results = document.createElement('p');
    results.textContent = result;
    resultEl.appendChild(results);
    resultEl.setAttribute('class','display-result');
    setTimeout(function(){
        resultEl.removeChild(resultEl.firstElementChild);
        resultEl.removeAttribute('class');
        resultEl.setAttribute('class','result');
    },750);
}

function showHighScore() {
    clearQuizBoard()
    for (let i=0;i<highScores.length;i++){
        let scoreEl = document.createElement('p');
        scoreEl.setAttribute('class','score')
        scoreEl.textContent = highScores[i].name + ':' + highScores[i].score
        mainEl.appendChild(scoreEl);
        }
    makeBackButton()
}

function saveGame(name) {
    let newScore = {name:name,score:gameTime}
    highScores.push(newScore)
    highScores.sort(function (a,b){
        return b.score -a.score;
    })
    localStorage.setItem('highScores',JSON.stringify(highScores))
    showHighScore()
}

function winGame() {
    let endMessage = document.createElement('p')
    endMessage.textContent = 'You WON!!!! You completed the quiz with ' + gameTime + ' seconds remaining';
    mainEl.appendChild(endMessage)
    let input = document.createElement('input');
    input.setAttribute('placeholder','Enter your name')
    let submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.addEventListener('click',function(event){
        saveGame(event.target.parentElement.firstChild.nextElementSibling.value)
    })
    footerEl.appendChild(input)
    footerEl.appendChild(submitBtn)
}

function checkAnswer(answer){
    let result;
    if(answer === questionPool[questionIndex][5]){
        result = 'Correct';
        correctAnswers++;
    }else{
        result = 'WRONG!';
        if (gameTime <= 15){
            gameTime = 0;
        }else{
            gameTime-=15;
        }
    }
    console.log(result,answer,questionPool[questionIndex][5])
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
    const listEl = document.querySelectorAll('.answer');

    for (let i=0;i<4;i++){
        listEl[i].textContent = questionPool[questionIndex][i+1]
        listEl[i].setAttribute('id',questionPool[questionIndex][i+1])
    }
}

function clearQuizBoard(){
    if (mainList.firstChild){
        for (let i=0;i<4;i++){
            mainList.removeChild(mainList.firstChild)
        }
    }
    questionIndex=0;

}

function makeQuizBoard() {
    mainEl.removeChild(mainEl.firstElementChild);
    footerEl.removeChild(footerEl.firstElementChild);
    // const mainList = document.createElement('ul')
    // mainList.setAttribute('id','list')
    // console.log(mainList)
    
    for (let i=0;i<4;i++){
        // let listBtn = document.createElement('button')
        let listEl = document.createElement('li')
        listEl.setAttribute('class','answer')
        // console.log(listEl)
        // listBtn.textContent = questionPool[questionIndex][i+1]
        // listEl.setAttribute('id',questionPool[questionIndex][i+1])
        listEl.addEventListener('click',function(event){
            checkAnswer(event.target.textContent)
        })
        
        mainList.appendChild(listEl)
    }
    
    
    updateQuizBoard()
    quizStart()

    // getQuestions()
}
function getQuestions () {

    // If all questions are complete the timer is stopped
    if (questionIndex===questionPool.length){
        // testButton.textContent = 'You Win';
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
    // testButton.textContent = questionPool[questionIndex][1];
    questionIndex++;
}

function mainPage() {
    if (footerEl.firstElementChild){
        footerEl.removeChild(footerEl.firstElementChild);
    }
    for (let i=0;i<highScores.length;i++){
        if (mainEl.firstElementChild){
            mainEl.removeChild(mainEl.firstElementChild)
        }
    }
    
    let startBtn = document.createElement('button');
    startBtn.textContent = 'Start Quiz';
    startBtn.setAttribute('class', 'start-button');
    startBtn.onclick = makeQuizBoard;
    footerEl.appendChild(startBtn);
    let mainText = document.createElement('p')
    mainText.setAttribute('class','info')
    mainText.textContent = 'akjbdkjfbdskjfbkjsdbfjksdbfkjbsdjkfbsdjkfbjksdbfjksbdfjkbsj';
    mainEl.appendChild(mainText)
    titleEl.textContent = 'Code Quiz Challenge';    
    timeCounter.textContent = '';
    highScores = JSON.parse(localStorage.getItem('highScores'))
}

highScoreEl.onclick = showHighScore;
// mainButton.onclick = makeQuizBoard
// testButton.onclick = getQuestions
mainPage()





// Sort high score
// x.sort(function(a,b){return b.score - a.score})