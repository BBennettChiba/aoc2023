import run from "aocrunner";
import { isFunction } from "util";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => {
    const [hand, bid] = line.split(" ");
    return { hand, bid: parseInt(bid) };
  });

const cardConversion = {
  "2": 1,
  "3": 2,
  "4": 3,
  "5": 4,
  "6": 5,
  "7": 6,
  "8": 7,
  "9": 8,
  T: 9,
  J: 10,
  Q: 11,
  K: 12,
  A: 13,
};

type Card = keyof typeof cardConversion;

function isSafe(char: string): asserts char is Card {}

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
        const handAtA = a.hand[i];
        const handAtB = b.hand[i];
        isSafe(handAtA);
        isSafe(handAtB);
        const aLetter = cardConversion[handAtA];
        const bLetter = cardConversion[handAtB];
        if (aLetter === bLetter) continue;
        return aLetter - bLetter;
      }
    }
    return a.score - b.score;
  });
  return withDistinct.map((d, i) => d.bid * (i + 1)).reduce((a, b) => a + b, 0);
};

const RANK = {
  "High card": 1,
  "One pair": 2,
  "Two pair": 3,
  "Three of a kind": 4,
  "Full house": 5,
  "Four of a kind": 6,
  "Five of a kind": 7,
} as const;

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let withRank = input.map(({ hand, bid }) => ({
    hand,
    rank: 0,
    bid,
  }));

  for (let thing of withRank) {
    const { hand } = thing;
    const howMany = new Map(
      hand.split("").map((s, i, a) => [s, a.filter((x) => x === s).length]),
    );
    if (!howMany.get("J")) {
      if (howMany.size === 5) {
        thing.rank = RANK["High card"];
      }
      if (howMany.size === 4) {
        thing.rank = RANK["One pair"];
      }
      if (howMany.size === 3) {
        thing.rank = is3OfAKindOrTwoPair(howMany);
      }
      if (howMany.size === 2) {
        thing.rank = is4ofAKindorFullHouse(howMany);
      }
      if (howMany.size === 1) {
        thing.rank = RANK["Five of a kind"];
      }
    } else if (howMany.get("J") === 1) {
      // console.log(howMany.size, hand, howMany);
      if (howMany.size === 2) {
        // console.log("five of a kind");
        thing.rank = RANK["Five of a kind"];
      } else if (howMany.size === 3) {
        let isFourOfAKind = false;
        for (const [_, val] of howMany) {
          if (val === 3) isFourOfAKind = true;
        }
        if (isFourOfAKind) thing.rank = RANK["Four of a kind"];
        else thing.rank = RANK["Full house"];
      } else if (howMany.size === 4) {
        thing.rank = RANK["Three of a kind"];
      } else {
        thing.rank = RANK["One pair"];
      }
    } else if (howMany.get("J") === 2) {
      if (howMany.size === 2) {
        thing.rank = RANK["Five of a kind"];
      } else if (howMany.size === 3) {
        thing.rank = RANK["Four of a kind"];
      } else {
        thing.rank = RANK["Three of a kind"];
      }
    } else if (howMany.get("J") === 3) {
      if (howMany.size === 2) {
        thing.rank = RANK["Five of a kind"];
      } else {
        thing.rank = RANK["Four of a kind"];
      }
    } else {
      thing.rank = RANK["Five of a kind"];
    }
  }
  withRank.sort((a, b) => {
    if (a.rank === b.rank) {
      for (let i = 0; i < a.hand.length; i++) {
        const handAtA = a.hand[i];
        const handAtB = b.hand[i];
        isSafe(handAtA);
        isSafe(handAtB);
        const aLetter = handAtA === "J" ? 0 : cardConversion[handAtA];
        const bLetter = handAtB === "J" ? 0 : cardConversion[handAtB];
        if (aLetter === bLetter) continue;
        return aLetter - bLetter;
      }
    }
    return a.rank - b.rank;
  });
  return withRank.map((d, i) => d.bid * (i + 1)).reduce((a, b) => a + b, 0);

  return 0;
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
