const cardEl = document.querySelector('.main-card');
const headEl = document.querySelector('.head');
const mainEl = document.querySelector('.main'); 
const footerEl = document.querySelector('.footer'); 
const mainButton = document.querySelector('.start-button');
const titleEl = document.querySelector('.title');
const pEl = document.querySelector('p');
const testButton = document.querySelector('.test');
// h1El = document.createElement('h1');
// h1El.textContent = 'Test';
// headEl.appendChild(h1El);
// h1El.textContent = 'testing';
// headEl.appendChild(h1El);
let startTime = 10;
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
        pEl.textContent = startTime + ' seconds remaining';
        
        // Removes timer when time runs out
        if (startTime===0){
            pEl.textContent = 'Game Over'
            clearInterval(timer)
            timer=null;
        }
        startTime--;
    },1000)}
}

// Pool of questions
let questionIndex = 0;
const questionPool = [['q1','a2','a3','a4','a5'],
                    ['q2','asd2','aasd3','adh4','ahgk5'],
                    ['q3','azx2','afd3','ea4','ay5'],
                    ['q4','az2','xa3','acv4','amvb5'],
                    ['q5','aq2','aw3','ae4','ra5']]


function getQuestions () {

    // If all questions are complete the timer is stopped
    if (questionIndex===questionPool.length){
        testButton.textContent = 'You Win';
        clearInterval(timer)
        timer = null;
        questionIndex = 0;
        return
    }
    titleEl.textContent = questionPool[questionIndex][0];
    testButton.textContent = questionPool[questionIndex][1];
    questionIndex++;
}

mainButton.onclick = quizStart
testButton.onclick = getQuestions


