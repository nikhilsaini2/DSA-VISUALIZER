import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Zap } from "lucide-react";
// Add import for typing animation
import { Typewriter } from 'react-simple-typewriter';
import MiniSortingVisualizer from './components/MiniSortingVisualizer';

// Add framer-motion for animation
import { motion } from 'framer-motion';

export default function Hero() {



  const scrollToSection = () => {
    const target = document.getElementById("algorithms");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated SVG Background with slow wave animation */}
      <svg className="absolute inset-0 w-full h-full z-0 opacity-30 pointer-events-none animate-wave" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#a78bfa" fillOpacity="0.3" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
      </svg>
      {/* Floating particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`absolute rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 animate-float${i%3+1}`} style={{width: 24 + (i%3)*12, height: 24 + (i%3)*12, left: `${8*i}%`, top: `${(i*13)%100}%`}} />
        ))}
      </div>
      <div className="container mx-auto px-4 py-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="flex flex-col items-center text-center">
          <div className="inline-block rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 px-3 py-1 text-sm font-medium text-white mb-6 animate-fadein">
            Interactive Learning
          </div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 animate-gradient-x drop-shadow-glow mr-1">
              <Typewriter
                words={["Visualize", "Explore", "Master"]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={120}
                deleteSpeed={80}
                delaySpeed={1500}
              />
            </span>
            Data Structures & Algorithms
            {/* Animated underline */}
            <span className="block h-1 w-2/3 mx-auto mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 rounded-full animate-underline" />
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mb-10 animate-fadein">
            Explore, understand, and master algorithms through interactive visualizations. Compare algorithm performance
            in real-time with our unique Race Mode.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 shadow-lg shadow-cyan-400/30 animate-glow"
            >
              <Link to="/race" className="flex items-center gap-2">
                <Zap className="h-5 w-5 animate-bounce" />
                Try Race Mode
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cyan-400 dark:border-cyan-600 text-slate-900 dark:text-white hover:bg-cyan-50 dark:hover:bg-cyan-900 animate-glow"
            >
              <div onClick={scrollToSection} className="flex items-center gap-2">
                <Code2 className="h-5 w-5 animate-bounce" />
                Explore Algorithms
                <ArrowRight className="h-4 w-4 ml-1 animate-bounce" />
              </div>
            </Button>
          </motion.div>
          {/* Sorting Demo Card with glassmorphism and glow */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="w-full max-w-xl mt-8">
            <div className="rounded-2xl shadow-2xl bg-white/10 dark:bg-slate-900/40 p-4 border border-cyan-400/30 backdrop-blur-md relative animate-glow">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="text-slate-700 dark:text-cyan-200 mb-2 font-semibold animate-shimmer">
                Try a Sorting Demo:
              </motion.p>
              <MiniSortingVisualizer />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
