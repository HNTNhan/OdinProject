function computerPlay() {
  let random = Math.floor(Math.random() * 3);
  if (random === 0) return "rock";
  else if (random === 1) return "paper";
  else return "scissors";
}

function checkRound(playerChoose, computerChoose) {
  if (playerChoose.toLowerCase() === "rock") {
    if (computerChoose.toLowerCase() === "rock") return 0;
    else if (computerChoose.toLowerCase() === "paper") return -1;
    else if (computerChoose.toLowerCase() === "scissors") return 1;
  } else if (playerChoose.toLowerCase() === "paper") {
    if (computerChoose.toLowerCase() === "rock") return 1;
    else if (computerChoose.toLowerCase() === "paper") return 0;
    else if (computerChoose.toLowerCase() === "scissors") return -1;
  } else if (playerChoose.toLowerCase() === "scissors") {
    if (computerChoose.toLowerCase() === "rock") return -1;
    else if (computerChoose.toLowerCase() === "paper") return 1;
    else if (computerChoose.toLowerCase() === "scissors") return 0;
  } else {
    return "Something went wrong!!!";
  }
}

let numRound;
let currRound;
let userScore;
let computerScore;

function startNewGame() {
  numRound = 5;
  currRound = 1;
  userScore = 0;
  computerScore = 0;
}

const userChoose = document.querySelectorAll(".buttons button");
const imgUserChoose = document.querySelector(".img-user-choose");
const imgComputerChoose = document.querySelector(".img-computer-choose");

for (let obj of userChoose) {
  obj.addEventListener("click", function () {
    let computerChoose = computerPlay();
    let playerChoose = obj.classList[0].split("-")[0];
    let result = checkRound(playerChoose, computerChoose);

    imgUserChoose.children[1].src = "public/images/" + playerChoose + ".jpg";
    imgComputerChoose.children[1].src =
      "public/images/" + computerChoose + ".jpg";
    imgUserChoose.style.display = "block";
    imgComputerChoose.style.display = "block";

    currRound += 1;
  });
}

//Test Case//

function testCheckRound() {
  console.group("Test Check Round Function");
  console.log(checkRound("Scissors", "Rock") === -1);
  console.log(checkRound("Rock", "Rock") === 0);
  console.log(checkRound("Rock", "Scissors") === 1);
  console.log(checkRound("Paper", "Rock") === 1);
  console.log(checkRound("Paper", "Scissors") === -1);
  console.groupEnd();
}
testCheckRound();
