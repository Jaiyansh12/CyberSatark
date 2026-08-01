"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import CyberBackground from "@/components/cyberbackground";
import { 
  BookOpen, 
  Activity, 
  Fingerprint, 
  ShieldAlert, 
  Globe, 
  Target, 
  Lock, 
  LifeBuoy, 
  Terminal,
  Check,
  AlertTriangle,
  ChevronRight,
  Info,
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  Laptop,
  Send,
  UserMinus,
  ShieldCheck
} from "lucide-react";
import { ProgressBar } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserLearnProgress, updateUserLearnProgress } from "@/lib/db";

const chapters = [
  { title: "Introduction to Phishing", icon: BookOpen },
  { title: "How Phishing Attacks Work", icon: Activity },
  { title: "Types of Phishing", icon: Fingerprint },
  { title: "Identifying Phishing Attempts", icon: ShieldAlert },
  { title: "URL and Website Analysis", icon: Globe },
  { title: "Real-World Impact of Phishing", icon: Target },
  { title: "Prevention and Safety Measures", icon: Lock },
  { title: "Response, Reporting, and Modern Detection", icon: LifeBuoy },
  { title: "Personal Incident Response", icon: Terminal }
];

export default function LearnPage() {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [navbarVisible, setNavbarVisible] = useState(true);

  const progress = ((active + 1) / chapters.length) * 100;

  useEffect(() => {
    const handleNavbarChange = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (customEvt && customEvt.detail) {
        setNavbarVisible(customEvt.detail.visible);
      }
    };
    window.addEventListener("navbarVisibilityChange", handleNavbarChange);
    return () => window.removeEventListener("navbarVisibilityChange", handleNavbarChange);
  }, []);

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Fetch initial progress when user logs in
  useEffect(() => {
    if (!user) {
      setLoadingProgress(false);
      return;
    }

    const loadProgress = async () => {
      try {
        const savedProgress = await getUserLearnProgress(user.uid);
        setActive(savedProgress);
      } catch (err) {
        console.error("Failed to load user learn progress:", err);
      } finally {
        setLoadingProgress(false);
      }
    };

    loadProgress();
  }, [user]);

  // Save progress dynamically when active chapter changes
  const changeActiveChapter = async (index: number) => {
    if (index < 0 || index >= chapters.length) return;
    setActive(index);
    if (user) {
      try {
        await updateUserLearnProgress(user.uid, index);
      } catch (err) {
        console.error("Failed to save user learn progress:", err);
      }
    }
  };

  if (loadingProgress) {
    return (
      <>
        <Navbar />
        <CyberBackground />
        <div className="min-h-screen flex items-center justify-center bg-black/50 relative z-10">
          <div className="flex flex-col items-center gap-3 font-mono text-sm text-green-400">
            <Loader2 className="animate-spin text-green-500" size={32} />
            <span className="tracking-widest uppercase">Loading learning content...</span>
            <span className="text-[10px] text-gray-500 animate-pulse">// Loading course data</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* EXACT SPACER OFFSET FOR NAVBAR HEIGHT */}
      <motion.div 
        animate={{ height: navbarVisible ? 112 : 0 }} 
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      <CyberBackground />

      {/* LIQUID GLASS REFRACTIVE BACKGROUND BLOBS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] left-[5%] w-[380px] h-[380px] rounded-full bg-green-500/5 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 60, -30, 0],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[20%] right-[10%] w-[420px] h-[420px] rounded-full bg-emerald-500/4 blur-[130px]"
        />
      </div>

      {/* HEIGHT ADJUSTED TO PREVENT OVERLAY CUTS */}
      <motion.div 
        animate={{ height: navbarVisible ? "calc(100vh - 112px)" : "100vh" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex overflow-hidden text-gray-300 relative z-10 max-w-7xl mx-auto w-full px-4 md:px-6 gap-6"
      >
        
        {/* SIDEBAR PANEL */}
        <aside className="cyber-scroll h-[calc(100%-48px)] my-6 w-80 rounded-3xl border border-white/10 px-6 py-6 overflow-y-auto bg-white/[0.015] backdrop-blur-[35px] saturate-[1.6] shadow-[0_20px_50px_rgba(0,0,0,0.55)] flex flex-col justify-between select-none relative hidden md:flex overflow-hidden group/aside">
          {/* Liquid Sheen Highlight */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] via-transparent to-transparent opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute -inset-y-12 -inset-x-0 w-[50%] bg-gradient-to-r from-transparent via-white/[0.015] to-transparent skew-x-12 translate-x-[-150%] group-hover/aside:translate-x-[250%] transition-transform duration-[1500ms] ease-out pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-6 border-b border-white/5 pb-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <Shield className="text-green-400 h-5 w-5" />
              <h2 className="text-sm font-black text-white font-mono tracking-wider uppercase">
                Training Core
              </h2>
            </div>

            <div className="space-y-2">
              {chapters.map((ch, i) => {
                const Icon = ch.icon;
                const isActive = active === i;
                const isCompleted = active > i;
                
                let stateLabel = "Pending";
                if (isActive) stateLabel = "Active";
                else if (isCompleted) stateLabel = "Completed";

                return (
                  <button
                    key={i}
                    onClick={() => changeActiveChapter(i)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-300 font-mono text-sm relative overflow-hidden flex items-center gap-3.5 group cursor-pointer
                    ${
                      isActive
                        ? "bg-gradient-to-r from-green-500/10 to-transparent border-green-500/30 text-green-300 font-bold shadow-[0_4px_20px_rgba(34,197,94,0.05)]"
                        : isCompleted
                        ? "border-green-500/10 hover:border-green-500/25 hover:bg-green-500/[0.02] text-gray-400"
                        : "border-white/5 hover:bg-white/[0.02] hover:border-white/10 hover:text-white text-gray-500"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-[3px] bg-green-500"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}

                    {/* Chapter Number Badge */}
                    <span className={`text-[10px] font-mono shrink-0 ${isActive ? "text-green-400" : "text-gray-600"}`}>
                      0{i + 1}
                    </span>

                    <Icon size={15} className={`shrink-0 ${isActive ? "text-green-400" : isCompleted ? "text-green-500/50" : "text-gray-600"}`} />
                    
                    <div className="flex-1 min-w-0 font-sans">
                      <span className="truncate block text-xs tracking-wide">{ch.title}</span>
                      <span className={`text-[9px] font-mono block mt-0.5 uppercase tracking-wider ${isActive ? "text-green-400 animate-pulse font-bold" : isCompleted ? "text-green-600" : "text-gray-600"}`}>
                        {stateLabel}
                      </span>
                    </div>
                    {isCompleted ? (
                      <Check size={13} className="text-green-400 shrink-0 bg-green-500/10 p-0.5 rounded-full" />
                    ) : (
                      <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 border-t border-white/5 pt-4 relative z-10 font-mono">
            <div className="flex justify-between items-center text-[10px] text-gray-500 mb-2">
              <span>Course Progress</span>
              <span className="text-green-400 font-bold">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-black/45 border border-white/5 rounded-full overflow-hidden p-[1px]">
              <div 
                className="h-full bg-gradient-to-r from-green-600 via-green-500 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </aside>

        {/* MAIN HUD CONSOLE */}
        <main className="cyber-scroll h-full flex-1 overflow-y-auto px-4 md:px-8 py-8 flex flex-col justify-between bg-gradient-to-b from-black/5 via-transparent to-black/20 relative z-10">
          <div className="space-y-8 max-w-4xl mx-auto w-full">
            {/* TACTICAL HUD HEADER */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.015] backdrop-blur-[35px] saturate-[1.6] shadow-[0_20px_40px_rgba(0,0,0,0.45)] relative overflow-hidden group/header">
              {/* Liquid Sheen Highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.015] via-transparent to-transparent opacity-100 pointer-events-none" />
              <div className="absolute -inset-y-12 -inset-x-0 w-[50%] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent skew-x-12 translate-x-[-150%] group-hover/header:translate-x-[250%] transition-transform duration-[1200ms] ease-out pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    <span className="text-[10px] text-green-400 font-mono tracking-widest uppercase font-bold">
                      Interactive Training Guide
                    </span>
                  </div>
                  <h1 className="text-2xl font-black text-white font-mono uppercase tracking-wide mt-1">
                    Phishing Awareness Course
                  </h1>

                  {/* Mobile Chapter Selector */}
                  <div className="mt-4 md:hidden relative font-mono text-xs">
                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Select Chapter</span>
                    <select
                      value={active}
                      onChange={(e) => changeActiveChapter(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-green-300 focus:outline-none focus:border-green-400/40 transition duration-300"
                    >
                      {chapters.map((ch, idx) => (
                        <option key={idx} value={idx} className="bg-black text-gray-300">
                          Chapter 0{idx + 1}: {ch.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* HUD STATUS VALUES */}
                <div className="grid grid-cols-2 gap-4 text-left md:text-right font-mono text-xs text-gray-400">
                  <div className="border-l md:border-l-0 md:border-r border-white/5 pr-4 pl-4 md:pl-0">
                    <span className="text-[10px] text-gray-500 uppercase block">Current Chapter</span>
                    <span className="text-white font-bold block">0{active + 1} / 0{chapters.length}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block">Topic</span>
                    <span className="text-green-400 font-bold block truncate max-w-[150px]" title={chapters[active].title}>
                      {chapters[active].title}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE LEARNING SHEET BLOCK */}
            <div className="glass-card p-6 md:p-8 relative overflow-hidden group/card bg-white/[0.02] border-white/10 backdrop-blur-[35px] saturate-[1.6] shadow-[0_25px_60px_rgba(0,0,0,0.65)] hover:border-green-500/20 transition-all duration-500">
              {/* Liquid Sheen Highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent opacity-100 pointer-events-none" />
              <div className="absolute -inset-y-12 -inset-x-0 w-[50%] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent skew-x-12 translate-x-[-150%] group-hover/card:translate-x-[150%] transition-transform duration-[1500ms] ease-out pointer-events-none" />

              <div className="absolute top-2 right-2 font-mono text-[9px] text-gray-600 pointer-events-none select-none">
                Security Academy
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {active === 0 && <Intro />}
                  {active === 1 && <HowWorks />}
                  {active === 2 && <Types />}
                  {active === 3 && <Identify />}
                  {active === 4 && <URLAnalysis />}
                  {active === 5 && <Impact />}
                  {active === 6 && <Prevention />}
                  {active === 7 && <Response />}
                  {active === 8 && <PersonalIncidentResponse />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* HUD FOOTER ACTIONS */}
          <div className="flex justify-between items-center max-w-4xl mx-auto w-full mt-8 border-t border-white/5 pt-6 pb-4 font-mono">
            <button
              disabled={active === 0}
              onClick={() => changeActiveChapter(active - 1)}
              className="px-5 py-3 rounded-xl border border-white/5 hover:border-green-500/20 hover:bg-green-500/5 text-xs font-bold text-gray-400 hover:text-green-300 disabled:opacity-20 disabled:pointer-events-none transition duration-300 cursor-pointer flex items-center gap-2"
            >
              <span>←</span>
              <span>Previous</span>
            </button>

            <span className="text-[10px] text-gray-600 hidden md:inline">
              Training Course Status: Online
            </span>

            <button
              disabled={active === chapters.length - 1}
              onClick={() => changeActiveChapter(active + 1)}
              className="px-5 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black text-xs font-bold disabled:opacity-20 disabled:pointer-events-none transition duration-300 shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] cursor-pointer flex items-center gap-2"
            >
              <span>Next</span>
              <span>→</span>
            </button>
          </div>
        </main>
      </motion.div>
    </>
  );
}

/* ---------- COMMON LAYOUT ACCENT MODULE ---------- */
interface SectionProps {
  title: string;
  icon?: React.ComponentType<any>;
  children: React.ReactNode;
}

function Section({ title, icon: Icon, children }: SectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        {Icon && <Icon className="text-green-400 h-6 w-6" />}
        <h2 className="text-xl md:text-2xl font-black text-white font-mono uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <div className="space-y-5 leading-relaxed text-sm md:text-base text-gray-200 font-sans">
        {children}
      </div>
    </section>
  );
}

/* ---------- DETAILED HIGHLIGHT CARDS ---------- */
interface CalloutProps {
  type: "warning" | "info" | "success";
  title: string;
  children: React.ReactNode;
}

function Callout({ type, title, children }: CalloutProps) {
  const styles = {
    warning: {
      border: "border-red-500/20",
      bg: "bg-red-500/[0.02]",
      text: "text-red-400",
      icon: AlertCircle
    },
    info: {
      border: "border-blue-500/20",
      bg: "bg-blue-500/[0.02]",
      text: "text-blue-400",
      icon: Info
    },
    success: {
      border: "border-green-500/20",
      bg: "bg-green-500/[0.02]",
      text: "text-green-400",
      icon: CheckCircle2
    }
  }[type];

  const Icon = styles.icon;

  return (
    <div className={`p-5 rounded-2xl border ${styles.border} ${styles.bg} flex items-start gap-4 shadow-inner mt-4`}>
      <Icon size={18} className={`${styles.text} shrink-0 mt-0.5`} />
      <div className="space-y-1">
        <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${styles.text}`}>
          {title}
        </h4>
        <div className="text-xs md:text-sm text-gray-300 font-sans leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------- HIGH-FIDELITY INTERACTIVE QUIZ ---------- */
interface QuizProps {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

function Quiz({ question, options, answerIndex, explanation }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="mt-8 p-6 border border-white/5 rounded-2xl bg-black/40 backdrop-blur-xl shadow-inner relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[2px] h-full bg-green-500/50" />
      
      <p className="font-bold text-green-400 mb-2 font-mono text-[9px] uppercase tracking-widest flex items-center gap-1.5 select-none">
        <Shield size={12} className="animate-pulse" />
        Chapter Quiz
      </p>

      <p className="mb-4 text-sm text-gray-200 leading-relaxed font-sans">{question}</p>

      <div className="space-y-2.5">
        {options.map((opt, i) => {
          let btnStyle = "border-white/5 hover:border-green-500/25 hover:bg-white/[0.01] text-gray-300";
          if (showAnswer) {
            if (i === answerIndex) {
              btnStyle = "border-green-500/40 bg-green-500/10 text-green-300 font-bold shadow-[0_0_10px_rgba(34,197,94,0.05)]";
            } else if (i === selected) {
              btnStyle = "border-red-500/40 bg-red-500/10 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.05)]";
            } else {
              btnStyle = "border-white/5 opacity-30 text-gray-500";
            }
          }

          return (
            <button
              key={i}
              disabled={showAnswer}
              onClick={() => {
                setSelected(i);
                setShowAnswer(true);
              }}
              className={`block w-full text-left px-4 py-3.5 rounded-xl border text-xs font-mono transition-all duration-300 ${btnStyle} flex items-center justify-between cursor-pointer`}
            >
              <span>{opt}</span>
              {showAnswer && i === answerIndex && <Check size={14} className="text-green-400 shrink-0 bg-green-500/20 p-0.5 rounded-full" />}
              {showAnswer && i === selected && i !== answerIndex && <AlertTriangle size={14} className="text-red-400 shrink-0 bg-red-500/20 p-0.5 rounded-full" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showAnswer && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 pt-5 border-t border-white/5 overflow-hidden"
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1 text-green-400">
              {selected === answerIndex ? "✓ Correct Answer" : "✗ Incorrect Answer"}
            </span>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              {explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =================================================================================================
 * CHAPTER COMPONENTS
 * ===============================================================================================*/

/* --- 1. INTRODUCTION --- */
function Intro() {
  return <IntroContent />;
}

function IntroContent() {
  return (
    <Section title="Introduction to Phishing" icon={BookOpen}>
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed font-sans text-sm md:text-base">
          Phishing is a deceptive cyberattack vector where threat actors impersonate trusted
          entities—such as banks, corporate executives, or digital service providers—to manipulate 
          users into exposing credentials, financial payloads, or Multi-Factor tokens. 
        </p>
        
        <p className="text-gray-300 leading-relaxed font-sans text-sm md:text-base">
          Unlike technical hacking vectors that seek code exploits, phishing targets 
          <strong className="text-white"> human cognitive protocols</strong>. By engineering feelings of urgency, threat, or high reward, 
          attackers trick operators into bypassing normal verification steps.
        </p>
      </div>

      {/* Threat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        {[
          { label: "Breaches from Phishing", val: "91%", desc: "Originates via Phishing", color: "text-red-400", border: "border-red-500/20" },
          { label: "Attack Frequency", val: "11s", desc: "Worldwide Attack Cycle", color: "text-yellow-400", border: "border-yellow-500/20" },
          { label: "Average Breach Cost", val: "$4.9M", desc: "Average Breach Cost", color: "text-blue-400", border: "border-blue-500/20" }
        ].map((m, idx) => (
          <div key={idx} className={`p-4 bg-black/45 rounded-2xl border ${m.border} relative overflow-hidden group hover:bg-black/60 transition-all duration-300`}>
            <div className="absolute top-0 right-0 w-8 h-8 bg-white/[0.01] border-b border-l border-white/5 rounded-bl-xl pointer-events-none" />
            <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest block mb-1">{m.label}</span>
            <span className={`text-3xl font-black font-mono block ${m.color}`}>{m.val}</span>
            <span className="text-[10px] text-gray-400 mt-1.5 block font-sans">{m.desc}</span>
          </div>
        ))}
      </div>

      <Callout type="warning" title="Cognitive Override Vulnerability">
        Standard firewalls and encrypted pipes cannot prevent phishing if an operator willingly enters 
        credentials on a spoofed portal. Human training is the primary firewall against social engineering.
      </Callout>

      <Quiz
        question="Phishing primarily exploits which vector?"
        options={[
          "Unpatched zero-day firmware flaws",
          "Human psychological and trust protocols",
          "Inefficient packet routing protocols",
          "Insufficient RAM allocations on local nodes"
        ]}
        answerIndex={1}
        explanation="Phishing exploits cognitive vulnerabilities (trust, fear, urgency) rather than structural code vulnerabilities."
      />
    </Section>
  );
}

/* --- 2. HOW ATTACKS WORK --- */
function HowWorks() {
  const steps = [
    { num: "01", label: "Reconnaissance", cmd: "OSINT Gathering", icon: Search, desc: "Attackers gather information from public sources, social networks, and data leaks to target specific profiles." },
    { num: "02", label: "Infrastructure", cmd: "Cloning Login UI", icon: Laptop, desc: "Attackers register domain names mimicking real brands and set up cloned login screens." },
    { num: "03", label: "Lure Delivery", cmd: "Spoofing Sender", icon: Send, desc: "The phishing payload link or attachment is sent to targets via email, SMS, or other direct channels." },
    { num: "04", label: "User Compromise", cmd: "Capturing Inputs", icon: UserMinus, desc: "The target is manipulated into clicking the link, logging in, or opening the file under stressful conditions." },
    { num: "05", label: "System Exploit", cmd: "Exfiltrating Tokens", icon: ShieldCheck, desc: "Attackers hijack active session cookies, download databases, or compromise connected network logs." }
  ];

  return (
    <Section title="How Phishing Attacks Work" icon={Activity}>
      <p className="text-gray-300 leading-relaxed font-sans text-sm md:text-base">
        A phishing vector operates systematically. Rather than chaotic attempts, attackers 
        deploy a structured compromise chain designed to bypass defensive firewalls and user suspicions.
      </p>

      {/* TIMELINE INTERACTIVE DIAGRAM */}
      <div className="mt-8 space-y-6 relative">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-green-400 mb-4 flex items-center gap-2">
          <Terminal size={12} className="animate-pulse" />
          // Attack Lifecycle Timeline
        </h4>
        
        {/* Connection Line */}
        <div className="absolute left-[20px] top-[40px] bottom-[20px] w-[1px] bg-gradient-to-b from-green-500/20 via-green-500/5 to-transparent pointer-events-none" />

        {steps.map((s, idx) => {
          const StepIcon = s.icon;
          return (
            <div key={idx} className="flex gap-5 items-start group relative">
              <div className="flex flex-col items-center relative z-10">
                <span className="w-10 h-10 rounded-xl border border-green-500/25 flex items-center justify-center font-mono text-xs text-green-400 bg-black group-hover:border-green-500 transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.05)] group-hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] shrink-0">
                  <StepIcon size={16} />
                </span>
              </div>
              
              <div className="flex-1 bg-black/40 border border-white/5 p-5 rounded-2xl hover:border-green-500/20 hover:bg-black/60 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 font-mono text-[9px] text-green-500/30 px-3 py-1.5 border-l border-b border-white/5 bg-white/[0.01] hidden sm:block">
                  {s.cmd}
                </div>
                <span className="text-sm font-mono font-bold text-white uppercase tracking-wider block mb-1">
                  {s.num}. {s.label}
                </span>
                <p className="text-xs md:text-sm text-gray-400 font-sans leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Quiz
        question="Which phase of the lifecycle focuses on gathering targets' personal detail profiles?"
        options={[
          "Eradication and monitoring",
          "Reconnaissance and information gathering",
          "Lure dispatch execution",
          "Credential harvesting"
        ]}
        answerIndex={1}
        explanation="Reconnaissance is the initial phase where attackers research targets to personalize lures for spear-phishing."
      />
    </Section>
  );
}

/* --- 3. TYPES OF PHISHING --- */
function Types() {
  const [activeTab, setActiveTab] = useState(0);

  const typesList = [
    {
      name: "Spear Phishing",
      vector: "Email",
      threat: "HIGH",
      color: "text-red-400",
      complexity: "85%",
      successRate: "76%",
      desc: "Unlike mass phishing, spear phishing is personalized. Attackers research targets in advance, utilizing specific details (e.g., job titles, project names, or colleague names) to build trust.",
      example: `FROM: Corporate IT Security <security-update@company-portal.com>
TO: John Doe <john.doe@company.com>
SUBJECT: CRITICAL: Verify Your Corporate Password

Dear John,

Our systems indicate that your work computer has not updated its security certificate.
Please verify your credentials using the compliance link below within the next 12 hours to avoid account suspension:

URL: https://company-portal.verify-security-login.net/auth`
    },
    {
      name: "Whaling",
      vector: "Executive Channels",
      threat: "CRITICAL",
      color: "text-red-500",
      complexity: "95%",
      successRate: "62%",
      desc: "A sub-type of spear phishing specifically targeting high-profile targets such as CEOs, CFOs, or government officials to authorize wire transfers or access databases.",
      example: `FROM: Richard Miller <richard.miller@acquisition-group.org>
TO: CFO <alex.cfo@company.com>
SUBJECT: CONFIDENTIAL: Wire transfer authorization for acquisition

Alex,

I need you to authorize the initial escrow deposit of $1,420,000 for the acquisition project immediately.
We are locking the asset transfer window within the hour. Use these escrow details:

IBAN: US82 3400 1200 4509 11 (Escrow Account)`
    },
    {
      name: "Smishing",
      vector: "SMS Text Message",
      threat: "MEDIUM",
      color: "text-yellow-400",
      complexity: "40%",
      successRate: "48%",
      desc: "Phishing conducted through SMS text messages. These often masquerade as delivery notifications, bank alerts, or government warnings containing urgent action links.",
      example: `FedEx ALERT: Your package #481-942 is on hold due to an incomplete delivery address.
Update your delivery address within 24 hours to avoid package return:

LINK: https://fedex-redirection-hub.org/shipping/update`
    },
    {
      name: "Vishing",
      vector: "Voice Call",
      threat: "MEDIUM",
      color: "text-yellow-400",
      complexity: "60%",
      successRate: "35%",
      desc: "Voice phishing where attackers call victims directly, using spoofed numbers and social engineering tactics to extract critical verification elements or bank pins.",
      example: `CALLER_ID: Mimicking [Internal Revenue Service - 1-800-829-1040]
Voice Prompt: "This is an automated notification from the Internal Revenue Service.
An outstanding tax balance of $4,850 has been detected on your account.
Press 1 to speak with an agent and resolve your payment now."`
    },
    {
      name: "Clone Phishing",
      vector: "Email Clone",
      threat: "HIGH",
      color: "text-red-400",
      complexity: "75%",
      successRate: "68%",
      desc: "Attackers take a legitimate email containing attachments or links that the victim has previously received, copy it, swap links with malware, and send a cloned email.",
      example: `FROM: Document Signing Notification <contracts@company-portal.org>
TO: John Doe <john.doe@company.com>
SUBJECT: Re: Signed Lease Agreement

John,

We had to adjust line 14 of the contract attachment.
Please sign the updated version by clicking the portal access code below:

LINK: http://contracts-portal-signature.org/secure/sign`
    }
  ];

  return (
    <Section title="Types of Phishing" icon={Fingerprint}>
      <p className="text-gray-300 leading-relaxed font-sans text-sm md:text-base">
        Phishing has evolved from generic mass spam into multiple highly specialized sub-vectors. 
        Attackers select their methods based on the specific targets and accessibility constraints of the organization.
      </p>

      {/* INTERACTIVE CONTROLS TABS */}
      <div className="mt-8 border border-white/5 rounded-2xl overflow-hidden bg-black/20 backdrop-blur-xl">
        <div className="flex overflow-x-auto border-b border-white/5 scrollbar-none bg-black/45 p-1.5 gap-1.5 select-none">
          {typesList.map((t, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-colors duration-300 cursor-pointer
                ${isActive ? "text-green-300 font-bold" : "text-gray-500 hover:text-gray-300"}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTypesTab"
                    className="absolute inset-0 bg-green-500/10 border border-green-500/20 rounded-xl animate-pulse"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t.name}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6 space-y-6">
          {/* STATS MATRIX */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-white/5 pb-5">
            <div>
              <span className="text-[9px] font-mono text-gray-500 block uppercase">Attack Vector</span>
              <span className="text-xs md:text-sm font-mono font-bold text-white">{typesList[activeTab].vector}</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-gray-500 block uppercase">Threat Level</span>
              <span className={`text-xs md:text-sm font-mono font-bold ${typesList[activeTab].color}`}>{typesList[activeTab].threat}</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-gray-500 block uppercase">Complexity</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: typesList[activeTab].complexity }} />
                </div>
                <span className="text-[10px] font-mono text-gray-300">{typesList[activeTab].complexity}</span>
              </div>
            </div>
            <div>
              <span className="text-[9px] font-mono text-gray-500 block uppercase">Success Rate</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: typesList[activeTab].successRate }} />
                </div>
                <span className="text-[10px] font-mono text-gray-300">{typesList[activeTab].successRate}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm md:text-base font-bold text-white font-mono uppercase tracking-wide">
              {typesList[activeTab].name} Overview
            </h4>
            <p className="text-xs md:text-sm text-gray-300 font-sans leading-relaxed">
              {typesList[activeTab].desc}
            </p>
          </div>

          {/* SIMULATED ATTACK CONSOLE */}
          <div className="border border-white/5 bg-black/60 rounded-xl overflow-hidden font-mono text-[11px] md:text-xs shadow-inner">
            <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between text-gray-400 text-[9px] md:text-[10px]">
              <span>[Simulated Attack Payload]</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            </div>
            <pre className="p-4 overflow-x-auto text-gray-300 leading-relaxed font-mono whitespace-pre select-text">
              {typesList[activeTab].example}
            </pre>
          </div>
        </div>
      </div>

      <Quiz
        question="Which attack focus impersonates corporate executives to authorize large financial payouts?"
        options={[
          "Generic spam mailing",
          "Whaling attack",
          "Local network spoofing",
          "WiFi sniffing hijack"
        ]}
        answerIndex={1}
        explanation="Whaling specifically targets high-value corporate executives like CEOs and CFOs who have authorization privileges."
      />
    </Section>
  );
}

/* --- 4. IDENTIFYING PHISHING --- */
function Identify() {
  const [inspectMode, setInspectMode] = useState<"legit" | "phish">("phish");
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);

  const phishAuditNotes: Record<string, { title: string; check: string; result: string; advise: string }> = {
    sender: {
      title: "Sender Validation",
      check: "Domain & Email Authenticity Check (SPF / DKIM)",
      result: "DKIM Signature: MISSING. SPF Record: Fail. The sending server IP is not listed in the legitimate Netflix mail servers list.",
      advise: "Never trust a display name ('Netflix'). Always look for SPF/DKIM verification details in the email client header."
    },
    urgency: {
      title: "Tone & Urgency Analysis",
      check: "Tone & Urgency Assessment",
      result: "Flagged: High urgency hook ('IMMEDIATE SUSPENSION' / '24 hours'). Designed to induce panic.",
      advise: "Legitimate businesses will warn about billing issues but rarely suspend your access without warning and multiple emails."
    },
    greeting: {
      title: "Greeting Personalization",
      check: "Database Personalization Check",
      result: "Greeting: Anonymous / Generic ('Dear Customer'). Reveals that the email was dispatched to a generic list.",
      advise: "Be cautious with emails from organizations you hold accounts with that don't address you by your real name."
    },
    link: {
      title: "Destination Link Verification",
      check: "URL Destination Check",
      result: "Destination: http://secure-netflix-accounts.check-portal.net/auth. This points to check-portal.net, not netflix.com.",
      advise: "Always hover over buttons or links to inspect the actual destination path before entering your credentials."
    }
  };

  return (
    <Section title="Identifying Phishing Attempts" icon={ShieldAlert}>
      <p className="text-gray-300 leading-relaxed font-sans text-sm md:text-base">
        Most phishing emails leave digital artifacts and behavioral clues that operators can spot. 
        Developing the habit of inspecting message headers, grammatical structures, and links protects accounts.
      </p>

      {/* HEADER COMPARISON CONSOLE */}
      <div className="mt-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-green-400 flex items-center gap-2">
            <Terminal size={12} />
            // Sample Email Header Analysis
          </span>
          
          <div className="flex bg-black/45 border border-white/5 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => {
                setInspectMode("phish");
                setSelectedAudit(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer
              ${inspectMode === "phish" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "text-gray-500 hover:text-gray-300"}`}
            >
              Phishing (Spoofed)
            </button>
            <button
              onClick={() => {
                setInspectMode("legit");
                setSelectedAudit(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer
              ${inspectMode === "legit" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "text-gray-500 hover:text-gray-300"}`}
            >
              Legitimate (Verified)
            </button>
          </div>
        </div>

        {inspectMode === "phish" ? (
          <div className="border border-red-500/25 bg-red-500/[0.01] rounded-2xl p-6 font-mono text-xs md:text-sm space-y-4 relative overflow-hidden shadow-lg shadow-red-950/5">
            <div className="absolute top-0 right-0 bg-red-500/10 text-red-400 px-3 py-1.5 text-[8px] md:text-[9px] tracking-widest font-bold uppercase border-l border-b border-red-500/20 animate-pulse">
              Security Analysis
            </div>
            
            <div className="space-y-2 border-b border-white/5 pb-4 pt-2">
              <div 
                onClick={() => setSelectedAudit("sender")}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${selectedAudit === "sender" ? "border-red-500 bg-red-500/10" : "border-transparent hover:border-red-500/20 hover:bg-white/[0.01]"}`}
              >
                <span className="text-gray-500">From:</span>{" "}
                <span className="text-red-400 font-bold underline decoration-dotted">Netflix accounts-verify@netflix-update.secure-portal.com</span>
                <span className="text-[8px] md:text-[9px] text-red-500 font-bold ml-2 font-mono">[Verify Point]</span>
              </div>
              <div className="p-1.5">
                <span className="text-gray-500">To:</span>{" "}
                <span>user@company.com</span>
              </div>
              <div 
                onClick={() => setSelectedAudit("urgency")}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${selectedAudit === "urgency" ? "border-red-500 bg-red-500/10" : "border-transparent hover:border-red-500/20 hover:bg-white/[0.01]"}`}
              >
                <span className="text-gray-500">Subject:</span>{" "}
                <span className="text-yellow-400 font-bold underline decoration-dotted">⚠️ Billing Issue: Action Required</span>
                <span className="text-[8px] md:text-[9px] text-yellow-500 font-bold ml-2 font-mono">[Verify Point]</span>
              </div>
            </div>

            <div className="text-gray-300 py-2 leading-relaxed space-y-4 font-sans text-xs md:text-sm">
              <p 
                onClick={() => setSelectedAudit("greeting")}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer font-mono inline-block ${selectedAudit === "greeting" ? "border-red-500 bg-red-500/10" : "border-transparent hover:border-red-500/20 hover:bg-white/[0.01]"}`}
              >
                Dear Customer, <span className="text-[8px] md:text-[9px] text-red-500 font-bold ml-2 font-mono">[Verify Point]</span>
              </p>
              <p className="px-1.5">
                We were unable to process your billing index. Access will be revoked in **24 hours** 
                unless billing records are updated.
              </p>
              <div className="pt-2 px-1.5">
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAudit("link");
                  }}
                  className={`px-4 py-2 border rounded-lg inline-block text-[11px] font-mono tracking-wide cursor-pointer transition-all
                  ${selectedAudit === "link" ? "border-red-500 bg-red-500/20 text-red-300 font-bold" : "border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10"}`}
                >
                  Update Billing Information
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-green-500/25 bg-green-500/[0.01] rounded-2xl p-6 font-mono text-xs md:text-sm space-y-4 relative overflow-hidden shadow-lg shadow-green-950/5">
            <div className="absolute top-0 right-0 bg-green-500/10 text-green-400 px-3 py-1.5 text-[8px] md:text-[9px] tracking-widest font-bold uppercase border-l border-b border-green-500/20">
              Email Authenticated
            </div>

            <div className="space-y-2 border-b border-white/5 pb-4 pt-2">
              <div className="p-1.5">
                <span className="text-gray-500">From:</span>{" "}
                <span className="text-green-400 font-bold">Netflix info@netflix.com</span>
                <span className="text-[8px] md:text-[9px] text-green-500 font-mono ml-2">[SPF/DKIM: Pass]</span>
              </div>
              <div className="p-1.5">
                <span className="text-gray-500">To:</span>{" "}
                <span>user@company.com</span>
              </div>
              <div className="p-1.5">
                <span className="text-gray-500">Subject:</span>{" "}
                <span>Monthly billing confirmation receipt</span>
              </div>
            </div>

            <div className="text-gray-300 py-2 leading-relaxed space-y-4 font-sans text-xs md:text-sm">
              <p className="p-1.5 font-mono">
                Dear John Doe,
              </p>
              <p className="px-1.5">
                This email confirms that your monthly subscription invoice has been successfully processed. 
                Your billing receipt details are stored in your settings dashboard.
              </p>
              <div className="pt-2 px-1.5">
                <span className="px-4 py-2 border border-green-500/20 bg-green-500/5 text-green-400 rounded-lg inline-block text-[11px] font-mono tracking-wide select-none">
                  netflix.com/your-account
                </span>
              </div>
            </div>
          </div>
        )}

        {/* AUDIT CORNER NOTES PANEL */}
        <AnimatePresence mode="wait">
          {inspectMode === "phish" && (
            <motion.div
              key={selectedAudit || "idle"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-5 rounded-2xl border border-white/5 bg-black/45 shadow-inner"
            >
              {selectedAudit && phishAuditNotes[selectedAudit] ? (
                <div className="space-y-2 font-mono">
                  <div className="flex justify-between items-center text-[10px] text-red-400 font-bold uppercase tracking-wider">
                    <span>{phishAuditNotes[selectedAudit].title}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  </div>
                  <h5 className="text-[11px] md:text-xs text-gray-300 font-bold">{phishAuditNotes[selectedAudit].check}</h5>
                  <p className="text-[11px] md:text-xs text-red-300 font-sans leading-relaxed mt-1">{phishAuditNotes[selectedAudit].result}</p>
                  <p className="text-[11px] md:text-xs text-gray-400 font-sans leading-relaxed mt-2 pt-2 border-t border-white/5">
                    <strong className="text-white block mb-0.5">Defensive Strategy:</strong>
                    {phishAuditNotes[selectedAudit].advise}
                  </p>
                </div>
              ) : (
                <div className="text-center text-[11px] md:text-xs text-gray-500 font-mono italic py-2">
                  Click any highlighted <span className="text-red-400 font-bold">[Verify Point]</span> in the email body above to analyze its components.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Quiz
        question="Which header field discrepancy is the strongest indicator of a spoofed phishing message?"
        options={[
          "An email address that mismatches the actual brand subdomain routing",
          "A subject line that doesn't use standard punctuation",
          "A timestamp displaying a late-night delivery index",
          "The absence of images inside the message content frame"
        ]}
        answerIndex={0}
        explanation="Spoofed senders use similar names, but the root domain name in the address field will reveal they do not control the brand domain."
      />
    </Section>
  );
}

/* --- 5. URL AND WEBSITE ANALYSIS --- */
function URLAnalysis() {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const urlSegments = [
    { part: "https://", desc: "Security Protocol: Encrypts data in transit. Note: Attackers configure valid HTTPS SSL/TLS layers too! A browser lock icon only signals encrypted transport integrity, not verification of host identity.", type: "neutral", record: "SSL Handshake: Secure" },
    { part: "netflix", desc: "Obfuscated Subdomain: Attackers put trusted brand labels here as a prefix to trick eyes that read from left to right, making it seem like the brand's space.", type: "warn", record: "Subdomain Check: Mismatch Detected" },
    { part: ".billing-check", desc: "Auxiliary Subdomain: Extra descriptive labels configured by the host provider to distract the operator from verifying the root host domain registry.", type: "warn", record: "Subdomain Alert: Unusual Layout" },
    { part: ".secure-login-portal", desc: "Root Domain Owner: This is the actual owner root domain of the host website. Because it resolves to secure-login-portal instead of netflix, it is a phishing gateway!", type: "critical", record: "WHOIS Registry: Registered 48 Hours Ago" },
    { part: ".com", desc: "Top-Level Domain (TLD): General purpose generic TLD. Anyone can purchase standard domain suffixes under any brand prefix.", type: "neutral", record: "TLD Check: Standard TLD" },
    { part: "/update-account", desc: "Directory Path: Server path structure configured by the attacker to copy legitimate Netflix settings sub-navigation structures.", type: "neutral", record: "Path Check: Valid" }
  ];

  return (
    <Section title="URL and Website Analysis" icon={Globe}>
      <p className="text-gray-300 leading-relaxed font-sans text-sm md:text-base">
        Modern phishing websites look visually identical to the corporate portals they clone. 
        The only element that attackers cannot duplicate is the **registered root domain name** in the browser address bar.
      </p>

      {/* URL DISSECTION INTERACTIVE CONSOLE */}
      <div className="mt-8 space-y-6">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-green-400 flex items-center gap-2">
          <Terminal size={12} />
          // URL Segment Parser (Click components to analyze)
        </h4>
        
        <div className="bg-black/30 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Browser Window Control Bar */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 bg-black/40 rounded-xl px-4 py-2 text-xs text-gray-450 flex items-center justify-center gap-1.5 border border-white/5 max-w-lg mx-auto font-mono">
              <Lock size={12} className="text-green-400 shrink-0" />
              <span className="truncate text-gray-400">secure-connection // Analysis Target</span>
            </div>
          </div>
          
          {/* Segment Blocks Grid */}
          <div className="p-6 bg-black/45 flex flex-wrap items-center justify-center gap-1.5 select-none">
            {urlSegments.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSegment(idx)}
                className={`px-3 py-2 rounded-lg border transition-all cursor-pointer font-bold font-mono text-xs md:text-sm
                ${
                  activeSegment === idx
                    ? s.type === "critical"
                      ? "bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                      : s.type === "warn"
                      ? "bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.25)]"
                      : "bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.25)]"
                    : s.type === "critical"
                    ? "border-red-500/20 text-red-400 hover:border-red-500/40 hover:bg-red-500/5"
                    : s.type === "warn"
                    ? "border-yellow-500/20 text-yellow-400 hover:border-yellow-500/40 hover:bg-yellow-500/5"
                    : "border-white/5 text-gray-400 hover:border-white/20 hover:bg-white/5"
                }`}
              >
                {s.part}
              </button>
            ))}
          </div>
        </div>

        {/* ANNOTATION DISPLAY */}
        <AnimatePresence mode="wait">
          {activeSegment !== null ? (
            <motion.div
              key={activeSegment}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-5 rounded-2xl border border-white/5 bg-black/40 shadow-inner"
            >
              <div className="flex justify-between items-center text-[8px] md:text-[9px] font-mono mb-2">
                <span className="text-gray-500">Classification Type:</span>
                <span className={`font-bold ${
                  urlSegments[activeSegment].type === "critical"
                    ? "text-red-400"
                    : urlSegments[activeSegment].type === "warn"
                    ? "text-yellow-400"
                    : "text-blue-400"
                }`}>
                  {urlSegments[activeSegment].type.toUpperCase()}
                </span>
              </div>
              <h5 className="font-mono font-bold text-white text-xs md:text-sm mb-1.5">
                Segment: {urlSegments[activeSegment].part}
              </h5>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
                {urlSegments[activeSegment].desc}
              </p>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[8px] md:text-[9px] font-mono text-gray-500">
                <span>Heuristic Record:</span>
                <span className="text-white font-bold">{urlSegments[activeSegment].record}</span>
              </div>
            </motion.div>
          ) : (
            <div className="p-5 rounded-2xl border border-white/5 bg-black/30 text-center text-xs text-gray-500 font-mono italic">
              Select any URL segment above to see its detailed diagnostic information.
            </div>
          )}
        </AnimatePresence>
      </div>

      <Quiz
        question="Given: https://paypal.verification-portal-service.net/login. What is the root domain label?"
        options={[
          "paypal",
          "verification-portal-service",
          "net",
          "login"
        ]}
        answerIndex={1}
        explanation="The root domain label immediately precedes the TLD (.net). Here, the root domain is 'verification-portal-service.net', not 'paypal.com'."
      />
    </Section>
  );
}

/* --- 6. REAL-WORLD IMPACT --- */
function Impact() {
  const caseStudies = [
    {
      title: "Credential Harvesting",
      metric: "72% of Data Breaches",
      severity: "Critical Threat",
      color: "text-red-400",
      border: "border-red-500/20",
      desc: "Attackers deploy fake Outlook, Gmail, or corporate SSO login portals. Once operators input access keys, they hijack cloud files, email boxes, and network directories."
    },
    {
      title: "Business Email Compromise (BEC)",
      metric: "Financial Redirect Vector",
      severity: "High Threat",
      color: "text-yellow-400",
      border: "border-yellow-500/20",
      desc: "By spoofing or hijacking executive mailboxes, attackers instruct accounting operators to modify invoice bank destination codes, redirecting corporate payments."
    },
    {
      title: "Ransomware Infiltration",
      metric: "System Shutdown Payload",
      severity: "Critical Threat",
      color: "text-red-500",
      border: "border-red-500/25",
      desc: "Phishing emails carry disguised scripts (macros, fake PDFs). Once opened, they execute local shellcode, encrypting company databases and demanding millions in payout."
    }
  ];

  return (
    <Section title="Real-World Impact of Phishing" icon={Target}>
      <p className="text-gray-300 leading-relaxed font-sans text-sm md:text-base">
        Phishing is rarely a solitary threat; it serves as the spearhead vector for complex organizational compromises, 
        malware deployments, and financial fraud.
      </p>

      {/* BENTO GRID CASES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        {caseStudies.map((cs, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border ${cs.border} bg-black/40 hover:bg-black/60 transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 font-mono text-[8px] bg-white/5 border-l border-b border-white/5 px-2 py-1 text-gray-500">
              {cs.severity}
            </div>
            
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-green-400 font-bold block tracking-widest">// Threat Scenario 0{idx+1}</span>
              <h4 className="text-sm md:text-base font-bold text-white font-mono uppercase tracking-wide">{cs.title}</h4>
              <p className="text-xs md:text-sm text-gray-400 font-sans leading-relaxed">{cs.desc}</p>
            </div>
            
            <div className="pt-2 border-t border-white/5 font-mono text-[9px] text-gray-500 uppercase tracking-wider flex justify-between">
              <span>Impact:</span>
              <span className={`${cs.color} font-bold`}>{cs.metric}</span>
            </div>
          </div>
        ))}
      </div>

      <Quiz
        question="Which attack focus impersonates corporate routing instructions to divert legitimate vendor invoices to hacker accounts?"
        options={[
          "Credential Harvesting",
          "Business Email Compromise (BEC)",
          "Typo-Squatted SQL Injection",
          "Local wireless decryption"
        ]}
        answerIndex={1}
        explanation="Business Email Compromise (BEC) manipulates business correspondence, usually impersonating executives or vendors, to divert wire transfers."
      />
    </Section>
  );
}

/* --- 7. PREVENTION MEASURES --- */
function Prevention() {
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false, false, false]);

  const toggleCheck = (idx: number) => {
    const next = [...checkedItems];
    next[idx] = !next[idx];
    setCheckedItems(next);
  };

  const currentTally = checkedItems.filter(Boolean).length;
  const checklistProgress = (currentTally / checkedItems.length) * 100;

  const steps = [
    { title: "Enforce Multi-Factor Authentication (MFA)", desc: "MFA blocks up to 99% of simple automated account takeovers, even if credentials are stolen." },
    { title: "Deploy Password Management Utilities", desc: "Password managers evaluate browser URLs and will refuse to auto-fill credentials on look-alike phishing pages." },
    { title: "Inspect Sender Domain Records & Routing Details", desc: "Verify if SPF, DKIM, and DMARC envelopes match. Treat generic notifications as untrusted." },
    { title: "Implement Passive Link-Inspection Protocols (Hover)", desc: "Always hover over links to read their actual destination address before committing keystrokes." },
    { title: "Enforce DNS Security Filters & Firewalls", desc: "Block connection access to known threat repositories using services that block suspicious domain classifications." }
  ];

  return (
    <Section title="Prevention and Safety Measures" icon={Lock}>
      <p className="text-gray-300 leading-relaxed font-sans text-sm md:text-base">
        Building a strong security profile requires a mixture of defensive tools and careful user habits. 
        By implementing these rules, operators can reduce threat exposure.
      </p>

      {/* CHECKLIST HUD INTERACTIVE MODULE */}
      <div className="mt-8 space-y-5 bg-black/30 border border-white/5 p-6 rounded-2xl backdrop-blur-xl">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="font-bold text-green-400 uppercase tracking-wider">// Training Checklist Progress</span>
          <span className="text-gray-400">{currentTally} / {checkedItems.length} Completed</span>
        </div>
        
        <div className="w-full h-1.5 bg-black/45 border border-white/5 rounded-full overflow-hidden p-[1px]">
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 to-green-500 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.3)]"
            style={{ width: `${checklistProgress}%` }}
          />
        </div>

        <div className="space-y-3 pt-2">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 cursor-pointer
              ${
                checkedItems[idx]
                  ? "bg-green-500/[0.02] border-green-500/35 text-white"
                  : "bg-white/[0.01] border-white/5 hover:border-white/10 text-gray-400"
              }`}
            >
              {/* Dynamic LED Indicator */}
              <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all
              ${checkedItems[idx] ? "border-green-500 bg-green-500 text-black shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "border-white/20 bg-black/20"}`}>
                {checkedItems[idx] && <Check size={12} strokeWidth={3.5} />}
              </div>
              <div className="flex-1">
                <span className={`text-xs md:text-sm font-mono font-bold block ${checkedItems[idx] ? "text-green-300" : "text-white"}`}>
                  {s.title}
                </span>
                <p className="text-xs md:text-sm text-gray-400 mt-1 font-sans leading-relaxed">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Quiz
        question="Which system represents the most powerful defense against credential-theft access?"
        options={[
          "A localized DNS cache reload",
          "Deploying Multi-Factor Authentication (MFA / 2FA)",
          "Adding a secure banner warning in HTML emails",
          "Periodically updating device hardware specs"
        ]}
        answerIndex={1}
        explanation="Even if an attacker harvests the user's password, MFA blocks access by requiring a separate token verification."
      />
    </Section>
  );
}

/* --- 8. RESPONSE & MODERN DETECTION --- */
function Response() {
  return (
    <Section title="Response, Reporting, and Modern Detection" icon={LifeBuoy}>
      <p className="text-gray-300 leading-relaxed font-sans text-sm md:text-base">
        Modern security filters use automated detection systems. By analyzing message vocabulary, 
        domain ages, SSL signature paths, and link layouts, automated firewalls identify threats 
        before they hit the inbox.
      </p>

      {/* TWO PILLAR CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
        <div className="p-5 bg-black/45 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-green-500/15 transition-all duration-300">
          <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-500/40 m-3" />
          <h4 className="text-xs md:text-sm font-mono font-bold text-white mb-2.5 uppercase tracking-wide flex items-center gap-2">
            <Shield size={14} className="text-green-400" />
            1. Sender Policy (SPF / DKIM)
          </h4>
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-sans">
            Authentication frameworks (SPF, DKIM) verify if the sending server is authorized to 
            dispatch mail on behalf of the domain label, dropping suspicious spoofed senders automatically.
          </p>
        </div>
        
        <div className="p-5 bg-black/45 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-green-500/15 transition-all duration-300">
          <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-500/40 m-3" />
          <h4 className="text-xs md:text-sm font-mono font-bold text-white mb-2.5 uppercase tracking-wide flex items-center gap-2">
            <Globe size={14} className="text-green-400" />
            2. Reputation Feeds
          </h4>
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-sans">
            Browsers reference online domain blacklists (Google Safe Browsing, PhishTank) to block 
            connections to domain labels registered in the last 24-48 hours.
          </p>
        </div>
      </div>

      <Quiz
        question="What cryptographic verification system checks if a mail delivery server is authorized to send emails?"
        options={[
          "Local host file audits",
          "Sender Policy Framework (SPF) records",
          "Virtual Private Network routing checks",
          "SSL browser certificate verification"
        ]}
        answerIndex={1}
        explanation="SPF is an email authentication standard that lists the IP addresses authorized to send emails for a domain."
      />
    </Section>
  );
}

/* --- 9. PERSONAL INCIDENT RESPONSE SIMULATOR --- */
function PersonalIncidentResponse() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      title: "Identification",
      content: "You suspect entering credentials on an unverified site, sharing a verification pin, or downloading a suspicious file.",
      action: "Flag Suspicious Activity",
      cmd: "Scan Account Status",
      consoleCmds: [
        "Scanning account status...",
        "Warning: Suspicious credentials used on: verify-netflix-portal.com",
        "Alert: Potential token hijack detected. Password reset recommended."
      ]
    },
    {
      title: "Containment",
      content: "Restrict access paths to isolate the compromise area.",
      action: "Revoke User Sessions",
      cmd: "Revoke Active Sessions",
      consoleCmds: [
        "Revoking active user sessions...",
        "Initiating password reset...",
        "Success. Terminated active user sessions.",
        "Enforced Multi-Factor Authentication requirement."
      ]
    },
    {
      title: "Eradication",
      content: "Search for and remove any malware or hidden access channels.",
      action: "Scan for Malware",
      cmd: "Scan and Eradicate Malware",
      consoleCmds: [
        "Scanning local directory for malware...",
        "Analyzing script files...",
        "Flagged suspicious file: patch-utility.vbs ... DELETED",
        "No further malicious scripts found."
      ]
    },
    {
      title: "Recovery",
      content: "Safely restore normal accounts and audit the environment.",
      action: "Update Recovery Info",
      cmd: "Restore Backup State",
      consoleCmds: [
        "Restoring database state...",
        "Verified secondary recovery address update: OK",
        "Profile rebuild complete. Security verification check: Passed."
      ]
    },
    {
      title: "Reporting",
      content: "File formal reports to block transactions and warn authorities.",
      action: "Generate Security Report",
      cmd: "Generate Incident Report",
      consoleCmds: [
        "Filing report draft...",
        "Exporting security logs... Done.",
        "Notifying bank API endpoints... Connected."
      ]
    },
    {
      title: "Monitoring",
      content: "Watch for delayed attacks or data misuse.",
      action: "Enable Active Monitoring",
      cmd: "Activate Active Monitoring",
      consoleCmds: [
        "Activating passive tracking...",
        "Deploying login monitors... Active",
        "Monitoring for suspicious login attempts... Active"
      ]
    }
  ];

  useEffect(() => {
    if (started) {
      const currentCmds = steps[step].consoleCmds;
      const formatted = currentCmds.map(cmd => `[${new Date().toLocaleTimeString()}] ${cmd}`);
      setTerminalLogs(prev => [...prev, ...formatted]);
    }
  }, [step, started]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  const handleStart = () => {
    setStarted(true);
    setStep(0);
    const initialCmds = steps[0].consoleCmds.map(cmd => `[${new Date().toLocaleTimeString()}] ${cmd}`);
    setTerminalLogs([
      `[${new Date().toLocaleTimeString()}] Incident Simulator: Active`,
      `[${new Date().toLocaleTimeString()}] Monitoring simulator state...`,
      ...initialCmds
    ]);
  };

  const handleExecuteCommand = () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    }
  };

  return (
    <Section title="Personal Incident Response" icon={Terminal}>
      <p className="text-gray-300 leading-relaxed font-sans text-sm md:text-base">
        If credentials or session tokens are exposed, immediate action is critical. 
        Follow this structured security playbook to contain breaches and restore account safety.
      </p>

      <div className="bg-black/30 border border-white/5 rounded-2xl p-6 mt-6 backdrop-blur-xl shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
        
        {!started ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-12 h-12 rounded-xl border border-red-500/30 bg-red-500/10 flex items-center justify-center mx-auto text-red-400 animate-pulse">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs md:text-sm font-mono font-bold text-white uppercase tracking-wider">Incident Response Simulator</h4>
              <p className="text-[10px] md:text-xs text-gray-500 font-sans max-w-sm mx-auto">
                Simulate response steps to isolate compromise vectors and secure accounts.
              </p>
            </div>
            <button
              onClick={handleStart}
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl transition duration-300 cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.2)] font-mono text-xs tracking-wider uppercase inline-flex items-center gap-2"
            >
              <Terminal size={14} />
              🚨 Start Simulator
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6">
            
            {/* PLAYBOOK FLOW WIZARD */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {steps.map((s, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 min-w-[65px] text-center py-1.5 rounded-lg border text-[9px] font-mono tracking-wider transition-all duration-300
                    ${
                      idx === step
                        ? "bg-green-500 text-black border-green-500 font-bold"
                        : idx < step
                        ? "bg-green-500/5 border-green-500/20 text-green-400"
                        : "bg-white/[0.01] border-white/5 text-gray-500"
                    }`}
                  >
                    {s.title}
                  </div>
                ))}
              </div>

              {/* CARD DETAILS */}
              <div className="bg-black/45 border border-white/5 rounded-xl p-5 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-white/5 px-2.5 py-1 text-[8px] text-gray-500 font-mono tracking-widest uppercase rounded-bl-lg">
                  Stage 0{step + 1}
                </div>
                
                <div>
                  <span className="text-[10px] font-mono text-green-400 font-bold tracking-widest block uppercase">
                    Playbook: {steps[step].title} Phase
                  </span>
                  <h4 className="text-xs md:text-sm font-bold text-white font-mono mt-1">{steps[step].title} Phase</h4>
                  <p className="text-[11px] md:text-xs text-gray-400 mt-2 font-sans leading-relaxed">{steps[step].content}</p>
                </div>

                {/* RUN SIMULATED COMMAND ACTION BUTTON */}
                <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                  <span className="text-[9px] text-green-400 font-bold block mb-1 font-mono">// Simulator Control</span>
                  <button
                    onClick={handleExecuteCommand}
                    disabled={step === steps.length - 1}
                    className="w-full mt-1 px-4 py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-mono font-bold text-[10px] md:text-xs uppercase tracking-wider transition disabled:opacity-20 disabled:pointer-events-none flex items-center justify-between cursor-pointer shadow-[0_0_10px_rgba(34,197,94,0.15)]"
                  >
                    <span>Execute: {steps[step].cmd}</span>
                    <Terminal size={14} />
                  </button>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    disabled={step === 0}
                    onClick={() => setStep((p) => p - 1)}
                    className="px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10 text-[9px] font-mono hover:bg-white/[0.01] disabled:opacity-30 transition cursor-pointer text-gray-400"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() => setStarted(false)}
                    className="px-3 py-1.5 rounded-lg border border-red-500/20 hover:border-red-500/40 text-[9px] font-mono hover:bg-red-500/5 transition cursor-pointer text-red-400"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE CONSOLE LOGS TERMINAL */}
            <div className="lg:col-span-2 flex flex-col h-[280px] bg-black/85 border border-white/5 rounded-xl p-4 font-mono text-[9px] text-green-400 relative shadow-2xl overflow-hidden select-text">
              {/* Scanlines Effect Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-40 animate-pulse" />
              
              <div className="absolute top-0 left-0 right-0 bg-white/5 px-3 py-1.5 flex items-center justify-between border-b border-white/5 select-none relative z-10">
                <span className="text-gray-400 flex items-center gap-1.5 text-[8px]">
                  <Terminal size={10} className="text-green-400" />
                  Incident Log
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>

              <div className="flex-1 overflow-y-auto pt-6 space-y-1.5 custom-scrollbar pr-1 relative z-10">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="leading-normal flex items-start gap-1">
                    <span className="text-green-500/50 select-none">&gt;</span>
                    <span className="whitespace-pre-wrap">{log}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>

          </div>
        )}
      </div>
    </Section>
  );
}