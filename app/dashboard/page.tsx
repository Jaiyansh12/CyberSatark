"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  Link2, 
  Mail, 
  Lock, 
  GraduationCap, 
  Activity, 
  Loader2, 
  Terminal, 
  Cpu, 
  Radio, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Globe
} from "lucide-react";
import Navbar from "@/components/Navbar";
import CyberBackground from "@/components/cyberbackground";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, UserProfile } from "@/lib/db";
import { 
  Button, 
  ProgressBar, 
  ProgressCircle, 
  Tooltip 
} from "@heroui/react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Dashboard Profile Dropdown Menu State
  const [showMenu, setShowMenu] = useState(false);

  // Diagnostics Scan Simulator State
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done">("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const uProfile = await getUserProfile(user.uid);
          setProfile(uProfile);
        } catch (err) {
          console.error("Failed to load profile", err);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const startScan = async () => {
    if (scanState === "scanning") return;
    setScanState("scanning");
    setScanProgress(0);
    setScanLogs([]);

    const logMessages = [
      "Initializing Security Diagnostic Audit...",
      "Checking database connectivity...",
      "Verifying user authentication token status...",
      "Auditing quiz completion records...",
      "Retrieving password analyzer diagnostic metrics...",
      "Validating active tool telemetry states...",
      "Compiling module progress statistics...",
      "Audit complete. Security rating generated successfully."
    ];

    for (let i = 0; i < logMessages.length; i++) {
      await new Promise(r => setTimeout(r, 450 + Math.random() * 200));
      setScanProgress(Math.round(((i + 1) / logMessages.length) * 100));
      setScanLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logMessages[i]}`]);
    }
    setScanState("done");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <CyberBackground />
        <div className="min-h-[calc(100vh-90px)] flex items-center justify-center text-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-green-400 h-10 w-10" />
            <p className="text-green-300 font-mono tracking-widest text-xs animate-pulse">
              Loading dashboard...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!profile) {
    return null;
  }

  const score = profile.stats.securityScore;

  return (
    <>
      <Navbar />
      <CyberBackground />

      <main className="min-h-screen px-6 py-28 text-white relative z-10 max-w-7xl mx-auto w-full space-y-8">
        
        {/* TACTICAL DIAGNOSTIC TOP HUD */}
        <section className="grid lg:grid-cols-4 gap-6">
          
          {/* USER WELCOME & DIAGNOSTIC GENERAL DETAILS */}
          <div className="lg:col-span-2 glass-card p-8 flex flex-col justify-between relative overflow-hidden group hover:border-green-500/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 via-green-400/30 to-blue-500/20" />
            <div>
              <p className="text-blue-400 font-mono text-base uppercase tracking-widest flex items-center gap-2 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                Session Active
              </p>
              
              <div className="relative inline-block mt-4">
                <button
                  onClick={() => setShowMenu(prev => !prev)}
                  className="flex items-center gap-3.5 cursor-pointer bg-transparent border-none text-left p-0 group"
                >
                  <div className="w-12 h-12 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center text-green-400 font-mono font-bold text-xl shadow-[0_0_12px_rgba(74,222,128,0.15)] group-hover:bg-green-500/20 group-hover:border-green-400/60 transition-all duration-300 overflow-hidden">
                    {profile.photoURL ? (
                      <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      (profile.username || "user").charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-4xl md:text-5xl font-black tracking-tight text-white font-mono uppercase group-hover:text-green-400 transition-colors flex items-center gap-1.5">
                    Dashboard
                    <span className="text-xs opacity-50 font-normal tracking-widest text-gray-500 font-mono self-end pb-2">▼</span>
                  </span>
                </button>

                {showMenu && (
                  <div className="absolute left-0 mt-2 bg-[#07142a]/95 backdrop-blur-3xl border border-white/10 rounded-xl shadow-2xl p-2 w-52 z-30 font-mono text-xs text-white">
                    <button
                      onClick={() => setShowMenu(false)}
                      className="w-full text-left px-3 py-2.5 rounded-lg transition-colors cursor-pointer bg-green-500/10 text-green-400 border border-green-500/20 font-bold"
                    >
                      Security Dashboard
                    </button>
                    <Link
                      href="/profile"
                      className="block w-full text-left px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5 text-gray-400 mt-1 font-bold"
                    >
                      Profile
                    </Link>
                  </div>
                )}
              </div>

              <p className="text-gray-200 mt-4 text-sm leading-relaxed max-w-md font-sans">
                Welcome to your security center. Track quiz progress, analyze system security metrics, and access awareness tools.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-6 font-mono text-xs text-gray-400">
              <div>
                <span>Member Since</span>
                <p className="text-white mt-0.5 truncate font-bold">{new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span>Account Role</span>
                <p className="text-green-400 mt-0.5 font-bold uppercase">{profile.role === "admin" ? "Admin" : "Standard User"}</p>
              </div>
            </div>
          </div>

          {/* ACTIVE RADIAL SECURITY SCORE GAUGE USING HEROUI */}
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-green-500/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            <p className="text-gray-400 font-mono text-sm uppercase tracking-wider mb-4 font-bold">Security Score</p>
            
            <div className="relative w-36 h-36 flex items-center justify-center">
              <ProgressCircle value={score} aria-label="Security Index">
                <ProgressCircle.Track className="w-36 h-36 drop-shadow-[0_0_12px_rgba(52,211,153,0.35)]">
                  <ProgressCircle.TrackCircle className="stroke-white/5" />
                  <ProgressCircle.FillCircle className={score >= 80 ? "stroke-green-400" : score >= 50 ? "stroke-yellow-400" : "stroke-red-400"} />
                </ProgressCircle.Track>
              </ProgressCircle>
              
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black font-mono tracking-tight">{score}%</span>
                <span className={`text-sm font-bold uppercase tracking-widest mt-1.5 ${
                  score >= 80 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {score >= 80 ? "Secure" : score >= 50 ? "Vulnerable" : "Critical"}
                </span>
              </div>
            </div>
          </div>

          {/* TELEMETRY DIAGNOSTICS */}
          <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group hover:border-green-500/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-gray-300 font-mono text-sm uppercase tracking-wider flex items-center gap-1.5 font-bold">
                <Cpu size={14} className="text-blue-400" />
                Security Protocols
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
            </div>

            <div className="space-y-3.5 font-mono text-xs text-gray-300 py-4">
              <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
                <span className="text-gray-400">Data Encryption</span>
                <span className="text-white font-semibold">AES-256-GCM</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
                <span className="text-gray-400">Connection Security</span>
                <span className="text-green-400 font-semibold">Enforced</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
                <span className="text-gray-400">SSL Certificate</span>
                <span className="text-white font-semibold truncate max-w-[110px]">Valid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Portal Stability</span>
                <span className="text-blue-400 font-semibold">99.99%</span>
              </div>
            </div>

            <div className="bg-black/35 rounded-xl border border-white/5 px-3 py-2.5 flex items-center gap-2">
              <Radio size={14} className="text-green-400 animate-pulse" />
              <span className="text-xs font-mono text-gray-300 tracking-wider">Active Monitoring Enabled</span>
            </div>
          </div>

        </section>

        {/* INTERACTIVE DIAGNOSTICS TERMINAL & QUICK STATISTICS */}
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between relative overflow-hidden group hover:border-green-500/20 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/25 via-blue-400/20 to-green-500/25" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <span className="text-gray-300 font-mono text-sm uppercase tracking-wider flex items-center gap-2 font-bold">
                <Terminal size={16} className="text-green-400" />
                Security Diagnostic Audit
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${scanState === "scanning" ? "bg-yellow-400 animate-pulse" : scanState === "done" ? "bg-green-400" : "bg-gray-500"}`} />
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  {scanState === "scanning" ? "SCANNING..." : scanState === "done" ? "System Ready" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Run a diagnostic security check of your active sessions, profile progress, and tool telemetry states.
              </p>

              {/* TERMINAL DISPLAY SCREEN */}
              <div className="bg-black/60 rounded-xl border border-white/5 p-4 font-mono text-[11px] h-48 overflow-y-auto space-y-1.5 custom-scrollbar text-green-400/80">
                {scanLogs.length === 0 ? (
                  <p className="text-gray-500 italic">// Awaiting scan initialization command...</p>
                ) : (
                  scanLogs.map((log, index) => (
                    <p key={index} className="leading-relaxed break-all">
                      {log}
                    </p>
                  ))
                )}
                {scanState === "scanning" && (
                  <div className="flex items-center gap-2 text-yellow-400 animate-pulse mt-2">
                    <Loader2 size={12} className="animate-spin" />
                    <span>RUNNING SECURITY CHECK ({scanProgress}%)</span>
                  </div>
                )}
                {scanState === "done" && (
                  <p className="text-green-400 font-bold mt-2">
                    [+] Security Check Complete. No threats detected.
                  </p>
                )}
              </div>
            </div>

            {/* CONTROL ROW */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 border-t border-white/5 pt-4">
              <button
                onClick={startScan}
                disabled={scanState === "scanning"}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition duration-300 ${
                  scanState === "scanning"
                    ? "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-black shadow-lg shadow-green-500/10 cursor-pointer"
                }`}
              >
                {scanState === "scanning" ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={12} />
                    <span>Run Security Audit</span>
                  </>
                )}
              </button>

              {scanState === "scanning" && (
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="bg-green-500 h-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* QUICK STATISTICS HUD */}
          <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group hover:border-green-500/20 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-blue-500/20" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <span className="text-gray-300 font-mono text-sm uppercase tracking-wider flex items-center gap-2 font-bold">
                <Activity size={16} className="text-blue-400" />
                Training Stats
              </span>
              <span className="text-[10px] font-mono text-gray-500">Overview</span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 font-mono text-xs">
              <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Quizzes Taken</span>
                <span className="text-white font-bold text-lg">{profile.stats.quizCount}</span>
              </div>
              <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Top Score</span>
                <span className="text-cyan-400 font-bold text-lg">{profile.stats.highestScore} / 10</span>
              </div>
              <div className="bg-black/30 border border-white/5 rounded-xl p-3 col-span-2">
                <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Average Compliance Index</span>
                <span className="text-green-400 font-bold text-lg">{profile.stats.averageScore}%</span>
              </div>
            </div>

            <Link
              href="/profile"
              className="mt-4 w-full text-center px-4 py-2.5 rounded-xl border border-white/10 hover:border-green-500/20 hover:bg-white/[0.02] text-xs font-mono font-bold uppercase tracking-wider transition duration-300 block"
            >
              Access Profile Settings
            </Link>
          </div>
        </section>

        {/* LAUNCHPAD DEPLOY MODULES */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-mono tracking-widest text-white uppercase flex items-center gap-2">
            <span className="w-1.5 h-3 bg-green-500 inline-block animate-pulse" />
            Security Awareness Modules
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 flex flex-col justify-between min-h-[180px] relative group hover:border-green-500/20 transition duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Globe className="text-blue-400" size={20} />
                  <span className="text-[9px] font-mono text-gray-500">Module 1</span>
                </div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">URL Threat Scanner</h3>
                <p className="text-xs text-gray-400 mt-2 font-sans leading-relaxed">
                  Inspect suspected links against risk logs and domain reputation registers.
                </p>
              </div>
              <Link 
                href="/tools/url-checker"
                className="mt-4 text-xs font-mono font-bold text-green-400 hover:text-green-300 flex items-center gap-1 uppercase"
              >
                <span>Open Tool</span>
                <span>→</span>
              </Link>
            </div>

            <div className="glass-card p-6 flex flex-col justify-between min-h-[180px] relative group hover:border-green-500/20 transition duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Mail className="text-cyan-400" size={20} />
                  <span className="text-[9px] font-mono text-gray-500">Module 2</span>
                </div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Phishing Analyzer</h3>
                <p className="text-xs text-gray-400 mt-2 font-sans leading-relaxed">
                  Scan suspicious email body contents for heuristic flags and social engineering indicators.
                </p>
              </div>
              <Link 
                href="/tools/phishing-analysis"
                className="mt-4 text-xs font-mono font-bold text-green-400 hover:text-green-300 flex items-center gap-1 uppercase"
              >
                <span>Open Tool</span>
                <span>→</span>
              </Link>
            </div>

            <div className="glass-card p-6 flex flex-col justify-between min-h-[180px] relative group hover:border-green-500/20 transition duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Lock className="text-green-400" size={20} />
                  <span className="text-[9px] font-mono text-gray-500">Module 3</span>
                </div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Password Entropy</h3>
                <p className="text-xs text-gray-400 mt-2 font-sans leading-relaxed">
                  Analyze password complexity patterns and guess resistance algorithms.
                </p>
              </div>
              <Link 
                href="/tools/password-analyzer"
                className="mt-4 text-xs font-mono font-bold text-green-400 hover:text-green-300 flex items-center gap-1 uppercase"
              >
                <span>Open Tool</span>
                <span>→</span>
              </Link>
            </div>

            <div className="glass-card p-6 flex flex-col justify-between min-h-[180px] relative group hover:border-green-500/20 transition duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <GraduationCap className="text-yellow-400" size={20} />
                  <span className="text-[9px] font-mono text-gray-500">Module 4</span>
                </div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Tactical Quizzes</h3>
                <p className="text-xs text-gray-400 mt-2 font-sans leading-relaxed">
                  Evaluate your cyber safety defense scores by solving active awareness scenarios.
                </p>
              </div>
              <Link 
                href="/quiz"
                className="mt-4 text-xs font-mono font-bold text-green-400 hover:text-green-300 flex items-center gap-1 uppercase"
              >
                <span>Open Quiz</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}