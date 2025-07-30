import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, Zap, BarChart3, Search, Network, GitBranch, Info, Box, Layers, Database, ListTree } from "lucide-react";
import { Toaster, toast } from "sonner";

// Force dark theme on initial load
document.documentElement.classList.add("dark");

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [algosDropdownOpen, setAlgosDropdownOpen] = useState(false);
  const [dataDropdownOpen, setDataDropdownOpen] = useState(false);
  const location = useLocation();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    setIsOpen(false);

  },[location])

  const showComingSoonToast = () => {
    toast.success("Coming Soon!", {
      icon: <Info className="h-5 w-5 text-blue-500" />,
      duration: 2500,
      style: {
        borderRadius: "12px",
        border: "1px solid rgba(59, 130, 246, 0.5)",
        background: "white",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        padding: "12px",
        fontWeight: "500",
      },
    });
  };

  // Dark theme is now permanent

  return (
    <>
      <>
        <Toaster position="top-center" richColors closeButton />

        <nav className="fixed top-0 left-0 right-0 z-50 bg-black">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold">
                  <span className="text-white dark:text-white">DSA </span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">Visualizer</span>
                </span>

                </Link>
              </div>

              {/* Desktop Navigation - FORCED VISIBILITY */}
              <div className="flex items-center space-x-4" style={{display: 'flex', visibility: 'visible'}}>
                <Link
                  to="/race"
                  className="text-white hover:text-purple-500 px-2 py-1 rounded text-sm font-medium flex items-center transition-colors duration-200 cursor-pointer"
                  style={{display: 'flex', visibility: 'visible'}}
                >
                  <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                  Race Mode
                </Link>

                <DropdownMenu open={algosDropdownOpen} onOpenChange={setAlgosDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:text-purple-500 px-2 py-1 rounded text-sm font-medium flex items-center transition-colors duration-200 cursor-pointer"
                      style={{display: 'flex', backgroundColor: 'transparent', visibility: 'visible'}}
                    >
                      Algorithms
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md">
                    <DropdownMenuItem>
                      <Link to="/algorithms/sorting" className="flex items-center w-full" onClick={() => setAlgosDropdownOpen(false)}>
                        <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
                        Sorting
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/algorithms/searching" className="flex items-center w-full" onClick={() => setAlgosDropdownOpen(false)}>
                        <Search className="h-4 w-4 mr-2 text-blue-500" />
                        Searching
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/algorithms/graph" className="flex items-center w-full" onClick={() => setAlgosDropdownOpen(false)}>
                        <Network className="h-4 w-4 mr-2 text-green-500" />
                        Graph
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/algorithms/dynamic-programming" className="flex items-center w-full" onClick={() => setAlgosDropdownOpen(false)}>
                        <GitBranch className="h-4 w-4 mr-2 text-yellow-500" />
                        Dynamic Programming
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu open={dataDropdownOpen} onOpenChange={setDataDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:text-purple-500 px-2 py-1 rounded text-sm font-medium flex items-center transition-colors duration-200 cursor-pointer"
                      style={{display: 'flex', backgroundColor: 'transparent', visibility: 'visible'}}
                    >
                      Data Structures
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md">
                    <DropdownMenuItem className="text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer">
                      <Link to="/data-structures/arrays" className="flex items-center w-full" onClick={() => setDataDropdownOpen(false)}>
                        <Box className="h-4 w-4 mr-2 text-purple-500" />
                        Arrays
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer">
                      <Link to="/data-structures/stacks" className="flex items-center w-full" onClick={() => setDataDropdownOpen(false)}>
                        <Layers className="h-4 w-4 mr-2 text-blue-500" />
                        Stacks
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer">
                      <Link to="/data-structures/queues" className="flex items-center w-full" onClick={() => setDataDropdownOpen(false)}>
                        <Database className="h-4 w-4 mr-2 text-green-500" />
                        Queues
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer">
                      <Link to="/data-structures/linked-lists" className="flex items-center w-full" onClick={() => setDataDropdownOpen(false)}>
                        <ListTree className="h-4 w-4 mr-2 text-yellow-500" />
                        Linked Lists
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  to="/about"
                  className="text-white hover:text-purple-500 px-2 py-1 rounded text-sm font-medium transition-colors duration-200 cursor-pointer"
                  style={{display: 'flex', visibility: 'visible'}}
                >
                  About
                </Link>
              </div>

              <div className="md:hidden flex items-center">

                <button
                  onClick={toggleMenu}
                  className="text-slate-700 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 focus:outline-none"
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/race"
              className="text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Race Mode
              </div>
            </Link>

            {/* Algorithms Section - Mobile */}
            <div className="text-slate-700 dark:text-white px-3 py-2 font-medium">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                Algorithms
              </div>
              <div className="pl-7 space-y-1">
                <Link
                  to="/algorithms/sorting"
                  className="text-slate-700 flex items-center dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
                  Sorting
                </Link>
                <Link
                  to="/algorithms/searching"
                  className="text-slate-700 flex items-center dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <Search className="h-4 w-4 mr-2 text-blue-500" />
                  Searching
                </Link>
                <Link
                  to="/algorithms/graph"
                  className="text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center px-3 py-2 rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                   <Network className="h-4 w-4 mr-2 text-green-500" />
                  Graph
                </Link>
                <Link
                  to="/algorithms/dynamic-programming"
                  className="text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center px-3 py-2 rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                    <GitBranch className="h-4 w-4 mr-2 text-yellow-500" />
                  Dynamic Programming
                </Link>
              </div>
            </div>

            {/* Data Structures Section - Mobile - New Addition */}
            <div className="text-slate-700 dark:text-white px-3 py-2 font-medium">
              <div className="flex items-center mb-2">
                <Database className="h-5 w-5 mr-2 text-blue-500" />
                Data Structures
              </div>
              <div className="pl-7 space-y-1">
                <Link
                  to="/data-structures/arrays"
                  className="text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center  px-3 py-2 rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                   <Box className="h-4 w-4 mr-2 text-purple-500" />
                  Arrays
                </Link>
                <Link
                  to="/data-structures/stacks"
                  className="text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center  px-3 py-2 rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                   <Layers className="h-4 w-4 mr-2 text-blue-500" />
                  Stacks
                </Link>
                <Link
                  to="/data-structures/queues"
                  className="text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center  px-3 py-2 rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                   <Database className="h-4 w-4 mr-2 text-green-500" />
                  Queues
                </Link>
                <Link
                  to="/data-structures/linked-lists"
                  className="text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center  px-3 py-2 rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                   <ListTree className="h-4 w-4 mr-2 text-yellow-500" />
                  Linked Lists
                </Link>
              </div>
            </div>

            <Link
              to="/about"
              className="text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}

         
        </nav>
      </>
    </>
  );
}
