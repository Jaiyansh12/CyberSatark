"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CyberBackground from "@/components/cyberbackground";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  Terminal,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Unlock,
  AlertCircle,
  Hash,
  Copy,
  Check,
  Sparkles,
  Clock,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { analyzePassword } from "@/data/analyzer/passwordAnalyzer";

// Strength grading visual tokens
function getStrengthColor(score: number) {
  if (score >= 70)
    return {
      text: "text-green-400",
      bar: "bg-green-500",
      stroke: "stroke-green-500",
      border: "border-green-500/30",
      bg: "bg-green-500/10",
      glow: "shadow-green-500/15"
    };

  if (score >= 40)
    return {
      text: "text-yellow-400",
      bar: "bg-yellow-500",
      stroke: "stroke-yellow-500",
      border: "border-yellow-500/30",
      bg: "bg-yellow-500/10",
      glow: "shadow-yellow-500/15"
    };

  return {
    text: "text-red-400",
    bar: "bg-red-500",
    stroke: "stroke-red-500",
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    glow: "shadow-red-500/15"
  };
}

// Simulated cryptographic hashing algorithm
function mockHash(str: string, type: "sha256" | "md5" | "bcrypt") {
  if (!str) return "...";
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  const hex = Math.abs(h).toString(16).padStart(8, '0');
  const doubleHex = Math.abs(h * 31).toString(16).padStart(8, '0');
  const tripleHex = Math.abs(h * 73).toString(16).padStart(8, '0');
  
  if (type === "md5") {
    return (hex + doubleHex + tripleHex + hex).substring(0, 32);
  }
  if (type === "sha256") {
    return (hex + doubleHex + tripleHex + hex + doubleHex + tripleHex + hex + doubleHex).substring(0, 64);
  }
  return `$2b$12$${(hex + doubleHex + tripleHex + hex).substring(0, 22)}V8vR9kXe0YpA9kL...`;
}

// Crack time calculator using Log2 ratios
function formatCrackTime(entropy: number, hashesPerSec: number): string {
  if (entropy === 0) return "Instant";
  
  // Average attempts = 0.5 * 2^entropy
  // T = average attempts / hashesPerSec
  // log2T = -1 + entropy - log2(hashesPerSec)
  const log2T = -1 + entropy - Math.log2(hashesPerSec);
  
  if (log2T < 0) {
    const t = Math.pow(2, log2T);
    if (t < 0.001) return "< 1 millisecond";
    return `${Math.round(t * 1000)} ms`;
  }
  
  const log2Minute = Math.log2(60); 
  const log2Hour = Math.log2(3600); 
  const log2Day = Math.log2(86400); 
  const log2Year = Math.log2(31536000); 

  if (log2T < log2Minute) {
    return `${Math.round(Math.pow(2, log2T))} seconds`;
  }
  if (log2T < log2Hour) {
    return `${Math.round(Math.pow(2, log2T - log2Minute))} minutes`;
  }
  if (log2T < log2Day) {
    return `${Math.round(Math.pow(2, log2T - log2Hour))} hours`;
  }
  if (log2T < log2Year) {
    return `${Math.round(Math.pow(2, log2T - log2Day))} days`;
  }
  
  const yearsExponent = (log2T - log2Year) * Math.log2(2);
  if (yearsExponent > 12) {
    return "Trillions of Years";
  }
  if (yearsExponent > 9) {
    return "Billions of Years";
  }
  if (yearsExponent > 6) {
    return "Millions of Years";
  }
  if (yearsExponent > 3) {
    return `${Math.round(Math.pow(10, yearsExponent - 6))} Million Years`;
  }
  
  return `${Math.round(Math.pow(2, log2T - log2Year))} years`;
}

const PASSWORD_PRESETS = [
  { name: "Default Admin", value: "admin123" },
  { name: "Common Pattern", value: "P@ssw0rd!2026" },
  { name: "Passphrase", value: "correcthorsebatterystaple" },
  { name: "Military Grade", value: "k#9X!mP4$vL7&wZ2" }
];

