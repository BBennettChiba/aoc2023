import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => {
    const [hand, bid] = line.split(" ");
    return { hand, bid: parseInt(bid) };
  });

const cardConversion = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
  9: 8,
  T: 9,
  J: 10,
  Q: 11,
  K: 12,
  A: 13,
};

const is3OfAKindOrTwoPair = (hand: Map<string, number>) => {
  for (const [key, val] of hand) {
    if (val === 3) return 4;
    if (val === 2) return 3;
  }
  throw new Error("not good");
};
const is4ofAKindorFullHouse = (hand: Map<string, number>) => {
  for (const [_, val] of hand) {
    if (val === 4) return 6;
    if (val === 3) return 5;
  }
  throw new Error("not good");
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let withDistinct = input.map((hand) => ({ ...hand, score: 0 }));
  for (const thing of withDistinct) {
    const { hand } = thing;
    const howMany = new Map(
      hand.split("").map((s, i, a) => [s, a.filter((x) => x === s).length]),
    );
    if (howMany.size === 5) {
      thing.score = 1;
    }
    if (howMany.size === 4) {
      thing.score = 2;
    }
    if (howMany.size === 3) {
      thing.score = is3OfAKindOrTwoPair(howMany);
    }
    if (howMany.size === 2) {
      thing.score = is4ofAKindorFullHouse(howMany);
    }
    if (howMany.size === 1) {
      thing.score = 7;
    }
  }
  withDistinct.sort((a, b) => {
    if (a.score === b.score) {
      for (let i = 0; i < a.hand.length; i++) {
        const aLetter = cardConversion[a.hand[i]];
        const bLetter = cardConversion[b.hand[i]];
        if (aLetter === bLetter) continue;
        return aLetter - bLetter;
      }
    }
    return a.score - b.score;
  });
  return withDistinct.map((d, i) => d.bid * (i + 1)).reduce((a, b) => a + b, 0);
};

const replaceJokers = (hand: string) => {
  if (!hand.includes("J")) return hand;
  const howMany = new Map(
    hand.split("").map((s, i, a) => [s, a.filter((x) => x === s).length]),
  );
  if (howMany.size === 5) {
    let highest = ["1", 0];
    for (const card of hand.split("")) {
      if (cardConversion[card] > highest[1])
        highest = [card, cardConversion[card]];
    }
    return hand.replace(/J/g, highest[0]);
  }
  let [key, val] = [...howMany.entries()].reduce(
    (acc, entry) => {
      if (entry[0] === "J") return acc;
      return entry[1] > acc[1] ? entry : acc;
    },
    ["2", 0],
  );
  if (key === "J") throw new Error(`channot handle hand ${hand} key is ${key}`);
  return hand.replace(/J/g, key.toString());
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let withDistinct = input.map(({ hand, bid }) => ({
    hand,
    score: 0,
    bid,
    replacedHand: hand,
  }));
  for (let thing of withDistinct) {
    thing.replacedHand = replaceJokers(thing.hand);
    const howMany = new Map(
      thing.replacedHand
        .split("")
        .map((s, i, a) => [s, a.filter((x) => x === s).length]),
    );
    if (howMany.size === 5) {
      thing.score = 1;
    }
    if (howMany.size === 4) {
      thing.score = 2;
    }
    if (howMany.size === 3) {
      thing.score = is3OfAKindOrTwoPair(howMany);
    }
    if (howMany.size === 2) {
      thing.score = is4ofAKindorFullHouse(howMany);
    }
    if (howMany.size === 1) {
      thing.score = 7;
    }
  }
  withDistinct.sort((a, b) => {
    if (a.score === b.score) {
      for (let i = 0; i < a.hand.length; i++) {
        let jokerReplacedA = a.hand.replace(/J/g, '1');
        let jokerReplacedB = b.hand.replace(/J/g, '1');
        const aLetter = cardConversion[jokerReplacedA[i]];
        const bLetter = cardConversion[jokerReplacedB[i]];
        if (aLetter === bLetter) continue;
        return aLetter - bLetter;
      }
    }
    return a.score - b.score;
  });
  return withDistinct.map((d, i) => d.bid * (i + 1)).reduce((a, b) => a + b, 0);
};

run({
  part1: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,

        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
