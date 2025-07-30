// Greedy Algorithms Implementation - Enhanced Professional Version
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import * as Tooltip from '@radix-ui/react-tooltip';
import { Play, Pause, RotateCcw, Info, Shuffle, Trophy, Clock, CheckCircle, AlertCircle, Zap, Target } from "lucide-react";
import { greedyAlgorithms } from "@/lib/greedy-algorithms";

interface Activity {
  id: number;
  start: number;
  finish: number;
}

interface HuffmanNode {
  char: string;
  frequency: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
  code?: string;
}

// Add these new interfaces at the top with the existing ones
interface Coin {
  value: number;
  count: number;
}

interface Item {
  id: number;
  weight: number;
  value: number;
  ratio?: number;
  fraction?: number;
}

interface Job {
  id: number;
  deadline: number;
  profit: number;
}

// Update the greedyProblems array to include the new algorithms
const greedyProblems = [
  {
    name: "Activity Selection",
    description: "Select maximum number of activities that can be performed by a single person, given start and finish time of activities",
    getSteps: (activities: Activity[]) => {
      // Sort activities by finish time
      const sortedActivities = [...activities].sort((a, b) => a.finish - b.finish);
      const steps = [];
      const selected: Activity[] = [];
      
      steps.push({
        activities: sortedActivities,
        selected: [],
        current: null,
        explanation: "Sort all activities by finish time"
      });
      
      // Select first activity
      if (sortedActivities.length > 0) {
        selected.push(sortedActivities[0]);
        steps.push({
          activities: sortedActivities,
          selected: [...selected],
          current: sortedActivities[0],
          explanation: `Select first activity (ID: ${sortedActivities[0].id}) with finish time ${sortedActivities[0].finish}`
        });
      }
      
      // Select remaining activities
      let lastSelected = 0;
      for (let i = 1; i < sortedActivities.length; i++) {
        steps.push({
          activities: sortedActivities,
          selected: [...selected],
          current: sortedActivities[i],
          explanation: `Considering activity (ID: ${sortedActivities[i].id}) with start time ${sortedActivities[i].start} and finish time ${sortedActivities[i].finish}`
        });
        
        if (sortedActivities[i].start >= sortedActivities[lastSelected].finish) {
          selected.push(sortedActivities[i]);
          lastSelected = i;
          steps.push({
            activities: sortedActivities,
            selected: [...selected],
            current: sortedActivities[i],
            explanation: `Select activity (ID: ${sortedActivities[i].id}) as its start time ${sortedActivities[i].start} is after the finish time of the last selected activity ${sortedActivities[lastSelected].finish}`
          });
        } else {
          steps.push({
            activities: sortedActivities,
            selected: [...selected],
            current: sortedActivities[i],
            explanation: `Skip activity (ID: ${sortedActivities[i].id}) as its start time ${sortedActivities[i].start} conflicts with the finish time of the last selected activity ${sortedActivities[lastSelected].finish}`
          });
        }
      }
      
      steps.push({
        activities: sortedActivities,
        selected: [...selected],
        current: null,
        explanation: `Finished! Selected ${selected.length} activities out of ${sortedActivities.length}`
      });
      
      return steps;
    }
  },
  {
    name: "Huffman Coding",
    description: "Generate optimal prefix codes for character encoding using their frequencies",
    getSteps: (text: string) => {
      // Calculate frequencies
      const frequencies = new Map<string, number>();
      for (const char of text) {
        frequencies.set(char, (frequencies.get(char) || 0) + 1);
      }
      
      // Create leaf nodes
      let nodes: HuffmanNode[] = Array.from(frequencies.entries()).map(([char, frequency]) => ({
        char,
        frequency,
        left: null,
        right: null
      }));
      
      const steps = [];
      steps.push({
        nodes: [...nodes],
        tree: null,
        codes: new Map<string, string>(),
        explanation: `Created ${nodes.length} leaf nodes based on character frequencies`
      });
      
      // Build Huffman tree
      while (nodes.length > 1) {
        // Sort nodes by frequency
        nodes.sort((a, b) => a.frequency - b.frequency);
        
        // Take two nodes with lowest frequencies
        const left = nodes.shift()!;
        const right = nodes.shift()!;
        
        // Create a new internal node
        const newNode: HuffmanNode = {
          char: left.char + right.char,
          frequency: left.frequency + right.frequency,
          left,
          right
        };
        
        steps.push({
          nodes: [...nodes, newNode],
          tree: newNode,
          codes: new Map<string, string>(),
          explanation: `Merged nodes '${left.char}' (${left.frequency}) and '${right.char}' (${right.frequency}) into new node with frequency ${newNode.frequency}`
        });
        
        // Add the new node back to the queue
        nodes.push(newNode);
      }
      
      // Generate codes
      const huffmanTree = nodes[0];
      const codes = new Map<string, string>();
      
      function generateCodes(node: HuffmanNode, code: string) {
        if (!node.left && !node.right) {
          codes.set(node.char, code);
          return;
        }
        if (node.left) generateCodes(node.left, code + '0');
        if (node.right) generateCodes(node.right, code + '1');
      }
      
      generateCodes(huffmanTree, '');
      
      steps.push({
        nodes,
        tree: huffmanTree,
        codes,
        explanation: `Generated Huffman codes for all characters`
      });
      
      return steps;
    }
  },
  {
    name: "Coin Change",
    description: "Find minimum number of coins that make a given value using greedy approach",
    getSteps: (amount: number, denominations: number[]) => {
      // Sort denominations in descending order
      const sortedDenominations = [...denominations].sort((a, b) => b - a);
      const steps = [];
      let remainingAmount = amount;
      const coinsUsed: Coin[] = [];
      
      steps.push({
        amount,
        denominations: sortedDenominations,
        coinsUsed: [],
        currentCoin: null,
        remainingAmount,
        explanation: `Starting with amount ${amount} and denominations sorted in descending order`
      });
      
      for (const denom of sortedDenominations) {
        steps.push({
          amount,
          denominations: sortedDenominations,
          coinsUsed: [...coinsUsed],
          currentCoin: denom,
          remainingAmount,
          explanation: `Considering coin of value ${denom}`
        });
        
        if (denom <= remainingAmount) {
          const count = Math.floor(remainingAmount / denom);
          remainingAmount = remainingAmount % denom;
          
          coinsUsed.push({ value: denom, count });
          
          steps.push({
            amount,
            denominations: sortedDenominations,
            coinsUsed: [...coinsUsed],
            currentCoin: denom,
            remainingAmount,
            explanation: `Used ${count} coin(s) of value ${denom}. Remaining amount: ${remainingAmount}`
          });
        } else {
          steps.push({
            amount,
            denominations: sortedDenominations,
            coinsUsed: [...coinsUsed],
            currentCoin: denom,
            remainingAmount,
            explanation: `Skipped coin of value ${denom} as it's greater than remaining amount ${remainingAmount}`
          });
        }
      }
      
      steps.push({
        amount,
        denominations: sortedDenominations,
        coinsUsed,
        currentCoin: null,
        remainingAmount,
        explanation: remainingAmount === 0 ? 
          `Finished! Used ${coinsUsed.reduce((sum, coin) => sum + coin.count, 0)} coins to make ${amount}` :
          `Cannot make exact change. Remaining amount: ${remainingAmount}`
      });
      
      return steps;
    }
  },
  {
    name: "Fractional Knapsack",
    description: "Maximize value in a knapsack by taking fractions of items based on value-to-weight ratio",
    getSteps: (capacity: number, items: Item[]) => {
      // Calculate value-to-weight ratio for each item
      const itemsWithRatio = items.map(item => ({
        ...item,
        ratio: item.value / item.weight
      }));
      
      // Sort items by value-to-weight ratio in descending order
      const sortedItems = [...itemsWithRatio].sort((a, b) => b.ratio! - a.ratio!);
      
      const steps = [];
      let remainingCapacity = capacity;
      const selectedItems: Item[] = [];
      let totalValue = 0;
      
      steps.push({
        capacity,
        items: sortedItems,
        selectedItems: [],
        currentItem: null,
        remainingCapacity,
        totalValue: 0,
        explanation: `Starting with knapsack capacity ${capacity} and items sorted by value-to-weight ratio`
      });
      
      for (const item of sortedItems) {
        steps.push({
          capacity,
          items: sortedItems,
          selectedItems: [...selectedItems],
          currentItem: item,
          remainingCapacity,
          totalValue,
          explanation: `Considering item ${item.id} with weight ${item.weight}, value ${item.value}, and ratio ${item.ratio!.toFixed(2)}`
        });
        
        if (remainingCapacity >= item.weight) {
          // Take the whole item
          remainingCapacity -= item.weight;
          totalValue += item.value;
          
          selectedItems.push({ ...item, fraction: 1 });
          
          steps.push({
            capacity,
            items: sortedItems,
            selectedItems: [...selectedItems],
            currentItem: item,
            remainingCapacity,
            totalValue,
            explanation: `Added entire item ${item.id}. Remaining capacity: ${remainingCapacity}, Total value: ${totalValue}`
          });
        } else if (remainingCapacity > 0) {
          // Take a fraction of the item
          const fraction = remainingCapacity / item.weight;
          totalValue += item.value * fraction;
          
          selectedItems.push({ ...item, fraction });
          remainingCapacity = 0;
          
          steps.push({
            capacity,
            items: sortedItems,
            selectedItems: [...selectedItems],
            currentItem: item,
            remainingCapacity,
            totalValue,
            explanation: `Added ${(fraction * 100).toFixed(0)}% of item ${item.id}. Knapsack is now full. Total value: ${totalValue.toFixed(2)}`
          });
        } else {
          steps.push({
            capacity,
            items: sortedItems,
            selectedItems: [...selectedItems],
            currentItem: item,
            remainingCapacity,
            totalValue,
            explanation: `Skipped item ${item.id} as knapsack is full`
          });
        }
      }
      
      steps.push({
        capacity,
        items: sortedItems,
        selectedItems,
        currentItem: null,
        remainingCapacity,
        totalValue,
        explanation: `Finished! Total value in knapsack: ${totalValue.toFixed(2)}`
      });
      
      return steps;
    }
  },
  {
    name: "Job Sequencing",
    description: "Maximize profit by scheduling jobs with deadlines to maximize profit",
    getSteps: (jobs: Job[]) => {
      // Sort jobs by profit in descending order
      const sortedJobs = [...jobs].sort((a, b) => b.profit - a.profit);
      
      // Find the maximum deadline to determine the size of the sequence array
      const maxDeadline = Math.max(...jobs.map(job => job.deadline));
      
      const steps = [];
      const sequence = Array(maxDeadline).fill(-1); // -1 indicates empty slot
      const result: Job[] = [];
      let totalProfit = 0;
      
      steps.push({
        jobs: sortedJobs,
        sequence: [...sequence],
        currentJob: null,
        result: [],
        totalProfit: 0,
        explanation: `Starting with ${sortedJobs.length} jobs sorted by profit and ${maxDeadline} time slots`
      });
      
      for (const job of sortedJobs) {
        steps.push({
          jobs: sortedJobs,
          sequence: [...sequence],
          currentJob: job,
          result: [...result],
          totalProfit,
          explanation: `Considering job ${job.id} with deadline ${job.deadline} and profit ${job.profit}`
        });
        
        // Find a free slot for this job (start from the deadline and move backwards)
        let slot = job.deadline - 1; // Convert to 0-indexed
        while (slot >= 0 && sequence[slot] !== -1) {
          slot--;
        }
        
        if (slot >= 0) {
          // Assign the job to this slot
          sequence[slot] = job.id;
          result.push(job);
          totalProfit += job.profit;
          
          steps.push({
            jobs: sortedJobs,
            sequence: [...sequence],
            currentJob: job,
            result: [...result],
            totalProfit,
            explanation: `Assigned job ${job.id} to time slot ${slot + 1}. Total profit: ${totalProfit}`
          });
        } else {
          steps.push({
            jobs: sortedJobs,
            sequence: [...sequence],
            currentJob: job,
            result: [...result],
            totalProfit,
            explanation: `Could not assign job ${job.id} as no free slot available before its deadline`
          });
        }
      }
      
      steps.push({
        jobs: sortedJobs,
        sequence: [...sequence],
        currentJob: null,
        result,
        totalProfit,
        explanation: `Finished! Scheduled ${result.length} jobs with total profit: ${totalProfit}`
      });
      
      return steps;
    }
  }
];

