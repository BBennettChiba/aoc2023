import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => {
    const [card, numbers] = line.split(":");
    const [winningNums, nums] = numbers.split("|");
    return {
      card: Number(card.replace("Card", "").trim()),
      winningNums: winningNums.match(/.../g)!.map(Number),
      nums: nums.match(/.../g)!.map(Number),
    };
  });

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let total = 0;
  for (const { card, winningNums, nums } of input) {
    let numOfWins = -1;
    for (const winningNum of winningNums) {
      if (nums.includes(winningNum)) numOfWins++;
    }
    if (numOfWins >= 0) total += 2 ** numOfWins;
  }
  return total;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let file = input.map((card) => ({ ...card, copies: 1 }));
  for (const { card, winningNums, nums, copies } of file) {
    for (let i = 0; i < copies; i++) {
      let numOfCopies = 0;
      for (const winningNum of winningNums) {
        if (nums.includes(winningNum)) numOfCopies++;
      }
      file = file.map((futureCard) => {
        if (futureCard.card > card && futureCard.card <= card + numOfCopies)
          futureCard.copies++;
        return futureCard;
      });
    }
  }
  return file.reduce((acc, curr) => acc + curr.copies, 0);
};

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