export default function PasswordAnalyzerPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"warnings" | "composition" | "entropy" | "hashes">("warnings");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const result = analyzePassword(password);
  const themeColor = useMemo(() => getStrengthColor(result.score), [result.score]);

  // Copy helper
  const handleCopyHash = (textToCopy: string, hashName: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedHash(hashName);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Generate secure key payload
  const handleGenerateKey = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    const all = uppercase + lowercase + numbers + symbols;
    let newPass = "";
    
    // Seed characters from each character set to guarantee presence
    newPass += uppercase[Math.floor(Math.random() * uppercase.length)];
    newPass += lowercase[Math.floor(Math.random() * lowercase.length)];
    newPass += numbers[Math.floor(Math.random() * numbers.length)];
    newPass += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill up to 16 characters
    for (let i = 4; i < 16; i++) {
      newPass += all[Math.floor(Math.random() * all.length)];
    }
    
    // Shuffle
    newPass = newPass.split('').sort(() => 0.5 - Math.random()).join('');
    setPassword(newPass);
  };

  // Dynamic status logs
  const reactiveLogs = useMemo(() => {
    if (!password) {
      return ["// STANDBY: Ingest key payload into the credentials scanner..."];
    }
    
    const logs = [];
    const len = password.length;
    logs.push(`[${new Date().toLocaleTimeString()}] Buffer initialized: size = ${len} bytes`);
    
    const hasUpper = /[A-Z]/.test(password);
    logs.push(`[${new Date().toLocaleTimeString()}] UPPERCASE validation: ${hasUpper ? "VALID" : "MISSING"}`);
    
    const hasLower = /[a-z]/.test(password);
    logs.push(`[${new Date().toLocaleTimeString()}] lowercase validation: ${hasLower ? "VALID" : "MISSING"}`);
    
    const hasNumber = /[0-9]/.test(password);
    logs.push(`[${new Date().toLocaleTimeString()}] NUMERIC validation: ${hasNumber ? "VALID" : "MISSING"}`);
    
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    logs.push(`[${new Date().toLocaleTimeString()}] SYMBOLIC validation: ${hasSymbol ? "VALID" : "MISSING"}`);
    
    const hasRepeat = /(.)\1{2,}/.test(password);
    if (hasRepeat) {
      logs.push(`[${new Date().toLocaleTimeString()}] WARN: Repeating character sequence detected!`);
    }

    const hasCommon = /(123|abc|qwerty|password|admin)/i.test(password);
    if (hasCommon) {
      logs.push(`[${new Date().toLocaleTimeString()}] ALERT: Common dictionary pattern matched!`);
    }
    
    logs.push(`[${new Date().toLocaleTimeString()}] Entropy calculated: ${result.entropy} bits`);
    logs.push(`[${new Date().toLocaleTimeString()}] Security index finalized: ${result.score}/100`);
    
    return logs;
  }, [password, result.entropy, result.score]);

  // Progress metrics calculation
  const dimensions = useMemo(() => {
    let varietyCount = 0;
    if (/[a-z]/.test(password)) varietyCount++;
    if (/[A-Z]/.test(password)) varietyCount++;
    if (/[0-9]/.test(password)) varietyCount++;
    if (/[^A-Za-z0-9]/.test(password)) varietyCount++;
    
    const varietyScore = Math.round((varietyCount / 4) * 100);
    const lengthScore = Math.min(100, Math.round((password.length / 16) * 100));
    
    const hasCommonPatterns = /(123|abc|qwerty|password|admin)/i.test(password);
    const patternScore = Math.max(0, 100 - (hasCommonPatterns ? 50 : 0) - (password.length > 0 && password.length < 8 ? 30 : 0));
    
    const hasRepetition = /(.)\1{2,}/.test(password);
    const collisionScore = Math.max(0, 100 - (hasRepetition ? 40 : 0));

    return {
      variety: varietyScore,
      length: lengthScore,
      patterns: patternScore,
      collisions: collisionScore
    };
  }, [password]);

  // Composition distribution
  const composition = useMemo(() => {
    return {
      lower: (password.match(/[a-z]/g) || []).length,
      upper: (password.match(/[A-Z]/g) || []).length,
      numbers: (password.match(/[0-9]/g) || []).length,
      symbols: (password.match(/[^A-Za-z0-9]/g) || []).length
    };
  }, [password]);

  // Circular gauge config
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.score / 100) * circumference;

  return (
    <>
      <Navbar />
      <CyberBackground />

      <main className="min-h-screen px-6 py-28 text-white relative z-10 max-w-7xl mx-auto w-full">
        
        {/* BACK TO TOOLS LINK */}
        <div className="mb-6">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-green-400 transition-colors duration-200 uppercase tracking-widest group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Security Tools</span>
          </Link>
        </div>

        {/* TWO-COLUMN CYBER FORENSICS CONSOLE GRID */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: CONTROL CONSOLE PANEL (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* GLOWING HERO HEADER */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 relative overflow-hidden group hover:border-green-500/20 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-green-500/10 via-green-400/30 to-green-500/10" />
              <div>
                <p className="text-green-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2 font-bold mb-2">
                  <Activity size={12} className="animate-pulse" />
                  KEY_VAL_NODE
                </p>
                <h1 className="text-3xl font-black font-mono tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                  Password Analyzer
                </h1>
                <p className="text-gray-300 mt-3 text-sm leading-relaxed font-sans">
                  Deconstruct key entropy. Scan character variety, evaluate brute-force resistance thresholds, and simulate cryptographic hash digests.
                </p>
              </div>
            </motion.div>

            {/* SCAN INPUT CARD */}
            <div className="backdrop-blur-[40px] bg-white/[0.03] border border-white/12 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
              <div className="flex items-center justify-between px-5 py-3 border-b border-green-500/10 bg-black/40">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                </div>
                <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-green-400 font-semibold font-mono">
                  Payload Ingestion
                </p>
                <div className="text-xs text-gray-500 font-mono">
                  key-inspector.sh
                </div>
              </div>

              <div className="p-5 space-y-4">
                
                {/* PRESETS SLIDER */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-gray-500">Heuristic Preset Payloads:</span>
                  <div className="flex flex-wrap gap-2">
                    {PASSWORD_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setPassword(preset.value)}
                        className="px-2.5 py-1 rounded-md border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/15 text-[10px] font-mono text-gray-400 hover:text-white transition duration-200 cursor-pointer"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* THE PASSWORD ENTRY CONTROL */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono uppercase tracking-widest text-green-300 font-bold">
                      Secret Key String
                    </label>
                    <button
                      onClick={handleGenerateKey}
                      className="text-[10px] font-mono text-green-400 hover:text-green-300 flex items-center gap-1 transition cursor-pointer"
                    >
                      <Sparkles size={11} className="animate-pulse" />
                      Generate Secure Key
                    </button>
                  </div>

                  <div className="flex items-center bg-black/35 border border-white/10 rounded-2xl overflow-hidden focus-within:border-green-400/40 transition duration-300 shadow-inner">
                    <div className="px-4 text-gray-500">
                      <Lock size={16} />
                    </div>

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter credential string to audit..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 bg-transparent py-4 text-sm font-mono text-green-300 placeholder:text-gray-600 focus:outline-none"
                    />

                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="px-4 text-gray-500 hover:text-green-300 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-mono text-gray-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Buffer Size: {password.length} bytes
                  </span>
                  <span>Strength Audit Online</span>
                </div>
              </div>
            </div>

            {/* CHARACTER SET LED CHECKLIST */}
            <div className="glass-card p-5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-gray-400 block mb-1">
                ASCII Character Alignments
              </span>
              
              <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                
                {/* LOWERCASE INDICATOR */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 bg-black/20 ${
                  /[a-z]/.test(password) 
                    ? "border-green-500/30 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.05)]" 
                    : "border-white/5 text-gray-500"
                }`}>
                  <span className="font-bold">[a-z] lowercase</span>
                  {/[a-z]/.test(password) ? (
                    <ShieldCheck size={14} className="text-green-400" />
                  ) : (
                    <Unlock size={14} className="opacity-30" />
                  )}
                </div>

                {/* UPPERCASE INDICATOR */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 bg-black/20 ${
                  /[A-Z]/.test(password) 
                    ? "border-green-500/30 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.05)]" 
                    : "border-white/5 text-gray-500"
                }`}>
                  <span className="font-bold">[A-Z] UPPERCASE</span>
                  {/[A-Z]/.test(password) ? (
                    <ShieldCheck size={14} className="text-green-400" />
                  ) : (
                    <Unlock size={14} className="opacity-30" />
                  )}
                </div>

                {/* NUMERIC INDICATOR */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 bg-black/20 ${
                  /[0-9]/.test(password) 
                    ? "border-green-500/30 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.05)]" 
                    : "border-white/5 text-gray-500"
                }`}>
                  <span className="font-bold">[0-9] Numbers</span>
                  {/[0-9]/.test(password) ? (
                    <ShieldCheck size={14} className="text-green-400" />
                  ) : (
                    <Unlock size={14} className="opacity-30" />
                  )}
                </div>

                {/* SYMBOLS INDICATOR */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 bg-black/20 ${
                  /[^A-Za-z0-9]/.test(password) 
                    ? "border-green-500/30 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.05)]" 
                    : "border-white/5 text-gray-500"
                }`}>
                  <span className="font-bold">[!@#] Symbols</span>
                  {/[^A-Za-z0-9]/.test(password) ? (
                    <ShieldCheck size={14} className="text-green-400" />
                  ) : (
                    <Unlock size={14} className="opacity-30" />
                  )}
                </div>

              </div>
            </div>

            {/* LIVE INSPECTOR LOG TERMINAL */}
            <div className="glass-card p-6 flex flex-col h-[225px] relative overflow-hidden group">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-3">
                <Terminal size={14} className="text-green-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Audit Execution Shell
                </span>
              </div>

              <div className="flex-1 bg-black/30 rounded-xl border border-white/5 p-3.5 font-mono text-xs text-green-300/80 overflow-y-auto space-y-2 custom-scrollbar shadow-inner">
                {reactiveLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-1.5 items-start">
                    <span className="text-green-500 shrink-0 font-semibold">[SEC]</span>
                    <span className="break-all">{log}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: FORENSICS DISCOVERY PANEL (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">

            <AnimatePresence mode="wait">
              {password.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  className="space-y-6"
                >
                  
                  {/* OVERVIEW RENDER */}
                  <div className="grid sm:grid-cols-3 gap-6">
                    
                    {/* VERDICT SUMMARY */}
                    <div className="sm:col-span-2 glass-card p-6 relative overflow-hidden flex flex-col justify-between">
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${themeColor.bar} to-transparent`} />
                      <div>
                        <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block mb-3">
                          Vulnerability Status
                        </span>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className={`px-3 py-1.5 rounded-full font-mono font-bold tracking-widest text-xs uppercase border ${themeColor.border} ${themeColor.bg} ${themeColor.glow}`}>
                            {result.strength.toUpperCase()}
                          </div>
                          <span className="text-xs text-gray-400 font-mono">
                            (Entropy Score: {result.entropy} bits)
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 mt-4 leading-relaxed font-sans">
                          {result.score >= 70
                            ? "This password meets recommended safety protocols. Standard brute-force defenses are actively secured."
                            : result.score >= 40
                            ? "This password provides moderate baseline coverage but lacks sufficient complexity against dictionary lookup patterns."
                            : "WARNING: High security vulnerability. Automated brute-force modules can deconstruct and crack this signature in seconds."}
                        </p>
                      </div>

                      <div className="mt-6 flex justify-between items-center text-xs text-gray-500 font-mono border-t border-white/5 pt-3">
                        <span>SECURITY_INDEX</span>
                        <span className={`font-bold ${themeColor.text}`}>
                          {result.score >= 70 ? "SECURE_KEY" : result.score >= 40 ? "MODERATE_RISK" : "CRITICAL_ANOMALY"}
                        </span>
                      </div>
                    </div>

                    {/* SCORE CIRCULAR GAUGE */}
                    <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden items-center">
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                      <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block mb-4 self-start">
                        Key Score
                      </span>

                      {/* SVG Ring */}
                      <div className="relative flex items-center justify-center w-28 h-28 my-auto">
                        <svg className="w-full h-full transform -rotate-90">
                          {/* Inner Gray Ring */}
                          <circle
                            cx="56"
                            cy="56"
                            r={radius}
                            className="stroke-white/5"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          {/* Pulsing Active Ring */}
                          <circle
                            cx="56"
                            cy="56"
                            r={radius}
                            className={`transition-all duration-700 ease-out ${themeColor.stroke}`}
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center font-mono">
                          <span className={`text-3xl font-black ${themeColor.text}`}>
                            {result.score}
                          </span>
                          <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">
                            / 100
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* ESTIMATED BRUTE-FORCE DECRYPT TIMELINE */}
                  <div className="glass-card p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Clock size={15} className="text-cyan-400" />
                      <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
                        Estimated Crack Time Matrix
                      </span>
                    </div>

                    <div className="space-y-3 font-mono text-xs text-gray-300">
                      
                      {/* consumer notebook */}
                      <div className="flex justify-between items-center bg-black/25 border border-white/5 p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <div>
                            <p className="font-bold text-white uppercase text-[10px]">Consumer Laptop</p>
                            <p className="text-[9px] text-gray-500">Heuristics: 10^7 attempts/sec</p>
                          </div>
                        </div>
                        <span className="font-black text-cyan-400">{formatCrackTime(result.entropy, 10000000)}</span>
                      </div>

                      {/* gpu rig */}
                      <div className="flex justify-between items-center bg-black/25 border border-white/5 p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-400" />
                          <div>
                            <p className="font-bold text-white uppercase text-[10px]">Custom GPU Cluster</p>
                            <p className="text-[9px] text-gray-500">Heuristics: 10^10 attempts/sec</p>
                          </div>
                        </div>
                        <span className="font-black text-yellow-400">{formatCrackTime(result.entropy, 10000000000)}</span>
                      </div>

                      {/* supercomputer */}
                      <div className="flex justify-between items-center bg-black/25 border border-white/5 p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-400" />
                          <div>
                            <p className="font-bold text-white uppercase text-[10px]">Quantum / State Supercomputer</p>
                            <p className="text-[9px] text-gray-500">Heuristics: 10^15 attempts/sec</p>
                          </div>
                        </div>
                        <span className="font-black text-red-400">{formatCrackTime(result.entropy, 1000000000000000)}</span>
                      </div>

                    </div>
                  </div>

                  {/* THREAT ANALYSIS PROGRESS BARS */}
                  <div className="glass-card p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                    <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block mb-4">
                      Complexity Dimensions metrics
                    </span>

                    <div className="grid sm:grid-cols-2 gap-5 font-mono text-xs">
                      
                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400">CHARSET_VARIETY</span>
                          <span className="text-red-400">{dimensions.variety}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400 animate-pulse" style={{ width: `${dimensions.variety}%` }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400">LENGTH_MULTIPLIER</span>
                          <span className="text-yellow-400">{dimensions.length}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 animate-pulse" style={{ width: `${dimensions.length}%` }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400">DICTIONARY_COLLISION</span>
                          <span className="text-blue-400">{dimensions.patterns}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 animate-pulse" style={{ width: `${dimensions.patterns}%` }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400">SEQUENCE_REPETITIONS</span>
                          <span className="text-cyan-400">{dimensions.collisions}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 animate-pulse" style={{ width: `${dimensions.collisions}%` }} />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* DETAILS PANEL WITH TABS */}
                  <div className="glass-card overflow-hidden">
                    <div className="flex overflow-x-auto border-b border-white/5 bg-black/25">
                      <button
                        onClick={() => setActiveTab("warnings")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-r border-white/5 cursor-pointer select-none
                        ${activeTab === "warnings" ? "bg-white/[0.02] text-green-300 font-black border-b border-green-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <ShieldAlert size={13} />
                        Audit Warnings ({result.findings.length})
                      </button>

                      <button
                        onClick={() => setActiveTab("composition")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-r border-white/5 cursor-pointer select-none
                        ${activeTab === "composition" ? "bg-white/[0.02] text-green-300 font-black border-b border-green-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <Activity size={13} />
                        Composition
                      </button>

                      <button
                        onClick={() => setActiveTab("entropy")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-r border-white/5 cursor-pointer select-none
                        ${activeTab === "entropy" ? "bg-white/[0.02] text-green-300 font-black border-b border-green-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <Cpu size={13} />
                        Entropy Math
                      </button>

                      <button
                        onClick={() => setActiveTab("hashes")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer select-none
                        ${activeTab === "hashes" ? "bg-white/[0.02] text-green-300 font-black border-b border-green-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <Hash size={13} />
                        Hash Simulator
                      </button>
                    </div>

                    <div className="p-5">
                      
                      {/* TAB 1: WARNINGS */}
                      {activeTab === "warnings" && (
                        <div className="space-y-3">
                          {result.findings.length > 0 ? (
                            result.findings.map((f, idx) => (
                              <div key={idx} className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wide">
                                    Vulnerability Flagged
                                  </h4>
                                  <p className="text-[11px] text-gray-300 mt-1.5 font-mono leading-relaxed">
                                    {f}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-6 text-center bg-black/20 border border-white/5 rounded-xl font-mono text-xs text-green-400 flex flex-col items-center justify-center gap-1.5">
                              <CheckCircle2 size={20} />
                              <span>✓ Scan complete: No security vulnerabilities flagged.</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* TAB 2: COMPOSITION */}
                      {activeTab === "composition" && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs text-gray-400">
                          
                          <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-500 uppercase tracking-wider block text-[10px] mb-1">lowercase Letters</span>
                            <p className="text-xl font-bold text-green-400">{composition.lower}</p>
                            <span className="text-[9px] text-gray-600 block mt-1">+4.7 bits/char</span>
                          </div>

                          <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-500 uppercase tracking-wider block text-[10px] mb-1">UPPERCASE Letters</span>
                            <p className="text-xl font-bold text-white">{composition.upper}</p>
                            <span className="text-[9px] text-gray-600 block mt-1">+4.7 bits/char</span>
                          </div>

                          <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-500 uppercase tracking-wider block text-[10px] mb-1">Numerical Digits</span>
                            <p className="text-xl font-bold text-cyan-400">{composition.numbers}</p>
                            <span className="text-[9px] text-gray-600 block mt-1">+3.3 bits/char</span>
                          </div>

                          <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-500 uppercase tracking-wider block text-[10px] mb-1">Special Symbols</span>
                            <p className="text-xl font-bold text-purple-400">{composition.symbols}</p>
                            <span className="text-[9px] text-gray-600 block mt-1">+5.0 bits/char</span>
                          </div>

                        </div>
                      )}

                      {/* TAB 3: ENTROPY MATH */}
                      {activeTab === "entropy" && (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs text-gray-400">
                          
                          <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-500 uppercase tracking-wider block text-[10px] mb-1">Entropy Value</span>
                            <p className="text-sm font-bold text-green-400">{result.entropy} bits</p>
                          </div>

                          <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-500 uppercase tracking-wider block text-[10px] mb-1">Active Pool Size</span>
                            <p className="text-sm font-bold text-white">
                              {((composition.lower ? 26 : 0) + (composition.upper ? 26 : 0) + (composition.numbers ? 10 : 0) + (composition.symbols ? 32 : 0)) || 0} keys
                            </p>
                          </div>

                          <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-500 uppercase tracking-wider block text-[10px] mb-1">Strength Class</span>
                            <p className="text-sm font-bold text-blue-400">
                              {result.entropy >= 80 ? "Military Grade" : result.entropy >= 60 ? "Strong Base" : result.entropy >= 40 ? "Standard Base" : "Insecure"}
                            </p>
                          </div>

                          <div className="bg-black/35 rounded-xl p-4 border border-white/5 sm:col-span-2 md:col-span-3 space-y-2">
                            <span className="text-gray-500 uppercase tracking-wider block text-[10px]">Shannon Key Complexity Search space</span>
                            <div className="p-3 bg-black/60 border border-white/5 rounded-lg text-green-300 leading-relaxed overflow-x-auto whitespace-pre custom-scrollbar">
                              Total Search Space = (Pool Size)^Length
                              {"\n"}Pool Size = {(composition.lower ? 26 : 0) + (composition.upper ? 26 : 0) + (composition.numbers ? 10 : 0) + (composition.symbols ? 32 : 0)} chars
                              {"\n"}Total Permutations ≈ 2^{result.entropy} combinations.
                            </div>
                          </div>

                        </div>
                      )}

                      {/* TAB 4: HASH DIGEST SIMULATOR */}
                      {activeTab === "hashes" && (
                        <div className="bg-black/45 border border-white/5 rounded-xl p-4 font-mono text-xs text-green-300 leading-relaxed shadow-inner">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-gray-500 font-bold">
                            <span>Hash Digest Simulator</span>
                            <span>Secure client digests</span>
                          </div>
                          
                          <div className="space-y-4 py-2 font-mono">
                            
                            {/* MD5 */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-[10px]">MD5 DIGEST:</span>
                                <button
                                  onClick={() => handleCopyHash(mockHash(password, "md5"), "md5")}
                                  className="text-gray-500 hover:text-green-400 flex items-center gap-1 transition cursor-pointer text-[10px]"
                                >
                                  {copiedHash === "md5" ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                                  <span>{copiedHash === "md5" ? "COPIED" : "COPY"}</span>
                                </button>
                              </div>
                              <pre className="p-2 bg-black/50 border border-white/5 rounded-lg text-cyan-400 overflow-x-auto whitespace-pre select-all text-[11px] leading-none tracking-wide">
                                {mockHash(password, "md5")}
                              </pre>
                            </div>

                            {/* SHA-256 */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-[10px]">SHA-256 DIGEST:</span>
                                <button
                                  onClick={() => handleCopyHash(mockHash(password, "sha256"), "sha256")}
                                  className="text-gray-500 hover:text-green-400 flex items-center gap-1 transition cursor-pointer text-[10px]"
                                >
                                  {copiedHash === "sha256" ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                                  <span>{copiedHash === "sha256" ? "COPIED" : "COPY"}</span>
                                </button>
                              </div>
                              <pre className="p-2 bg-black/50 border border-white/5 rounded-lg text-green-400 overflow-x-auto whitespace-pre select-all text-[11px] leading-none tracking-wide">
                                {mockHash(password, "sha256")}
                              </pre>
                            </div>

                            {/* bcrypt */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-[10px]">bcrypt DIGEST (KDF BLOWFISH):</span>
                                <button
                                  onClick={() => handleCopyHash(mockHash(password, "bcrypt"), "bcrypt")}
                                  className="text-gray-500 hover:text-green-400 flex items-center gap-1 transition cursor-pointer text-[10px]"
                                >
                                  {copiedHash === "bcrypt" ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                                  <span>{copiedHash === "bcrypt" ? "COPIED" : "COPY"}</span>
                                </button>
                              </div>
                              <pre className="p-2 bg-black/50 border border-white/5 rounded-lg text-yellow-400 overflow-x-auto whitespace-pre select-all text-[11px] leading-none tracking-wide">
                                {mockHash(password, "bcrypt")}
                              </pre>
                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </motion.div>
              ) : (
                <motion.div
                  key="standby"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="h-full min-h-[400px] rounded-3xl border border-white/5 bg-black/15 flex flex-col items-center justify-center text-center p-8 font-mono text-gray-500 gap-4"
                >
                  <Activity size={32} className="opacity-25 animate-pulse" />
                  <div className="space-y-1.5">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">// Standby</p>
                    <p className="text-xs max-w-sm leading-relaxed">
                      Awaiting password input to execute complexity and strength scans.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </main>
    </>
  );
}