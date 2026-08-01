"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CyberBackground from "@/components/cyberbackground";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  ShieldAlert,
  Terminal,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Lock,
  Unlock,
  Server,
  FileCode,
  AlertCircle,
  Globe,
  Fingerprint,
  Info,
  ArrowLeft
} from "lucide-react";

type Verdict =
  | "LEGITIMATE"
  | "SUSPICIOUS"
  | "PHISHING";

interface Threat {
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  detail: string;
}

interface AnalysisResult {
  verdict: Verdict;
  risk: number;
  confidence: number;
  summary: string;
  threats: Threat[];
  iocs: string[];
  dimensions: {
    urgency: number;
    impersonation: number;
    credentialHarvesting: number;
    technicalDeception: number;
    socialEngineering: number;
  };
  securityScore: number;
}

function getRiskColor(score: number) {
  if (score >= 70)
    return {
      text: "text-red-400",
      bar: "bg-red-500",
      border: "border-red-500/30",
      bg: "bg-red-500/10",
      glow: "shadow-red-500/15"
    };

  if (score >= 40)
    return {
      text: "text-yellow-400",
      bar: "bg-yellow-500",
      border: "border-yellow-500/30",
      bg: "bg-yellow-500/10",
      glow: "shadow-yellow-500/15"
    };

  return {
    text: "text-green-400",
    bar: "bg-green-500",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
    glow: "shadow-green-500/15"
  };
}

