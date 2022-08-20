/* eslint-disable no-undef */
import { capitalize, reverseString, caculator, caesarCipher, analyzeArray } from "./basic";

describe("Capitalize", () => {
  test("Capitalize first charecter of 'hello world!'", () => {
    expect(capitalize("hello world!")).toBe("Hello world!");
  });
});

describe("Reverse String", () => {
  test("Reverse string 'Hello World!' to '!dlroW olleH'", () => {
    expect(reverseString("Hello World!")).toBe("!dlroW olleH");
  });
});

describe("Calculator", () => {
  test("Function add of caculator object: 10 + 5 to equal 15", () => {
    expect(caculator.add(10, 5)).toBe(15);
  });

  test("Function subtract of caculator object: 10 - 5 to equal 5", () => {
    expect(caculator.subtract(10, 5)).toBe(5);
  });

  test("Function divide of caculator object: 10 / 5 to equal 2", () => {
    expect(caculator.divide(10, 5)).toBe(2);
  });

  test("Function divide of caculator object: 10 / 0 notify Invalid Input!", () => {
    expect(caculator.divide(10, 0)).toBe("Invalid Input!");
  });

  test("Function multiply of caculator object: 10 * 5 to equal 50", () => {
    expect(caculator.multiply(10, 5)).toBe(50);
  });
});

describe("Caesar Cipher", () => {
  test("Caesar Cipher, shift = 5, convert string 'testing' to 'yjxynsi'", () => {
    expect(caesarCipher("testing", 5)).toBe("yjxynsl");
  });

  test("Caesar Cipher, shift = 25, convert string 'testing practice' to 'sdrshmf oqzbshbd'", () => {
    expect(caesarCipher("testing practice", 25)).toBe("sdrshmf oqzbshbd");
  });

  test("Caesar Cipher, shift = 5, convert string 'testing!' show 'Invalid String!'", () => {
    expect(caesarCipher("testing!", 5)).toBe("Invalid String!");
  });

  test("Caesar Cipher, shift = 30, convert string 'testing' show 'Shift too large!'", () => {
    expect(caesarCipher("testing", 30)).toBe("Shift too large!");
  });

  test("Caesar Cipher, shift = -1, convert string 'testing' show 'Shift too small!'", () => {
    expect(caesarCipher("testing", -1)).toBe("Shift too small!");
  });
});

describe("Analyze Array", () => {
  test("Input is not a array", () => {
    expect(analyzeArray({ array: [1, 2, 3] })).toBe("Input was not a array!");
  });
  test("Input is not a array of number", () => {
    expect(analyzeArray([1, 2, 3, "Hello"])).toBe("Input was not a array of number!");
  });
  test("Input is not a array of number", () => {
    expect(analyzeArray([])).toBe("Array was empty!");
  });
  test("[1,8,3,4,2,6] has average: 4, min: 1, max: 8, length: 6", () => {
    expect(analyzeArray([1, 8, 3, 4, 2, 6])).toStrictEqual({
      average: 4,
      min: 1,
      max: 8,
      length: 6,
    });
  });
});
