import run from "aocrunner";

const MAX = {
  red: 12,
  green: 13,
  blue: 14,
};

const colors = ["red", "green", "blue"] as const;
type Color = (typeof colors)[number];

function isValid(string: string): asserts string is Color {
  if (string === "red" || string === "green" || string === "blue")
    throw new Error("invalid color");
}

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => {
    const split = line.split(":");
    const game = Number(split[0].replace("Game ", ""));
    const rounds = split[1].split(";").map((round) =>
      round.split(",").map((r) => {
        const [number, color] = r.trim().split(" ");
        return { number: Number(number), color };
      }),
    );
    return { game, rounds };
  });

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let sumOfPossibleGames = 0;
  for (const game of input) {
    let possible = true;
    for (const round of game.rounds) {
      for (const { number, color } of round) {
        isValid(color);
        if (MAX[color] < number) possible = false;
      }
    }
    if (possible) sumOfPossibleGames += game.game;
  }
  return sumOfPossibleGames;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let sum = 0;
  for (const game of input) {
    const max = {
      red: 0,
      green: 0,
      blue: 0,
    };
    for (const round of game.rounds) {
      for (const { number, color } of round) {
        isValid(color);
        if (number > max[color]) max[color] = number;
      }
    }
    sum += max.red * max.green * max.blue;
  }
  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
