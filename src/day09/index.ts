import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(" ").map(Number));

const differences = (history: number[]) => {
  return history.slice(1).map((num, i) => num - history[i]);
};
const predictNext = (history: number[]): number => {
  if (history.every((num) => num === 0)) return 0;
  return history[history.length - 1] + predictNext(differences(history));
};

const sum = (history: number[]): number =>
  history.reduce((acc, num) => num + acc, 0);

const reverse = (history: number[]): number => {
  if (history.every((num) => num === 0)) return 0;
  return history[0] - reverse(differences(history));
};

const part1 = (rawInput: string) => sum(parseInput(rawInput).map(predictNext));

const part2 = (rawInput: string) => sum(parseInput(rawInput).map(reverse));

run({
  part1: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
