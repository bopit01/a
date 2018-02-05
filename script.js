const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

var timer = [0, 0, 0, 0];
var interval;
var timerRunning = false;

// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
  if (time <= 9) {
    time = "0" + time;
  }
  return time;
}

// Run a standard minute/second/hundredths timer:
function runTimer() {
  let currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
  theTimer.innerHTML = currentTime;
  timer[3]++;

  timer[0] = Math.floor((timer[3] / 100) / 60);
  timer[1] = Math.floor((timer[3] / 100) - (timer[0] * 60));
  timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));
}

// Match the text entered with the provided text on the page:
function spellCheck() {
  let textEntered = testArea.value;
  let originTextMatch = originText.substring(0, textEntered.length);

  if (textEntered == originText) {
    clearInterval(interval);
    testWrapper.style.borderColor = "#429890";
    resultCalc(timer);
    //trigger method that converts timer value into number of seconds
  } else {
    if (textEntered == originTextMatch) {
      testWrapper.style.borderColor = "#65CCf3";
    } else {
      testWrapper.style.borderColor = "#E95D0F";
    }
  }

}

// Start the timer:
function start() {
  let textEnterdLength = testArea.value.length;
  if (textEnterdLength === 0 && !timerRunning) {
    timerRunning = true;
    interval = setInterval(runTimer, 10);
  }
}

// Reset everything:
function reset() {
  clearInterval(interval);
  interval = null;
  timer = [0, 0, 0, 0];
  timerRunning = false;

  testArea.value = "";
  theTimer.innerHTML = "00:00:00";
  testWrapper.style.borderColor = "grey";
}

// Event listeners for keyboard input and the reset
testArea.addEventListener("keypress", start, false);
testArea.addEventListener("keyup", spellCheck, false);
resetButton.addEventListener("click", reset, false);

function resultCalc(arr) {
  let time = 0;
  let seconds = arr[1];
  let milliseconds = (arr[2] / 100);
  time = seconds + milliseconds;
  testCompleted(time);
}

function testCompleted(result) {
  let name = prompt("please enter your name")
  captureLeaderboard(result, name);
}

//function that creates a collection of the different list items that make up the best times. test to see what index in the li collection the new score should have.
function captureLeaderboard(newScore, newName) {
  let scores = document.querySelectorAll("li");
  let newIndex;
  let originalTableScores = [];
  let newTableScores = [];

  //placeholder variables that will become arguments
  // let newScore = 26;
  // let newName = "Leo";


  //loop through each value in scores, create an array containing the time and the name of the li contents, add that array to the originalTableScores array
  for (var i = 0; i < scores.length; i++) {
    let li = [];
    scoreInner = scores[i].querySelector(".score");
    li[0] = scoreInner.innerHTML;
    nameInner = scores[i].querySelector(".name");
    li[1] = nameInner.innerHTML;
    originalTableScores[i] = li;
  }

  let bestScore = originalTableScores[0][0];
  let bottomScore = originalTableScores[scores.length - 1][0];

  if (newScore > bottomScore) {
    originalTableScores.push([newScore, newName]);
  } else if (newScore < bestScore) {
    originalTableScores.unshift([newScore, newName]);
  } else if (bestScore < newScore < bottomScore) {
    for (let i = 0; i < originalTableScores.length; i++) {
      if (newScore < originalTableScores[i][0]) {
        newIndex = i;
        originalTableScores.splice(newIndex, 0, [newScore, newName]);
        break;
      }
    }

  }
  generateOl(originalTableScores);
}

//function to generate String of new ol if new score needs to be added, publish to page with changeList function
function generateOl(arr) {
  let newOlString = "";
  for (let i = 0; i < arr.length; i += 1) {
    newOlString += "<li><p class=\"score\">" + arr[i][0] + "</p><p class=\"name\">"+arr[i][1]+"</li>";
  }
  changeList(newOlString);
}

function changeList(newContent) {
  let ol = document.querySelector("ol");
  ol.innerHTML = newContent;
}

//captureLeaderboard();
