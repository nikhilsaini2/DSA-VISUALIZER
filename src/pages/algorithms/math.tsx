import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import * as Tooltip from '@radix-ui/react-tooltip';
import { Play, Pause, RotateCcw, Shuffle, ArrowLeft, ArrowRight, Lightbulb, Info } from 'lucide-react';

// Type definitions for different mathematical algorithms
interface GCDStep {
  a: number;
  b: number;
  operation: string;
  explanation: string;
  remainder?: number;
  isComplete?: boolean;
}

interface SieveStep {
  n: number;
  primes: number[];
  currentNumber: number | null;
  sieve: boolean[];
  explanation: string;
  markedNumbers?: number[];
}

interface FastExpStep {
  base: number;
  exponent: number;
  currentPower: number;
  result: number;
  binaryRep: string;
  currentBit: number | null;
  explanation: string;
}

interface FibonacciStep {
  n: number;
  sequence: number[];
  currentIndex: number;
  explanation: string;
  formula?: string;
}

interface PrimeFactorStep {
  n: number;
  originalN: number;
  factors: number[];
  currentFactor: number | null;
  explanation: string;
  isComplete?: boolean;
}

// Mathematical algorithms with step generation
const mathematicalAlgorithms = [
  {
    name: "Euclidean Algorithm (GCD)",
    description: "Find the Greatest Common Divisor of two numbers using the Euclidean algorithm",
    getSteps: (a: number, b: number): GCDStep[] => {
      const steps: GCDStep[] = [];
      let x = Math.max(a, b);
      let y = Math.min(a, b);
      
      steps.push({
        a: x,
        b: y,
        operation: "start",
        explanation: `Finding GCD of ${a} and ${b}. Starting with larger number ${x} and smaller number ${y}`
      });

      while (y !== 0) {
        const remainder = x % y;
        steps.push({
          a: x,
          b: y,
          operation: `${x} = ${y} × ${Math.floor(x / y)} + ${remainder}`,
          remainder,
          explanation: `Divide ${x} by ${y}: quotient = ${Math.floor(x / y)}, remainder = ${remainder}`
        });
        
        x = y;
        y = remainder;
        
        if (y !== 0) {
          steps.push({
            a: x,
            b: y,
            operation: "continue",
            explanation: `Continue with a = ${x} and b = ${y}`
          });
        }
      }

      steps.push({
        a: x,
        b: 0,
        operation: "complete",
        explanation: `GCD found! The remainder is 0, so GCD(${a}, ${b}) = ${x}`,
        isComplete: true
      });

      return steps;
    }
  },
  {
    name: "Sieve of Eratosthenes",
    description: "Find all prime numbers up to a given number using the Sieve of Eratosthenes",
    getSteps: (n: number): SieveStep[] => {
      const steps: SieveStep[] = [];
      const sieve = Array(n + 1).fill(true);
      sieve[0] = sieve[1] = false; // 0 and 1 are not prime
      const primes: number[] = [];

      steps.push({
        n,
        primes: [],
        currentNumber: null,
        sieve: [...sieve],
        explanation: `Initialize array for numbers 0 to ${n}. Mark 0 and 1 as not prime.`
      });

      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (sieve[i]) {
          steps.push({
            n,
            primes: [...primes],
            currentNumber: i,
            sieve: [...sieve],
            explanation: `${i} is prime. Mark all multiples of ${i} as composite.`,
            markedNumbers: []
          });

          const markedInThisStep: number[] = [];
          for (let j = i * i; j <= n; j += i) {
            if (sieve[j]) {
              sieve[j] = false;
              markedInThisStep.push(j);
            }
          }

          if (markedInThisStep.length > 0) {
            steps.push({
              n,
              primes: [...primes],
              currentNumber: i,
              sieve: [...sieve],
              explanation: `Marked multiples of ${i}: ${markedInThisStep.join(', ')} as composite.`,
              markedNumbers: markedInThisStep
            });
          }

          primes.push(i);
        }
      }

      // Add remaining primes
      for (let i = Math.floor(Math.sqrt(n)) + 1; i <= n; i++) {
        if (sieve[i]) {
          primes.push(i);
        }
      }

      steps.push({
        n,
        primes,
        currentNumber: null,
        sieve: [...sieve],
        explanation: `Complete! Found ${primes.length} prime numbers: ${primes.join(', ')}`
      });

      return steps;
    }
  },
  {
    name: "Fast Exponentiation",
    description: "Calculate base^exponent efficiently using binary exponentiation",
    getSteps: (base: number, exponent: number): FastExpStep[] => {
      const steps: FastExpStep[] = [];
      const binaryRep = exponent.toString(2);
      let result = 1;
      let currentPower = base;

      steps.push({
        base,
        exponent,
        currentPower: base,
        result: 1,
        binaryRep,
        currentBit: null,
        explanation: `Calculate ${base}^${exponent}. Binary representation of ${exponent} is ${binaryRep}. Start with result = 1, power = ${base}`
      });

      for (let i = binaryRep.length - 1; i >= 0; i--) {
        const bit = parseInt(binaryRep[i]);
        
        steps.push({
          base,
          exponent,
          currentPower,
          result,
          binaryRep,
          currentBit: binaryRep.length - 1 - i,
          explanation: `Reading bit ${binaryRep.length - 1 - i}: ${bit} (from right to left)`
        });

        if (bit === 1) {
          result *= currentPower;
          steps.push({
            base,
            exponent,
            currentPower,
            result,
            binaryRep,
            currentBit: binaryRep.length - 1 - i,
            explanation: `Bit is 1: multiply result by current power. result = ${result}`
          });
        } else {
          steps.push({
            base,
            exponent,
            currentPower,
            result,
            binaryRep,
            currentBit: binaryRep.length - 1 - i,
            explanation: `Bit is 0: skip multiplication`
          });
        }

        if (i > 0) {
          currentPower *= currentPower;
          steps.push({
            base,
            exponent,
            currentPower,
            result,
            binaryRep,
            currentBit: binaryRep.length - 1 - i,
            explanation: `Square the current power for next bit: power = ${currentPower}`
          });
        }
      }

      steps.push({
        base,
        exponent,
        currentPower,
        result,
        binaryRep,
        currentBit: null,
        explanation: `Complete! ${base}^${exponent} = ${result}`
      });

      return steps;
    }
  },
  {
    name: "Fibonacci Sequence",
    description: "Generate Fibonacci numbers using iterative approach",
    getSteps: (n: number): FibonacciStep[] => {
      const steps: FibonacciStep[] = [];
      const sequence = [0, 1];

      if (n === 0) {
        steps.push({
          n: 0,
          sequence: [0],
          currentIndex: 0,
          explanation: "F(0) = 0"
        });
        return steps;
      }

      steps.push({
        n,
        sequence: [0],
        currentIndex: 0,
        explanation: "Initialize: F(0) = 0"
      });

      if (n >= 1) {
        steps.push({
          n,
          sequence: [0, 1],
          currentIndex: 1,
          explanation: "F(1) = 1"
        });
      }

      for (let i = 2; i <= n; i++) {
        const nextFib = sequence[i - 1] + sequence[i - 2];
        sequence.push(nextFib);
        
        steps.push({
          n,
          sequence: [...sequence],
          currentIndex: i,
          explanation: `F(${i}) = F(${i-1}) + F(${i-2}) = ${sequence[i-1]} + ${sequence[i-2]} = ${nextFib}`,
          formula: `F(${i}) = ${sequence[i-1]} + ${sequence[i-2]}`
        });
      }

      steps.push({
        n,
        sequence,
        currentIndex: n,
        explanation: `Complete! The ${n}th Fibonacci number is ${sequence[n]}`
      });

      return steps;
    }
  },
  {
    name: "Prime Factorization",
    description: "Find all prime factors of a given number",
    getSteps: (n: number): PrimeFactorStep[] => {
      const steps: PrimeFactorStep[] = [];
      const factors: number[] = [];
      let num = n;
      const originalN = n;

      steps.push({
        n: num,
        originalN,
        factors: [],
        currentFactor: null,
        explanation: `Finding prime factors of ${n}`
      });

      // Check for factor 2
      while (num % 2 === 0) {
        factors.push(2);
        num = num / 2;
        steps.push({
          n: num,
          originalN,
          factors: [...factors],
          currentFactor: 2,
          explanation: `${num * 2} is divisible by 2. Add 2 to factors. Continue with ${num}`
        });
      }

      // Check for odd factors from 3 onwards
      for (let i = 3; i <= Math.sqrt(num); i += 2) {
        while (num % i === 0) {
          factors.push(i);
          num = num / i;
          steps.push({
            n: num,
            originalN,
            factors: [...factors],
            currentFactor: i,
            explanation: `${num * i} is divisible by ${i}. Add ${i} to factors. Continue with ${num}`
          });
        }
      }

      // If num is still greater than 2, it's a prime factor
      if (num > 2) {
        factors.push(num);
        steps.push({
          n: 1,
          originalN,
          factors: [...factors],
          currentFactor: num,
          explanation: `${num} is prime. Add ${num} to factors.`
        });
      }

      steps.push({
        n: 1,
        originalN,
        factors,
        currentFactor: null,
        explanation: `Complete! Prime factors of ${originalN}: ${factors.join(' × ')} = ${originalN}`,
        isComplete: true
      });

      return steps;
    }
  }
];