const greedyButtonThemes = [
  "bg-green-500",  // Activity Selection
  "bg-purple-500", // Huffman Coding
  "bg-blue-500",   // Coin Change
  "bg-amber-500",  // Fractional Knapsack
  "bg-rose-500"    // Job Sequencing
];

// Example input data for each algorithm
const greedyExamples = [
  {
    tip: "Try this set of activities!",
    example: {
      activities: [
        { id: 1, start: 1, finish: 4 },
        { id: 2, start: 3, finish: 5 },
        { id: 3, start: 0, finish: 6 },
        { id: 4, start: 5, finish: 7 },
        { id: 5, start: 3, finish: 9 },
        { id: 6, start: 5, finish: 9 },
        { id: 7, start: 6, finish: 10 },
        { id: 8, start: 8, finish: 11 },
        { id: 9, start: 8, finish: 12 },
        { id: 10, start: 2, finish: 14 }
      ]
    },
    display: "10 activities with various start and finish times"
  },
  {
    tip: "Try this text for Huffman coding!",
    example: { text: "abracadabra" },
    display: 'Text = "abracadabra"'
  },
  {
    tip: "Try this amount and coin denominations!",
    example: { 
      amount: 63, 
      denominations: [1, 5, 10, 25] 
    },
    display: "Amount = 63, Coins = [1, 5, 10, 25]"
  },
  {
    tip: "Try these items for the knapsack!",
    example: { 
      capacity: 50,
      items: [
        { id: 1, weight: 10, value: 60 },
        { id: 2, weight: 20, value: 100 },
        { id: 3, weight: 30, value: 120 },
        { id: 4, weight: 15, value: 80 },
        { id: 5, weight: 25, value: 120 }
      ] 
    },
    display: "Capacity = 50, 5 items with different weights and values"
  },
  {
    tip: "Try these jobs with deadlines and profits!",
    example: { 
      jobs: [
        { id: 1, deadline: 4, profit: 20 },
        { id: 2, deadline: 1, profit: 10 },
        { id: 3, deadline: 1, profit: 40 },
        { id: 4, deadline: 2, profit: 30 },
        { id: 5, deadline: 3, profit: 25 }
      ] 
    },
    display: "5 jobs with different deadlines and profits"
  }
];

