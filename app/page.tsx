"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import CyberBackground from "@/components/cyberbackground";
import { 
  ArrowRight,
  BookOpen,
  Activity
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <CyberBackground />

      {/* VIEWPORT CONTROLLER WITH TOP NAVBAR SPACING */}
      <main className="min-h-screen pt-32 pb-16 px-6 relative z-10 flex flex-col items-center justify-center max-w-7xl mx-auto w-full">
        
        {/* TELEMETRY ONLINE BADGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-green-500/25 bg-green-500/5 text-green-400 font-mono text-xs uppercase tracking-widest mb-6"
        >
          <Activity size={12} className="animate-pulse" />
          Security Portal Active
        </motion.div>

        {/* HERO CONTAINER */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black font-mono uppercase text-white tracking-tight"
          >
            Stay <span className="text-green-400 drop-shadow-[0_0_12px_rgba(34,197,94,0.2)]">Cyber Safe</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base md:text-lg text-gray-300 leading-relaxed font-sans"
          >
            Phishing attacks exploit human trust rather than structural code flaws. 
            CyberSatark is an interactive awareness platform providing link verification tools and training scenarios.
          </motion.p>
        </div>

        {/* ACTION PANEL BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/tools"
              className="px-8 py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-black font-mono font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-green-500/10 transition-all duration-300"
            >
              <span>Explore Security Tools</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/learn"
              className="px-8 py-3.5 rounded-xl border border-white/10 hover:border-green-500/25 hover:bg-white/[0.02] text-white font-mono font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300"
            >
              <span>Start Learning</span>
              <BookOpen size={14} className="text-purple-400" />
            </Link>
          </motion.div>
        </div>

      </main>
    </>
  );
}