const mathematicalButtonThemes = [
  "bg-green-500",   // GCD
  "bg-purple-500",    // Sieve
  "bg-blue-500",      // Fast Exp
  "bg-amber-500",    // Fibonacci
  "bg-rose-500"       // Prime Factorization
];

// Example input data for each algorithm
const mathematicalExamples = [
  {
    tip: "Try finding GCD of these numbers!",
    example: { a: 48, b: 18 },
    display: "a = 48, b = 18"
  },
  {
    tip: "Find primes up to this number!",
    example: { n: 30 },
    display: "n = 30"
  },
  {
    tip: "Calculate this power efficiently!",
    example: { base: 3, exponent: 10 },
    display: "3^10"
  },
  {
    tip: "Generate Fibonacci sequence!",
    example: { n: 10 },
    display: "First 10 Fibonacci numbers"
  },
  {
    tip: "Find prime factors!",
    example: { n: 84 },
    display: "n = 84"
  }
];

export default function MathematicalAlgorithms() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<any[]>([]);
  const [speed, setSpeed] = useState(1000);
  
  // Parameters for different algorithms
  const [a, setA] = useState(48);
  const [b, setB] = useState(18);
  const [n, setN] = useState(30);
  const [base, setBase] = useState(3);
  const [exponent, setExponent] = useState(10);
  const [fibN, setFibN] = useState(10);
  const [factorN, setFactorN] = useState(84);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateSteps = () => {
    let newSteps: any[] = [];
    
    switch (selectedAlgorithm) {
      case 0: // GCD
        newSteps = mathematicalAlgorithms[0].getSteps(a, b);
        break;
      case 1: // Sieve
        newSteps = mathematicalAlgorithms[1].getSteps(n);
        break;
      case 2: // Fast Exponentiation
        newSteps = mathematicalAlgorithms[2].getSteps(base, exponent);
        break;
      case 3: // Fibonacci
        newSteps = mathematicalAlgorithms[3].getSteps(fibN);
        break;
      case 4: // Prime Factorization
        newSteps = mathematicalAlgorithms[4].getSteps(factorN);
        break;
    }
    
    setSteps(newSteps);
    setCurrentStep(0);
  };

  // Reset on algorithm change (but don't auto-generate steps)
