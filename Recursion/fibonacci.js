// Use loop
const fibs = (n) => {
  if (n <= 0) return [];
  let arr = [0];
  let n1 = 1;
  let n2 = 0;

  for (let i = 2; i <= n; i++) {
    arr.push(n1);
    let next = n1 + n2;
    n2 = n1;
    n1 = next;
  }

  return arr;
};

const fibsRec = (n) => {
  if (n < 1) return [];
  if (n < 2) return [0];
  if (n < 3) return [0, 1];

  const arr = fibsRec(n - 1);

  arr.push(arr[n - 2] + arr[n - 3]);

  return arr;
};

// Test case
console.log("\nLoop");
console.log(fibs(8), "// Expect [0, 1, 1, 2, 3, 5, 8, 13]");
console.log(fibs(-1), "// Expect []");
console.log(fibs(1), "// Expect [0]");

console.log("\nRecursion");
console.log(fibsRec(8), "// Expect [0, 1, 1, 2, 3, 5, 8, 13]");
console.log(fibsRec(-1), "// Expect []");
console.log(fibsRec(1), "// Expect [0]");
