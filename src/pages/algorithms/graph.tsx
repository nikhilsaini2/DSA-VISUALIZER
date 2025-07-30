import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import * as Tooltip from '@radix-ui/react-tooltip';
import { Plus, Trash, Play, Pause, RotateCcw, Info, Shuffle } from "lucide-react";

interface Node {
  id: string;
  x: number;
  y: number;
  label?: string;
}

interface Edge {
  from: string;
  to: string;
  weight: number;
}

// Default graph data
const defaultNodes: Node[] = [
  { id: "1", x: 100, y: 100, label: "A" },
  { id: "2", x: 250, y: 100, label: "B" },
  { id: "3", x: 400, y: 100, label: "C" },
  { id: "4", x: 100, y: 250, label: "D" },
  { id: "5", x: 250, y: 250, label: "E" },
  { id: "6", x: 400, y: 250, label: "F" }
];

const defaultEdges: Edge[] = [
  { from: "1", to: "2", weight: 4 },
  { from: "2", to: "3", weight: 3 },
  { from: "1", to: "4", weight: 5 },
  { from: "2", to: "5", weight: 2 },
  { from: "3", to: "6", weight: 6 },
  { from: "4", to: "5", weight: 4 },
  { from: "5", to: "6", weight: 3 }
];

const algorithms = [
  { 
    name: "BFS", 
    color: "bg-blue-500",
    description: "Breadth-First Search traverses level by level, visiting all neighbors before moving deeper."
  },
  { 
    name: "DFS", 
    color: "bg-purple-500",
    description: "Depth-First Search explores as far as possible along each branch before backtracking."
  },
  { 
    name: "Dijkstra's", 
    color: "bg-green-500",
    description: "Finds the shortest path between nodes in a weighted graph."
  },
  { 
    name: "Prim's", 
    color: "bg-cyan-500",
    description: "Finds a minimum spanning tree for a weighted undirected graph."
  },
  { 
    name: "Kruskal's", 
    color: "bg-pink-500",
    description: "Another algorithm to find the minimum spanning tree using a greedy approach."
  }
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomGraph(numNodes = 8, numEdges = 12) {
  // Place nodes in a circle
  const centerX = 400, centerY = 200, radius = 140;
  const nodes = Array.from({ length: numNodes }, (_, i) => {
    const angle = (2 * Math.PI * i) / numNodes;
    return {
      id: String(i + 1),
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      label: String.fromCharCode(65 + i)
    };
  });
  const edges: Edge[] = [];
  const edgeSet = new Set();
  // Ensure the graph is connected by making a ring
  for (let i = 0; i < numNodes; i++) {
    const from = nodes[i].id;
    const to = nodes[(i + 1) % numNodes].id;
    const key = [from, to].sort().join('-');
    edgeSet.add(key);
    edges.push({ from, to, weight: getRandomInt(1, 9) });
  }
  // Add extra random edges
  while (edges.length < numEdges) {
    const a = getRandomInt(0, numNodes - 1);
    let b = getRandomInt(0, numNodes - 1);
    while (b === a) b = getRandomInt(0, numNodes - 1);
    const key = [nodes[a].id, nodes[b].id].sort().join('-');
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push({ from: nodes[a].id, to: nodes[b].id, weight: getRandomInt(1, 9) });
    }
  }
  return { nodes, edges };
}

