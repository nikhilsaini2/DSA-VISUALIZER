"use client"

import { JSX, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Info, Play, BookOpen } from "lucide-react"
import { motion } from 'framer-motion';

interface DataStructureVisualizerProps {
  title: string
  description: string
  operations: {
    name: string
    description: string
    action: () => void
    disabled?: boolean
  }[]
  renderVisualization: () => JSX.Element
  codeImplementation: {
    [key: string]: string
  }
  information: {
    characteristics: string[]
    useCases: string[]
    timeComplexity: {
      [key: string]: string
    }
    spaceComplexity: string
    types?: {
      name: string
      description: string
    }[]
  }
}

export default function DataStructureVisualizer({
  title,
  description,
  operations,
  renderVisualization,
  codeImplementation,
  information,
}: DataStructureVisualizerProps) {
  const [activeLanguage, setActiveLanguage] = useState<string>(Object.keys(codeImplementation)[0])

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
      className="relative bg-white/20 dark:bg-slate-900/60 rounded-2xl border-2 border-transparent shadow-2xl overflow-hidden backdrop-blur-md group animate-fadein p-0 md:p-0">
      {/* Animated gradient border overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 dark:group-hover:from-blue-700 dark:group-hover:to-purple-700 animate-border-glow z-10" />
      <div className="p-4 md:p-6 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 rounded-t-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{description}</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="visualization">
          <TabsList className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <TabsTrigger value="visualization" className="data-[state=active]:bg-purple-600">
              <Play className="h-4 w-4 mr-2" />
              Visualization
            </TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-blue-600">
              <Code className="h-4 w-4 mr-2" />
              Code
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-green-600">
              <Info className="h-4 w-4 mr-2" />
              Information
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualization" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">{renderVisualization()}</div>
              <div className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                  <Card className="bg-white/30 dark:bg-slate-900/60 border-2 border-transparent rounded-2xl shadow-lg backdrop-blur-md animate-fadein">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Operations</CardTitle>
                      <CardDescription>Interact with the data structure</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {operations.map((op, index) => (
                        <div key={index} className="space-y-1">
                          <Button
                            onClick={op.action}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-300 focus:outline-none transition disabled:opacity-50 animate-glow"
                            disabled={op.disabled}
                          >
                            {op.name}
                          </Button>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{op.description}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white flex items-center">
                  <Code className="h-5 w-5 mr-2 text-blue-500" />
                  Implementation
                </h3>

                <div className="flex space-x-2">
                  {Object.keys(codeImplementation).map((lang) => (
                    <Button
                      key={lang}
                      variant={activeLanguage === lang ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveLanguage(lang)}
                      className={
                        activeLanguage === lang
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white"
                      }
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>

              <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm text-slate-300 font-mono">
                {codeImplementation[activeLanguage]}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-4">
                <BookOpen className="h-5 w-5 mr-2 text-green-500" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">About {title}</h3>
              </div>

              <div className="space-y-6">
                {information.types && (
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-medium mb-2">Types of {title}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {information.types.map((type, index) => (
                        <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-md">{type.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{type.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-slate-900 dark:text-white font-medium mb-2">Characteristics</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {information.characteristics.map((char, index) => (
                      <li key={index}>{char}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-slate-900 dark:text-white font-medium mb-2">Common Use Cases</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {information.useCases.map((useCase, index) => (
                      <li key={index}>{useCase}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-slate-900 dark:text-white font-medium mb-2">Time Complexity</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                      <thead className="bg-slate-100 dark:bg-slate-800">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Operation
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Complexity
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                        {Object.entries(information.timeComplexity).map(([operation, complexity], index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-slate-900 dark:text-white">{operation}</td>
                            <td className="px-4 py-2 text-sm font-mono text-slate-900 dark:text-white">{complexity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-slate-900 dark:text-white font-medium mb-2">Space Complexity</h4>
                  <p className="text-slate-700 dark:text-slate-300 font-mono">{information.spaceComplexity}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}

