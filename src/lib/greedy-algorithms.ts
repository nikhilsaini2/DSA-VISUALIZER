export const greedyAlgorithms = {
  activitySelection: {
    name: "Activity Selection",
    description: "Select maximum number of activities that can be performed by a single person, given start and finish time of activities",
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)"
    },
    spaceComplexity: "O(n)"
  },
  huffmanCoding: {
    name: "Huffman Coding",
    description: "Generate optimal prefix codes for character encoding using their frequencies",
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)"
    },
    spaceComplexity: "O(n)"
  },
  coinChange: {
    name: "Coin Change",
    description: "Find the minimum number of coins needed to make a given amount using a greedy approach",
    timeComplexity: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)"
    },
    spaceComplexity: "O(1)"
  },
  fractionalKnapsack: {
    name: "Fractional Knapsack",
    description: "Maximize the value of items in a knapsack by taking fractions of items",
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)"
    },
    spaceComplexity: "O(n)"
  },
  jobSequencing: {
    name: "Job Sequencing",
    description: "Schedule jobs to maximize profit when each job has a deadline and profit",
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)"
    },
    spaceComplexity: "O(n)"
  }
}