// Graph templates
const graphTemplates = [
  {
    name: "Cycle (Ring)",
    nodes: Array.from({ length: 8 }, (_, i) => {
      const angle = (2 * Math.PI * i) / 8;
      return {
        id: String(i + 1),
        x: 400 + 140 * Math.cos(angle),
        y: 200 + 140 * Math.sin(angle),
        label: String.fromCharCode(65 + i)
      };
    }),
    edges: Array.from({ length: 8 }, (_, i) => ({
      from: String(i + 1),
      to: String(((i + 1) % 8) + 1),
      weight: getRandomInt(1, 9)
    }))
  },
  {
    name: "Star",
    nodes: [
      { id: "1", x: 400, y: 200, label: "A" },
      ...Array.from({ length: 7 }, (_, i) => {
        const angle = (2 * Math.PI * i) / 7;
        return {
          id: String(i + 2),
          x: 400 + 120 * Math.cos(angle),
          y: 200 + 120 * Math.sin(angle),
          label: String.fromCharCode(66 + i)
        };
      })
    ],
    edges: Array.from({ length: 7 }, (_, i) => ({
      from: "1",
      to: String(i + 2),
      weight: getRandomInt(1, 9)
    }))
  },
  {
    name: "Grid",
    nodes: Array.from({ length: 9 }, (_, i) => ({
      id: String(i + 1),
      x: 220 + 80 * (i % 3),
      y: 120 + 80 * Math.floor(i / 3),
      label: String.fromCharCode(65 + i)
    })),
    edges: [
      // Horizontal
      ...Array.from({ length: 9 }, (_, i) => (i % 3 < 2 ? { from: String(i + 1), to: String(i + 2), weight: getRandomInt(1, 9) } : null)).filter(Boolean),
      // Vertical
      ...Array.from({ length: 6 }, (_, i) => ({ from: String(i + 1), to: String(i + 4), weight: getRandomInt(1, 9) }))
    ]
  },
  {
    name: "Tree",
    nodes: [
      { id: "1", x: 400, y: 80, label: "A" },
      { id: "2", x: 280, y: 180, label: "B" },
      { id: "3", x: 520, y: 180, label: "C" },
      { id: "4", x: 220, y: 300, label: "D" },
      { id: "5", x: 340, y: 300, label: "E" },
      { id: "6", x: 460, y: 300, label: "F" },
      { id: "7", x: 580, y: 300, label: "G" }
    ],
    edges: [
      { from: "1", to: "2", weight: 2 }, { from: "1", to: "3", weight: 3 },
      { from: "2", to: "4", weight: 4 }, { from: "2", to: "5", weight: 5 },
      { from: "3", to: "6", weight: 6 }, { from: "3", to: "7", weight: 7 }
    ]
  },
  {
    name: "Complete",
    nodes: Array.from({ length: 6 }, (_, i) => {
      const angle = (2 * Math.PI * i) / 6;
      return {
        id: String(i + 1),
        x: 400 + 120 * Math.cos(angle),
        y: 200 + 120 * Math.sin(angle),
        label: String.fromCharCode(65 + i)
      };
    }),
    edges: (() => {
      const edges: Edge[] = [];
      for (let i = 0; i < 6; i++) {
        for (let j = i + 1; j < 6; j++) {
          edges.push({ from: String(i + 1), to: String(j + 1), weight: getRandomInt(1, 9) });
        }
      }
      return edges;
    })()
  },
  {
    name: "Bipartite",
    nodes: [
      ...Array.from({ length: 3 }, (_, i) => ({ id: String(i + 1), x: 300, y: 120 + i * 80, label: String.fromCharCode(65 + i) })),
      ...Array.from({ length: 3 }, (_, i) => ({ id: String(i + 4), x: 500, y: 120 + i * 80, label: String.fromCharCode(68 + i) }))
    ],
    edges: [
      { from: "1", to: "4", weight: 2 }, { from: "1", to: "5", weight: 3 }, { from: "1", to: "6", weight: 4 },
      { from: "2", to: "4", weight: 5 }, { from: "2", to: "5", weight: 6 }, { from: "2", to: "6", weight: 7 },
      { from: "3", to: "4", weight: 8 }, { from: "3", to: "5", weight: 9 }, { from: "3", to: "6", weight: 1 }
    ]
  },
  {
    name: "Wheel",
    nodes: [
      { id: "1", x: 400, y: 200, label: "A" },
      ...Array.from({ length: 7 }, (_, i) => {
        const angle = (2 * Math.PI * i) / 7;
        return {
          id: String(i + 2),
          x: 400 + 120 * Math.cos(angle),
          y: 200 + 120 * Math.sin(angle),
          label: String.fromCharCode(66 + i)
        };
      })
    ],
    edges: [
      ...Array.from({ length: 7 }, (_, i) => ({ from: "1", to: String(i + 2), weight: getRandomInt(1, 9) })),
      ...Array.from({ length: 7 }, (_, i) => ({ from: String(i + 2), to: String(((i + 1) % 7) + 2), weight: getRandomInt(1, 9) }))
    ]
  },
  {
    name: "Ladder",
    nodes: [
      ...Array.from({ length: 6 }, (_, i) => ({ id: String(i + 1), x: 300, y: 100 + i * 40, label: String.fromCharCode(65 + i) })),
      ...Array.from({ length: 6 }, (_, i) => ({ id: String(i + 7), x: 500, y: 100 + i * 40, label: String.fromCharCode(71 + i) }))
    ],
    edges: [
      // Rungs
      ...Array.from({ length: 6 }, (_, i) => ({ from: String(i + 1), to: String(i + 7), weight: getRandomInt(1, 9) })),
      // Sides
      ...Array.from({ length: 5 }, (_, i) => ({ from: String(i + 1), to: String(i + 2), weight: getRandomInt(1, 9) })),
      ...Array.from({ length: 5 }, (_, i) => ({ from: String(i + 7), to: String(i + 8), weight: getRandomInt(1, 9) }))
    ]
  }
];

