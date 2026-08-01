"use client";

import Navbar from "@/components/Navbar";
import CyberBackground from "@/components/cyberbackground";
import { motion } from "framer-motion";
import { Github, Linkedin, Target, Cpu, Shield, Activity, Terminal, Globe } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Abhinav Mishra",
      github: "https://github.com/NotSoAbhinav",
      linkedin: "https://www.linkedin.com/in/notsoabhinav/",
      role: "Systems Integration",
    },
    {
      name: "Jaiyansh Dhaulakhandi",
      github: "https://github.com/Jaiyansh-4n6",
      linkedin: "https://www.linkedin.com/in/jaiyansh-4n6/",
      role: "UI/UX Developer",
    },
    {
      name: "Ritambhar Advait",
      github: "https://github.com/RitambharAdvait",
      linkedin: "https://www.linkedin.com/in/ritambhar-advait-0b3b2137b/",
      role: "Security Tools Developer",
    },
    {
      name: "Piyush Kumar",
      github: "https://github.com/piyushkumar-git",
      linkedin: "https://www.linkedin.com/in/piyush-kumar-4223ba231/",
      role: "Database Engineer",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <>
      <Navbar />
      <CyberBackground />

      {/* INJECT ANIMATION KEYFRAMES */}
      <style>{`
        @keyframes scanline {
          0% { top: -5%; }
          50% { top: 105%; }
          100% { top: -5%; }
        }
        @keyframes sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="relative min-h-screen overflow-hidden">
        {/* LIQUID GLASS REFRACTIVE BACKGROUND BLOBS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <motion.div
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -60, 40, 0],
              scale: [1, 1.15, 0.9, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-green-500/10 blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, -50, 30, 0],
              y: [0, 50, -40, 0],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[45%] right-[10%] w-[400px] h-[400px] rounded-full bg-emerald-500/8 blur-[130px]"
          />
          <motion.div
            animate={{
              x: [0, 30, -30, 0],
              y: [0, 40, 50, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-[10%] left-[25%] w-[380px] h-[380px] rounded-full bg-green-400/5 blur-[120px]"
          />
        </div>

        <div className="px-6 py-28 max-w-6xl mx-auto space-y-24 text-white relative z-10">
          
          {/* HERO TITLE PANEL */}
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4 relative"
          >
            {/* Tactical Overlay */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              <span className="text-[10px] text-green-400 font-mono tracking-widest uppercase font-bold">
                OpenThreatLabs Core Information
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-mono tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-250 to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              About <span className="text-green-400">OpenThreatLabs</span>
            </h1>

            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed font-sans pt-2">
              OpenThreatLabs is a security research and development collective. CyberSatark 
              is our flagship AI-powered phishing awareness platform built to strengthen 
              human judgment through intelligent detection systems and immersive simulations.
            </p>
          </motion.section>

          {/* MISSION & APPROACH GRID */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* MISSION CARD */}
            <motion.div 
              variants={itemVariants}
              className="group relative rounded-[28px] border border-white/10 bg-white/[0.02] backdrop-blur-[35px] saturate-[1.6] p-8 hover:border-green-500/25 hover:bg-white/[0.04] transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden"
            >
              {/* Liquid Sheen Highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -inset-y-12 -inset-x-0 w-[50%] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-[1200ms] ease-out pointer-events-none" />

              {/* Corner Crosshairs */}
              <div className="absolute top-3 left-3 text-white/10 font-mono text-[9px] pointer-events-none select-none">+</div>
              <div className="absolute bottom-3 right-3 text-white/10 font-mono text-[9px] pointer-events-none select-none">+</div>
              
              <div className="flex items-center gap-3.5 border-b border-white/5 pb-4 mb-4">
                <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
                  <Target size={20} />
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest block">Core Principles</span>
                  <h2 className="text-xl font-black font-mono uppercase tracking-wider text-white group-hover:text-green-300 transition-colors">
                    Our Mission
                  </h2>
                </div>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                To develop open-source intelligence utilities and training systems that protect the digital commons. 
                By merging straightforward diagnostics with practical training, we empower individuals to transform 
                from passive observers into active defenders against social engineering vectors.
              </p>
            </motion.div>

            {/* APPROACH CARD */}
            <motion.div 
              variants={itemVariants}
              className="group relative rounded-[28px] border border-white/10 bg-white/[0.02] backdrop-blur-[35px] saturate-[1.6] p-8 hover:border-green-500/25 hover:bg-white/[0.04] transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden"
            >
              {/* Liquid Sheen Highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -inset-y-12 -inset-x-0 w-[50%] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-[1200ms] ease-out pointer-events-none" />

              {/* Corner Crosshairs */}
              <div className="absolute top-3 left-3 text-white/10 font-mono text-[9px] pointer-events-none select-none">+</div>
              <div className="absolute bottom-3 right-3 text-white/10 font-mono text-[9px] pointer-events-none select-none">+</div>
              
              <div className="flex items-center gap-3.5 border-b border-white/5 pb-4 mb-4">
                <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
                  <Cpu size={20} />
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest block">Development Approach</span>
                  <h2 className="text-xl font-black font-mono uppercase tracking-wider text-white group-hover:text-green-300 transition-colors">
                    Our Approach
                  </h2>
                </div>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                We leverage multi-layered verification engines (incorporating email header forensics, domain registry checks, 
                and URL structure analyzes) combined with interactive threat scenario simulators to make security learning 
                approachable, intuitive, and effective.
              </p>
            </motion.div>
          </motion.section>

          {/* TEAM DOSSIER CARDS SECTION */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center space-y-12"
          >
            <div className="space-y-2">
              <span className="text-[10px] text-green-400 font-mono tracking-widest uppercase block font-bold">
                Our Creators
              </span>
              <h2 className="text-2xl md:text-3xl font-black font-mono uppercase tracking-wider text-white">
                OpenThreatLabs Core Team
              </h2>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    borderColor: "rgba(74, 222, 128, 0.35)",
                    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.85), 0 0 25px rgba(74, 222, 128, 0.08)"
                  }}
                  className="flex flex-col items-center p-6 rounded-[24px] border border-white/10 bg-white/[0.02] backdrop-blur-[25px] saturate-[1.6] shadow-[0_20px_40px_rgba(0,0,0,0.55)] transition-all duration-500 relative overflow-hidden group select-none h-[280px] justify-between text-center"
                >
                  {/* Liquid Sheen Highlight */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.015] via-transparent to-transparent opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute -inset-y-12 -inset-x-0 w-[50%] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out pointer-events-none" />

                  {/* Laser Scanline */}
                  <div className="absolute left-0 right-0 h-[2px] bg-green-500/40 shadow-[0_0_8px_rgba(34,197,94,0.6)] top-0 opacity-0 group-hover:opacity-100 group-hover:animate-[scanline_2.2s_ease-in-out_infinite] pointer-events-none" />

                  {/* Cyber Hover Grid Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.015)_1px,transparent_1px)] bg-[size:10px_10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Corner bracket focus frame on cards */}
                  <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-white/10 group-hover:border-green-500 transition-colors pointer-events-none" />
                  <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-white/10 group-hover:border-green-500 transition-colors pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-white/10 group-hover:border-green-500 transition-colors pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-white/10 group-hover:border-green-500 transition-colors pointer-events-none" />

                  {/* Dossier Code Accents */}
                  <div className="absolute top-3.5 right-3.5 font-mono text-[9px] text-gray-600 group-hover:text-green-400 transition-colors">
                    OTL
                  </div>
                  
                  {/* AVATAR FRAME */}
                  <div className="relative mb-4 mt-2">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-black/45 z-10">
                      <img
                        src={`https://github.com/${member.github.split("/").pop()}.png`}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Online Status LED Indicator */}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-black shadow-[0_0_6px_rgba(34,197,94,0.8)] animate-pulse z-20" />
                  </div>

                  {/* NAME */}
                  <div className="space-y-1 text-center w-full">
                    <h3 className="text-white font-mono font-bold text-sm tracking-wider uppercase group-hover:text-green-400 transition-colors">
                      {member.name}
                    </h3>
                    <span className="text-[9px] font-mono text-gray-500 group-hover:text-green-500/50 transition-colors block mt-0.5">
                      {member.role}
                    </span>
                  </div>

                  {/* SOCIAL CONTROL TRIGGERS */}
                  <div className="flex gap-2.5 relative z-10 w-full justify-center pt-3 border-t border-white/5 mt-2">
                    <a
                      href={member.github}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-black/60 border border-white/5 text-gray-400 hover:text-green-400 hover:border-green-500/20 transition duration-300 shadow-inner"
                    >
                      <Github size={15} />
                    </a>

                    <a
                      href={member.linkedin}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-black/60 border border-white/5 text-gray-400 hover:text-green-400 hover:border-green-500/20 transition duration-300 shadow-inner"
                    >
                      <Linkedin size={15} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </div>
      </div>
    </>
  );
}