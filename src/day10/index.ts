import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""));

type FromDirection = "U" | "D" | "L" | "R";
type Coords = [number, number];

const lookupTable = {
  "|": (dir: FromDirection, [y, x]: Coords) => {
    switch (dir) {
      case "U":
        return [y + 1, x];
      case "D":
        return [y - 1, x];
      default:
        return null;
    }
  },
  "-": (dir: FromDirection, [y, x]: Coords) => {
    switch (dir) {
      case "L":
        return [y, x + 1];
      case "R":
        return [y, x - 1];
      default:
        return null;
    }
  },
  L: (dir: FromDirection, [y, x]: Coords) => {
    switch (dir) {
      case "U":
        return [y + 1, x + 1];
      case "R":
        return [y - 1, x - 1];
      default:
        return null;
    }
  },
  J: (dir: FromDirection, [y, x]: Coords) => {
    switch (dir) {
      case "U":
        return [y + 1, x - 1];
      case "L":
        return [y - 1, x + 1];
      default:
        return null;
    }
  },
  "7": (dir: FromDirection, [y, x]: Coords) => {
    switch (dir) {
      case "D":
        return [y - 1, x - 1];
      case "L":
        return [y + 1, x + 1];
      default:
        return null;
    }
  },
  F: (dir: FromDirection, [y, x]: Coords) => {
    switch (dir) {
      case "D":
        return [y - 1, x + 1];
      case "R":
        return [y + 1, x - 1];
      default:
        return null;
    }
  },
  ".": (dir: FromDirection, [y, x]: Coords) => {
    return null;
  },
  S: (dir: FromDirection, [y, x]: Coords) => {
    return "START";
  },
};

const searchAround = ([y, x]: Coords, map: string[][]) => {
  const up = { coords: [y - 1, x], fromDir: "D" };
  const right = { coords: [y, x + 1], fromDir: "L" };
  const down = { coords: [y + 1, x], fromDir: "U" };
  const left = { coords: [y, x - 1], fromDir: "R" };
  const dirs = [up, right, down, left];
  for (const { coords, fromDir } of dirs) {
    const [dirY, dirX] = coords;
    const spot = map[dirY][dirX];
    if (!spot) continue;
    const next = lookupTable[spot](fromDir, coords);
    if (next) {
      map[y][x] = ".";
      return next;
    }
    if (!next) map[dirY][dirX] = ".";
  }
  throw new Error("something went wrong");
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const start = input.reduce(
    (acc, curr, ind) => {
      for (let i = 0; i < curr.length; i++) {
        const cell = curr[i];
        if (cell === "S") return [ind, i];
      }
      return acc;
    },
    [0, 0],
  ) as [number, number];

  let current = start;
  while (true) {
    current = searchAround(current, input);
    const currentCell = input[current[0]][current[1]];
    console.log(currentCell);
    if (currentCell === "S") break;
  }
  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `.....
.S-7.
.|.|.
.L-J.
.....`,
        expected: 4,
      },
      {
        input: `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
