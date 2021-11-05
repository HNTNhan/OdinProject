import { operator } from "./math.js";

const buttons = [
  ["log", "!", "%", "DEL", "AC"],
  ["7", "8", "9", "Pow", "Sqrt"],
  ["4", "5", "6", "&times;", "&divide;"],
  ["1", "2", "3", "+", "&minus;"],
  ["0", ".", "x10", "Ans", "="],
];

const buttonSection = document.querySelector(".button-section");
const showContent = document.querySelector(".content");
const previousResult = document.querySelector(".previous-result");

let expression = "";
let sign = "";
let result;

function replaceHTMLSign(str) {
  return str
    .replace(/[*]/g, " &times; ")
    .replace(/[/]/g, " &divide; ")
    .replace(/[+]/g, " + ")
    .replace(/[-]/g, " - ")
    .replace(/x10/g, "<small>&times;10</small>")
    .replace(/Pow([0-9-.]*)/g, `<sup style="border:1px solid black">$1</sup>`)
    .replace(/^Sqrt/g, `&Sqrt;`)
    .replace(/Sqrt([0-9.-]*)$/g, `&times;&Sqrt;$1`)
    .replace(/!([0-9-.]+)$/g, `! &times; $1`)
    .replace(/^log([0-9-.]*)/g, `log($1)`)
    .replace(/log([0-9.-]*)$/g, ` &times; log($1)`);
}

function checkSign(signSelected) {
  if (expression === "") {
    if (signSelected === "Sqrt" || "log") return "sqrt";
    else if (signSelected !== "-") return "unchange";
    else return "minus";
  } else {
    if (sign !== "") {
      if (expression.slice(expression.length - sign.length) === sign) {
        if (signSelected === "-") return "minus";
        else if (checkSign !== sign) return "replace";
        else return "unchange";
      } else return "calculate";
    } else if (expression[0] === "-" && expression.length === 1)
      return "unchange";
  }
  return "add";
}

function calculate() {
  let num1 = expression.match(/^[-]*[0-9.]*/)[0];
  let num2;
  if (sign === "-") {
    if (expression.match(/-{2}[0-9.]*$/)) {
      num2 = expression.match(/-{2}[0-9.]*$/)[0].slice(1);
    } else num2 = expression.match(/[0-9.]*$/)[0];
  } else if (sign !== "x10") num2 = expression.match(/[-0-9.]*$/)[0];
  else num2 = expression.match(/x10[0-9.]*$/)[0].slice(3) || 1;

  if (num2 === "") {
    if (["+", "-"].includes(expression[expression.length - 1])) num2 = 0;
    else num2 = 1;
  }
  if (Number.isNaN(+num1) || Number.isNaN(+num2)) return "Error";

  let result = operator(+num1, +num2, sign);
  let decimal = result.toString().match(/[.][0-9]*$/);

  if (decimal && decimal[0].length > 12)
    return (+result.toFixed(11)).toString();

  if (result.toString().length > 30)
    result = Number.parseFloat(result).toExponential(5);

  return result.toString();
}

function changeExpression(type, signSelected) {
  switch (type) {
    case "replace":
      expression = expression.slice(0, -sign.length) + signSelected;
      sign = signSelected;
      break;
    case "add":
      expression += signSelected;
      sign = signSelected;
      break;
    case "calculate":
      expression = calculate() + signSelected;
      sign = signSelected;
      break;
    case "minus":
      expression += signSelected;
      break;
    case "sqrt":
      expression += signSelected;
      sign = signSelected;
      break;
  }
  console.log(signSelected, type);
  showContent.innerHTML = replaceHTMLSign(expression);
}

