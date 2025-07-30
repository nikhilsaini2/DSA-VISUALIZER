import {Link} from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BarChart3, GitBranch, Network, Search, Sigma, Workflow } from "lucide-react"
import { motion } from 'framer-motion';

export default function AlgorithmCategories() {
  const categories = [
    {
      title: "Sorting Algorithms",
      description: "Visualize and compare different sorting techniques",
      icon: <BarChart3 className="h-6 w-6 text-purple-500 group-hover:animate-bounce" />,
      link: "/algorithms/sorting",
      algorithms: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort"],
      status: "implemented",
    },
    {
      title: "Searching Algorithms",
      description: "Explore efficient ways to find elements in data structures",
      icon: <Search className="h-6 w-6 text-blue-500 group-hover:animate-bounce" />,
      link: "/algorithms/searching",
      algorithms: ["Linear Search", "Binary Search"],
      status: "implemented",
    },
    {
      title: "Graph Algorithms",
      description: "Visualize traversal and pathfinding techniques",
      icon: <Network className="h-6 w-6 text-green-500 group-hover:animate-bounce" />,
      link: "/algorithms/graph",
      algorithms: ["BFS", "DFS", "Dijkstra's", "Prim's", "Kruskal's"],
      status: "implemented",
    },
    {
      title: "Dynamic Programming",
      description: "Understand optimization through subproblem solutions",
      icon: <GitBranch className="h-6 w-6 text-yellow-500 group-hover:animate-bounce" />,
      link: "/algorithms/dynamic-programming",
      algorithms: ["Fibonacci", "Knapsack", "LCS", "LIS"],
      status: "implemented",
    },
    {
      title: "Greedy Algorithms",
      description: "Learn optimal local choices for global solutions",
      icon: <Workflow className="h-6 w-6 text-red-500 group-hover:animate-bounce" />,
      link: "/algorithms/greedy",
      algorithms: ["Activity Selection", "Huffman Coding"],
      status: "implemented", // Changed from "coming-soon" to "implemented"
    },
    {
      title: "Mathematical Algorithms",
      description: "Explore fundamental mathematical computations",
      icon: <Sigma className="h-6 w-6 text-pink-500 group-hover:animate-bounce" />,
      link: "/algorithms/math",
      algorithms: ["GCD (Euclidean)", "Sieve of Eratosthenes", "Prime Factorization"],
      status: "implemented",
    },
  ]

  return (
    <div id="algorithms" className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-glow animate-gradient-x">Algorithm Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            className="group"
          >
            <Card
              className="bg-white/20 dark:bg-slate-800/60 border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 dark:group-hover:from-blue-700 dark:group-hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden backdrop-blur-md rounded-2xl group-hover:scale-105 group-hover:drop-shadow-glow relative"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  {category.icon}
                  {category.status === "implemented" ? (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow animate-glow">Implemented</Badge>
                  ) : (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500 animate-shimmer">Coming Soon</Badge>
                  )}
                </div>
                <CardTitle className="text-slate-900 dark:text-white text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-glow">
                  {category.title}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2">
                  {category.algorithms.map((algo, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-400/30 transition-all duration-200 animate-shimmer"
                    >
                      {algo}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                {category.status === "implemented" ? (
                  <Link
                    to={category.link}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center text-sm font-medium group-hover:underline"
                  >
                    Explore {category.title}
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:animate-arrow" />
                  </Link>
                ) : (
                  <span className="text-slate-500 dark:text-slate-500 text-sm">Coming soon...</span>
                )}
              </CardFooter>
              {/* Animated border overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 dark:group-hover:from-blue-700 dark:group-hover:to-purple-700 animate-border-glow" />
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

