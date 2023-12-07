import run from "aocrunner";

const parseInput = (rawInput: string, part: 1 | 2) => {
  const input = rawInput.split("\n").map((l) => l.split(/\s+/).slice(1));
  const [times, distances] = input;
  if (part === 1) {
    let races = [];
    for (let i = 0; i < times.length; i++) {
      const time = parseInt(times[i]);
      const distance = parseInt(distances[i]);
      races.push({ time, distance });
    }

    return races;
  }
  return {
    time: parseInt(times.join("")),
    distance: parseInt(distances.join("")),
  };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput, 1);
  let product = 1;
  for (const race of input) {
    let total = 0;
    for (let secondsPushed = 0; secondsPushed < race.time; secondsPushed++) {
      const totalDistance = (race.time - secondsPushed) * secondsPushed;
      if (totalDistance > race.distance) total++;
    }
    product *= total;
  }
  return product;
};

const part2 = (rawInput: string) => {
  const race = parseInput(rawInput, 2);
  let total = 0;
  for (let secondsPushed = 0; secondsPushed < race.time; secondsPushed++) {
    const totalDistance = (race.time - secondsPushed) * secondsPushed;
    if (totalDistance > race.distance) total++;
  }
  return total
};

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
