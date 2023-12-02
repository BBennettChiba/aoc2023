import run from "aocrunner";

const validDigits = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
} as const;

type ValidDigits = keyof typeof validDigits;

function isValid(digit: string): asserts digit is ValidDigits {
  if (!(digit in validDigits) && isNaN(Number(digit)))
    throw new Error(`Invalid`);
}

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  return parseInput(rawInput)
    .map((line) => line.replace(/\D/g, "").split(""))
    .map((nums) => Number([nums.at(0), nums.at(-1)].join("")))
    .reduce((acc, num) => acc + num);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let total = 0;
  for (let line of input) {
    const exp = "";
    const reg = new RegExp(/(one|two|three|four|five|six|seven|eight|nine|\d)/);
    const revReg = new RegExp(
      /(\d|enin|thgie|neves|xis|evif|xuof|eerht|owt|eno)/,
    );
    const matchWord = line.match(reg);
    const matchRev = line.split("").reverse().join("").match(revReg);
    let firstString = matchWord?.at(0)!;
    const lastString = matchRev?.at(0)!;
    isValid(firstString);
    isValid(lastString);
    const firstNum = validDigits[firstString];
    const secondNum = validDigits[lastString];
    const number = Number([firstNum, secondNum].join(""));
    total += number;
  }
  return total;
};

run({
  part1: {
    tests: [
      {
        input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
