let currRound;
let userScore;
let computerScore;
let maxScore;
let isGameOver;

const userChoose = document.querySelectorAll(".buttons button");
const imgUserChoose = document.querySelector(".img-user-choose");
const imgComputerChoose = document.querySelector(".img-computer-choose");
const showResultContent = document.querySelector(".show-result-content");
const roundHeader = document.querySelector(".current-round");
const textRoundResult = document.querySelector(".text-round-result");
const textUserScore = document.querySelector(".user-score");
const textComputerScore = document.querySelector(".computer-score");
const endGameModal = document.querySelector(".end-game-modal");
const endResult = document.querySelector(".modal-result");
const restartButton = document.querySelector(".restart-button");
const newGameButton = document.querySelector(".new-game-button");
const showMaxScore = document.querySelector(".show-max-score");

function newGame() {
  maxScore = parseInt(document.querySelector("#max-score").value);
  maxScore = maxScore < 1 ? 1 : maxScore;
  currRound = 1;
  userScore = 0;
  computerScore = 0;
  isGameOver = false;
  textUserScore.textContent = 0;
  textComputerScore.textContent = 0;
  endGameModal.style.display = "none";
  showResultContent.style.display = "none";
  showMaxScore.textContent = "Max Score: " + maxScore;
}

function gameOver() {
  isGameOver = true;
  endGameModal.style.display = "flex";
  if (userScore > computerScore) {
    endResult.textContent = "You Won!";
    endResult.style.color = "green";
    playSound("won-sound");
  } else if (userScore === computerScore) {
    endResult.textContent = "Tie!";
    endResult.style.color = "blue";
    playSound("won-sound");
  } else {
    playSound("lost-sound");
    endResult.textContent = "You Lost!";
    endResult.style.color = "red";
  }
}

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

function updateSatus(result) {
  roundHeader.textContent = "Round " + currRound;
  if (result === -1) {
    computerScore += 1;
    textComputerScore.textContent = computerScore;
    textRoundResult.textContent = "You Lost!";
    textRoundResult.style.color = "red";
  } else if (result === 0) {
    computerScore += 1;
    userScore += 1;
    textComputerScore.textContent = computerScore;
    textUserScore.textContent = userScore;
    textRoundResult.textContent = "Tie!";
    textRoundResult.style.color = "blue";
  } else if (result === 1) {
    userScore += 1;
    textUserScore.textContent = userScore;
    textRoundResult.textContent = "You Won!";
    textRoundResult.style.color = "green";
  } else {
    alert("Something went wrong!");
  }

  currRound += 1;

  if (userScore >= maxScore || computerScore >= maxScore) {
    gameOver();
  }
}

function playSound(id) {
  document.querySelector(`#${id}`).currentTime = 0;
  document.querySelector(`#${id}`).play();
}

restartButton.addEventListener("click", function () {
  newGame();
});

newGameButton.addEventListener("click", function () {
  newGame();
});

newGame();

for (let obj of userChoose) {
  obj.addEventListener("click", function () {
    let computerChoose = computerPlay();
    let playerChoose = obj.classList[0].split("-")[0];
    let result = checkRound(playerChoose, computerChoose);

    imgUserChoose.children[1].src = "public/images/" + playerChoose + ".jpg";
    imgComputerChoose.children[1].src =
      "public/images/" + computerChoose + ".jpg";
    showResultContent.style.display = "block";
    playSound("click-sound");
    updateSatus(result);
  });
}

window.addEventListener("keydown", (e) => {
  if (!isGameOver) {
    switch (e.key) {
      case "1":
        document.querySelector(`.rock-button`).click();
        playSound("click-sound");
        break;
      case "2":
        document.querySelector(`.paper-button`).click();
        playSound("click-sound");
        break;
      case "3":
        document.querySelector(`.scissors-button`).click();
        playSound("click-sound");
        break;
    }
  }
});
