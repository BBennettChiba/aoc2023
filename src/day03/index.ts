import run from "aocrunner";

const isDigit = (string: string) => /\d/.test(string);

const getDigitLength = (line: string[]) => {
  for (let i = 0; i < line.length; i++) {
    if (!isDigit(line[i])) return i;
  }
  return line.length;
};

const getAroundDigits = (
  input: string[][],
  length: number,
  y: number,
  x: number,
) => {
  const yMinusOne = y === 0 ? 0 : y - 1;
  const yPlusOne = y === input.length ? y : y + 2;
  const xMinusOne = x === 0 ? 0 : x - 1;
  const xPlusLength = x + length + 1;
  return input
    .slice(yMinusOne, yPlusOne)
    .map((row) => row.slice(xMinusOne, xPlusLength));
};

const checkForPart = (input: string[][]) => {
  for (const col of input) {
    for (const row of col) {
      if (!isDigit(row) && row !== ".") return true;
    }
  }
  return false;
};

const getDigits = (input: string[][], y: number, x: number) => {
  const row = input[y];
  let left = x;
  while (left > 0 || row[left - 1] === ".") {
    left--;
  }
  const len = getDigitLength(row.slice(left));
  return Number(row.slice(left, left + len).join(""));
};

const getTwoDigits = (fullInput: string[][], y: number, x: number) => {
  let totalDigits = [];
  let yStart = y === 0 ? 0 : y - 1;
  let yEnd = y === fullInput.length - 1 ? fullInput.length - 1 : y + 2;
  let xStart = x === 0 ? 0 : x - 1;
  let xEnd = x === fullInput[0].length - 1 ? fullInput[0].length - 1 : x + 2;
  console.log(fullInput.slice(yStart, yEnd))
  for (let i = yStart; i <= yEnd; i++) {
    const col = fullInput[i];
    for (let j = xStart; j <= xEnd; j++) {
      const cell = col[j];
      if (isDigit(cell)) {
        const digits = getDigits(fullInput, i, j);
        console.log(digits)
      }
    }
  }
};

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((l) => l.split(""));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let total = 0;
  for (let i = 0; i < input.length; i++) {
    const line = input[i];
    for (let j = 0; j < line.length; j++) {
      const cell = line[j];
      if (isDigit(cell)) {
        const len = getDigitLength(line.slice(j));
        const surrounding = getAroundDigits(input, len, i, j);
        const isLegit = checkForPart(surrounding);
        const number = Number(line.slice(j, j + len).join(""));
        if (isLegit) total += number;
        j += len;
      }
    }
  }
  return total;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let total = 0;
  for (let i = 0; i < input.length; i++) {
    const line = input[i];
    for (let j = 0; j < line.length; j++) {
      const cell = line[j];
      if (cell === "*") {
        getTwoDigits(input, i, j);
      }
    }
  }

  return;
};

run({
  part1: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
