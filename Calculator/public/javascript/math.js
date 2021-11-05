function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function multiply10(num1, num2) {
  return num1 * 10 ** num2;
}

function pow(num1, num2) {
  return num1 ** num2;
}

function sqrt(num1, num2) {
  if (num1) return num1 * Math.sqrt(num2);
  else return Math.sqrt(num2);
}

function modulus(num1, num2) {
  return num1 % num2;
}

function caculateFactorial(num) {
  if (num === 0) return 1;
  return caculateFactorial(num - 1) * num;
}

function factorial(num1, num2) {
  if (num2) return caculateFactorial(num1) * num2;
  return caculateFactorial(num1);
}

function logarithm(num1, num2) {
  if (num1) return num1 * Math.log10(num2);
  return Math.log10(num2);
}

export function operator(num1, num2, operator) {
  switch (operator) {
    case "+":
      return add(num1, num2);
    case "-":
      return subtract(num1, num2);
    case "*":
      return multiply(num1, num2);
    case "/":
      return divide(num1, num2);
    case "x10":
      return multiply10(num1, num2);
    case "Pow":
      return pow(num1, num2);
    case "Sqrt":
      return sqrt(num1, num2);
    case "%":
      return modulus(num1, num2);
    case "!":
      return factorial(num1, num2);
    case "log":
      return logarithm(num1, num2);
  }
}
