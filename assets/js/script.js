const cardEl = document.querySelector('.main-card');
const headEl = document.querySelector('.head');
const mainEl = document.querySelector('.main'); 
const footerEl = document.querySelector('.footer'); 
const mainButton = document.querySelector('.start-button');
const titleEl = document.querySelector('.title');
const pEl = document.querySelector('.info');
const mainList = document.querySelector('ul');
const timeCounter = document.querySelector('.timer');

let correctAnswers = 0;
// const testButton = document.querySelector('.test');
// h1El = document.createElement('h1');
// h1El.textContent = 'Test';
// headEl.appendChild(h1El);
// h1El.textContent = 'testing';
// headEl.appendChild(h1El);
let startTime = 100;
let timer;
function quizStart() {

    // Prevents timer from running more than once
    if (timer === undefined || timer === null){

        // If timer is complete it resets the clock
        if (timer===null){
            startTime = 10;
        }

        // displays the time
        timer =  setInterval(function(){
        timeCounter.textContent = startTime + ' seconds remaining';
        
        // Removes timer when time runs out
        if (startTime <= 0){
            pEl.textContent = 'Game Over'
            clearInterval(timer)
            timer=null;
        }
        startTime--;
    },1000)}
}

// Pool of questions
let questionIndex = 0;
const questionPool = [['q1','a2','a3','a4','a5','a2'],
                    ['q2','asd2','aasd3','adh4','ahgk5','ahgk5'],
                    ['q3','azx2','afd3','ea4','ay5','ea4'],
                    ['q4','az2','xa3','acv4','amvb5','acv4'],
                    ['q5','aq2','aw3','ae4','ra5','ra5']]

function checkAnswer(answer){
    if(answer === questionPool[questionIndex][5]){
        console.log('Correct');
        correctAnswers++;
    }else{
        console.log('WRONG!')
        if (startTime <= 15){
            startTime = 0;
        }else{
            startTime-=15;
        }
    }
    questionIndex++;
    if (questionIndex<questionPool.length){
        
        updateQuizBoard()
    }
    else {
        clearQuizBoard()
        pEl.textContent = 'You WON!!!!';
        clearInterval(timer)
    }
    
}

function updateQuizBoard(){
    const listEl = document.querySelectorAll('li');

    for (let i=0;i<4;i++){
        listEl[i].textContent = questionPool[questionIndex][i+1]
        listEl[i].setAttribute('id',questionPool[questionIndex][i+1])
    }
}

function clearQuizBoard(){
    for (let i=0;i<4;i++){
        mainList.removeChild(mainList.firstChild)
    }
    questionIndex=0;
}

function makeQuizBoard() {
    pEl.textContent = ''
    // const mainList = document.createElement('ul')
    // mainList.setAttribute('id','list')
    // console.log(mainList)
    for (let i=0;i<4;i++){
        let listEl = document.createElement('li')
        // console.log(listEl)
        listEl.textContent = questionPool[questionIndex][i+1]
        // listEl.setAttribute('id',questionPool[questionIndex][i+1])
        listEl.addEventListener('click',function(event){
            checkAnswer(event.target.textContent)
        })
        mainList.appendChild(listEl)
    }
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

mainButton.onclick = makeQuizBoard
// testButton.onclick = getQuestions


