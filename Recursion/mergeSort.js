const mergeSort = (arr) => {
  if (arr.length === 1) return arr;
  let mid = arr.length / 2;
  let resultArr = [];
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));

  let i = 0;
  let j = 0;

  while (i < left.length || j < right.length) {
    if (i >= left.length) {
      resultArr.push(right[j]);
      j++;
      continue;
    }
    if (j >= right.length) {
      resultArr.push(left[i]);
      i++;
      continue;
    }

    if (left[i] < right[j]) {
      resultArr.push(left[i]);
      i++;
    } else {
      resultArr.push(right[j]);
      j++;
    }
  }
  return resultArr;
};

// Test case
const testArr1 = [4, 1, 3, 9, 7];
const testArr2 = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
const testArr3 = [12, 12, 23, 4, 6, 6, 10, -35, 28];

console.log(mergeSort(testArr1)); // Expect [ 1, 3, 4, 7, 9 ]
console.log(mergeSort(testArr2)); // Expect [1, 2, 3, 4,  5, 6, 7, 8, 9, 10 ]
console.log(mergeSort(testArr3)); // Expect [-35,  4,  6,  6, 10, 12, 12, 23, 28]
