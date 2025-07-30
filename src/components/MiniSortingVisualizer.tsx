import React, { useState, useRef } from "react";
import Confetti from "react-confetti";
import { motion } from 'framer-motion';

const BAR_COUNT = 16;
const MIN_HEIGHT = 20;
const MAX_HEIGHT = 120;
const ANIMATION_SPEED = 120; // ms

function getRandomArray() {
  return Array.from({ length: BAR_COUNT }, () =>
    Math.floor(Math.random() * (MAX_HEIGHT - MIN_HEIGHT + 1)) + MIN_HEIGHT
  );
}

const MiniSortingVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>(getRandomArray());
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetArray = () => {
    setArray(getRandomArray());
    setActiveIndices([]);
    setIsSorting(false);
    setShowConfetti(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const bubbleSort = async () => {
    setIsSorting(true);
    setShowConfetti(false);
    let arr = [...array];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setActiveIndices([j, j + 1]);
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, ANIMATION_SPEED);
        });
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }
    }
    setActiveIndices([]);
    setIsSorting(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1800);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full flex flex-col items-center">
      {/* Glassmorphism card effect and confetti */}
      <div className="relative w-full">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <Confetti width={400} height={180} numberOfPieces={120} recycle={false} />
          </div>
        )}
        <div className="flex items-end justify-center gap-1 h-36 w-full mb-4 rounded-2xl p-2 transition-all bg-white/40 dark:bg-cyan-900/40 backdrop-blur-md shadow-2xl border border-cyan-400/30 relative animate-glow">
          {array.map((value, idx) => (
            <div
              key={idx}
              className={`transition-all duration-200 rounded-full flex-1 mx-0.5 cursor-pointer group
                ${activeIndices.includes(idx)
                  ? "bg-gradient-to-t from-cyan-400 via-blue-400 to-teal-300 shadow-2xl shadow-cyan-300/80 animate-pulse scale-110"
                  : "bg-gradient-to-t from-cyan-200 via-blue-200 to-teal-100 dark:from-cyan-800 dark:to-blue-600 hover:scale-105 hover:shadow-lg hover:shadow-cyan-200/60 animate-gradient-x"}
              `}
              style={{ height: `${value}px`, minWidth: 14 }}
            ></div>
          ))}
          {/* Reflection under bars */}
          <div className="absolute left-0 right-0 bottom-0 h-8 pointer-events-none z-10" style={{filter:'blur(6px)'}}>
            <div className="w-full h-full bg-gradient-to-t from-cyan-300/30 to-transparent rounded-b-2xl" />
          </div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="flex gap-3 mt-2">
        <button
          className="px-5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-400 to-teal-400 text-white font-bold shadow-lg hover:from-cyan-600 hover:to-teal-500 focus:ring-2 focus:ring-cyan-300 focus:outline-none transition disabled:opacity-50 animate-glow"
          onClick={bubbleSort}
          disabled={isSorting}
          style={{ boxShadow: isSorting ? '0 0 16px 4px #22d3ee' : undefined }}
        >
          {isSorting ? "Sorting..." : "Play"}
        </button>
        <button
          className="px-5 py-1.5 rounded-lg bg-white/70 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-200 font-bold shadow hover:bg-cyan-100 dark:hover:bg-cyan-800 transition border border-cyan-100 dark:border-cyan-800"
          onClick={resetArray}
          disabled={isSorting}
        >
          Reset
        </button>
      </motion.div>
    </motion.div>
  );
};

export default MiniSortingVisualizer; 