useEffect(() => {
    // Clear the current interval if it exists
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [selectedAlgorithm]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, steps.length]);

  const handlePlay = () => {
    if (steps.length === 0) {
      // Generate steps first
      generateSteps();
      setIsPlaying(true);
    } else if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleStepForward = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleStepBackward = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleRandomize = () => {
    switch (selectedAlgorithm) {
      case 0: // GCD
        setA(Math.floor(Math.random() * 100) + 10);
        setB(Math.floor(Math.random() * 100) + 10);
        break;
      case 1: // Sieve
        setN(Math.floor(Math.random() * 50) + 10);
        break;
      case 2: // Fast Exp
        setBase(Math.floor(Math.random() * 8) + 2);
        setExponent(Math.floor(Math.random() * 15) + 5);
        break;
      case 3: // Fibonacci
        setFibN(Math.floor(Math.random() * 15) + 5);
        break;
      case 4: // Prime Factorization
        setFactorN(Math.floor(Math.random() * 200) + 50);
        break;
    }
    setCurrentStep(0);
  };

  const loadExample = () => {
    const example = mathematicalExamples[selectedAlgorithm].example;
    
    switch (selectedAlgorithm) {
      case 0:
        setA((example as any).a);
        setB((example as any).b);
        break;
      case 1:
        setN((example as any).n);
        break;
      case 2:
        setBase((example as any).base);
        setExponent((example as any).exponent);
        break;
      case 3:
        setFibN((example as any).n);
        break;
      case 4:
        setFactorN((example as any).n);
        break;
    }
    setCurrentStep(0);
  };

  // Enhanced visualization renderer
  const renderVisualization = () => {
    if (steps.length === 0 || !steps[currentStep]) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">🔢</div>
          <p className="text-slate-400">Run the algorithm to see visualization</p>
        </div>
      );
    }

    const step = steps[currentStep];

    switch (selectedAlgorithm) {
      case 0: // GCD Visualization
        return renderGCDVisualization(step as GCDStep);
      case 1: // Sieve Visualization
        return renderSieveVisualization(step as SieveStep);
      case 2: // Fast Exponentiation Visualization
        return renderFastExpVisualization(step as FastExpStep);
      case 3: // Fibonacci Visualization
        return renderFibonacciVisualization(step as FibonacciStep);
      case 4: // Prime Factorization Visualization
        return renderPrimeFactorVisualization(step as PrimeFactorStep);
      default:
        return null;
    }
  };

  // GCD Visualization Component
  const renderGCDVisualization = (step: GCDStep) => {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center text-green-400 mb-8">
          Euclidean Algorithm (GCD)
        </h3>
        
        <div className="flex justify-center items-center gap-8 mb-8">
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-6 rounded-2xl shadow-2xl"
            animate={{ scale: step.operation === 'start' ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="text-sm opacity-80 mb-1">Number A</div>
              <div className="text-3xl font-bold">{step.a}</div>
            </div>
          </motion.div>
          
          <div className="text-4xl text-slate-400">÷</div>
          
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-6 rounded-2xl shadow-2xl"
            animate={{ scale: step.operation === 'start' ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="text-sm opacity-80 mb-1">Number B</div>
              <div className="text-3xl font-bold">{step.b}</div>
            </div>
          </motion.div>
        </div>

        {step.remainder !== undefined && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-slate-800/60 rounded-xl py-6 px-4"
          >
            <div className="text-lg text-slate-300 mb-2">Division Operation:</div>
            <div className="text-xl font-mono text-yellow-400 mb-4">{step.operation}</div>
            {step.remainder > 0 && (
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl">
                  <div className="text-sm opacity-80">Remainder</div>
                  <div className="text-2xl font-bold">{step.remainder}</div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {step.isComplete && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl py-8 px-6"
          >
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-2xl font-bold">GCD Found!</div>
            <div className="text-4xl font-bold mt-2">{step.a}</div>
          </motion.div>
        )}
      </div>
    );
  };

  // Sieve Visualization Component
  const renderSieveVisualization = (step: SieveStep) => {
    // Safety check to ensure step and required properties exist
    if (!step || !step.sieve) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">🔢</div>
          <p className="text-slate-400">Loading sieve data...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center text-purple-400 mb-8">
          Sieve of Eratosthenes
        </h3>
        
        <div className="grid grid-cols-10 gap-2 max-w-4xl mx-auto">
          {step.sieve && Array.isArray(step.sieve) ? Array.from({ length: step.n + 1 }, (_, i) => {
            const isPrime = step.sieve[i];
            const isCurrentNumber = step.currentNumber === i;
            const isMarkedInThisStep = step.markedNumbers?.includes(i);
            
            return (
              <motion.div
                key={i}
                className={`
                  w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${i === 0 || i === 1 ? 'bg-gray-600 text-gray-400' : 
                    isPrime ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg' : 
                    'bg-gradient-to-br from-red-500 to-red-600 text-white'}
                  ${isCurrentNumber ? 'ring-4 ring-yellow-400 scale-110' : ''}
                  ${isMarkedInThisStep ? 'ring-4 ring-red-400' : ''}
                `}
                animate={{
                  scale: isCurrentNumber ? 1.1 : isMarkedInThisStep ? 0.9 : 1,
                  rotateY: isMarkedInThisStep ? 180 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {i}
              </motion.div>
            );
          }) : null}
        </div>
        
        <div className="flex justify-center gap-6 mt-8">
          <div className="text-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded mx-auto mb-2"></div>
            <div className="text-sm text-slate-300">Prime</div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded mx-auto mb-2"></div>
            <div className="text-sm text-slate-300">Composite</div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-600 rounded mx-auto mb-2"></div>
            <div className="text-sm text-slate-300">Not Prime</div>
          </div>
        </div>
        
        {step.primes && Array.isArray(step.primes) && step.primes.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/60 rounded-xl p-6 mt-6"
          >
            <h4 className="text-lg font-semibold text-purple-400 mb-3">Found Primes:</h4>
            <div className="flex flex-wrap gap-2">
              {step.primes.map((prime, idx) => (
                <motion.span
                  key={prime}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full font-semibold"
                >
                  {prime}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // Fast Exponentiation Visualization Component
  const renderFastExpVisualization = (step: FastExpStep) => {
    // Safety check to ensure step and binaryRep exist
    if (!step || !step.binaryRep) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">🔢</div>
          <p className="text-slate-400">Loading fast exponentiation data...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center text-blue-400 mb-8">
          Fast Exponentiation: {step.base}^{step.exponent}
        </h3>
        
        <div className="bg-slate-800/60 rounded-xl p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-lg text-slate-300 mb-2">Binary Representation of {step.exponent}:</div>
            <div className="flex justify-center gap-1">
              {step.binaryRep.split('').map((bit, idx) => (
                <motion.div
                  key={idx}
                  className={`
                    w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold transition-all
                    ${step.currentBit === idx ? 
                      'bg-gradient-to-br from-yellow-500 to-orange-500 text-white ring-4 ring-yellow-400 scale-110' : 
                      bit === '1' ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' : 
                      'bg-slate-600 text-slate-300'}
                  `}
                  animate={{ scale: step.currentBit === idx ? 1.1 : 1 }}
                >
                  {bit}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-8 mb-8">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-2xl shadow-xl"
            animate={{ scale: step.currentBit !== null ? 1.05 : 1 }}
          >
            <div className="text-center">
              <div className="text-sm opacity-80 mb-1">Current Power</div>
              <div className="text-2xl font-bold">{step.currentPower}</div>
            </div>
          </motion.div>
          
          <div className="text-4xl text-slate-400 self-center">×</div>
          
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl"
            animate={{ scale: step.result > 1 ? 1.05 : 1 }}
          >
            <div className="text-center">
              <div className="text-sm opacity-80 mb-1">Result</div>
              <div className="text-2xl font-bold">{step.result}</div>
            </div>
          </motion.div>
        </div>
        
        <div className="bg-slate-800/60 rounded-xl p-6">
          <div className="text-center">
            <div className="text-lg text-slate-300 mb-2">Calculation:</div>
            <div className="text-3xl font-bold text-blue-400">
              {step.base}^{step.exponent} = {step.result}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fibonacci Visualization Component
  const renderFibonacciVisualization = (step: FibonacciStep) => {
    // Safety check to ensure step and required properties exist
    if (!step || !step.sequence || !Array.isArray(step.sequence)) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">🔢</div>
          <p className="text-slate-400">Loading Fibonacci sequence...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center text-amber-400 mb-8">
          Fibonacci Sequence
        </h3>
        
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {step.sequence && Array.isArray(step.sequence) ? step.sequence.map((num, idx) => {
            const isCurrent = idx === step.currentIndex;
            const isUsedInSum = step.currentIndex > 1 && (idx === step.currentIndex - 1 || idx === step.currentIndex - 2);
            
            return (
              <motion.div
                key={idx}
                className={`
                  px-4 py-3 rounded-xl font-bold text-center min-w-[60px] transition-all duration-300
                  ${isCurrent ? 
                    'bg-gradient-to-r from-amber-500 to-orange-500 text-white ring-4 ring-amber-400 scale-110' :
                    isUsedInSum ?
                    'bg-gradient-to-r from-yellow-500 to-amber-500 text-white ring-2 ring-yellow-400' :
                    'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-200'}
                `}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: isCurrent ? 1.1 : 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-xs opacity-80 mb-1">F({idx})</div>
                <div className="text-lg">{num}</div>
              </motion.div>
            );
          }) : null}
        </div>
        
        {step.formula && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/60 rounded-xl p-6 text-center"
          >
            <div className="text-lg text-slate-300 mb-2">Current Calculation:</div>
            <div className="text-2xl font-mono text-amber-400">{step.formula}</div>
            <div className="text-lg text-slate-300 mt-2">= {step.sequence[step.currentIndex]}</div>
          </motion.div>
        )}
        
        <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-xl p-6">
          <div className="text-center">
            <div className="text-lg text-amber-300 mb-2">Golden Ratio Approximation:</div>
            <div className="text-2xl font-bold text-amber-400">
              {step.sequence && Array.isArray(step.sequence) && step.sequence.length > 1 && 
               step.currentIndex > 0 && step.currentIndex < step.sequence.length && 
               step.sequence[step.currentIndex] && step.sequence[step.currentIndex - 1] && 
               step.sequence[step.currentIndex - 1] !== 0 ? 
                (step.sequence[step.currentIndex] / step.sequence[step.currentIndex - 1]).toFixed(6) : 
                '1.000000'}
            </div>
            <div className="text-sm text-amber-300 mt-1">φ ≈ 1.618034</div>
          </div>
        </div>
      </div>
    );
  };

  // Prime Factorization Visualization Component
  const renderPrimeFactorVisualization = (step: PrimeFactorStep) => {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center text-rose-400 mb-8">
          Prime Factorization of {step.originalN}
        </h3>
        
        <div className="flex justify-center items-center gap-6 mb-8">
          <motion.div 
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-6 rounded-2xl shadow-2xl"
            animate={{ scale: step.n === step.originalN ? 1.1 : 1 }}
          >
            <div className="text-center">
              <div className="text-sm opacity-80 mb-1">Current Number</div>
              <div className="text-3xl font-bold">{step.n}</div>
            </div>
          </motion.div>
          
          {step.currentFactor && (
            <>
              <div className="text-4xl text-slate-400">÷</div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-6 rounded-2xl shadow-2xl"
              >
                <div className="text-center">
                  <div className="text-sm opacity-80 mb-1">Factor</div>
                  <div className="text-3xl font-bold">{step.currentFactor}</div>
                </div>
              </motion.div>
            </>
          )}
        </div>
        
        {step.factors && Array.isArray(step.factors) && step.factors.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/60 rounded-xl p-6"
          >
            <h4 className="text-lg font-semibold text-rose-400 mb-4 text-center">Prime Factors Found:</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {step.factors.map((factor, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg"
                >
                  {factor}
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <div className="text-lg text-slate-300 mb-2">Factorization:</div>
              <div className="text-2xl font-mono text-rose-400">
                {step.originalN} = {step.factors && Array.isArray(step.factors) && step.factors.length > 0 ? step.factors.join(' × ') : 'Calculating...'}
              </div>
            </div>
          </motion.div>
        )}
        
        {step.isComplete && (
          <motion.div 
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            className="text-center bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl py-8 px-6"
          >
            <div className="text-6xl mb-4">🔢</div>
            <div className="text-2xl font-bold">Factorization Complete!</div>
            <div className="text-lg mt-2">{step.originalN} = {step.factors && Array.isArray(step.factors) && step.factors.length > 0 ? step.factors.join(' × ') : 'Error'}</div>
          </motion.div>
        )}
      </div>
    );
  };

  const renderInputControls = () => {
    switch (selectedAlgorithm) {
      case 0: // GCD
        return (
          <div className="flex flex-col w-full gap-2">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-slate-400 mb-1" htmlFor="gcdA">First Number (a)</label>
                <Input
                  id="gcdA"
                  type="number"
                  value={a}
                  onChange={e => setA(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full"
                  placeholder="Enter first number"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-400 mb-1" htmlFor="gcdB">Second Number (b)</label>
                <Input
                  id="gcdB"
                  type="number"
                  value={b}
                  onChange={e => setB(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full"
                  placeholder="Enter second number"
                />
              </div>
            </div>
          </div>
        );
      
      case 1: // Sieve
        return (
          <div className="flex flex-col w-full">
            <label className="text-xs text-slate-400 mb-1" htmlFor="sieveN">Find primes up to (n)</label>
            <Input
              id="sieveN"
              type="number"
              value={n}
              onChange={e => setN(Math.max(2, Math.min(100, parseInt(e.target.value) || 2)))}
              className="w-full"
              placeholder="Enter upper limit (max 100)"
            />
          </div>
        );
      
      case 2: // Fast Exponentiation
        return (
          <div className="flex flex-col w-full gap-2">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-slate-400 mb-1" htmlFor="expBase">Base</label>
                <Input
                  id="expBase"
                  type="number"
                  value={base}
                  onChange={e => setBase(Math.max(2, Math.min(10, parseInt(e.target.value) || 2)))}
                  className="w-full"
                  placeholder="Enter base (2-10)"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-400 mb-1" htmlFor="expExponent">Exponent</label>
                <Input
                  id="expExponent"
                  type="number"
                  value={exponent}
                  onChange={e => setExponent(Math.max(0, Math.min(20, parseInt(e.target.value) || 0)))}
                  className="w-full"
                  placeholder="Enter exponent (0-20)"
                />
              </div>
            </div>
          </div>
        );
      
      case 3: // Fibonacci
        return (
          <div className="flex flex-col w-full">
            <label className="text-xs text-slate-400 mb-1" htmlFor="fibN">Generate up to F(n)</label>
            <Input
              id="fibN"
              type="number"
              value={fibN}
              onChange={e => setFibN(Math.max(0, Math.min(25, parseInt(e.target.value) || 0)))}
              className="w-full"
              placeholder="Enter n (max 25)"
            />
          </div>
        );
      
      case 4: // Prime Factorization
        return (
          <div className="flex flex-col w-full">
            <label className="text-xs text-slate-400 mb-1" htmlFor="factorN">Number to factorize</label>
            <Input
              id="factorN"
              type="number"
              value={factorN}
              onChange={e => setFactorN(Math.max(2, Math.min(1000, parseInt(e.target.value) || 2)))}
              className="w-full"
              placeholder="Enter number (2-1000)"
            />
          </div>
        );
    }
  };

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
      ctx.fillStyle = 'rgba(255,140,0,0.08)';
      ctx.fill();
    }
  });

  // Example input card component
  function ExampleInputCard({ idx, onUse }: { idx: number, onUse: () => void }) {
    return (
      <div className="mb-4 flex items-center gap-4 bg-slate-700/40 rounded-xl px-4 py-3">
        <span className="text-slate-300 text-sm"><b>Try this example:</b> <span className="font-mono text-blue-300">{mathematicalExamples[idx].display}</span></span>
        <button
          onClick={onUse}
          className="ml-2 px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Use Example
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8 mt-10">
      <canvas ref={canvasRef} width={800} height={400} className="absolute top-0 left-0 w-full h-[400px] pointer-events-none z-0" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-3xl md:text-4xl font-bold mb-8 mt-16 text-center bg-gradient-to-r from-green-400 via-teal-400 to-emerald-300 bg-clip-text text-transparent drop-shadow-glow animate-gradient-x">
          Mathematical Algorithms
          <span className="block h-1 w-2/3 mx-auto mt-2 bg-gradient-to-r from-green-400 via-teal-400 to-emerald-300 rounded-full animate-underline" />
        </motion.h1>
        <Card className="bg-slate-900/60 border-2 border-slate-700/50 shadow-xl backdrop-blur-md rounded-2xl max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-xl">Select a Problem</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Choose a mathematical algorithm problem to visualize
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 w-full mt-4 mb-6">
              {mathematicalAlgorithms.map((prob, idx) => (
                <button
                  key={prob.name}
                  onClick={() => setSelectedAlgorithm(idx)}
                  className={`flex-1 h-12 flex items-center justify-center px-2 py-2 rounded-xl font-semibold text-white shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-normal text-center overflow-hidden truncate leading-tight ${
                    selectedAlgorithm === idx
                      ? `${mathematicalButtonThemes[idx]} scale-110 ring-2 ring-blue-400`
                      : "bg-slate-600/70 hover:scale-105"
                  }`}
                  aria-pressed={selectedAlgorithm === idx}
                  aria-label={`Select ${prob.name}`}
                >
                  <span className={prob.name.length > 15 ? 'text-xs' : 'text-sm'}>{prob.name}</span>
                </button>
              ))}
            </div>
            <div className="mb-5 bg-slate-800/40 p-4 rounded-xl flex items-start gap-3 min-w-[300px] w-full">
              <Info className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <div className="text-slate-300 font-semibold mb-1">{mathematicalAlgorithms[selectedAlgorithm].name}</div>
                <div className="text-slate-400 text-sm">{mathematicalAlgorithms[selectedAlgorithm].description}</div>
              </div>
            </div>
            <span className="block text-slate-400 text-sm mb-2">{mathematicalExamples[selectedAlgorithm].tip}</span>
            <ExampleInputCard idx={selectedAlgorithm} onUse={loadExample} />
            
            {/* Input controls based on selected algorithm */}
            <div className="flex gap-4 mt-2 mb-6 items-center w-full">
              {renderInputControls()}
              <Button onClick={handlePlay} disabled={isPlaying} className="bg-green-500 hover:bg-green-600 flex items-center gap-x-2 justify-center">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isPlaying ? 'Pause' : 'Run'}</span>
              </Button>
              <Button onClick={handleReset} disabled={currentStep === 0} variant="outline">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button onClick={handleRandomize} className="bg-purple-500 hover:bg-purple-600 flex items-center gap-x-2 justify-center">
                <Shuffle className="w-4 h-4" />
                <span>Random</span>
              </Button>
            </div>
            
            {/* Step Navigation Controls */}
            {steps.length > 0 && (
              <div className="flex gap-2 mb-6">
                <Button 
                  onClick={handleStepBackward} 
                  disabled={currentStep === 0} 
                  variant="outline" 
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button 
                  onClick={handleStepForward} 
                  disabled={currentStep >= steps.length - 1} 
                  variant="outline" 
                  className="flex-1"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
            
            {/* Algorithm-specific visualization will be rendered here */}
            <div className="min-h-[400px] flex items-center justify-center">
              {steps.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🔢</div>
                  <p className="text-lg">Configure parameters and click Run to start visualization</p>
                </div>
              ) : (
                <div className="w-full">
                  {/* Progress */}
                  {steps.length > 0 && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-slate-200">
                          Progress
                        </h3>
                        <span className="text-sm text-slate-400">
                          Step {currentStep + 1} of {steps.length}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${mathematicalButtonThemes[selectedAlgorithm]}`}
                          style={{
                            width: `${steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Current Step Explanation */}
                  {steps.length > 0 && steps[currentStep] && (
                    <div className="mb-6 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                      <h4 className="font-semibold text-slate-200 mb-2">
                        Current Step
                      </h4>
                      <p className="text-slate-300">
                        {steps[currentStep].explanation}
                      </p>
                    </div>
                  )}
                  
                  {/* Enhanced Visualizations */}
                  <div className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                    {renderVisualization()}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
