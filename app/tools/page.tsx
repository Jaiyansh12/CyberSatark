"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CyberBackground from "@/components/cyberbackground";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  MailWarning,
  Link2,
  BrainCircuit,
  ArrowRight,
  BugOff,
  Activity,
  Cpu,
  ShieldAlert,
  Terminal,
  Radio,
  Search
} from "lucide-react";

const toolsData = [
  {
    title: "URL Threat Scanner",
    description:
      "Analyze suspicious URLs using phishing detection, domain intelligence, and threat analysis.",
    href: "/tools/url-checker",
    icon: Link2,
    status: "Active",
    category: "DETECTION",
    telemetryId: "URL-01",
    color: "blue",
    glowColor: "group-hover:border-blue-500/30 group-hover:shadow-blue-500/10",
    iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400"
  },
  {
    title: "Email Risk Analyzer",
    description:
      "Inspect email headers for spoofing attempts, SPF/DKIM failures, and phishing indicators.",
    href: "/tools/email-checker",
    icon: MailWarning,
    status: "Active",
    category: "ANALYSIS",
    telemetryId: "EMAIL-01",
    color: "cyan",
    glowColor: "group-hover:border-cyan-500/30 group-hover:shadow-cyan-500/10",
    iconBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
  },
  {
    title: "Phishing Analyzer",
    description:
      "Detect phishing attempts inside emails, SMS, WhatsApp messages, and social engineering attacks.",
    href: "/tools/phishing-analysis",
    icon: BrainCircuit,
    status: "Active",
    category: "DETECTION",
    telemetryId: "PHISH-01",
    color: "red",
    glowColor: "group-hover:border-red-500/30 group-hover:shadow-red-500/10",
    iconBg: "bg-red-500/10 border-red-500/20 text-red-400"
  },
  {
    title: "Password Analyzer",
    description:
      "Analyze password complexity, detect weak patterns, and improve credential security.",
    href: "/tools/password-analyzer",
    icon: ShieldCheck,
    status: "Active",
    category: "UTILITIES",
    telemetryId: "PASS-01",
    color: "green",
    glowColor: "group-hover:border-green-500/30 group-hover:shadow-green-500/10",
    iconBg: "bg-green-500/10 border-green-500/20 text-green-400"
  },
  {
    title: "Threat Intelligence",
    description:
      "Analyze suspicious file hashes, malware signatures, IP addresses, and DNS domains using VirusTotal registries.",
    href: "/tools/threat-intelligence",
    icon: BugOff,
    status: "Active",
    category: "ANALYSIS",
    telemetryId: "INTEL-01",
    color: "purple",
    glowColor: "group-hover:border-purple-500/30 group-hover:shadow-purple-500/10",
    iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-400"
  },
];

