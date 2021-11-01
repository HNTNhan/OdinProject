const main = document.querySelector("main");
const newGameButton = document.querySelector(".new-game");
const colorInput = document.querySelector("#color");
const opacityInput = document.querySelector("#opacity");
const sizeInput = document.querySelector("#size");

let size = 16;
let color = "#04d4f0";
let opacity = 0.2;

function hexToDec(hex) {
  return `rgb(${parseInt(hex[1] + hex[2], 16)}, ${parseInt(
    hex[3] + hex[4],
    16
  )}, ${parseInt(hex[5] + hex[6], 16)})`;
}

function changeBackgroundColor(e) {
  if (e.target.style.backgroundColor !== hexToDec(color)) {
    e.target.style.opacity = opacity;
  } else {
    e.target.style.opacity = +e.target.style.opacity + opacity;
  }
  e.target.style.backgroundColor = color;

  e.target.style.opacity =
    e.target.style.opacity > 1 ? 1 : e.target.style.opacity;
}

function removeChild(parentNode) {
  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.lastChild);
  }
}

function changeSize(e) {
  if (+e.target.value > 50) {
    e.target.value = 50;
    size = 50;
  } else if (+e.target.value < 1) {
    e.target.value = 1;
    size = 1;
  } else {
    size = +e.target.value;
  }
}

function changeColor(e) {
  color = e.target.value;
}

function changeOpacity(e) {
  opacity = +document.querySelector("#opacity").value;
}

function startNewGame() {
  size = document.querySelector("#size").value ** 2;

  removeChild(main);

  initGameBoard();

  document.querySelectorAll(".square").forEach((square) => {
    square.style.backgroundColor = "";
  });
}

function initGameBoard() {
  for (let i = 1; i <= size; i++) {
    const square = document.createElement("div");
    square.style.flex = `1 1 ${100 / Math.sqrt(size)}%`;
    square.style.height = 0;
    square.style.paddingTop = `${100 / Math.sqrt(size)}%`;
    square.style.border = "1px solid black";
    square.classList.add("square");

    square.addEventListener("mouseover", changeBackgroundColor);

    main.appendChild(square);
  }
}

newGameButton.addEventListener("click", startNewGame);
colorInput.addEventListener("change", changeColor);
opacityInput.addEventListener("change", changeOpacity);
sizeInput.addEventListener("change", changeSize);

startNewGame();
