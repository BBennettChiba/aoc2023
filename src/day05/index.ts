import run from "aocrunner";

const processString = (input: string) =>
  input
    .split("\n")
    .filter((_, i) => i !== 0)
    .map((line) => line.split(" ").map(Number)) as [number, number, number][];

const parseInput = (rawInput: string) => {
  const sections = rawInput.split("\n\n");
  let [
    seedsLine,
    seedsToSoilLine,
    soilToFertilizerLine,
    fertilizerToWaterLine,
    waterToLightLine,
    lightToTemperatureLine,
    temperatureToHumidityLine,
    humidityToLocationLine,
  ] = sections;
  const seeds = seedsLine
    .split(": ")[1]
    .split(" ")
    .map((n) => parseInt(n));
  const seedsToSoil = processString(seedsToSoilLine);
  const soilToFertilizer = processString(soilToFertilizerLine);
  const fertilizerToWater = processString(fertilizerToWaterLine);
  const waterToLight = processString(waterToLightLine);
  const lightToTemperature = processString(lightToTemperatureLine);
  const temperatureToHumidity = processString(temperatureToHumidityLine);
  const humidityToLocation = processString(humidityToLocationLine);
  return {
    seeds,
    maps: [
      seedsToSoil,
      soilToFertilizer,
      fertilizerToWater,
      waterToLight,
      lightToTemperature,
      temperatureToHumidity,
      humidityToLocation,
    ],
  };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const finals = [];
  for (const seed of input.seeds) {
    let current = seed;
    for (const set of input.maps) {
      for (const [destination, source, range] of set) {
        if (current >= source && current < source + range) {
          const difference = destination - source;
          current = current + difference;
          break;
        }
      }
    }
    finals.push(current);
  }
  return Math.min(...finals);
};

const arrayRange = (start: number, stop: number, step = 1) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step,
  );

const convert = (arr: number[]) => {
  const newArr = [];
  while (arr.length > 0) newArr.push(arr.splice(0, 2));
  return newArr as [number, number][];
};

const weHaveThatSeed = (seed: number, seedRanges: [number, number][]) => {
  for (const [start, range] of seedRanges) {
    if(seed >= start && seed < start + range -1) return true;
  }
  return false;
};

const getSeedFromLocation = (
  location: number,
  input: ReturnType<typeof parseInput>["maps"],
) => {
  let current = location;
  for (const set of input.slice().reverse()) {
    for (const [destination, source, range] of set) {
      if (destination <= current && destination + range > current) {
        current = source + current - destination;
        break;
      }
    }
  }
  return current;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const seeds = convert(input.seeds);

  for (let i = 0; i < 1_000_000_000; i++) {
    const seed = getSeedFromLocation(i, input.maps);
    if (weHaveThatSeed(seed, seeds)) {
      return i;
    }
  }
};

run({
  part1: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
