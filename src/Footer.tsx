
import { Info, Mail, Github, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from 'framer-motion';

export default function Footer() {
  const showComingSoonToast = (event: React.MouseEvent) => {
    event.preventDefault();
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

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full mt-16"
    >
      {/* Animated gradient top border */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x" />
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white/10 dark:bg-black/40 backdrop-blur-md shadow-2xl border border-white/10 dark:border-slate-800/40 flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 animate-fadein">
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 mb-1">DSA Visualizer</span>
            <span className="text-xs text-slate-400">© {new Date().getFullYear()} DSA Visualizer. All rights reserved.</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto justify-center">
            <a href="https://github.com/nikhilsaini2/" className="group flex items-center gap-2 text-slate-400 hover:text-blue-400 transition font-medium" target="_blank">
              <span className="rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 p-2 group-hover:scale-110 group-hover:shadow-lg transition-all">
                <Github className="h-5 w-5 text-white group-hover:animate-bounce" />
              </span>
              <span className="hidden md:inline">GitHub</span>
            </a>
            <Dialog>
              <DialogTrigger asChild>
                <span className="group flex items-center gap-2 text-slate-400 hover:text-purple-400 transition font-medium cursor-pointer">
                  <span className="rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-2 group-hover:scale-110 group-hover:shadow-lg transition-all">
                    <Mail className="h-5 w-5 text-white group-hover:animate-bounce" />
                  </span>
                  <span className="hidden md:inline">Contact</span>
                </span>
              </DialogTrigger>
              <DialogContent className="max-w-sm p-6 bg-white dark:bg-black shadow-lg rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">👋 Contact Me</DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">
                    I'm <strong>Nikhil Saini</strong>, the developer of this DSA Visualizer. Connect with me:
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4 mt-3">
                  <a href="mailto:nikhilsaini7981@gmail.com" className="flex items-center space-x-2 hover:text-purple-600 transition">
                    <Mail className="h-5 w-5" />
                    <span>Email: nikhilsaini7981@gmail.com</span>
                  </a>
                  <a href="https://github.com/nikhilsaini2/" className="flex items-center space-x-2 hover:text-purple-600 transition" target="_blank">
                    <Github className="h-5 w-5" />
                    <span>GitHub</span>
                  </a>
                  <a href="https://www.linkedin.com/in/nikhilsaini2/" className="flex items-center space-x-2 hover:text-purple-600 transition">
                    <Linkedin className="h-5 w-5" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </DialogContent>
            </Dialog>
            <a onClick={(event) => showComingSoonToast(event)} className="group flex items-center gap-2 text-slate-400 hover:text-pink-400 transition font-medium cursor-pointer">
              <span className="rounded-full bg-gradient-to-br from-pink-400 to-purple-400 p-2 group-hover:scale-110 group-hover:shadow-lg transition-all">
                <Info className="h-5 w-5 text-white group-hover:animate-bounce" />
              </span>
              <span className="hidden md:inline">Documentation</span>
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
