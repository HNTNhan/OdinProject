// const capitalize = (str) => {
//   let tempStr = str[0].toUpperCase();
//   for (let i = 1; i < str.length; i++) {
//     tempStr += str[i];
//   }
//   return tempStr;
// };

const capitalize = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};

const reverseString = (str) => {
  if (str.length == 0) return "";
  return str[str.length - 1] + reverseString(str.slice(0, str.length - 1));
};

const caculator = {
  add(n1, n2) {
    return n1 + n2;
  },
  subtract(n1, n2) {
    return n1 - n2;
  },
  divide(n1, n2) {
    if (n2 === 0) return "Invalid Input!";
    return n1 / n2;
  },
  multiply(n1, n2) {
    return n1 * n2;
  },
};

const caesarCipher = (str, shift) => {
  if (shift < 0) return "Shift too small!";
  if (shift > 25) return "Shift too large!";
  let shiftStr = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === " ") {
      shiftStr += " ";
      continue;
    }
    const temp = str.charCodeAt(i);
    if (temp < 97 || temp > 122) return "Invalid String!";
    shiftStr += String.fromCharCode(((temp - 97 + shift) % 26) + 97);
  }
  return shiftStr;
};

const analyzeArray = (arr) => {
  if (!Array.isArray(arr)) return "Input was not a array!";
  if (!arr.length) return "Array was empty!";
  let average = arr[0];
  let min = arr[0];
  let max = arr[0];
  let length = arr.length;
  for (let i = 1; i < length; i++) {
    if (isNaN(arr[i])) return "Input was not a array of number!";
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
    average = average + arr[i];
  }

  return {
    average: average / length,
    min,
    max,
    length,
  };
};

module.exports = {
  capitalize,
  reverseString,
  caculator,
  caesarCipher,
  analyzeArray,
};
