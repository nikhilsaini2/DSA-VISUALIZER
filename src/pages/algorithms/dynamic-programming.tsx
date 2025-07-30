import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import * as Tooltip from '@radix-ui/react-tooltip';
import { Play, Pause, RotateCcw, Info, Shuffle } from "lucide-react";

const dpProblems = [
  {
    name: "Fibonacci",
    description: "Compute the nth Fibonacci number using dynamic programming.",
    recurrence: "dp[i] = dp[i-1] + dp[i-2]",
    code: `for i in 2..n: dp[i] = dp[i-1] + dp[i-2]`,
    params: [
      { name: "n", label: "n (Index)", type: "number", min: 1, max: 30, default: 8 }
    ],
    getSteps: ({ n }: { n: number }) => {
      const steps = [];
      const dp = Array(n + 1).fill(0);
      dp[0] = 0;
      dp[1] = 1;
      steps.push({ dp: [...dp], explanation: `Base cases: dp[0]=0, dp[1]=1` });
      for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        steps.push({ dp: [...dp], explanation: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}` });
      }
      return steps;
    },
    is2D: false
  },
  {
    name: "Knapsack (0/1)",
    description: "Given weights and values, maximize value in a knapsack of capacity W.",
    recurrence: "dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i])",
    code: `for i in 1..n: for w in 0..W: dp[i][w] = ...` ,
    params: [
      { name: "n", label: "Items (n)", type: "number", min: 2, max: 6, default: 4 },
      { name: "W", label: "Capacity (W)", type: "number", min: 1, max: 20, default: 10 }
    ],
    getSteps: ({ n, W, weights, values }: { n: number, W: number, weights: number[], values: number[] }) => {
      const steps = [];
      const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
      steps.push({ dp: dp.map(row => [...row]), explanation: `Base case: dp[0][*]=0` });
      for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= W; w++) {
          if (weights[i - 1] <= w) {
            dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
            steps.push({
              dp: dp.map(row => [...row]),
              highlight: { i, w },
              explanation: `dp[${i}][${w}] = max(dp[${i-1}][${w}], dp[${i-1}][${w-weights[i-1]}]+${values[i-1]}) = ${dp[i][w]}`
            });
          } else {
            dp[i][w] = dp[i - 1][w];
            steps.push({
              dp: dp.map(row => [...row]),
              highlight: { i, w },
              explanation: `dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w]}`
            });
          }
        }
      }
      return steps;
    },
    is2D: true,
    randomParams: () => {
      const n = 4 + Math.floor(Math.random() * 3);
      const W = 8 + Math.floor(Math.random() * 8);
      const weights = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 7));
      const values = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 15));
      return { n, W, weights, values };
    }
  },
  {
    name: "LCS",
    description: "Find the length of the longest common subsequence of two strings.",
    recurrence: `dp[i][j] = s1[i-1] == s2[j-1] ? 1+dp[i-1][j-1] : max(dp[i-1][j], dp[i][j-1])`,
    code: `for i in 1..n: for j in 1..m: dp[i][j] = ...` ,
    params: [
      { name: "s1", label: "String 1", type: "text", default: "abcde" },
      { name: "s2", label: "String 2", type: "text", default: "ace" }
    ],
    getSteps: ({ s1, s2 }: { s1: string, s2: string }) => {
      const n = s1.length, m = s2.length;
      const steps = [];
      const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
      steps.push({ dp: dp.map(row => [...row]), explanation: `Base case: dp[0][*]=0, dp[*][0]=0` });
      for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
          if (s1[i - 1] === s2[j - 1]) {
            dp[i][j] = 1 + dp[i - 1][j - 1];
            steps.push({
              dp: dp.map(row => [...row]),
              highlight: { i, j },
              explanation: `dp[${i}][${j}] = 1 + dp[${i-1}][${j-1}] = ${dp[i][j]}`
            });
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            steps.push({
              dp: dp.map(row => [...row]),
              highlight: { i, j },
              explanation: `dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = ${dp[i][j]}`
            });
          }
        }
      }
      return steps;
    },
    is2D: true
  },
  {
    name: "LIS",
    description: "Find the length of the longest increasing subsequence in an array.",
    recurrence: "dp[i] = max(1, dp[j] + 1 if arr[j] < arr[i])",
    code: `for i in 1..n: for j in 0..i-1: if arr[j] < arr[i]: dp[i] = max(dp[i], dp[j]+1)` ,
    params: [
      { name: "arr", label: "Array", type: "text", default: "10,9,2,5,3,7,101,18" }
    ],
    getSteps: ({ arr }: { arr: string }) => {
      const nums = arr.split(',').map(Number).filter(x => !isNaN(x));
      const n = nums.length;
      const steps = [];
      const dp = Array(n).fill(1);
      steps.push({ dp: [...dp], explanation: `Initialize all dp[i]=1` });
      for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
          if (nums[j] < nums[i]) {
            if (dp[i] < dp[j] + 1) {
              dp[i] = dp[j] + 1;
              steps.push({ dp: [...dp], highlight: { i }, explanation: `arr[${j}]=${nums[j]} < arr[${i}]=${nums[i]}, dp[${i}]=max(dp[${i}],dp[${j}]+1)=${dp[i]}` });
            }
          }
        }
      }
      return steps;
    },
    is2D: false
  },
  {
    name: "Coin Change",
    description: "Find the minimum number of coins to make up a given amount.",
    recurrence: "dp[x] = min(dp[x], dp[x-coin]+1)",
    code: `for coin in coins: for x in coin..amount: dp[x]=min(dp[x],dp[x-coin]+1)` ,
    params: [
      { name: "coins", label: "Coins", type: "text", default: "1,2,5" },
      { name: "amount", label: "Amount", type: "number", min: 1, max: 100, default: 11 }
    ],
    getSteps: ({ coins, amount }: { coins: string, amount: number }) => {
      const coinsArr = coins.split(',').map(Number);
      const dp = Array(amount + 1).fill(Infinity);
      dp[0] = 0;
      const steps = [{ dp: [...dp], explanation: `Base case: dp[0]=0` }];
      for (let coin of coinsArr) {
        for (let x = coin; x <= amount; x++) {
          if (dp[x] > dp[x - coin] + 1) {
            dp[x] = dp[x - coin] + 1;
            steps.push({ dp: [...dp], highlight: { x }, explanation: `Using coin ${coin}: dp[${x}]=min(dp[${x}],dp[${x-coin}]+1)=${dp[x]}` });
          }
        }
      }
      return steps;
    },
    is2D: false
  },
  {
    name: "Edit Distance",
    description: "Find the minimum number of operations to convert one string to another.",
    recurrence: `dp[i][j]=min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+cost)` ,
    code: `for i in 1..n: for j in 1..m: ...` ,
    params: [
      { name: "s1", label: "String 1", type: "text", default: "horse" },
      { name: "s2", label: "String 2", type: "text", default: "ros" }
    ],
    getSteps: ({ s1, s2 }: { s1: string, s2: string }) => {
      const n = s1.length, m = s2.length;
      const steps = [];
      const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
      for (let i = 0; i <= n; i++) dp[i][0] = i;
      for (let j = 0; j <= m; j++) dp[0][j] = j;
      steps.push({ dp: dp.map(row => [...row]), explanation: `Base case: dp[i][0]=i, dp[0][j]=j` });
      for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
          const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + cost
          );
          steps.push({ dp: dp.map(row => [...row]), highlight: { i, j }, explanation: `dp[${i}][${j}]=min(${dp[i-1][j]}+1,${dp[i][j-1]}+1,${dp[i-1][j-1]}+cost=${cost})=${dp[i][j]}` });
        }
      }
      return steps;
    },
    is2D: true
  },
  {
    name: "Subset Sum",
    description: "Determine if a subset of the array sums to a target value.",
    recurrence: "dp[i][s]=dp[i-1][s] || dp[i-1][s-arr[i]]",
    code: `for i in 1..n: for s in 0..target: ...` ,
    params: [
      { name: "arr", label: "Array", type: "text", default: "3,34,4,12,5,2" },
      { name: "target", label: "Target", type: "number", min: 1, max: 100, default: 9 }
    ],
    getSteps: ({ arr, target }: { arr: string, target: number }) => {
      const nums = arr.split(',').map(Number).filter(x => !isNaN(x));
      if (!Array.isArray(nums) || nums.length === 0 || !Number.isFinite(target) || target < 1) return [];
      const n = nums.length;
      const steps = [];
      const dp = Array.from({ length: n + 1 }, () => Array(target + 1).fill(false));
      for (let i = 0; i <= n; i++) dp[i][0] = true;
      steps.push({ dp: dp.map(row => [...row]), explanation: `Base case: dp[i][0]=true` });
      for (let i = 1; i <= n; i++) {
        for (let s = 1; s <= target; s++) {
          if (nums[i - 1] > s) {
            dp[i][s] = dp[i - 1][s];
          } else {
            dp[i][s] = dp[i - 1][s] || dp[i - 1][s - nums[i - 1]];
          }
          steps.push({ dp: dp.map(row => [...row]), highlight: { i, s }, explanation: `dp[${i}][${s}]=dp[${i-1}][${s}] || dp[${i-1}][${s-nums[i-1]}]=${dp[i][s]}` });
        }
      }
      return steps;
    },
    is2D: true
  },
  {
    name: "Min Path Sum",
    description: "Find the minimum path sum from top-left to bottom-right in a grid.",
    recurrence: "dp[i][j]=grid[i][j]+min(dp[i-1][j],dp[i][j-1])",
    code: `for i in 0..m: for j in 0..n: ...` ,
    params: [
      { name: "grid", label: "Grid", type: "text", default: "1,3,1;1,5,1;4,2,1" }
    ],
    getSteps: ({ grid }: { grid: string }) => {
      const rows = grid.split(';').map(row => row.split(',').map(Number).filter(x => !isNaN(x))).filter(row => row.length > 0);
      const m = rows.length, n = rows[0].length;
      const steps = [];
      const dp = Array.from({ length: m }, () => Array(n).fill(0));
      dp[0][0] = rows[0][0];
      for (let i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + rows[i][0];
      for (let j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + rows[0][j];
      steps.push({ dp: dp.map(row => [...row]), explanation: `Initialize first row and column` });
      for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
          dp[i][j] = rows[i][j] + Math.min(dp[i-1][j], dp[i][j-1]);
          steps.push({ dp: dp.map(row => [...row]), highlight: { i, j }, explanation: `dp[${i}][${j}]=grid[${i}][${j}]+min(dp[${i-1}][${j}],dp[${i}][${j-1}])=${dp[i][j]}` });
        }
      }
      return steps;
    },
    is2D: true
  }
];

const dpButtonThemes = [
  "bg-blue-500",    // Fibonacci
  "bg-purple-500", // Knapsack
  "bg-green-500",   // LCS
  "bg-pink-500",    // LIS
  "bg-yellow-500",  // Coin Change
  "bg-cyan-500",    // Edit Distance
  "bg-orange-500",  // Subset Sum
  "bg-teal-500"     // Min Path Sum
];

// Example input data for each algorithm
const dpExamples = [
  {
    tip: "Pick a value for n to see the Fibonacci sequence!",
    example: { n: 8 },
    display: "n = 8"
  },
  {
    tip: "Try these weights and values for Knapsack!",
    example: { n: 4, W: 10, weights: [2, 3, 4, 5], values: [3, 4, 5, 6] },
    display: "n = 4, W = 10, weights = [2,3,4,5], values = [3,4,5,6]"
  },
  {
    tip: "Enter two strings to see how LCS works!",
    example: { s1: "abcde", s2: "ace" },
    display: 'String 1 = "abcde", String 2 = "ace"'
  },
  { tip: "Find the LIS of this array!", example: { arr: "10,9,2,5,3,7,101,18" }, display: 'Array = "10,9,2,5,3,7,101,18"' },
  { tip: "Try these coins and amount!", example: { coins: "1,2,5", amount: 11 }, display: 'Coins = "1,2,5", Amount = 11' },
  { tip: "Try these strings for edit distance!", example: { s1: "horse", s2: "ros" }, display: 'String 1 = "horse", String 2 = "ros"' },
  { tip: "Try this array and target for subset sum!", example: { arr: "3,34,4,12,5,2", target: 9 }, display: 'Array = "3,34,4,12,5,2", Target = 9' },
  { tip: "Try this grid for min path sum!", example: { grid: "1,3,1;1,5,1;4,2,1" }, display: 'Grid = "1,3,1;1,5,1;4,2,1"' }
];

function ExampleInputCard({ idx, onUse }: { idx: number, onUse: () => void }) {
  return (
    <div className="mb-4 flex items-center gap-4 bg-slate-700/40 rounded-xl px-4 py-3">
      <span className="text-slate-300 text-sm"><b>Try this example:</b> <span className="font-mono text-blue-300">{dpExamples[idx].display}</span></span>
      <button
        onClick={onUse}
        className="ml-2 px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Use Example
      </button>
    </div>
  );
}

export default function DynamicProgrammingPage() {
  const [selected, setSelected] = useState(0);
  const [params, setParams] = useState({ n: 8 });
  const [dpTable, setDpTable] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [steps, setSteps] = useState<any[]>([]);

  // Animated background
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 30; i++) {
      const t = Date.now() / 1000 + i;
      const x = 400 + 350 * Math.cos(t + i);
      const y = 200 + 180 * Math.sin(t + i * 1.3);
      ctx.beginPath();
      ctx.arc(x, y, 2 + Math.sin(t + i) * 1.5, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(80,180,255,0.08)';
      ctx.fill();
    }
  });

  // Fibonacci DP steps generator
  function getFibonacciSteps(n: number) {
    const steps = [];
    const dp = Array(n + 1).fill(0);
    dp[0] = 0;
    dp[1] = 1;
    steps.push({ dp: [...dp], explanation: `Base cases: dp[0]=0, dp[1]=1` });
    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      steps.push({ dp: [...dp], explanation: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}` });
    }
    return steps;
  }

  // Run DP algorithm
  const runAlgorithm = () => {
    let algoSteps: any[] = [];
    const problem = dpProblems[selected];
    try {
      if (problem.name === "Fibonacci") {
        algoSteps = problem.getSteps({ n: params.n });
      } else if (problem.name === "Knapsack (0/1)") {
        // Use weights/values from params or example if not present
        const weights = params.weights || dpExamples[1].example.weights;
        const values = params.values || dpExamples[1].example.values;
        algoSteps = problem.getSteps({ n: params.n, W: params.W, weights, values });
      } else if (problem.name === "LCS") {
        algoSteps = problem.getSteps({ s1: params.s1 || '', s2: params.s2 || '' });
      } else if (problem.name === "LIS") {
        algoSteps = problem.getSteps({ arr: params.arr || '' });
      } else if (problem.name === "Coin Change") {
        algoSteps = problem.getSteps({ coins: params.coins || '', amount: params.amount });
      } else if (problem.name === "Edit Distance") {
        algoSteps = problem.getSteps({ s1: params.s1 || '', s2: params.s2 || '' });
      } else if (problem.name === "Subset Sum") {
        algoSteps = problem.getSteps({ arr: params.arr || '', target: params.target });
      } else if (problem.name === "Min Path Sum") {
        algoSteps = problem.getSteps({ grid: params.grid || '' });
      }
      if (!algoSteps || algoSteps.length === 0) {
        setExplanation("Invalid input or no steps to visualize. Please check your array and target.");
        setSteps([]);
        setDpTable([]);
        setIsPlaying(false);
        return;
      }
      setSteps(algoSteps);
      setCurrentStep(0);
      setIsPlaying(true);
      setDpTable(algoSteps[0].dp);
      setExplanation(algoSteps[0].explanation);
    } catch (e) {
      setExplanation("An error occurred. Please check your input values.");
      setSteps([]);
      setDpTable([]);
      setIsPlaying(false);
    }
  };

  // Animate steps
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStep((s) => s + 1);
      setDpTable(steps[currentStep + 1].dp);
      setExplanation(steps[currentStep + 1].explanation);
    }, 900);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps]);

  // Reset on problem change
  useEffect(() => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setDpTable([]);
    setExplanation("");
    setParams({ n: dpProblems[selected].params[0].default });
  }, [selected]);

  // Handle param change
  const handleParamChange = (name: string, value: number) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-black py-8 mt-10">
      <canvas ref={canvasRef} width={800} height={400} className="absolute top-0 left-0 w-full h-[400px] pointer-events-none z-0" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-3xl md:text-4xl font-bold mb-8 mt-16 text-center bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent drop-shadow-glow animate-gradient-x">
          Dynamic Programming
          <span className="block h-1 w-2/3 mx-auto mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 rounded-full animate-underline" />
        </motion.h1>
        <Card className="bg-white/20 dark:bg-slate-800/60 border-2 border-transparent shadow-xl backdrop-blur-md rounded-2xl max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-xl">Select a Problem</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Choose a dynamic programming problem to visualize
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 w-full mt-4 mb-6">
              {dpProblems.map((prob, idx) => (
                <button
                  key={prob.name}
                  onClick={() => setSelected(idx)}
                  className={`w-32 h-12 flex items-center justify-center px-2 py-2 rounded-xl font-semibold text-white shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-normal text-center overflow-hidden truncate leading-tight ${
                    selected === idx
                      ? `${dpButtonThemes[idx]} scale-110 ring-2 ring-blue-400`
                      : "bg-slate-600/70 hover:scale-105"
                  }`}
                  aria-pressed={selected === idx}
                  aria-label={`Select ${prob.name}`}
                >
                  <span className={prob.name.length > 10 ? 'text-xs' : 'text-sm'}>{prob.name}</span>
                </button>
              ))}
            </div>
            <div className="mb-5 bg-slate-800/40 p-4 rounded-xl flex items-start gap-3 min-w-[300px] w-full">
              <Info className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <div className="text-slate-300 font-semibold mb-1">{dpProblems[selected].name}</div>
                <div className="text-slate-400 text-sm">{dpProblems[selected].description}</div>
              </div>
            </div>
            <span className="block text-slate-400 text-sm mb-2">{dpExamples[selected].tip}</span>
            <ExampleInputCard idx={selected} onUse={() => {
              setParams({ ...params, ...dpExamples[selected].example });
            }} />
            <div className="flex gap-4 mt-2 mb-6 items-center w-full">
              {dpProblems[selected].params.map((param) => (
                <div key={param.name} className="flex flex-col">
                  <label className="text-xs text-slate-400 mb-1" htmlFor={param.name}>{param.label}</label>
                  <Input
                    id={param.name}
                    type={param.type}
                    min={param.min}
                    max={param.max}
                    value={params[param.name] ?? ''}
                    onChange={e => handleParamChange(param.name, param.type === 'number' ? Number(e.target.value) : e.target.value)}
                    className="w-24"
                    placeholder={param.type === 'number' ? `e.g. ${dpExamples[selected].example[param.name] ?? ''}` : `e.g. ${dpExamples[selected].example[param.name] ?? ''}`}
                  />
                  <span className="text-xs text-slate-500 mt-1">{param.type === 'number' ? 'Enter a number' : 'Enter a string'}</span>
                </div>
              ))}
              <Button onClick={runAlgorithm} disabled={isPlaying} className="bg-green-500 hover:bg-green-600 flex items-center gap-x-2 justify-center">
                <Play className="w-5 h-5" />
                <span>Run</span>
              </Button>
              <Button onClick={() => {
                setCurrentStep(0);
                setDpTable([]);
                setExplanation("");
                setIsPlaying(false);
                setSteps([]);
              }} disabled={currentStep === 0} variant="outline">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            {/* DP Table Visualization */}
            <div className="flex flex-col items-center mt-8">
              {dpProblems[selected].is2D && Array.isArray(dpTable[0]) ? (
                <div className="flex flex-col gap-1 mb-2">
                  {dpTable.map((row, i) => (
                    <div key={i} className="flex gap-1">
                      {row.map((val: any, j: number) => {
                        // For boolean DP tables (Subset Sum), use color coding
                        const isBool = typeof val === 'boolean';
                        const isFinal = i === dpTable.length - 1 && j === row.length - 1;
                        let cellClass =
                          isBool
                            ? val
                              ? 'bg-green-500/70 border-green-400 text-white'
                              : 'bg-slate-800/60 border-slate-700 text-slate-400'
                            : 'border-slate-700 bg-slate-900/60 text-white';
                        if (currentStep > 0 && dpProblems[selected].is2D && steps[currentStep]?.highlight?.i === i && (steps[currentStep]?.highlight?.s === j || steps[currentStep]?.highlight?.w === j || steps[currentStep]?.highlight?.j === j)) {
                          cellClass += ' border-blue-400 bg-blue-500/30 text-blue-200 animate-pulse';
                        }
                        if (isFinal) {
                          cellClass += ' ring-2 ring-yellow-400';
                        }
                        return (
                          <Tooltip.Root key={j}>
                            <Tooltip.Trigger asChild>
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4, delay: (i + j) * 0.03 }}
                                className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 shadow-lg text-lg font-bold select-none transition-all duration-200 ${cellClass}`}
                              >
                                {isBool ? (val ? 'T' : 'F') : val}
                              </motion.div>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content side="top" className="bg-slate-800 text-white px-3 py-1 rounded shadow text-xs">
                                {`dp[${i}][${j}] = ${val}`}
                                <Tooltip.Arrow className="fill-slate-800" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 mb-2">
                  {dpTable.map((val, idx) => (
                    <Tooltip.Root key={idx}>
                      <Tooltip.Trigger asChild>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4, delay: idx * 0.05 }}
                          className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 shadow-lg text-xl font-bold select-none transition-all duration-200 ${currentStep > 0 && idx === currentStep ? "border-blue-400 bg-blue-500/30 text-blue-200 animate-pulse" : "border-slate-700 bg-slate-900/60 text-white"}`}
                        >
                          {val}
                        </motion.div>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content side="top" className="bg-slate-800 text-white px-3 py-1 rounded shadow text-xs">
                          {`dp[${idx}] = ${val}`}
                          <Tooltip.Arrow className="fill-slate-800" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  ))}
                </div>
              )}
              <AnimatePresence>
                {explanation && (
                  <motion.div
                    key={explanation}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5 }}
                    className="mt-4 text-center text-slate-300 bg-slate-800/60 px-4 py-2 rounded-lg shadow"
                  >
                    {explanation}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
} 