export default function GraphAlgorithmsPage() {
  const [selected, setSelected] = useState("BFS");
  const [nodes, setNodes] = useState<Node[]>(defaultNodes);
  const [edges, setEdges] = useState<Edge[]>(defaultEdges);
  const [isAddingEdge, setIsAddingEdge] = useState(false);
  const [isAddingNode, setIsAddingNode] = useState(false);  // New state for node adding mode
  const [fromNode, setFromNode] = useState<string | null>(null);
  const [weight, setWeight] = useState("1");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [visitedEdges, setVisitedEdges] = useState<Edge[]>([]);
  const [explanation, setExplanation] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [startNode, setStartNode] = useState<string | null>("1");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[0]);
  const [steps, setSteps] = useState<any[]>([]); // Store steps for animation
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<{from: string, to: string} | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  // Reset visualization state when algorithm changes
  useEffect(() => {
    setVisitedNodes([]);
    setVisitedEdges([]);
    setExplanation("");
    setCurrentStep(0);
    setIsPlaying(false);
    setSteps([]);
  }, [selected]);

  // Handle canvas click for adding nodes
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    // Adjust for canvas scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Check if we clicked near any existing node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
      return distance < 25; // Node radius + some padding
    });

    if (clickedNode) {
      // If we're adding an edge
      if (isAddingEdge) {
        handleNodeClick(clickedNode.id);
      } else {
        // Set as start node if not in any special mode
        if (!isAddingNode && !isAddingEdge) {
          setStartNode(clickedNode.id);
          setExplanation(`Set node ${clickedNode.label || clickedNode.id} as start node`);
        }
      }
      return;
    }

    // Only add new node if we're in add node mode and didn't click an existing node
    if (isAddingNode) {
      const radius = 20; // Node radius
      const newNode: Node = {
        id: String(nodes.length + 1),
        x: x,
        y: y,
        label: String.fromCharCode(65 + nodes.length) // A, B, C, etc.
      };
      setNodes([...nodes, newNode]);
    }
  };

  // Handle node click for adding edges
  const handleNodeClick = (nodeId: string) => {
    if (!isAddingEdge) return;
    
    if (fromNode === null) {
      setFromNode(nodeId);
    } else if (fromNode !== nodeId) {
      // Check if edge already exists (undirected)
      const existingIndex = edges.findIndex(
        e => (e.from === fromNode && e.to === nodeId) || (e.from === nodeId && e.to === fromNode)
      );
      if (existingIndex !== -1) {
        // Update weight
        const updatedEdges = [...edges];
        updatedEdges[existingIndex] = {
          ...updatedEdges[existingIndex],
          weight: parseInt(weight)
        };
        setEdges(updatedEdges);
      } else {
        // Add new edge
        const newEdge: Edge = {
          from: fromNode,
          to: nodeId,
          weight: parseInt(weight)
        };
        setEdges([...edges, newEdge]);
      }
      setFromNode(null);
      setIsAddingEdge(false);
    }
  };

  // Clear the graph
  const clearGraph = () => {
    setNodes(defaultNodes);
    setEdges(defaultEdges);
    setVisitedNodes([]);
    setVisitedEdges([]);
    setFromNode(null);
    setIsAddingEdge(false);
    setCurrentStep(0);
    setIsPlaying(false);
    setExplanation("");
  };

  // BFS Implementation
  const bfs = (startNodeId: string) => {
    const steps: { visitedNodes: string[], visitedEdges: Edge[], explanation: string }[] = [];
    const queue: string[] = [startNodeId];
    const visited = new Set<string>();
    const edgesVisited: Edge[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (!visited.has(current)) {
        visited.add(current);
        steps.push({
          visitedNodes: Array.from(visited),
          visitedEdges: [...edgesVisited],
          explanation: `Visiting node ${current}`
        });

        // Find all adjacent nodes
        edges
          .filter(edge => edge.from === current || edge.to === current)
          .forEach(edge => {
            const nextNode = edge.from === current ? edge.to : edge.from;
            if (!visited.has(nextNode)) {
              queue.push(nextNode);
              edgesVisited.push(edge);
              steps.push({
                visitedNodes: Array.from(visited),
                visitedEdges: [...edgesVisited],
                explanation: `Adding node ${nextNode} to queue`
              });
            }
          });
      }
    }
    return steps;
  };

  // DFS Implementation
  const dfs = (startNodeId: string) => {
    const steps: { visitedNodes: string[], visitedEdges: Edge[], explanation: string }[] = [];
    const visited = new Set<string>();
    const edgesVisited: Edge[] = [];
    function dfsVisit(nodeId: string) {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      steps.push({
        visitedNodes: Array.from(visited),
        visitedEdges: [...edgesVisited],
        explanation: `Visiting node ${nodeId}`
      });
      edges
        .filter(edge => edge.from === nodeId || edge.to === nodeId)
        .forEach(edge => {
          const nextNode = edge.from === nodeId ? edge.to : edge.from;
          if (!visited.has(nextNode)) {
            edgesVisited.push(edge);
            steps.push({
              visitedNodes: Array.from(visited),
              visitedEdges: [...edgesVisited],
              explanation: `Traversing edge to node ${nextNode}`
            });
            dfsVisit(nextNode);
          }
        });
    }
    dfsVisit(startNodeId);
    return steps;
  };

  // Dijkstra's Implementation (visualizes shortest path tree from start node)
  const dijkstra = (startNodeId: string) => {
    const steps: { visitedNodes: string[], visitedEdges: Edge[], explanation: string }[] = [];
    const distances: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    const visited = new Set<string>();
    const edgesVisited: Edge[] = [];
    nodes.forEach(n => { distances[n.id] = Infinity; prev[n.id] = null; });
    distances[startNodeId] = 0;
    const queue = [...nodes.map(n => n.id)];
    while (queue.length > 0) {
      queue.sort((a, b) => distances[a] - distances[b]);
      const current = queue.shift()!;
      if (distances[current] === Infinity) break;
      visited.add(current);
      steps.push({
        visitedNodes: Array.from(visited),
        visitedEdges: [...edgesVisited],
        explanation: `Visiting node ${current} with distance ${distances[current]}`
      });
      edges.filter(e => e.from === current || e.to === current).forEach(edge => {
        const neighbor = edge.from === current ? edge.to : edge.from;
        if (!visited.has(neighbor)) {
          const alt = distances[current] + edge.weight;
          if (alt < distances[neighbor]) {
            distances[neighbor] = alt;
            prev[neighbor] = current;
            edgesVisited.push(edge);
            steps.push({
              visitedNodes: Array.from(visited),
              visitedEdges: [...edgesVisited],
              explanation: `Updating distance for node ${neighbor} to ${alt}`
            });
          }
        }
      });
    }
    return steps;
  };

  // Prim's Implementation (Minimum Spanning Tree)
  const prim = (startNodeId: string) => {
    const steps: { visitedNodes: string[], visitedEdges: Edge[], explanation: string }[] = [];
    const visited = new Set<string>();
    const edgesVisited: Edge[] = [];
    visited.add(startNodeId);
    steps.push({
      visitedNodes: Array.from(visited),
      visitedEdges: [...edgesVisited],
      explanation: `Starting at node ${startNodeId}`
    });
    while (visited.size < nodes.length) {
      // Find the minimum edge connecting visited to unvisited
      let minEdge: Edge | null = null;
      let minWeight = Infinity;
      edges.forEach(edge => {
        const inVisited = visited.has(edge.from) !== visited.has(edge.to);
        if (inVisited && edge.weight < minWeight) {
          minEdge = edge;
          minWeight = edge.weight;
        }
      });
      if (!minEdge) break;
      edgesVisited.push(minEdge);
      visited.add(visited.has(minEdge.from) ? minEdge.to : minEdge.from);
      steps.push({
        visitedNodes: Array.from(visited),
        visitedEdges: [...edgesVisited],
        explanation: `Adding edge (${minEdge.from}, ${minEdge.to}) with weight ${minEdge.weight}`
      });
    }
    return steps;
  };

  // Kruskal's Implementation (Minimum Spanning Tree)
  const kruskal = () => {
    const steps: { visitedNodes: string[], visitedEdges: Edge[], explanation: string }[] = [];
    const parent: Record<string, string> = {};
    nodes.forEach(n => { parent[n.id] = n.id; });
    function find(u: string): string {
      if (parent[u] !== u) parent[u] = find(parent[u]);
      return parent[u];
    }
    function union(u: string, v: string) {
      parent[find(u)] = find(v);
    }
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    const edgesVisited: Edge[] = [];
    let count = 0;
    for (const edge of sortedEdges) {
      if (find(edge.from) !== find(edge.to)) {
        union(edge.from, edge.to);
        edgesVisited.push(edge);
        count++;
        steps.push({
          visitedNodes: [],
          visitedEdges: [...edgesVisited],
          explanation: `Adding edge (${edge.from}, ${edge.to}) with weight ${edge.weight}`
        });
        if (count === nodes.length - 1) break;
      }
    }
    return steps;
  };

  // Run algorithm
  const runAlgorithm = () => {
    if (!startNode || nodes.length === 0) {
      setExplanation("Please select a start node first!");
      return;
    }

    let algoSteps;
    switch (selected) {
      case "BFS":
        algoSteps = bfs(startNode);
        break;
      case "DFS":
        algoSteps = dfs(startNode);
        break;
      case "Dijkstra's":
        algoSteps = dijkstra(startNode);
        break;
      case "Prim's":
        algoSteps = prim(startNode);
        break;
      case "Kruskal's":
        algoSteps = kruskal();
        break;
      default:
        algoSteps = [];
    }

    if (algoSteps.length > 0) {
      setSteps(algoSteps);
      setCurrentStep(0);
      setIsPlaying(true);
      updateVisualization(algoSteps, 0);
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
      updateVisualization(steps, currentStep + 1);
    }, 900); // Animation speed (ms)
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps]);

  // Update visualization based on current step
  const updateVisualization = (steps: any[], step: number) => {
    if (step < steps.length) {
      setVisitedNodes(steps[step].visitedNodes);
      setVisitedEdges(steps[step].visitedEdges);
      setExplanation(steps[step].explanation);
      setCurrentStep(step);
    } else {
      setIsPlaying(false);
    }
  };

  // Random graph generator
  const handleRandomGraph = () => {
    const idx = getRandomInt(0, graphTemplates.length - 1);
    setSelectedTemplate(idx);
    setNodes(graphTemplates[idx].nodes);
    setEdges(graphTemplates[idx].edges);
    setVisitedNodes([]);
    setVisitedEdges([]);
    setExplanation("");
    setCurrentStep(0);
    setIsPlaying(false);
    setSteps([]);
    setStartNode(graphTemplates[idx].nodes[0].id);
  };

  // Template selector handler
  const handleTemplateSelect = (idx: number) => {
    setSelectedTemplate(idx);
    setNodes(graphTemplates[idx].nodes);
    setEdges(graphTemplates[idx].edges);
    setVisitedNodes([]);
    setVisitedEdges([]);
    setExplanation("");
    setCurrentStep(0);
    setIsPlaying(false);
    setSteps([]);
    setStartNode(graphTemplates[idx].nodes[0].id);
  };

  // Enhanced draw function with animated background
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle animated background (moving dots)
    for (let i = 0; i < 30; i++) {
      const t = Date.now() / 1000 + i;
      const x = 400 + 350 * Math.cos(t + i);
      const y = 200 + 180 * Math.sin(t + i * 1.3);
      ctx.beginPath();
      ctx.arc(x, y, 2 + Math.sin(t + i) * 1.5, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(80,180,255,0.08)';
      ctx.fill();
    }

    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        ctx.save();
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
        const isVisited = visitedEdges.some(
          ve => (ve.from === edge.from && ve.to === edge.to) || (ve.from === edge.to && ve.to === edge.from)
        );
        const isHovered = hoveredEdge && ((hoveredEdge.from === edge.from && hoveredEdge.to === edge.to) || (hoveredEdge.from === edge.to && hoveredEdge.to === edge.from));
        if (isVisited) {
          gradient.addColorStop(0, '#22c55e');
          gradient.addColorStop(1, '#16a34a');
          ctx.shadowColor = '#22c55e';
          ctx.shadowBlur = 10;
        } else if (isHovered) {
          gradient.addColorStop(0, '#f472b6');
          gradient.addColorStop(1, '#818cf8');
          ctx.shadowColor = '#f472b6';
          ctx.shadowBlur = 12;
        } else {
          gradient.addColorStop(0, '#94a3b8');
          gradient.addColorStop(1, '#64748b');
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }
        ctx.strokeStyle = gradient;
        ctx.lineWidth = isHovered ? 5 : 3;
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
        ctx.restore();

        // Draw weight with background
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.save();
        ctx.fillStyle = isHovered ? '#f472b6' : 'rgba(15, 23, 42, 0.8)';
        ctx.beginPath();
        ctx.arc(midX, midY, isHovered ? 16 : 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = isHovered ? 'bold 16px Arial' : 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(edge.weight), midX, midY);
        ctx.restore();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.save();
      ctx.beginPath();
      const isVisited = visitedNodes.includes(node.id);
      const isStart = node.id === startNode;
      const isHovered = hoveredNode === node.id;
      const gradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, 20
      );
      if (isStart) {
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#2563eb');
        ctx.shadowColor = '#3b82f6';
      } else if (isVisited) {
        gradient.addColorStop(0, '#22c55e');
        gradient.addColorStop(1, '#16a34a');
        ctx.shadowColor = '#22c55e';
      } else if (isHovered) {
        gradient.addColorStop(0, '#f472b6');
        gradient.addColorStop(1, '#818cf8');
        ctx.shadowColor = '#f472b6';
      } else {
        gradient.addColorStop(0, '#1e293b');
        gradient.addColorStop(1, '#0f172a');
        ctx.shadowColor = '#94a3b8';
      }
      ctx.shadowBlur = isHovered ? 24 : 15;
      ctx.fillStyle = gradient;
      ctx.arc(node.x, node.y, isHovered ? 26 : 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Draw node label
      ctx.fillStyle = '#ffffff';
      ctx.font = isHovered ? 'bold 18px Arial' : 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label || node.id, node.x, node.y);
      ctx.restore();
    });
  }, [nodes, edges, visitedNodes, visitedEdges, startNode, hoveredNode, hoveredEdge]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }} 
      className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-black py-8 mt-10"
    >
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2, duration: 0.8 }} 
          className="text-3xl md:text-4xl font-bold mb-8 mt-16 text-center bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent drop-shadow-glow animate-gradient-x"
        >
          Graph Algorithms
          <span className="block h-1 w-2/3 mx-auto mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 rounded-full animate-underline" />
        </motion.h1>

        <Card className="bg-white/20 dark:bg-slate-800/60 border-2 border-transparent shadow-xl backdrop-blur-md rounded-2xl max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-xl">Select an Algorithm</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Choose a graph algorithm to visualize
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Algorithm Selection */}
              <div className="flex flex-wrap gap-3">
                {algorithms.map((algo) => (
                  <button
                    key={algo.name}
                    onClick={() => {
                      setSelected(algo.name);
                      setSelectedAlgorithm(algo);
                    }}
                    className={`px-4 py-2 rounded-xl font-semibold text-white shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      selected === algo.name ? algo.color + " scale-110 ring-2 ring-blue-400" : "bg-slate-600/70 hover:scale-105"
                    }`}
                    aria-pressed={selected === algo.name}
                    aria-label={`Select ${algo.name}`}
                  >
                    {algo.name}
                  </button>
                ))}
              </div>

              {/* Algorithm Description */}
              <div className="bg-slate-800/40 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <p className="text-slate-300">{selectedAlgorithm.description}</p>
                </div>
              </div>

              {/* Graph Controls */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => {
                    setIsAddingNode(!isAddingNode);
                    setIsAddingEdge(false);
                    if (!isAddingNode) {
                      setExplanation("Click anywhere on the canvas to add a new node");
                    } else {
                      setExplanation("");
                    }
                  }}
                  variant={isAddingNode ? "default" : "outline"}
                  className={`${isAddingNode ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-slate-800"}`}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Node
                </Button>
                <Button
                  onClick={() => {
                    setIsAddingEdge(!isAddingEdge);
                    setIsAddingNode(false);
                    if (!isAddingEdge) {
                      setExplanation("Click two nodes to connect them with an edge");
                    } else {
                      setExplanation("");
                    }
                  }}
                  variant={isAddingEdge ? "default" : "outline"}
                  className={`${isAddingEdge ? "bg-purple-500 hover:bg-purple-600" : "hover:bg-slate-800"}`}
                  disabled={nodes.length < 2}
                >
                  Add Edge
                </Button>
                {isAddingEdge && (
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-20"
                    placeholder="Weight"
                    min="1"
                  />
                )}
                <Button
                  onClick={() => {
                    clearGraph();
                    setIsAddingNode(false);
                    setIsAddingEdge(false);
                    setExplanation("");
                  }}
                  variant="outline"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash className="w-4 h-4 mr-2" /> Clear
                </Button>
                <Button
                  onClick={handleRandomGraph}
                  variant="outline"
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <Shuffle className="w-4 h-4 mr-2" /> Random Graph
                </Button>
              </div>

              {/* Instructions */}
              {isAddingNode ? (
                <div className="bg-slate-800/40 p-4 rounded-xl text-sm text-slate-400">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Click on the canvas to add nodes</li>
                  </ul>
                </div>
              ) : isAddingEdge ? (
                <div className="bg-slate-800/40 p-4 rounded-xl text-sm text-slate-400">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Click two nodes to connect them with an edge</li>
                  </ul>
                </div>
              ) : (
                <div className="bg-slate-800/40 p-4 rounded-xl text-sm text-slate-400">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Click on the canvas to add nodes</li>
                    <li>Click "Add Edge" and select two nodes to connect them</li>
                    <li>Click on a node to set it as the start node (shown in blue)</li>
                    <li>Use the controls below to run and visualize the algorithm</li>
                  </ul>
                </div>
              )}

              {/* Canvas with mode indicator */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={400}
                  onClick={handleCanvasClick}
                  onMouseMove={(e) => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;
                    const rect = canvas.getBoundingClientRect();
                    const scaleX = canvas.width / rect.width;
                    const scaleY = canvas.height / rect.height;
                    const x = (e.clientX - rect.left) * scaleX;
                    const y = (e.clientY - rect.top) * scaleY;

                    let hoveredNodeId: string | null = null;
                    let hoveredEdge: {from: string, to: string} | null = null;

                    nodes.forEach(node => {
                      const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
                      if (distance < 25) { // Node radius + some padding
                        hoveredNodeId = node.id;
                      }
                    });

                    edges.forEach(edge => {
                      const fromNode = nodes.find(n => n.id === edge.from);
                      const toNode = nodes.find(n => n.id === edge.to);
                      if (fromNode && toNode) {
                        const distance = Math.sqrt(Math.pow(fromNode.x - x, 2) + Math.pow(fromNode.y - y, 2));
                        if (distance < 25) { // Node radius + some padding
                          hoveredNodeId = fromNode.id;
                        }
                        const distanceTo = Math.sqrt(Math.pow(toNode.x - x, 2) + Math.pow(toNode.y - y, 2));
                        if (distanceTo < 25) { // Node radius + some padding
                          hoveredNodeId = toNode.id;
                        }

                        const isHovered = (hoveredNodeId === edge.from && hoveredNodeId === edge.to) ||
                                          (hoveredNodeId === edge.to && hoveredNodeId === edge.from);
                        if (isHovered) {
                          hoveredEdge = edge;
                        }
                      }
                    });

                    setHoveredNode(hoveredNodeId);
                    setHoveredEdge(hoveredEdge);
                  }}
                  onMouseLeave={() => {
                    setHoveredNode(null);
                    setHoveredEdge(null);
                  }}
                  className={`w-full h-[400px] bg-slate-900/70 dark:bg-slate-900/80 rounded-xl border-2 transition-colors duration-200 ${
                    isAddingNode 
                      ? "border-blue-500 cursor-crosshair" 
                      : isAddingEdge 
                        ? "border-purple-500 cursor-pointer" 
                        : "border-slate-700 cursor-pointer"
                  }`}
                />
                {(isAddingNode || isAddingEdge) && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-slate-800/90 text-white text-sm">
                    {isAddingNode ? "Adding Node" : "Adding Edge"}
                  </div>
                )}
              </div>

              {/* Algorithm Controls */}
              <div className="flex gap-2 items-center">
                <Button
                  onClick={runAlgorithm}
                  disabled={nodes.length === 0 || isPlaying}
                  className="bg-green-500 hover:bg-green-600 flex items-center gap-x-2 justify-center"
                >
                  <Play className="w-5 h-5" />
                  <span>Run {selected}</span>
                </Button>
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={currentStep === 0}
                  variant="outline"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={() => {
                    setCurrentStep(0);
                    setVisitedNodes([]);
                    setVisitedEdges([]);
                    setExplanation("");
                  }}
                  disabled={currentStep === 0}
                  variant="outline"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Explanation */}
              {explanation && (
                <div className="bg-slate-800/50 p-4 rounded-xl text-white">
                  {explanation}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
} 