function addButtonEventListener(buttonElement, content) {
  if (!Number.isNaN(+content)) {
    buttonElement.classList.add("number-button");
    buttonElement.addEventListener("click", (e) => {
      expression += e.target.innerHTML;
      showContent.innerHTML = replaceHTMLSign(expression);
    });
  }
  switch (content) {
    case "=":
      buttonElement.classList.add("equal-button");
      buttonElement.addEventListener("click", (e) => {
        if (sign === "") {
          result = expression;
        } else {
          expression = calculate();
          result = expression;
          sign = "";
        }
        previousResult.innerHTML = "Ans=" + result;
        showContent.innerHTML = replaceHTMLSign(expression);
      });
      break;
    case "Ans":
      buttonElement.addEventListener("click", (e) => {
        if (result) {
          if (expression === "") expression = result;
          else if (expression[expression.length - 1] === sign)
            expression += result;
        }
        showContent.innerHTML = replaceHTMLSign(expression);
      });
      break;
    case "DEL":
      buttonElement.classList.add("del-button");
      buttonElement.addEventListener("click", (e) => {
        if (
          sign !== "" &&
          expression.slice(expression.length - sign.length) === sign
        )
          expression = expression.slice(0, -sign.length);
        else expression = expression.slice(0, -1);
        showContent.innerHTML = replaceHTMLSign(expression);
      });
      break;
    case "AC":
      buttonElement.classList.add("ac-button");
      buttonElement.addEventListener("click", (e) => {
        expression = "";
        sign = "";
        showContent.innerHTML = expression;
      });
      break;
    case "+":
      buttonElement.addEventListener("click", (e) => {
        changeExpression(checkSign("+"), "+");
      });
      break;
    case "&minus;":
      buttonElement.addEventListener("click", (e) => {
        if (!expression.match(/[-]/g) || expression.match(/[-]/g).length < 3)
          changeExpression(checkSign("-"), "-");
      });
      break;
    case "&times;":
      buttonElement.addEventListener("click", (e) => {
        changeExpression(checkSign("*"), "*");
      });
      break;
    case "&divide;":
      buttonElement.addEventListener("click", (e) => {
        changeExpression(checkSign("/"), "/");
      });
      break;
    case "x10":
      buttonElement.addEventListener("click", (e) => {
        changeExpression(checkSign("x10"), "x10");
      });
      break;
    case ".":
      buttonElement.addEventListener("click", (e) => {
        if (sign === "") {
          if (expression.indexOf(".") === -1) expression += ".";
        } else {
          if (expression.slice(expression.indexOf(sign)).indexOf(".") === -1)
            expression += ".";
        }
        showContent.innerHTML = replaceHTMLSign(expression);
      });
      break;
    case "Pow":
      buttonElement.addEventListener("click", (e) => {
        changeExpression(checkSign("Pow"), "Pow");
      });
      break;
    case "Sqrt":
      buttonElement.addEventListener("click", (e) => {
        changeExpression(checkSign("Sqrt"), "Sqrt");
      });
      break;
    case "%":
      buttonElement.addEventListener("click", (e) => {
        changeExpression(checkSign("%"), "%");
      });
      break;
    case "!":
      buttonElement.addEventListener("click", (e) => {
        changeExpression(checkSign("!"), "!");
      });
      break;
    case "log":
      buttonElement.addEventListener("click", (e) => {
        changeExpression(checkSign("log"), "log");
      });
      break;
  }
}

for (let row of buttons) {
  const rowElement = document.createElement("div");
  rowElement.classList.add("row-buttons");

  for (let content of row) {
    const buttonElement = document.createElement("button");

    addButtonEventListener(buttonElement, content);

    buttonElement.setAttribute("data-type", content);
    buttonElement.classList.add("button");
    buttonElement.innerHTML = content;

    if (content === "Pow") buttonElement.innerHTML = "x<sup>y</sup>";
    if (content === "Sqrt") buttonElement.innerHTML = "&Sqrt;x";
    if (content === "!") buttonElement.innerHTML = "x!";
    if (content === "log") buttonElement.innerHTML = "log(x)";

    rowElement.appendChild(buttonElement);
  }
  buttonSection.appendChild(rowElement);
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "0":
      e.preventDefault();
      document.querySelector(`.button[data-type="${e.key}"]`).click();
      break;
    case "+":
      e.preventDefault();
      document.querySelector(`.button[data-type="+"]`).click();
      break;
    case "-":
      e.preventDefault();
      document.querySelector(`.button[data-type="&minus;"]`).click();
      break;
    case "*":
      e.preventDefault();
      document.querySelector(`.button[data-type="&times;"]`).click();
      break;
    case "/":
      e.preventDefault();
      document.querySelector(`.button[data-type="&divide;"]`).click();
      break;
    case "Enter":
      e.preventDefault();
      document.querySelector(`.button[data-type="="]`).click();
      break;
    case "Backspace":
      e.preventDefault();
      document.querySelector(`.button[data-type="DEL"]`).click();
      break;
    case "Delete":
      e.preventDefault();
      document.querySelector(`.button[data-type="AC"]`).click();
      break;
  }
});

// Test
function test(expTest, signTest, resultTest) {
  expression = expTest;
  sign = signTest;
  console.log(
    "expression:" + expression,
    "sign:" + sign,
    "result:" + (calculate() === resultTest)
  );
}

// Add
console.group("Test Add");
test("0+0", "+", "0");
test("2+2", "+", "4");
test("2+6", "+", "8");
console.groupEnd();

//subtract
console.group("Test Subtract");
test("-6--3", "-", "-3");
test("10-4", "-", "6");
test("-20-5", "-", "-25");
console.groupEnd();

//multiply
console.group("Test Multiply");
test("2*4", "*", "8");
test("-5*8", "*", "-40");
test("-20*0", "*", "0");
test("-0*0", "*", "0");
console.groupEnd();

//divide
console.group("Test Divide");
test("22/4", "/", "5.5");
test("10/3", "/", "3.33333333333");
test("21/-7", "/", "-3");
test("10/0", "/", "Infinity");
test("0/-10", "/", "0");
console.groupEnd();

//multiply 10
console.group("Test Multiply 10");
test("5x10", "x10", "50");
test("3x105", "x10", "300000");
test("-3x102", "x10", "-300");
console.groupEnd();

expression = "";
sign = "";
