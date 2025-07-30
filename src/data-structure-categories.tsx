import {Link} from 'react-router'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Box,
  Database,
  Layers,
  ListTree,
  GitGraph,
  Hash,
  Grid3X3,
  BinaryIcon as BinaryTree,
} from "lucide-react"
import { motion } from 'framer-motion';

export default function DataStructureCategories() {
  const categories = [
    {
      title: "Arrays",
      description: "Explore the fundamental sequential data structure",
      icon: <Box className="h-6 w-6 text-purple-500 group-hover:animate-bounce" />,
      link: "/data-structures/arrays",
      status: "implemented",
    },
    {
      title: "Stacks",
      description: "Understand the Last In First Out (LIFO) principle",
      icon: <Layers className="h-6 w-6 text-blue-500 group-hover:animate-bounce" />,
      link: "/data-structures/stacks",
      status: "implemented",
    },
    {
      title: "Queues",
      description: "Learn about First In First Out (FIFO) operations",
      icon: <Database className="h-6 w-6 text-green-500 group-hover:animate-bounce" />,
      link: "/data-structures/queues",
      status: "implemented",
    },
    {
      title: "Linked Lists",
      description: "Visualize nodes connected via references",
      icon: <ListTree className="h-6 w-6 text-yellow-500 group-hover:animate-bounce" />,
      link: "/data-structures/linked-lists",
      status: "implemented",
    },
    {
      title: "Trees",
      description: "Explore hierarchical node-based structures",
      icon: <BinaryTree className="h-6 w-6 text-red-500 group-hover:animate-bounce" />,
      link: "/data-structures/trees",
      status: "coming-soon",
    },
    {
      title: "Graphs",
      description: "Understand networks of nodes and edges",
      icon: <GitGraph className="h-6 w-6 text-pink-500 group-hover:animate-bounce" />,
      link: "/data-structures/graphs",
      status: "coming-soon",
    },
    {
      title: "Hash Tables",
      description: "Learn key-value mappings with efficient lookups",
      icon: <Hash className="h-6 w-6 text-indigo-500 group-hover:animate-bounce" />,
      link: "/data-structures/hash-tables",
      status: "coming-soon",
    },
    {
      title: "Heaps",
      description: "Visualize specialized tree-based priority structures",
      icon: <Grid3X3 className="h-6 w-6 text-orange-500 group-hover:animate-bounce" />,
      link: "/data-structures/heaps",
      status: "coming-soon",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-glow animate-gradient-x">Data Structure Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

