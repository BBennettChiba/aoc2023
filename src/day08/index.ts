import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [instructions, rest] = rawInput.split("\n\n");
  const nodes = rest.split("\n").reduce((acc, line) => {
    const [node, next] = line.split(" = ");
    const [left, right] = next
      .split(", ")
      .map((t) => t.replace("(", "").replace(")", ""));
    acc[node] = { left, right };
    return acc;
  }, {} as Record<string, { left: string; right: string }>);
  return { instructions: instructions.split(""), nodes };
};

const part1 = (rawInput: string) => {
  const { nodes, instructions } = parseInput(rawInput);
  let currentNodeName = "AAA";
  let currentNode = nodes[currentNodeName];
  const endPoint = "ZZZ";
  let steps = 0;
  while (currentNodeName !== endPoint) {
    for (const LorR of instructions) {
      steps++;
      if (currentNodeName === endPoint) break;
      if (LorR === "R") currentNodeName = currentNode.right;
      else currentNodeName = currentNode.left;
      currentNode = nodes[currentNodeName];
    }
  }

  return steps;
};

const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

const part2 = (rawInput: string) => {
  const { nodes, instructions } = parseInput(rawInput);
  let currentKeysAndNodes = Object.keys(nodes)
    .filter((key) => key.endsWith("A"))
    .map((key) => ({ key, node: nodes[key], stepsToZ: 0 }));
  let steps = 0;
  while (!currentKeysAndNodes.every(({ stepsToZ }) => stepsToZ !== 0)) {
    for (const LorR of instructions) {
      steps++;
      if (LorR === "R") {
        currentKeysAndNodes = currentKeysAndNodes.map(
          ({ key, node, stepsToZ }) => ({
            key: node.right,
            node: nodes[node.right],
            stepsToZ,
          }),
        );
      } else {
        currentKeysAndNodes = currentKeysAndNodes.map(
          ({ key, node, stepsToZ }) => ({
            key: node.left,
            node: nodes[node.left],
            stepsToZ,
          }),
        );
      }
      for (let i = 0; i < currentKeysAndNodes.length; i++) {
        const key = currentKeysAndNodes[i].key;
        if (key.endsWith("Z")) currentKeysAndNodes[i].stepsToZ = steps;
      }
    }
  }
  console.log(currentKeysAndNodes)
  return currentKeysAndNodes.map(a =>a.stepsToZ).reduce(lcm, 1);
};

run({
  part1: {
    tests: [
      {
        input: `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