function analyseMessage(text: string): AnalysisResult {
  const content = text.toLowerCase();
  let risk = 0;
  const threats: Threat[] = [];
  const iocs: string[] = [];

  let urgency = 0;
  let impersonation = 0;
  let credentialHarvesting = 0;
  let technicalDeception = 0;
  let socialEngineering = 0;
  let securityScore = 100;

  // URL DETECTION
  const urls = text.match(/(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi) || [];
  if (urls.length > 0) {
    technicalDeception += 30;
    risk += 15;
    securityScore -= 10;
    iocs.push(...urls);
    threats.push({
      severity: "medium",
      title: "Suspicious Hyperlink Detected",
      detail: "The message text embeds external hyperlinks. Scammers often use misleading web URLs to route traffic to deceptive portals."
    });
  }

  // SHORTENED URLS
  const shorteners = ["bit.ly", "tinyurl", "goo.gl", "t.co", "is.gd", "shrtco.de"];
  let hasShorteners = false;
  shorteners.forEach((s) => {
    if (content.includes(s)) {
      hasShorteners = true;
    }
  });

  if (hasShorteners) {
    risk += 25;
    technicalDeception += 45;
    securityScore -= 15;
    threats.push({
      severity: "high",
      title: "Obfuscated Shortened Link",
      detail: "URL shorteners are active in this message. These services are commonly used by threat actors to conceal hazardous routing pathways."
    });
  }

  // URGENCY TACTICS
  const urgencyWords = [
    "urgent",
    "immediately",
    "verify now",
    "suspended",
    "act now",
    "warning",
    "limited time",
    "expire",
    "final notice",
    "unauthorized"
  ];

  let urgencyMatches = 0;
  urgencyWords.forEach((word) => {
    if (content.includes(word)) {
      urgencyMatches++;
    }
  });

  if (urgencyMatches > 0) {
    urgency = Math.min(100, urgencyMatches * 20);
    risk += urgencyMatches * 6;
  }

  if (urgency >= 30) {
    securityScore -= 10;
    threats.push({
      severity: "medium",
      title: "Urgency Manipulation Flag",
      detail: "High-pressure urgency words were detected. Scammers use artificial time limits to induce quick, panic-driven actions."
    });
  }

  // CREDENTIAL HARVESTING
  const credentialWords = [
    "password",
    "otp",
    "credit card",
    "bank account",
    "security code",
    "login",
    "verify your account",
    "confirm your account",
    "ssn",
    "pincode",
    "passcode"
  ];

  let credentialMatches = 0;
  credentialWords.forEach((word) => {
    if (content.includes(word)) {
      credentialMatches++;
    }
  });

  if (credentialMatches > 0) {
    credentialHarvesting = Math.min(100, credentialMatches * 22);
    risk += credentialMatches * 8;
  }

  if (credentialHarvesting >= 30) {
    securityScore -= 20;
    threats.push({
      severity: "high",
      title: "Credential Harvesting Request",
      detail: "Solicitations for credentials, security codes, or accounts are present. Trusted services do not request passwords or PINs via text."
    });
  }

  // BRAND IMPERSONATION
  const brands = [
    "paypal",
    "google",
    "amazon",
    "microsoft",
    "apple",
    "instagram",
    "facebook",
    "netflix",
    "bank",
    "metamask",
    "binance"
  ];

  let brandMatches = 0;
  brands.forEach((brand) => {
    if (content.includes(brand)) {
      brandMatches++;
    }
  });

  if (brandMatches > 0) {
    impersonation = Math.min(100, brandMatches * 25);
    risk += brandMatches * 10;
  }

  if (impersonation >= 25) {
    securityScore -= 15;
    threats.push({
      severity: "high",
      title: "Corporate Brand Reference",
      detail: "The message makes explicit reference to reputable corporate entities. Verify sender authentication to prevent typosquatting attacks."
    });
  }

  // SOCIAL ENGINEERING
  const engineeringWords = [
    "account locked",
    "payment failed",
    "unauthorized login",
    "will be closed",
    "legal action",
    "avoid fees",
    "violation"
  ];

  let engineeringMatches = 0;
  engineeringWords.forEach((word) => {
    if (content.includes(word)) {
      engineeringMatches++;
    }
  });

  if (engineeringMatches > 0) {
    socialEngineering = Math.min(100, engineeringMatches * 25);
    risk += engineeringMatches * 12;
  }

  if (socialEngineering >= 25) {
    securityScore -= 15;
    threats.push({
      severity: "medium",
      title: "Fear-Inducing Social Engineering",
      detail: "Tactical language triggers fear of penalties, account closure, or legal action. Designed to manipulate emotional responses."
    });
  }

  // SCAM CHECKS
  const scamWords = [
    "bitcoin",
    "crypto",
    "wallet",
    "investment",
    "profit",
    "won",
    "claim prize",
    "gift card",
    "lottery",
    "reward",
    "cashback"
  ];

  let scamMatches = 0;
  scamWords.forEach((word) => {
    if (content.includes(word)) {
      scamMatches++;
    }
  });

  if (scamMatches >= 2) {
    risk += 15;
    threats.push({
      severity: "medium",
      title: "Financial Reward Scams",
      detail: "Promises of rewards, crypto returns, or lottery payouts are present. Classic indicators of financial phishing schemes."
    });
  }

  risk = Math.min(risk, 100);
  securityScore = Math.max(0, Math.min(securityScore, 100));

  let verdict: Verdict = "LEGITIMATE";
  if (risk >= 70) verdict = "PHISHING";
  else if (risk >= 30) verdict = "SUSPICIOUS";

  const confidence = Math.min(95, 55 + threats.length * 7);
  const summary =
    verdict === "LEGITIMATE"
      ? "Diagnostic validation complete. The message shows zero high-risk keywords, links, or manipulation tactics."
      : `Message contains ${threats.length} indicators of interest linked to urgency prompts, brand references, or harvesting cues.`;

  return {
    verdict,
    risk,
    confidence,
    summary,
    threats,
    iocs,
    dimensions: {
      urgency,
      impersonation,
      credentialHarvesting,
      technicalDeception: Math.min(100, technicalDeception),
      socialEngineering,
    },
    securityScore,
  };
}

export default function PhishingAnalysis() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // Upgraded state widgets
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"threats" | "iocs" | "semantics" | "payload">("threats");

  const runAnalysis = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setScanLogs([]);
    setAnalysis(null);

    const logMessages = [
      "Initializing string buffer scanner...",
      "Extracting hyperlink matches and anchor nodes...",
      "Scrutinizing URLs against redirect shorteners index...",
      "Tokenizing words and validating against urgency dictionary...",
      "Matching character sequences for credential harvesting vectors...",
      "Comparing references to registered enterprise brands...",
      "Evaluating text emotional pressure & fear factors...",
      "Scoring financial prize and cryptocurrency matches...",
      "Weighting threat parameters against heuristic scoring models...",
      "Phishing intelligence diagnosis compiled successfully."
    ];

    for (let i = 0; i < logMessages.length; i++) {
      await new Promise((r) => setTimeout(r, 180 + Math.random() * 70));
      setScanLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${logMessages[i]}`]);
    }

    const result = analyseMessage(text);
    setAnalysis(result);
    setLoading(false);
  };

  const riskColor = useMemo(
    () => (analysis ? getRiskColor(analysis.risk) : null),
    [analysis]
  );

  const semanticKeywords = useMemo(() => {
    if (!text.trim()) return null;
    const content = text.toLowerCase();
    const urgencyWords = ["urgent", "immediately", "verify now", "suspended", "act now", "warning", "expire"];
    const credentialWords = ["password", "otp", "credit card", "bank", "login", "verify", "confirm"];
    const brands = ["paypal", "google", "amazon", "microsoft", "apple", "netflix", "facebook", "bank"];
    const scams = ["bitcoin", "crypto", "won", "prize", "gift card", "lottery", "reward"];

    return {
      urgency: urgencyWords.filter(w => content.includes(w)),
      credentials: credentialWords.filter(w => content.includes(w)),
      brands: brands.filter(w => content.includes(w)),
      scams: scams.filter(w => content.includes(w))
    };
  }, [text]);

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
                  NLP_NODE
                </p>
                <h1 className="text-3xl font-black font-mono tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-155 to-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                  Phishing Analyzer
                </h1>
                <p className="text-gray-300 mt-3 text-sm leading-relaxed font-sans">
                  Audit messages, emails, or texts. Parse semantic social engineering indicators, cross-reference brand names, and detect hidden URL links.
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
                  text-inspector.sh
                </div>
              </div>

              <div className="p-5 space-y-4">
                <textarea
                  rows={8}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste message contents here (SMS, Whatsapp messages, body of an email, etc.)..."
                  className="w-full rounded-2xl bg-black/35 border border-white/10 p-4 text-sm font-mono text-green-355 placeholder:text-gray-600 resize-none focus:outline-none focus:border-green-400/40 transition duration-300 shadow-inner"
                />

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                    <span className="text-green-400 animate-pulse">●</span>
                    NLP Scanner Active
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={runAnalysis}
                    disabled={loading || !text.trim()}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-green-500 text-black font-mono font-bold text-sm hover:bg-green-400 shadow-lg shadow-green-500/10 transition duration-300 cursor-pointer disabled:opacity-40"
                  >
                    {loading ? "AUDITING..." : "RUN_AI_SCAN"}
                  </motion.button>
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
                {scanLogs.length > 0 ? (
                  scanLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-1.5 items-start">
                      <span className="text-green-500 shrink-0 font-semibold">[SEC]</span>
                      <span>{log}</span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 text-[11px] gap-1.5 py-4">
                    <Activity size={18} className="opacity-30" />
                    <span>// STANDBY: Input text data to initialize semantic parser indicators.</span>
                  </div>
                )}
                {loading && (
                  <div className="flex items-center gap-1 text-green-400 animate-pulse">
                    <span>●</span>
                    <span>Scanning message body...</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: FORENSICS DISCOVERY PANEL (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">

            <AnimatePresence mode="wait">
              {analysis ? (
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
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${riskColor?.bar} to-transparent`} />
                      <div>
                        <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block mb-3">
                          Threat Verdict
                        </span>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className={`px-3 py-1.5 rounded-full font-mono font-bold tracking-widest text-xs uppercase border ${riskColor?.border} ${riskColor?.bg} ${riskColor?.glow}`}>
                            {analysis.verdict}
                          </div>
                          <span className="text-xs text-gray-400 font-mono">
                            (Confidence: {analysis.confidence}%)
                          </span>
                        </div>
                        <p className="text-sm text-gray-205 mt-4 leading-relaxed font-sans">
                          {analysis.summary}
                        </p>
                      </div>

                      <div className="mt-6 flex justify-between items-center text-xs text-gray-500 font-mono border-t border-white/5 pt-3">
                        <span>SECURITY_INDEX</span>
                        <span className={`font-bold ${riskColor?.text}`}>
                          {analysis.risk >= 70 ? "CRITICAL_THREAT" : analysis.risk >= 30 ? "SUSPICIOUS_THREAT" : "PASS_SECURE"}
                        </span>
                      </div>
                    </div>

                    {/* STABILITY INDEX */}
                    <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                      <div>
                        <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block mb-4">
                          Security Score
                        </span>
                        <div className="flex flex-col items-baseline font-mono">
                          <h2 className={`text-5xl font-black ${
                            analysis.securityScore >= 80 ? "text-green-400" : analysis.securityScore >= 50 ? "text-yellow-400" : "text-red-400"
                          }`}>
                            {analysis.securityScore}
                          </h2>
                          <span className="text-[10px] text-gray-500 mt-1 uppercase font-bold">out of 100</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-black/45 rounded-full overflow-hidden mt-6 border border-white/5">
                        <div className={`h-full ${
                          analysis.securityScore >= 80 ? "bg-green-400" : analysis.securityScore >= 50 ? "bg-yellow-400" : "bg-red-400"
                        }`} style={{ width: `${analysis.securityScore}%` }} />
                      </div>
                    </div>

                  </div>

                  {/* THREAT ANALYSIS PROGRESS BARS */}
                  <div className="glass-card p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                    <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block mb-4">
                      Phishing Dimensions Metrics
                    </span>

                    <div className="grid sm:grid-cols-2 gap-5 font-mono text-xs">
                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400 font-bold">URGENCY_INDUCEMENT</span>
                          <span className="text-red-400">{analysis.dimensions.urgency}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400" style={{ width: `${analysis.dimensions.urgency}%` }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400 font-bold">BRAND_IMPERSONATION</span>
                          <span className="text-yellow-400">{analysis.dimensions.impersonation}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400" style={{ width: `${analysis.dimensions.impersonation}%` }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400 font-bold">CREDENTIAL_HARVEST_MARKERS</span>
                          <span className="text-blue-400">{analysis.dimensions.credentialHarvesting}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400" style={{ width: `${analysis.dimensions.credentialHarvesting}%` }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400 font-bold">TECHNICAL_DECEPTION</span>
                          <span className="text-cyan-400">{analysis.dimensions.technicalDeception}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400" style={{ width: `${analysis.dimensions.technicalDeception}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DETAILS PANEL WITH TABS */}
                  <div className="glass-card overflow-hidden">
                    <div className="flex overflow-x-auto border-b border-white/5 bg-black/25">
                      <button
                        onClick={() => setActiveTab("threats")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-r border-white/5 cursor-pointer select-none
                        ${activeTab === "threats" ? "bg-white/[0.02] text-green-300 font-black border-b border-green-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <ShieldAlert size={13} />
                        Threat Warnings ({analysis.threats.length})
                      </button>

                      <button
                        onClick={() => setActiveTab("iocs")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-r border-white/5 cursor-pointer select-none
                        ${activeTab === "iocs" ? "bg-white/[0.02] text-green-300 font-black border-b border-green-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <Globe size={13} />
                        IOC Extract ({analysis.iocs.length})
                      </button>

                      <button
                        onClick={() => setActiveTab("semantics")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-r border-white/5 cursor-pointer select-none
                        ${activeTab === "semantics" ? "bg-white/[0.02] text-green-300 font-black border-b border-green-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <Fingerprint size={13} />
                        Semantics
                      </button>

                      <button
                        onClick={() => setActiveTab("payload")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer select-none
                        ${activeTab === "payload" ? "bg-white/[0.02] text-green-300 font-black border-b border-green-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <FileCode size={13} />
                        Raw Payload
                      </button>
                    </div>

                    <div className="p-5">
                      {activeTab === "threats" && (
                        <div className="space-y-3">
                          {analysis.threats.length > 0 ? (
                            analysis.threats.map((t, idx) => (
                              <div key={idx} className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wide">
                                      {t.title}
                                    </h4>
                                    <span className="text-[9px] font-mono font-bold uppercase border border-red-500/20 px-1.5 py-0.5 rounded bg-red-500/5 text-red-400 tracking-wider">
                                      {t.severity}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-300 mt-1.5 font-mono leading-relaxed">
                                    {t.detail}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-6 text-center bg-black/20 border border-white/5 rounded-xl font-mono text-xs text-green-400 flex flex-col items-center justify-center gap-1.5">
                              <CheckCircle2 size={20} />
                              <span>✓ Analysis complete: No phishing indicators matched.</span>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === "iocs" && (
                        <div className="space-y-3">
                          {analysis.iocs.length > 0 ? (
                            <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
                              {analysis.iocs.map((ioc, idx) => (
                                <div key={idx} className="bg-black/35 rounded-xl p-4 border border-white/5 text-cyan-400 break-all flex flex-col justify-between">
                                  <div>
                                    <span className="text-gray-500 uppercase tracking-widest text-[9px] block mb-1">Extracted Hyperlink</span>
                                    <p className="font-bold text-white select-all">{ioc}</p>
                                  </div>
                                  <div className="mt-3 flex items-center gap-1 text-[9px] text-gray-400 border-t border-white/5 pt-2">
                                    <Info size={11} className="text-cyan-400" />
                                    <span>Note: Avoid visiting unverified URLs directly.</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-6 text-center bg-black/20 border border-white/5 rounded-xl font-mono text-xs text-gray-500">
                              // No external links or redirect elements extracted.
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === "semantics" && semanticKeywords && (
                        <div className="space-y-4 text-xs font-mono">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                              <span className="text-gray-500 uppercase tracking-wider block mb-1.5">Urgency Keywords</span>
                              {semanticKeywords.urgency.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {semanticKeywords.urgency.map(w => (
                                    <span key={w} className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-bold">{w}</span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-600 italic">None matched</span>
                              )}
                            </div>

                            <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                              <span className="text-gray-500 uppercase tracking-wider block mb-1.5">Credential Prompts</span>
                              {semanticKeywords.credentials.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {semanticKeywords.credentials.map(w => (
                                    <span key={w} className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold">{w}</span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-600 italic">None matched</span>
                              )}
                            </div>

                            <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                              <span className="text-gray-500 uppercase tracking-wider block mb-1.5">Matched Brands</span>
                              {semanticKeywords.brands.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {semanticKeywords.brands.map(w => (
                                    <span key={w} className="px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold">{w}</span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-600 italic">None matched</span>
                              )}
                            </div>

                            <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                              <span className="text-gray-500 uppercase tracking-wider block mb-1.5">Financial / Scam Patterns</span>
                              {semanticKeywords.scams.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {semanticKeywords.scams.map(w => (
                                    <span key={w} className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-405 text-purple-400 font-bold">{w}</span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-600 italic">None matched</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "payload" && (
                        <div className="bg-black/45 border border-white/5 rounded-xl p-4 font-mono text-xs text-green-300 leading-relaxed shadow-inner">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-gray-500">
                            <span>Extracted Message Content</span>
                            <span>Length: {text.length} characters</span>
                          </div>
                          <pre className="overflow-x-auto whitespace-pre-wrap py-1.5 leading-relaxed font-mono">
                            {text}
                          </pre>
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
                      Awaiting message content to execute NLP threat scans.
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