function ExampleInputCard({ idx, onUse }: { idx: number, onUse: () => void }) {
  return (
    <div className="mb-4 flex items-center gap-4 bg-slate-700/40 rounded-xl px-4 py-3">
      <span className="text-slate-300 text-sm"><b>Try this example:</b> <span className="font-mono text-blue-300">{greedyExamples[idx].display}</span></span>
      <button
        onClick={onUse}
        className="ml-2 px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Use Example
      </button>
    </div>
  );
}

function generateRandomActivities(count: number = 10) {
  const activities: Activity[] = [];
  for (let i = 0; i < count; i++) {
    const start = Math.floor(Math.random() * 15);
    const duration = Math.floor(Math.random() * 5) + 1;
    activities.push({
      id: i + 1,
      start,
      finish: start + duration
    });
  }
  return activities;
}

function ActivitySelectionVisualizer({ steps, currentStep }: { steps: any[], currentStep: number }) {
  if (!steps || steps.length === 0 || !steps[currentStep]) return null;
  
  const { activities, selected, current } = steps[currentStep];
  
  // Check if activities is an array before proceeding
  if (!Array.isArray(activities)) {
    return <div className="text-red-500 p-4">Invalid activity data</div>;
  }
  
  // Calculate non-overlapping vertical positions
  const activityRows: Activity[][] = [];
  
  // Sort activities by start time for better visualization
  const sortedActivities = [...activities].sort((a, b) => a.start - b.finish);
  
  // Assign each activity to a row where it doesn't overlap
  sortedActivities.forEach((activity) => {
    let rowIndex = 0;
    let placed = false;
    
    while (!placed) {
      if (!activityRows[rowIndex]) {
        activityRows[rowIndex] = [activity];
        placed = true;
      } else {
        const canPlaceInRow = activityRows[rowIndex].every(existingActivity => 
          activity.start >= existingActivity.finish || activity.finish <= existingActivity.start
        );
        
        if (canPlaceInRow) {
          activityRows[rowIndex].push(activity);
          placed = true;
        } else {
          rowIndex++;
        }
      }
    }
  });
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-slate-200">Activity Timeline</h3>
      <div className="relative h-[400px] bg-slate-800/40 rounded-xl p-4 overflow-hidden">
        {/* Time axis */}
        <div className="absolute bottom-10 left-0 right-0 h-1 bg-slate-600"></div>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="absolute bottom-8 text-xs text-slate-400" style={{ left: `${i * 6.25}%` }}>
            {i}
          </div>
        ))}
        
        {/* Activities */}
        {activities.map((activity: Activity) => {
          const isSelected = selected.some((s: Activity) => s.id === activity.id);
          const isCurrent = current && current.id === activity.id;
          const width = (activity.finish - activity.start) * 6.25;
          const left = activity.start * 6.25;
          
          // Find which row this activity is in
          let rowIndex = 0;
          for (let i = 0; i < activityRows.length; i++) {
            if (activityRows[i].some(a => a.id === activity.id)) {
              rowIndex = i;
              break;
            }
          }
          
          // Calculate vertical position based on row
          const rowHeight = 36; // Height of each row
          const topPosition = 320 - (rowIndex * rowHeight) - rowHeight;
          
          return (
            <Tooltip.Root key={activity.id}>
              <Tooltip.Trigger asChild>
                <div 
                  className={`absolute h-8 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-300 ${isCurrent ? 'ring-2 ring-yellow-400' : ''} ${isSelected ? 'bg-gradient-to-r from-green-500 to-green-400 shadow-lg' : 'bg-gradient-to-r from-slate-600 to-slate-500'}`}
                  style={{ 
                    left: `${left}%`, 
                    width: `${width}%`,
                    top: topPosition,
                    boxShadow: isSelected ? '0 4px 12px rgba(34, 197, 94, 0.3)' : ''
                  }}
                >
                  {activity.id}
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content side="top" className="bg-slate-800 text-white px-3 py-1 rounded shadow text-xs z-50">
                  Activity {activity.id}: [{activity.start}, {activity.finish}]
                  <Tooltip.Arrow className="fill-slate-800" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          );
        })}
        
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-slate-800/80 p-2 rounded-lg flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-green-500 to-green-400"></div>
          <span className="text-white">Selected</span>
          <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-slate-600 to-slate-500 ml-2"></div>
          <span className="text-white">Not Selected</span>
        </div>
      </div>
    </div>
  );
}

