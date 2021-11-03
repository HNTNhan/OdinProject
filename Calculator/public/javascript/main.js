const buttons = [
  ["(", ")", "%", "DEL", "AC"],
  ["7", "8", "9", "Pow", "Sqrt"],
  ["4", "5", "6", "x", "&divide;"],
  ["1", "2", "3", "+", "-"],
  ["0", ".", "x10", "Ans", "="],
];

const buttonSection = document.querySelector(".button-section");

let expression;

for (let row of buttons) {
  const rowElement = document.createElement("div");
  rowElement.classList.add("row-buttons");

  for (let button of row) {
    const buttonElement = document.createElement("button");

    if (!Number.isNaN(+button)) buttonElement.classList.add("number-button");

    if (button === "=") buttonElement.classList.add("equal-button");

    if (button === "DEL") buttonElement.classList.add("del-button");

    if (button === "AC") buttonElement.classList.add("ac-button");

    buttonElement.setAttribute("data-type", button);
    buttonElement.classList.add("button");
    buttonElement.innerHTML = button;
    rowElement.appendChild(buttonElement);
  }
  buttonSection.appendChild(rowElement);
}
