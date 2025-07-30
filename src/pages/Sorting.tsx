import AlgorithmDetail from "../algorithm-detail"
import { sortingAlgorithms } from "@/lib/sorting-algorithms"
import { motion } from 'framer-motion';

const SortingAlgorithmsPage = ()=> {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-black py-8 mt-10">
      <div className="container mx-auto px-4">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-3xl md:text-4xl font-bold mb-8 mt-16 text-center bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent drop-shadow-glow animate-gradient-x">
          Sorting Algorithms
          <span className="block h-1 w-2/3 mx-auto mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 rounded-full animate-underline" />
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(sortingAlgorithms).map(([key, algorithm], idx) => (
            <motion.div key={key} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay: idx * 0.1 }} className="group">
              <AlgorithmDetail algorithm={algorithm} type="sorting" algorithmKey={key} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
export default SortingAlgorithmsPage;