const categories = ["ALL", "DETECTION", "ANALYSIS", "UTILITIES"];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = toolsData.filter((tool) => {
    const matchesCategory = selectedCategory === "ALL" || tool.category === selectedCategory;
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <CyberBackground />

      <main className="min-h-screen pt-32 pb-20 px-6 text-white relative z-10 max-w-7xl mx-auto w-full">
        
        {/* TELEMETRY HEADERS HUD */}
        <section className="grid md:grid-cols-4 gap-6 mb-12">
          
          <div className="md:col-span-2 glass-card p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-green-500/10 via-green-400/30 to-green-500/10" />
            <div>
              <p className="text-green-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2 font-bold">
                <Activity size={12} className="animate-pulse" />
                Security Modules Online
              </p>
              <h1 className="text-3xl font-black mt-3 font-mono tracking-tight uppercase">
                Operations Launchpad
              </h1>
              <p className="text-gray-300 mt-3 text-sm leading-relaxed font-sans">
                Access our suite of security verification tools to inspect URLs, analyze email headers, check password strength, and scan threats.
              </p>
            </div>
          </div>

          <div className="glass-card p-5 flex flex-col justify-between font-mono text-xs text-gray-400">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2 mb-2 font-bold text-gray-350">
              <Cpu size={14} className="text-blue-400" />
              Security Feeds
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Threat Feeds</span>
                <span className="text-green-400 font-bold">STABLE</span>
              </div>
              <div className="flex justify-between">
                <span>Ingestion Rate</span>
                <span className="text-white font-bold">14.8K/S</span>
              </div>
              <div className="flex justify-between">
                <span>Database Sync</span>
                <span className="text-blue-400 font-bold">SYNCED</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-gray-500 bg-black/25 px-2.5 py-1 rounded">
              <Radio size={10} className="text-green-400 animate-pulse" />
              <span>Uptime: 99.99%</span>
            </div>
          </div>

          <div className="glass-card p-5 flex flex-col justify-between font-mono text-xs text-gray-400">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2 mb-2 font-bold text-gray-350">
              <ShieldAlert size={14} className="text-yellow-400" />
              System Status
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Firewall Mode</span>
                <span className="text-green-400 font-bold">ENFORCED</span>
              </div>
              <div className="flex justify-between">
                <span>System Pipelines</span>
                <span className="text-white font-bold">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>Security Isolation</span>
                <span className="text-yellow-400 font-bold">STANDBY</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-gray-500 bg-black/25 px-2.5 py-1 rounded">
              <Terminal size={10} className="text-blue-400" />
              <span>Status: Secured</span>
            </div>
          </div>

        </section>

        {/* INTERACTIVE CONTROLS BAR (SEARCH & FILTER TABS) */}
        <section className="flex flex-col md:flex-row gap-6 items-center justify-between border-t border-white/5 pt-8 mb-10">
          
          {/* SEARCH BOX */}
          <div className="relative w-full md:w-80 font-mono">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search utility..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/35 border border-white/10 text-sm text-green-300 placeholder:text-gray-600 focus:outline-none focus:border-green-400/40 transition duration-300 shadow-inner"
            />
          </div>

          {/* FILTER TABS */}
          <div className="flex overflow-x-auto gap-2 p-1 bg-black/35 border border-white/5 rounded-2xl max-w-full scrollbar-none shrink-0 select-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer shrink-0
                  ${isActive ? "text-green-300" : "text-gray-500 hover:text-gray-300"}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-green-500/10 border border-green-500/20 rounded-xl"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {cat}
                </button>
              );
            })}
          </div>

        </section>

        {/* DYNAMIC LAUNCHPAD GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[350px]">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              const isComingSoon = tool.status === "Coming Soon";

              return (
                <motion.div
                  key={tool.title}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="group relative"
                >
                  <Link
                    href={tool.href}
                    className={`block h-full rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur-[40px] p-7 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.65)] transition-all duration-300 ${tool.glowColor} hover:scale-[1.02] hover:-translate-y-1`}
                  >
                    <div>
                      {/* CARD STATUS BAR */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] font-mono text-gray-500 border border-white/5 px-2 py-0.5 rounded uppercase">
                          {tool.telemetryId}
                        </span>
                        
                        <span
                          className={`text-[10px] uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full border font-mono font-semibold
                          ${
                            isComingSoon
                              ? "border-purple-500/20 text-purple-400 bg-purple-500/10"
                              : "border-green-500/20 text-green-400 bg-green-500/10"
                          }`}
                        >
                          {tool.status}
                        </span>
                      </div>

                      {/* ICON HEAD */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300 border ${tool.iconBg}`}>
                        <Icon size={26} />
                      </div>

                      {/* TOOL DETAILS */}
                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition font-mono">
                        {tool.title}
                      </h2>

                      <p className="text-gray-300 leading-relaxed text-sm font-mono">
                        {tool.description}
                      </p>
                    </div>

                    {/* DYNAMIC CARD FOOTER */}
                    <div className="mt-8 pt-4 border-t border-white/[0.03] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isComingSoon ? "bg-purple-400" : "bg-green-400"}`} />
                        <span>{tool.category}</span>
                      </div>

                      {!isComingSoon ? (
                        <div className="flex items-center gap-1.5 text-green-400 text-sm font-bold group-hover:translate-x-1.5 transition font-mono">
                          <span>Open Tool</span>
                          <ArrowRight size={14} />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 font-mono">Coming Soon</span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* FALLBACK ON EMPTY FILTER RESULTS */}
          {filteredTools.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-16 flex flex-col items-center justify-center text-center text-gray-500 font-mono"
            >
              <ShieldAlert size={36} className="text-gray-600 mb-3" />
              <p className="text-sm uppercase tracking-wider">// No tools match criteria</p>
            </motion.div>
          )}

        </section>

        {/* FUTURE ROADMAP OUTLINE */}
        <section className="mt-20">
          <div className="rounded-3xl border border-white/12 bg-white/[0.03] backdrop-blur-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.65)] hover:border-green-500/20 transition duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
            <h2 className="text-2xl font-black text-green-400 mb-4 font-mono uppercase">
              Future Roadmap
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm font-sans">
              CyberSatark is continuously expanding its capabilities. Future modules will integrate deep domain history logs, email sender authentication audits, and advanced interactive training simulations.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}