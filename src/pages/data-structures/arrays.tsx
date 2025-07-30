"use client"

import { useState, useEffect } from "react"
import DataStructureVisualizer from "./data-structure-visualizer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { motion } from 'framer-motion';
// Tooltip import removed (not used)
import React from "react";
import { Layers } from 'lucide-react';

// TypeScript types for dialog props
type AddDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  onCancel: () => void;
};
type InsertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  index: string;
  onIndexChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInsert: () => void;
  onCancel: () => void;
  arrayLength: number;
};
type RemoveDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  index: string;
  onIndexChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onCancel: () => void;
  arrayLength: number;
};
type UpdateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  index: string;
  onIndexChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdate: () => void;
  onCancel: () => void;
  arrayLength: number;
};

function AddDialog({ open, onOpenChange, value, onValueChange, onAdd, onCancel }: AddDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Add Element</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Add a new element to the end of the array.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="add-value" className="text-slate-700 dark:text-slate-300">
              Value
            </Label>
            <Input
              id="add-value"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter a number"
              value={value}
              onChange={onValueChange}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white"
          >
            Cancel
          </Button>
          <Button onClick={onAdd} className="bg-purple-600 hover:bg-purple-700">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InsertDialog({ open, onOpenChange, value, onValueChange, index, onIndexChange, onInsert, onCancel, arrayLength }: InsertDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Insert Element</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Insert a new element at a specific index.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="insert-value" className="text-slate-700 dark:text-slate-300">
              Value
            </Label>
            <Input
              id="insert-value"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter a number"
              value={value}
              onChange={onValueChange}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="insert-index" className="text-slate-700 dark:text-slate-300">
              Index (0 to {arrayLength})
            </Label>
            <Input
              id="insert-index"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter index"
              value={index}
              onChange={onIndexChange}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white"
          >
            Cancel
          </Button>
          <Button onClick={onInsert} className="bg-purple-600 hover:bg-purple-700">
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RemoveDialog({ open, onOpenChange, index, onIndexChange, onRemove, onCancel, arrayLength }: RemoveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Remove Element</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Remove an element at a specific index.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="remove-index" className="text-slate-700 dark:text-slate-300">
              Index (0 to {arrayLength - 1})
            </Label>
            <Input
              id="remove-index"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter index"
              value={index}
              onChange={onIndexChange}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white"
          >
            Cancel
          </Button>
          <Button onClick={onRemove} className="bg-purple-600 hover:bg-purple-700">
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpdateDialog({ open, onOpenChange, value, onValueChange, index, onIndexChange, onUpdate, onCancel, arrayLength }: UpdateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Update Element</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Update an element at a specific index.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="update-index" className="text-slate-700 dark:text-slate-300">
              Index (0 to {arrayLength - 1})
            </Label>
            <Input
              id="update-index"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter index"
              value={index}
              onChange={onIndexChange}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="update-value" className="text-slate-700 dark:text-slate-300">
              New Value
            </Label>
            <Input
              id="update-value"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter a number"
              value={value}
              onChange={onValueChange}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white"
          >
            Cancel
          </Button>
          <Button onClick={onUpdate} className="bg-purple-600 hover:bg-purple-700">
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ArraysPage() {
  const [array, setArray] = useState<number[]>([10, 20, 30, 40, 50])
  const [addValue, setAddValue] = useState("")
  const [insertValue, setInsertValue] = useState("")
  const [insertIndex, setInsertIndex] = useState("")
  const [removeIndex, setRemoveIndex] = useState("")
  const [updateValue, setUpdateValue] = useState("")
  const [updateIndex, setUpdateIndex] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isInsertDialogOpen, setIsInsertDialogOpen] = useState(false)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [animationState, setAnimationState] = useState<"idle" | "adding" | "inserting" | "removing" | "updating">(
    "idle",
  )
  const [animationStep, setAnimationStep] = useState<number>(0)
  const [animationMessage, setAnimationMessage] = useState<string>("")

  // Reset animation state after completion
  useEffect(() => {
    if (animationState !== "idle" && animationStep > 0) {
      const timer = setTimeout(() => {
        if (animationStep < getMaxSteps()) {
          setAnimationStep(animationStep + 1)
          updateAnimationMessage()
        } else {
          // Animation complete
          setTimeout(() => {
            setAnimationState("idle")
            setAnimationStep(0)
            setActiveIndex(null)
            setAnimationMessage("")
          }, 1000)
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [animationState, animationStep])

  // Get max steps for current animation
  const getMaxSteps = () => {
    switch (animationState) {
      case "adding":
        return 2
      case "inserting":
        return 3
      case "removing":
        return 2
      case "updating":
        return 2
      default:
        return 0
    }
  }

  // Update animation message based on current step
  const updateAnimationMessage = () => {
    // Use the correct state for each animation
    let idx = 0, val = 0;
    switch (animationState) {
      case "adding":
        val = Number.parseInt(addValue);
        break;
      case "inserting":
        idx = Number.parseInt(insertIndex);
        val = Number.parseInt(insertValue);
        break;
      case "removing":
        idx = Number.parseInt(removeIndex);
        break;
      case "updating":
        idx = Number.parseInt(updateIndex);
        val = Number.parseInt(updateValue);
        break;
    }

    switch (animationState) {
      case "adding":
        if (animationStep === 1) {
          setAnimationMessage(`Creating space at the end of the array`)
        } else if (animationStep === 2) {
          setAnimationMessage(`Added ${val} at index ${array.length}`)
        }
        break
      case "inserting":
        if (animationStep === 1) {
          setAnimationMessage(`Shifting elements after index ${idx} to make space`)
        } else if (animationStep === 2) {
          setAnimationMessage(`Inserting ${val} at index ${idx}`)
        } else if (animationStep === 3) {
          setAnimationMessage(`Inserted ${val} at index ${idx}`)
        }
        break
      case "removing":
        if (animationStep === 1) {
          setAnimationMessage(`Removing element at index ${idx}`)
        } else if (animationStep === 2) {
          setAnimationMessage(`Shifting elements to fill the gap`)
        }
        break
      case "updating":
        if (animationStep === 1) {
          setAnimationMessage(`Accessing element at index ${idx}`)
        } else if (animationStep === 2) {
          setAnimationMessage(`Updated value at index ${idx} to ${val}`)
        }
        break
    }
  }

  // Array operations
  const handleAdd = () => {
    if (addValue.trim() === "") return;
    const value = Number.parseInt(addValue);
    if (isNaN(value)) return;
    setAnimationState("adding");
    setAnimationStep(1);
    setActiveIndex(array.length);
    updateAnimationMessage();
    setTimeout(() => {
      setArray([...array, value]);
      setAddValue("");
    }, 1000);
    setIsAddDialogOpen(false);
  }

  const handleInsert = () => {
    if (insertValue.trim() === "" || insertIndex.trim() === "") return;
    const value = Number.parseInt(insertValue);
    const idx = Number.parseInt(insertIndex);
    if (isNaN(value) || isNaN(idx) || idx < 0 || idx > array.length) return;
    setAnimationState("inserting");
    setAnimationStep(1);
    setActiveIndex(idx);
    updateAnimationMessage();
    setTimeout(() => {
      const newArray = [...array];
      newArray.splice(idx, 0, value);
      setArray(newArray);
      setInsertValue("");
      setInsertIndex("");
    }, 2000);
    setIsInsertDialogOpen(false);
  }

  const handleRemove = () => {
    if (removeIndex.trim() === "") return;
    const idx = Number.parseInt(removeIndex);
    if (isNaN(idx) || idx < 0 || idx >= array.length) return;
    setAnimationState("removing");
    setAnimationStep(1);
    setActiveIndex(idx);
    updateAnimationMessage();
    setTimeout(() => {
      const newArray = [...array];
      newArray.splice(idx, 1);
      setArray(newArray);
      setRemoveIndex("");
    }, 2000);
    setIsRemoveDialogOpen(false);
  }

  const handleUpdate = () => {
    if (updateValue.trim() === "" || updateIndex.trim() === "") return;
    const value = Number.parseInt(updateValue);
    const idx = Number.parseInt(updateIndex);
    if (isNaN(value) || isNaN(idx) || idx < 0 || idx >= array.length) return;
    setAnimationState("updating");
    setAnimationStep(1);
    setActiveIndex(idx);
    updateAnimationMessage();
    setTimeout(() => {
      const newArray = [...array];
      newArray[idx] = value;
      setArray(newArray);
      setUpdateValue("");
      setUpdateIndex("");
    }, 1000);
    setIsUpdateDialogOpen(false);
  }

  const renderArrayVisualization = () => {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="relative bg-white/30 dark:bg-slate-900/60 p-6 rounded-2xl border-2 border-transparent shadow-lg backdrop-blur-md animate-fadein h-full flex flex-col">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Array Visualization</h3>

        {animationMessage && (
          <div className="mb-4 p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-md text-center">
            {animationMessage}
          </div>
        )}

        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            {array.map((value, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                tabIndex={0}
                aria-label={`Array element ${value} at index ${idx}`}
                className={`relative w-20 h-20 flex items-center justify-center rounded-2xl border-4 shadow-2xl cursor-pointer focus:ring-2 focus:ring-blue-400 outline-none
                  ${activeIndex === idx
                    ? "border-cyan-400 animate-glow bg-white/30 dark:bg-slate-900/40 backdrop-blur-md text-white animate-pulse ring-4 ring-cyan-300 shadow-cyan-400/40"
                    : "border-white/30 dark:border-slate-700 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md text-white hover:scale-110 hover:shadow-2xl transition-all animate-glassmorphism"}
                  transition-all duration-300`}
                style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
              >
                <span className="text-3xl font-extrabold drop-shadow-lg tracking-wide select-none" style={{textShadow: '0 2px 8px rgba(0,0,0,0.25)'}}>
                  {value}
                </span>
                {/* Glass reflection */}
                <span className="absolute top-2 left-2 w-3/4 h-4 rounded-full bg-white/40 blur-md opacity-70 pointer-events-none rotate-[-20deg]" />
                {/* Animated diagonal shimmer */}
                <span className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                  <span className="block w-full h-full bg-gradient-to-tr from-white/10 via-white/0 to-white/10 animate-shimmer" />
                </span>
              </motion.div>
            ))}

            {/* Show new element being added */}
            {animationState === "adding" && animationStep === 1 && (
              <motion.div layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                className="w-16 h-16 flex items-center justify-center rounded-xl border-2 border-green-500 bg-gradient-to-t from-green-200 to-green-400 text-green-700 dark:text-green-300 animate-bounce">
                <span className="text-lg font-medium">{addValue}</span>
              </motion.div>
            )}

            {/* Show new element being inserted */}
            {animationState === "inserting" && animationStep === 2 && (
              <motion.div layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                className="absolute w-16 h-16 flex items-center justify-center rounded-xl border-2 border-green-500 bg-gradient-to-t from-green-200 to-green-400 text-green-700 dark:text-green-300 animate-bounce"
                style={{
                  transform: `translateY(-20px) translateX(${(activeIndex ?? 0) * 72}px)`,
                }}
              >
                <span className="text-lg font-medium">{insertValue}</span>
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-slate-600 dark:text-slate-400">
          <p>Array Length: {array.length}</p>
          <div className="flex justify-center mt-2 overflow-x-auto">
            <div className="flex">
              {array.map((_, idx) => (
                <div key={idx} className="w-16 text-center text-xs">
                  {idx}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* User Engagement: Randomize and Share buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow hover:from-blue-600 hover:to-cyan-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition animate-glow"
            onClick={() => {
              setArray(Array.from({ length: Math.floor(Math.random() * 6) + 5 }, () => Math.floor(Math.random() * 90) + 10));
              setActiveIndex(null);
            }}
            aria-label="Randomize Array"
          >
            Randomize Array
          </Button>
          <Button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-300 focus:outline-none transition animate-glow"
            onClick={() => {
              navigator.clipboard.writeText(array.join(", "));
            }}
            aria-label="Share Array State"
          >
            Share State
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">Arrays</h1>

      <DataStructureVisualizer
        title="Array"
        description="A collection of elements stored at contiguous memory locations"
        operations={[
          {
            name: "Add Element",
            description: "Add a new element to the end of the array",
            action: () => setIsAddDialogOpen(true),
            disabled: animationState !== "idle",
          },
          {
            name: "Insert Element",
            description: "Insert a new element at a specific index",
            action: () => setIsInsertDialogOpen(true),
            disabled: animationState !== "idle",
          },
          {
            name: "Remove Element",
            description: "Remove an element at a specific index",
            action: () => setIsRemoveDialogOpen(true),
            disabled: array.length === 0 || animationState !== "idle",
          },
          {
            name: "Update Element",
            description: "Update an element at a specific index",
            action: () => setIsUpdateDialogOpen(true),
            disabled: array.length === 0 || animationState !== "idle",
          },
        ]}
        renderVisualization={renderArrayVisualization}
        codeImplementation={{
          JavaScript: `// Array declaration
const arr = [10, 20, 30, 40, 50];

// Access element (O(1))
const element = arr[2]; // Returns 30

// Add element to the end (O(1))
arr.push(60);

// Insert element at index 2 (O(n))
arr.splice(2, 0, 25);

// Remove element at index 3 (O(n))
arr.splice(3, 1);

// Update element at index 1 (O(1))
arr[1] = 22;

// Array traversal (O(n))
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}`,
          Python: `# Array declaration (list in Python)
arr = [10, 20, 30, 40, 50]

# Access element (O(1))
element = arr[2]  # Returns 30

# Add element to the end (O(1))
arr.append(60)

# Insert element at index 2 (O(n))
arr.insert(2, 25)

# Remove element at index 3 (O(n))
del arr[3]  # or arr.pop(3)

# Update element at index 1 (O(1))
arr[1] = 22

# Array traversal (O(n))
for i in range(len(arr)):
    print(arr[i])`,
          Java: `// Array declaration
int[] arr = {10, 20, 30, 40, 50};

// Access element (O(1))
int element = arr[2]; // Returns 30

// Add element to the end (requires new array)
// Java arrays have fixed size, so we need to create a new array
int[] newArr = new int[arr.length + 1];
System.arraycopy(arr, 0, newArr, 0, arr.length);
newArr[arr.length] = 60;
arr = newArr;

// Insert element at index 2 (O(n))
// Requires shifting elements
int[] insertArr = new int[arr.length + 1];
System.arraycopy(arr, 0, insertArr, 0, 2);
insertArr[2] = 25;
System.arraycopy(arr, 2, insertArr, 3, arr.length - 2);
arr = insertArr;

// Update element at index 1 (O(1))
arr[1] = 22;

// Array traversal (O(n))
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}`,
        }}
        information={{
          characteristics: [
            "Elements are stored in contiguous memory locations",
            "Each element can be accessed directly using its index",
            "Fixed size in most low-level languages (dynamic in JavaScript, Python)",
            "Homogeneous elements (same data type) in most languages",
            "Memory is allocated at compile time in static arrays",
          ],
          useCases: [
            "Storing and accessing sequential data",
            "Temporary storage of objects in memory",
            "Implementing other data structures like stacks, queues",
            "Buffer for storing data being transferred",
            "Lookup tables and dynamic programming solutions",
          ],
          timeComplexity: {
            Access: "O(1)",
            Search: "O(n)",
            "Insert (at end)": "O(1)",
            "Insert (at position)": "O(n)",
            "Delete (at end)": "O(1)",
            "Delete (at position)": "O(n)",
          },
          spaceComplexity: "O(n)",
          types: [
            {
              name: "Static Arrays",
              description:
                "Fixed-size arrays where size is defined at compile time. Memory is allocated once and cannot be changed during execution.",
            },
            {
              name: "Dynamic Arrays",
              description:
                "Resizable arrays that can grow or shrink during execution. When capacity is reached, a new larger array is created and elements are copied.",
            },
            {
              name: "Multi-dimensional Arrays",
              description:
                "Arrays with multiple dimensions (2D, 3D, etc.). Elements are accessed using multiple indices, useful for representing matrices and tables.",
            },
          ],
        }}
      />

      <AddDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        value={addValue}
        onValueChange={e => setAddValue(e.target.value)}
        onAdd={handleAdd}
        onCancel={() => setIsAddDialogOpen(false)}
      />
      <InsertDialog
        open={isInsertDialogOpen}
        onOpenChange={setIsInsertDialogOpen}
        value={insertValue}
        onValueChange={e => setInsertValue(e.target.value)}
        index={insertIndex}
        onIndexChange={e => setInsertIndex(e.target.value)}
        onInsert={handleInsert}
        onCancel={() => setIsInsertDialogOpen(false)}
        arrayLength={array.length}
      />
      <RemoveDialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
        index={removeIndex}
        onIndexChange={e => setRemoveIndex(e.target.value)}
        onRemove={handleRemove}
        onCancel={() => setIsRemoveDialogOpen(false)}
        arrayLength={array.length}
      />
      <UpdateDialog
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        value={updateValue}
        onValueChange={e => setUpdateValue(e.target.value)}
        index={updateIndex}
        onIndexChange={e => setUpdateIndex(e.target.value)}
        onUpdate={handleUpdate}
        onCancel={() => setIsUpdateDialogOpen(false)}
        arrayLength={array.length}
      />
    </>
  )
}