function HuffmanCodingVisualizer({ steps, currentStep }: { steps: any[], currentStep: number }) {
  if (!steps || steps.length === 0 || !steps[currentStep]) return null;
  
  const { tree, codes } = steps[currentStep];
  
  // Calculate tree depth to adjust spacing
  const getTreeDepth = (node: HuffmanNode | null): number => {
    if (!node) return 0;
    return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
  };
  
  const treeDepth = tree ? getTreeDepth(tree) : 0;
  
  // Calculate tree width to ensure proper horizontal spacing
  const getTreeWidth = (node: HuffmanNode | null): number => {
    if (!node) return 0;
    if (!node.left && !node.right) return 1;
    return getTreeWidth(node.left) + getTreeWidth(node.right);
  };
  
  const treeWidth = tree ? Math.max(1, getTreeWidth(tree)) : 0;
  
  const renderTree = (node: HuffmanNode | null, x: number, y: number, depth: number = 0, isLeft: boolean = false) => {
    if (!node) return null;
    
    const nodeSize = 40;
    // Dynamic horizontal spacing based on tree width and depth
    const horizontalSpacing = Math.max(80, (treeWidth * 60) / Math.pow(2, depth));
    const verticalSpacing = 80;
    
    return (
      <>
        {/* Draw edge to parent */}
        {depth > 0 && (
          <line 
            x1={x + (isLeft ? horizontalSpacing : -horizontalSpacing)}
            y1={y - verticalSpacing}
            x2={x}
            y2={y}
            stroke="#64748b"
            strokeWidth="2"
          />
        )}
        
        {/* Draw edge labels */}
        {depth > 0 && (
          <text
            x={x + (isLeft ? horizontalSpacing/2 : -horizontalSpacing/2)}
            y={y - verticalSpacing/2}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="14"
            fontWeight="bold"
          >
            {isLeft ? "0" : "1"}
          </text>
        )}
        
        {/* Draw node */}
        <g transform={`translate(${x - nodeSize/2}, ${y - nodeSize/2})`}>
          <circle 
            cx={nodeSize/2} 
            cy={nodeSize/2} 
            r={nodeSize/2} 
            fill={node.left === null && node.right === null ? 
              "url(#leafGradient)" : "url(#nodeGradient)"}
            stroke="#ffffff"
            strokeWidth="2"
            filter="url(#glow)"
          />
          <text 
            x={nodeSize/2} 
            y={nodeSize/2} 
            textAnchor="middle" 
            dominantBaseline="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
          >
            {node.left === null && node.right === null ? node.char : node.frequency}
          </text>
        </g>
        
        {/* Draw children */}
        {node.left && renderTree(node.left, x - horizontalSpacing, y + verticalSpacing, depth + 1, true)}
        {node.right && renderTree(node.right, x + horizontalSpacing, y + verticalSpacing, depth + 1, false)}
      </>
    );
  };
  
  // Calculate SVG dimensions based on tree depth and width
  const svgWidth = Math.max(600, treeWidth * 120);
  const svgHeight = Math.max(400, (treeDepth + 1) * 120);
  
  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3 text-slate-200">Huffman Tree</h3>
          <div className="bg-slate-800/40 rounded-xl p-4 h-[400px] overflow-auto">
            {tree && (
              <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                  <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                  <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <g transform={`translate(${svgWidth/2}, 60)`}>
                  {renderTree(tree, 0, 0)}
                </g>
              </svg>
            )}
          </div>
        </div>
        <div className="w-full md:w-[250px]">
          <h3 className="text-lg font-semibold mb-3 text-slate-200">Huffman Codes</h3>
          <div className="bg-slate-800/40 rounded-xl p-4 h-[400px] overflow-auto">
            {codes && codes.size > 0 ? (
              <div className="space-y-2">
                {Array.from(codes.entries()).map(([char, code]) => (
                  <div key={char} className="flex justify-between items-center p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700/80 transition-colors">
                    <span className="text-white font-mono bg-slate-900/60 px-2 py-1 rounded">{char}</span>
                    <span className="text-green-400 font-mono">{code}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 text-center mt-4">No codes generated yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add these new visualizer components after the existing ones

function CoinChangeVisualizer({ steps, currentStep }: { steps: any[], currentStep: number }) {
  if (!steps || steps.length === 0 || !steps[currentStep]) return null;
  
  const { amount, denominations, coinsUsed, currentCoin } = steps[currentStep];
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-slate-200">Coin Change Solution</h3>
      <div className="bg-slate-800/40 rounded-xl p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <span className="text-slate-300 text-sm">Target Amount:</span>
            <div className="text-2xl font-bold text-green-400">${amount}</div>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <span className="text-slate-300 text-sm">Remaining:</span>
            <div className="text-2xl font-bold text-amber-400">${steps[currentStep].remainingAmount}</div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-2 text-slate-300">Available Denominations</h4>
          <div className="flex flex-wrap gap-2">
            {denominations.map((denom: number) => (
              <div 
                key={denom} 
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${denom === currentCoin ? 'bg-blue-500 ring-2 ring-blue-300' : 'bg-slate-600'}`}
              >
                ${denom}
              </div>
            ))}
          </div>
        </div>
        
        {coinsUsed.length > 0 && (
          <div>
            <h4 className="text-md font-semibold mb-2 text-slate-300">Coins Used</h4>
            <div className="space-y-2">
              {coinsUsed.map((coin: Coin, idx: number) => (
                <div key={idx} className="flex items-center bg-slate-700/50 p-3 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold mr-3">
                    ${coin.value}
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-300">Count: <span className="text-green-400 font-bold">{coin.count}</span></div>
                    <div className="text-slate-300">Total: <span className="text-green-400 font-bold">${coin.value * coin.count}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FractionalKnapsackVisualizer({ steps, currentStep }: { steps: any[], currentStep: number }) {
  if (!steps || steps.length === 0 || !steps[currentStep]) return null;
  
  const { capacity, remainingCapacity, items, selectedItems, currentItem, totalValue } = steps[currentStep];
  
  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3 text-slate-200">Available Items</h3>
          <div className="bg-slate-800/40 rounded-xl p-4 h-[400px] overflow-auto">
            <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-2 mb-2 text-xs text-slate-400 border-b border-slate-700 pb-2">
              <div className="font-semibold">ID</div>
              <div className="font-semibold">Weight</div>
              <div className="font-semibold">Value</div>
              <div className="font-semibold">Ratio</div>
            </div>
            {items.map((item: Item) => (
              <div 
                key={item.id} 
                className={`grid grid-cols-[auto_1fr_1fr_1fr] gap-2 p-2 rounded-lg mb-1 ${currentItem && currentItem.id === item.id ? 'bg-blue-500/30 ring-1 ring-blue-400' : 'bg-slate-700/50'}`}
              >
                <div className="font-bold text-white">{item.id}</div>
                <div className="text-slate-300">{item.weight}</div>
                <div className="text-green-400">{item.value}</div>
                <div className="text-amber-400">{item.ratio?.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3 text-slate-200">Knapsack</h3>
          <div className="bg-slate-800/40 rounded-xl p-4 h-[400px] overflow-auto">
            <div className="flex justify-between items-center mb-4 bg-slate-700/50 p-3 rounded-lg">
              <div>
                <div className="text-slate-400 text-xs">Capacity</div>
                <div className="text-xl font-bold text-white">{capacity}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">Remaining</div>
                <div className="text-xl font-bold text-amber-400">{remainingCapacity.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">Total Value</div>
                <div className="text-xl font-bold text-green-400">{totalValue.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              {selectedItems.map((item: Item) => (
                <div key={item.id} className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-white font-bold">Item {item.id}</span>
                    <span className="text-green-400 font-bold">{(item.fraction! * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full" 
                      style={{ width: `${item.fraction! * 100}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 text-xs">
                    <div className="text-slate-400">Weight: <span className="text-white">{(item.weight * item.fraction!).toFixed(2)}</span></div>
                    <div className="text-slate-400">Value: <span className="text-green-400">{(item.value * item.fraction!).toFixed(2)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobSequencingVisualizer({ steps, currentStep }: { steps: any[], currentStep: number }) {
  if (!steps || steps.length === 0 || !steps[currentStep]) return null;
  
  const { jobs, sequence, currentJob, result, totalProfit } = steps[currentStep];
  
  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3 text-slate-200">Available Jobs</h3>
          <div className="bg-slate-800/40 rounded-xl p-4 h-[400px] overflow-auto">
            <div className="grid grid-cols-3 gap-2 mb-2 text-xs text-slate-400 border-b border-slate-700 pb-2">
              <div className="font-semibold">Job ID</div>
              <div className="font-semibold">Deadline</div>
              <div className="font-semibold">Profit</div>
            </div>
            {jobs.map((job: Job) => (
              <div 
                key={job.id} 
                className={`grid grid-cols-3 gap-2 p-2 rounded-lg mb-1 ${currentJob && currentJob.id === job.id ? 'bg-blue-500/30 ring-1 ring-blue-400' : 'bg-slate-700/50'}`}
              >
                <div className="font-bold text-white">{job.id}</div>
                <div className="text-slate-300">{job.deadline}</div>
                <div className="text-green-400">{job.profit}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3 text-slate-200">Job Sequence</h3>
          <div className="bg-slate-800/40 rounded-xl p-4 h-[400px] overflow-auto">
            <div className="bg-slate-700/50 p-3 rounded-lg mb-4">
              <div className="text-slate-400 text-xs">Total Profit</div>
              <div className="text-2xl font-bold text-green-400">{totalProfit}</div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2 text-slate-300">Time Slots</h4>
              <div className="flex flex-wrap gap-2">
                {sequence.map((jobId: number, idx: number) => (
                  <div 
                    key={idx} 
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${jobId !== -1 ? 'bg-green-500' : 'bg-slate-600'}`}
                  >
                    {jobId !== -1 ? jobId : '-'}
                  </div>
                ))}
              </div>
            </div>
            
            {result && result.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2 text-slate-300">Selected Jobs</h4>
                <div className="space-y-2">
                  {result.map((job: Job) => (
                    <div key={job.id} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                      <div className="font-bold text-white">Job {job.id}</div>
                      <div className="text-slate-300">Deadline: <span className="text-amber-400">{job.deadline}</span></div>
                      <div className="text-slate-300">Profit: <span className="text-green-400">{job.profit}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GreedyAlgorithmsPage() {
  const [selected, setSelected] = useState(0);
  const [params, setParams] = useState<any>({ activities: generateRandomActivities() });
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
  
  // Run algorithm
  const runAlgorithm = () => {
    let algoSteps: any[] = [];
    const problem = greedyProblems[selected];
    try {
      if (problem.name === "Activity Selection") {
        algoSteps = problem.getSteps(params.activities);
      } else if (problem.name === "Huffman Coding") {
        algoSteps = problem.getSteps(params.text || '');
      } else if (problem.name === "Coin Change") {
        algoSteps = problem.getSteps(params.amount || 0, params.denominations || []);
      } else if (problem.name === "Fractional Knapsack") {
        algoSteps = problem.getSteps(params.capacity || 0, params.items || []);
      } else if (problem.name === "Job Sequencing") {
        algoSteps = problem.getSteps(params.jobs || []);
      }
      
      if (!algoSteps || algoSteps.length === 0) {
        setExplanation("Invalid input or no steps to visualize. Please check your input.");
        setSteps([]);
        setIsPlaying(false);
        return;
      }
      
      setSteps(algoSteps);
      setCurrentStep(0);
      setIsPlaying(true);
      setExplanation(algoSteps[0].explanation);
    } catch (e) {
      setExplanation("An error occurred. Please check your input values.");
      setSteps([]);
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
      setExplanation(steps[currentStep + 1].explanation);
    }, 900);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps]);
  
  // Reset on problem change
  useEffect(() => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setExplanation("");
    
    // Initialize parameters based on selected algorithm
    if (selected === 0) {
      // Activity Selection
      setParams({ activities: generateRandomActivities() });
    } else if (selected === 1) {
      // Huffman Coding
      setParams({ text: "" });
    } else if (selected === 2) {
      // Coin Change
      setParams({ amount: 0, denominations: [] });
    } else if (selected === 3) {
      // Fractional Knapsack
      setParams({ capacity: 0, items: [] });
    } else if (selected === 4) {
      // Job Sequencing
      setParams({ jobs: [] });
    }
  }, [selected]);
  
  // Handle param change for Huffman Coding
  const handleTextChange = (value: string) => {
    setParams({ text: value });
  };
  
  // Handle randomize for Activity Selection
  const handleRandomize = () => {
    setParams({ activities: generateRandomActivities() });
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setExplanation("");
  };
  
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8 mt-10">
      <canvas ref={canvasRef} width={800} height={400} className="absolute top-0 left-0 w-full h-[400px] pointer-events-none z-0" />
      <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-center mb-10 mt-16">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent"
              style={{
                textShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
              }}
              animate={{
                backgroundPosition: ['0%', '100%', '0%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              Greedy Algorithms
            </motion.h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-green-400 via-teal-400 to-emerald-500 rounded-full mb-8"></div>
          </motion.div>
        <Card className="bg-slate-900/60 border-2 border-slate-700/50 shadow-xl backdrop-blur-md rounded-2xl max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-xl">Select a Problem</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Choose a greedy algorithm problem to visualize
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 w-full mt-4 mb-6">
              {greedyProblems.map((prob, idx) => (
                <button
                  key={prob.name}
                  onClick={() => setSelected(idx)}
                  className={`flex-1 h-12 flex items-center justify-center px-2 py-2 rounded-xl font-semibold text-white shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-normal text-center overflow-hidden truncate leading-tight ${
                    selected === idx
                      ? `${greedyButtonThemes[idx]} scale-110 ring-2 ring-blue-400`
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
                <div className="text-slate-300 font-semibold mb-1">{greedyProblems[selected].name}</div>
                <div className="text-slate-400 text-sm">{greedyProblems[selected].description}</div>
              </div>
            </div>
            <span className="block text-slate-400 text-sm mb-2">{greedyExamples[selected].tip}</span>
            <ExampleInputCard idx={selected} onUse={() => {
              setParams({ ...params, ...greedyExamples[selected].example });
            }} />
            
            {/* Algorithm-specific visualizer */}
            {selected === 0 ? (
            <ActivitySelectionVisualizer steps={steps} currentStep={currentStep} />
            ) : selected === 1 ? (
            <HuffmanCodingVisualizer steps={steps} currentStep={currentStep} />
            ) : selected === 2 ? (
            <CoinChangeVisualizer steps={steps} currentStep={currentStep} />
            ) : selected === 3 ? (
            <FractionalKnapsackVisualizer steps={steps} currentStep={currentStep} />
            ) : (
            <JobSequencingVisualizer steps={steps} currentStep={currentStep} />
            )}
            
            {/* Input controls based on selected algorithm */}
            <div className="flex gap-4 mt-2 mb-6 items-center w-full">
            {selected === 0 ? (
            <Button onClick={handleRandomize} className="bg-purple-500 hover:bg-purple-600 flex items-center gap-x-2 justify-center">
            <Shuffle className="w-4 h-4" />
            <span>Randomize Activities</span>
            </Button>
            ) : selected === 1 ? (
            <div className="flex flex-col w-full">
            <label className="text-xs text-slate-400 mb-1" htmlFor="huffmanText">Input Text</label>
            <Input
            id="huffmanText"
            type="text"
            value={params.text || ''}
            onChange={e => handleTextChange(e.target.value)}
            className="w-full"
            placeholder="Enter text for Huffman coding (e.g. 'abracadabra')"
            />
            </div>
            ) : selected === 2 ? (
            <div className="flex flex-col w-full gap-2">
            <div className="flex gap-4">
            <div className="flex-1">
            <label className="text-xs text-slate-400 mb-1" htmlFor="coinAmount">Amount</label>
            <Input
            id="coinAmount"
            type="number"
            value={params.amount || ''}
            onChange={e => setParams({...params, amount: parseInt(e.target.value) || 0})}
            className="w-full"
            placeholder="Enter amount (e.g. 63)"
            />
            </div>
            <div className="flex-1">
            <label className="text-xs text-slate-400 mb-1" htmlFor="coinDenominations">Denominations</label>
            <Input
            id="coinDenominations"
            type="text"
            value={params.denominations ? params.denominations.join(', ') : ''}
            onChange={e => {
            const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setParams({...params, denominations: values});
            }}
            className="w-full"
            placeholder="Enter denominations (e.g. 1, 5, 10, 25)"
            />
            </div>
            </div>
            </div>
            ) : selected === 3 ? (
            <div className="flex flex-col w-full gap-2">
            <div className="flex gap-4">
            <div className="flex-1">
            <label className="text-xs text-slate-400 mb-1" htmlFor="knapsackCapacity">Capacity</label>
            <Input
            id="knapsackCapacity"
            type="number"
            value={params.capacity || ''}
            onChange={e => setParams({...params, capacity: parseInt(e.target.value) || 0})}
            className="w-full"
            placeholder="Enter knapsack capacity"
            />
            </div>
            <Button 
            onClick={() => {
            const randomItems = Array.from({length: 5}, (_, i) => ({
            id: i + 1,
            weight: Math.floor(Math.random() * 30) + 5,
            value: Math.floor(Math.random() * 100) + 20
            }));
            setParams({...params, items: randomItems});
            }} 
            className="bg-purple-500 hover:bg-purple-600 self-end"
            >
            <Shuffle className="w-4 h-4 mr-2" />
            <span>Random Items</span>
            </Button>
            </div>
            {params.items && params.items.length > 0 && (
            <div className="mt-2 bg-slate-800/40 p-2 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Items (ID, Weight, Value)</div>
            <div className="flex flex-wrap gap-2">
            {params.items.map((item: Item) => (
            <div key={item.id} className="bg-slate-700/50 px-2 py-1 rounded text-xs">
            {item.id}: {item.weight}kg, ${item.value}
            </div>
            ))}
            </div>
            </div>
            )}
            </div>
            ) : (
            <div className="flex flex-col w-full gap-2">
            <Button 
            onClick={() => {
            const randomJobs = Array.from({length: 5}, (_, i) => ({
            id: i + 1,
            deadline: Math.floor(Math.random() * 5) + 1,
            profit: Math.floor(Math.random() * 50) + 10
            }));
            setParams({...params, jobs: randomJobs});
            }} 
            className="bg-purple-500 hover:bg-purple-600"
            >
            <Shuffle className="w-4 h-4 mr-2" />
            <span>Generate Random Jobs</span>
            </Button>
            {params.jobs && params.jobs.length > 0 && (
            <div className="mt-2 bg-slate-800/40 p-2 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Jobs (ID, Deadline, Profit)</div>
            <div className="flex flex-wrap gap-2">
            {params.jobs.map((job: Job) => (
            <div key={job.id} className="bg-slate-700/50 px-2 py-1 rounded text-xs">
            {job.id}: D{job.deadline}, ${job.profit}
            </div>
            ))}
            </div>
            </div>
            )}
            </div>
            ) }
            <Button onClick={runAlgorithm} disabled={isPlaying} className="bg-green-500 hover:bg-green-600 flex items-center gap-x-2 justify-center">
            <Play className="w-5 h-5" />
            <span>Run</span>
            </Button>
            <Button onClick={() => {
            setCurrentStep(0);
            setExplanation("");
            setIsPlaying(false);
            setSteps([]);
            }} disabled={currentStep === 0} variant="outline">
            <RotateCcw className="w-4 h-4" />
            </Button>
            </div>
            </CardContent>
            </Card>
            </div>
            </motion.div>
            );
            }