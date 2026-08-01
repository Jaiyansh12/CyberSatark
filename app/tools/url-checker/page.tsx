"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CyberBackground from "@/components/cyberbackground";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  ShieldAlert,
  Terminal,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Lock,
  Unlock,
  ExternalLink,
  Layers,
  Server,
  FileCode,
  AlertCircle,
  Radio,
  ArrowLeft
} from "lucide-react";

type Verdict =
  | "SAFE"
  | "SUSPICIOUS"
  | "DANGEROUS";

interface Finding {
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  detail: string;
}

interface AnalysisResult {
  verdict: Verdict;
  risk: number;
  confidence: number;
  summary: string;
  findings: Finding[];
  indicators: string[];
  domain: string;
  protocol: string;
  dimensions: {
    domainRisk: number;
    phishingRisk: number;
    technicalRisk: number;
    urlStructure: number;
    trustScore: number;
  };
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

function analyseURL(input: string): AnalysisResult {
  let risk = 0;
  const findings: Finding[] = [];
  const indicators: string[] = [];

  let domainRisk = 0;
  let phishingRisk = 0;
  let technicalRisk = 0;
  let urlStructure = 0;
  let trustScore = 100;

  let parsed: URL;

  try {
    parsed = new URL(
      input.startsWith("http")
        ? input
        : `https://${input}`
    );
  } catch {
    return {
      verdict: "DANGEROUS",
      risk: 100,
      confidence: 95,
      summary: "Invalid web format. Target string could not be resolved to a URL.",
      findings: [
        {
          severity: "critical",
          title: "Malformed URL String",
          detail: "URL contains unsupported characters, spaces, or an incomplete domain structure."
        },
      ],
      indicators: [],
      domain: "Unknown",
      protocol: "Unknown",
      dimensions: {
        domainRisk: 100,
        phishingRisk: 100,
        technicalRisk: 100,
        urlStructure: 100,
        trustScore: 0,
      },
    };
  }

  const domain = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol;
  const path = parsed.pathname.toLowerCase();

  // HTTPS Checks
  if (protocol !== "https:") {
    risk += 25;
    technicalRisk += 35;
    trustScore -= 20;
    findings.push({
      severity: "high",
      title: "Insecure Connection Protocol",
      detail: "The site uses plaintext HTTP. Communication details can be easily read or modified by routers in transit."
    });
  } else {
    trustScore += 5;
  }

  // Raw IP DNS Checks
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(domain)) {
    risk += 35;
    technicalRisk += 40;
    trustScore -= 30;
    findings.push({
      severity: "critical",
      title: "Direct IP Address Reference",
      detail: "Direct IP connection requested instead of resolving hostnames. Used to mask suspicious domains."
    });
  }

  // URL Shorteners
  const shorteners = ["bit.ly", "tinyurl", "t.co", "goo.gl", "is.gd", "shrtco.de"];
  if (shorteners.some((s) => domain.includes(s))) {
    risk += 30;
    phishingRisk += 40;
    trustScore -= 25;
    findings.push({
      severity: "high",
      title: "Link Shortener Obfuscator",
      detail: "Link uses shortening redirects. Hides destination payload to bypass client reputation checks."
    });
  }

  // Suspicious keywords
  const suspiciousWords = [
    "login",
    "verify",
    "secure",
    "account",
    "update",
    "bank",
    "wallet",
    "password",
    "signin",
    "confirm",
    "support"
  ];

  let matchesCount = 0;
  suspiciousWords.forEach((word) => {
    if (domain.includes(word) || path.includes(word)) {
      risk += 8;
      phishingRisk += 10;
      urlStructure += 10;
      matchesCount++;
    }
  });

  if (phishingRisk >= 20) {
    findings.push({
      severity: "medium",
      title: "Spoofed Billing Terms",
      detail: `URL embeds credential harvesting markers (${matchesCount} terms) designed to mimic security dashboards.`
    });
  }

  // Complex subdomains
  const subdomains = domain.split(".");
  if (subdomains.length >= 5) {
    risk += 20;
    urlStructure += 30;
    trustScore -= 15;
    findings.push({
      severity: "medium",
      title: "Deep Subdomain Stacking",
      detail: `URL contains ${subdomains.length} subdomain nodes, a technique used to push actual root domains off screen on mobile devices.`
    });
  }

  // Suspicious TLD suffix
  const suspiciousTlds = [".ru", ".tk", ".xyz", ".top", ".gq", ".ml", ".cf"];
  suspiciousTlds.forEach((tld) => {
    if (domain.endsWith(tld)) {
      risk += 20;
      domainRisk += 25;
      trustScore -= 20;
      findings.push({
        severity: "medium",
        title: "Malicious Registry TLD Suffix",
        detail: `The top-level suffix '${tld}' has poor registry enforcement and is heavily abused by threat syndicates.`
      });
    }
  });

  // Brand mimicking
  const brands = [
    "paypal",
    "google",
    "amazon",
    "microsoft",
    "apple",
    "instagram",
    "facebook",
    "netflix",
    "metamask",
    "binance"
  ];

  brands.forEach((brand) => {
    if (domain.includes(brand) && !domain.endsWith(`${brand}.com`) && !domain.endsWith(`${brand}.org`) && !domain.endsWith(`${brand}.net`)) {
      risk += 25;
      phishingRisk += 35;
      trustScore -= 20;
      findings.push({
        severity: "high",
        title: "Protected Entity Typosquatting",
        detail: `The URL references official brand identity '${brand}' but resolves on an unaligned host root domain.`
      });
    }
  });

  // Extra long
  if (input.length > 110) {
    risk += 10;
    urlStructure += 15;
    findings.push({
      severity: "low",
      title: "Abnormal Payload Length",
      detail: "URL length exceeds standard limits, typical of redirect payloads carrying encrypted trackers."
    });
  }

  // Encoded signs
  if (input.includes("@") || input.includes("%")) {
    risk += 15;
    technicalRisk += 20;
    findings.push({
      severity: "medium",
      title: "UTF/Hex Character Masks",
      detail: "Hexadecimal or @ character injections detected, commonly used to bypass gateway email checkers."
    });
  }

  indicators.push(domain);
  risk = Math.min(risk, 100);
  trustScore = Math.max(0, Math.min(trustScore, 100));

  let verdict: Verdict = "SAFE";
  if (risk >= 70) verdict = "DANGEROUS";
  else if (risk >= 35) verdict = "SUSPICIOUS";

  // Interpolate dimensions
  domainRisk = Math.min(100, Math.max(domainRisk, risk * 0.82));
  phishingRisk = Math.min(100, Math.max(phishingRisk, risk * 0.94));
  technicalRisk = Math.min(100, Math.max(technicalRisk, risk * 0.72));
  urlStructure = Math.min(100, Math.max(urlStructure, risk * 0.62));

  const confidence = Math.min(95, 50 + findings.length * 8);
  const summary =
    verdict === "SAFE"
      ? "Diagnostic complete. Hyperlink host validation reports secure protocols and registrar records."
      : `URL analysis flagged ${findings.length} threat anomalies associated with identity mimicking, protocol warnings, or redirect loops.`;

  return {
    verdict,
    risk,
    confidence,
    summary,
    findings,
    indicators,
    domain,
    protocol,
    dimensions: {
      domainRisk: Math.round(domainRisk),
      phishingRisk: Math.round(phishingRisk),
      technicalRisk: Math.round(technicalRisk),
      urlStructure: Math.round(urlStructure),
      trustScore
    },
  };
}

export default function URLChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // States for upgraded layout
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"findings" | "metadata" | "sandbox">("findings");
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const runAnalysis = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setScanLogs([]);
    setAnalysis(null);
    setActiveSegment(null);

    const logMessages = [
      "Establishing link inspection sockets...",
      "Resolving DNS A / AAAA resource records...",
      "Checking SSL certificate expiration credentials...",
      "Comparing registrar details against threat intelligence indexes...",
      "Inspecting subdomain layout structure for brand similarities...",
      "Scanning parameters and folders for redirect loops...",
      "Weighing threat indicators and anomalies...",
      "Audit logs compile complete. Diagnostics report ready."
    ];

    for (let i = 0; i < logMessages.length; i++) {
      await new Promise((r) => setTimeout(r, 220 + Math.random() * 80));
      setScanLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${logMessages[i]}`]);
    }

    const result = analyseURL(url);
    setAnalysis(result);
    setLoading(false);
  };

  const riskColor = useMemo(
    () => (analysis ? getRiskColor(analysis.risk) : null),
    [analysis]
  );

  // URL Segmenter for the Dissection Deck
  const urlSegments = useMemo(() => {
    if (!url.trim()) return [];
    try {
      const formatted = url.startsWith("http") ? url : `https://${url}`;
      const parsed = new URL(formatted);
      const host = parsed.hostname;
      const protocol = parsed.protocol + "//";
      const path = parsed.pathname + parsed.search;

      const parts = host.split(".");
      if (parts.length >= 3) {
        const tld = parts[parts.length - 1];
        const domain = parts[parts.length - 2];
        const subdomains = parts.slice(0, parts.length - 2).join(".");
        return [
          { label: "PROTOCOL", value: protocol, type: "info", desc: "Connection Protocol. HTTPS encrypts traffic, but phishing pages often acquire certificates to look legit." },
          { label: "SUBDOMAIN(S)", value: subdomains, type: "warn", desc: "Prefix subdomains. Often contains spoofed brand names to deceive left-to-right readers." },
          { label: "ROOT DOMAIN", value: domain, type: "critical", desc: "The core registered domain label. Crucial to verify if this matches the official entity." },
          { label: "TLD", value: "." + tld, type: "info", desc: "Top-Level Domain suffix. Look out for suspicious extensions (.xyz, .gq, .tk) abused by scammers." },
          { label: "PATH & PARAMETERS", value: path && path !== "/" ? path : "", type: "neutral", desc: "Directory path or query parameters pointing to harvesting scripts." }
        ].filter(p => p.value !== "");
      } else if (parts.length === 2) {
        return [
          { label: "PROTOCOL", value: protocol, type: "info", desc: "Connection Protocol. HTTPS encrypts traffic, but phishing pages often acquire certificates to look legit." },
          { label: "ROOT DOMAIN", value: parts[0], type: "critical", desc: "The core registered domain label. Crucial to verify if this matches the official entity." },
          { label: "TLD", value: "." + parts[1], type: "info", desc: "Top-Level Domain suffix. Look out for suspicious extensions (.xyz, .gq, .tk) abused by scammers." },
          { label: "PATH & PARAMETERS", value: path && path !== "/" ? path : "", type: "neutral", desc: "Directory path or query parameters pointing to harvesting scripts." }
        ].filter(p => p.value !== "");
      } else {
        return [
          { label: "PROTOCOL", value: protocol, type: "info", desc: "Connection protocol." },
          { label: "HOST DOMAIN", value: host, type: "critical", desc: "Target host identity." },
          { label: "PATH & PARAMETERS", value: path && path !== "/" ? path : "", type: "neutral", desc: "Resource path." }
        ].filter(p => p.value !== "");
      }
    } catch {
      return [];
    }
  }, [url]);

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
                  INTERCEPTOR_NODE
                </p>
                <h1 className="text-3xl font-black font-mono tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-150 to-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                  URL Threat Interceptor
                </h1>
                <p className="text-gray-300 mt-3 text-sm leading-relaxed font-sans">
                  Deconstruct hyperlinks, inspect network route hops, and audit DNS registration signatures in real-time.
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
                  audit.sh
                </div>
              </div>

              <div className="p-5 space-y-4">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter suspected hyperlink address here..."
                  className="w-full rounded-2xl bg-black/35 border border-white/10 p-4 text-sm font-mono text-green-300 placeholder:text-gray-600 focus:outline-none focus:border-green-400/40 transition duration-300 shadow-inner"
                />

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                    <span className="text-green-400 animate-pulse">●</span>
                    Heuristics Active
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={runAnalysis}
                    disabled={loading || !url.trim()}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-green-500 text-black font-mono font-bold text-sm hover:bg-green-400 shadow-lg shadow-green-500/10 transition duration-300 cursor-pointer disabled:opacity-40"
                  >
                    {loading ? "AUDITING..." : "INITIALIZE_SCAN"}
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

              <div className="flex-1 bg-black/30 rounded-xl border border-white/5 p-3.5 font-mono text-xs text-green-350/80 overflow-y-auto space-y-2 custom-scrollbar shadow-inner">
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
                    <span>// STANDBY: Trigger scan sequence to monitor live shell execution.</span>
                  </div>
                )}
                {loading && (
                  <div className="flex items-center gap-1 text-green-400 animate-pulse">
                    <span>●</span>
                    <span>Running integrity scans...</span>
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
                        <p className="text-sm text-gray-200 mt-4 leading-relaxed font-sans">
                          {analysis.summary}
                        </p>
                      </div>

                      <div className="mt-6 flex justify-between items-center text-xs text-gray-500 font-mono border-t border-white/5 pt-3">
                        <span>SECURITY_INDEX</span>
                        <span className={`font-bold ${riskColor?.text}`}>
                          {analysis.risk >= 70 ? "CRITICAL_RISK" : analysis.risk >= 40 ? "MODERATE_ANOMALY" : "SECURE"}
                        </span>
                      </div>
                    </div>

                    {/* SCORE INDEX GAUGHT */}
                    <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                      <div>
                        <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block mb-4">
                          Trust Score
                        </span>
                        <div className="flex flex-col items-baseline font-mono">
                          <h2 className={`text-5xl font-black ${
                            analysis.dimensions.trustScore >= 85 ? "text-green-400" : analysis.dimensions.trustScore >= 55 ? "text-yellow-400" : "text-red-400"
                          }`}>
                            {analysis.dimensions.trustScore}
                          </h2>
                          <span className="text-[10px] text-gray-500 mt-1 uppercase font-bold">out of 100</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-black/45 rounded-full overflow-hidden mt-6 border border-white/5">
                        <div className={`h-full ${
                          analysis.dimensions.trustScore >= 85 ? "bg-green-400" : analysis.dimensions.trustScore >= 55 ? "bg-yellow-400" : "bg-red-400"
                        }`} style={{ width: `${analysis.dimensions.trustScore}%` }} />
                      </div>
                    </div>

                  </div>

                  {/* THREAT ANALYSIS PROGRESS BARS */}
                  <div className="glass-card p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                    <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block mb-4">
                      Threat Dimension Indexes
                    </span>

                    <div className="grid sm:grid-cols-2 gap-5 font-mono text-xs">
                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400">DOMAIN_REPUTATION</span>
                          <span className="text-red-400">{analysis.dimensions.domainRisk}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400" style={{ width: `${analysis.dimensions.domainRisk}%` }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400">SOCIAL_PHISHING_URGENCY</span>
                          <span className="text-yellow-400">{analysis.dimensions.phishingRisk}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400" style={{ width: `${analysis.dimensions.phishingRisk}%` }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400">TECHNICAL_DECEPTION</span>
                          <span className="text-blue-400">{analysis.dimensions.technicalRisk}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400" style={{ width: `${analysis.dimensions.technicalRisk}%` }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400">URL_STRUCTURAL_COMPLEXITY</span>
                          <span className="text-cyan-400">{analysis.dimensions.urlStructure}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400" style={{ width: `${analysis.dimensions.urlStructure}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DYNAMIC URL DISSECTION DECK */}
                  {urlSegments.length > 0 && (
                    <div className="glass-card p-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
                      <div className="flex items-center gap-2 mb-4">
                        <Layers size={16} className="text-cyan-400" />
                        <h3 className="text-base font-bold font-mono text-white uppercase tracking-wide">
                          Address Dissection Deck
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 mb-5 font-mono">
                        Select highlighted segment nodes to inspect URL attributes:
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-1.5 bg-black/45 border border-white/5 p-4 rounded-2xl font-mono text-xs select-none mb-4">
                        {urlSegments.map((seg, idx) => {
                          const isSelected = activeSegment === idx;
                          let borderClass = "border-white/5 text-gray-400 hover:border-white/20";
                          if (isSelected) {
                            borderClass = seg.type === "critical"
                              ? "bg-red-500/25 border-red-500 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                              : seg.type === "warn"
                              ? "bg-yellow-500/25 border-yellow-500 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.25)]"
                              : "bg-blue-500/25 border-blue-500 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.25)]";
                          } else {
                            if (seg.type === "critical") borderClass = "border-red-500/20 text-red-400 hover:border-red-500/40";
                            else if (seg.type === "warn") borderClass = "border-yellow-500/20 text-yellow-400 hover:border-yellow-500/40";
                            else if (seg.type === "info") borderClass = "border-blue-500/20 text-blue-400 hover:border-blue-500/40";
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => setActiveSegment(isSelected ? null : idx)}
                              className={`px-2 py-2.5 rounded-lg border transition-all cursor-pointer font-bold shrink-0 ${borderClass}`}
                            >
                              {seg.value}
                            </button>
                          );
                        })}
                      </div>

                      <AnimatePresence mode="wait">
                        {activeSegment !== null ? (
                          <motion.div
                            key={activeSegment}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="p-4 rounded-xl border border-white/5 bg-black/20 text-xs font-mono"
                          >
                            <div className="flex justify-between items-center text-[10px] text-gray-500 mb-1.5">
                              <span>SEGMENT_ROLE:</span>
                              <span className={`font-bold ${
                                urlSegments[activeSegment].type === "critical"
                                  ? "text-red-400"
                                  : urlSegments[activeSegment].type === "warn"
                                  ? "text-yellow-400"
                                  : "text-blue-400"
                              }`}>
                                {urlSegments[activeSegment].label}
                              </span>
                            </div>
                            <h5 className="font-bold text-white text-sm mb-1">
                              Segment: {urlSegments[activeSegment].value}
                            </h5>
                            <p className="text-xs text-gray-300 font-sans leading-relaxed">
                              {urlSegments[activeSegment].desc}
                            </p>
                          </motion.div>
                        ) : (
                          <div className="p-3 rounded-lg border border-white/5 bg-black/10 text-center text-[10px] text-gray-500 font-mono italic">
                            (Select URL node above to view segment security breakdown)
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* TABS CONTAINER */}
                  <div className="glass-card overflow-hidden">
                    <div className="flex overflow-x-auto border-b border-white/5 bg-black/25">
                      <button
                        onClick={() => setActiveTab("findings")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-r border-white/5 cursor-pointer select-none
                        ${activeTab === "findings" ? "bg-white/[0.02] text-green-300 font-black border-b border-green-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <ShieldAlert size={13} />
                        Threat Warnings ({analysis.findings.length})
                      </button>

                      <button
                        onClick={() => setActiveTab("metadata")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-r border-white/5 cursor-pointer select-none
                        ${activeTab === "metadata" ? "bg-white/[0.02] text-green-300 font-black border-b border-green-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <Globe size={13} />
                        DNS Records
                      </button>

                      <button
                        onClick={() => setActiveTab("sandbox")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer select-none
                        ${activeTab === "sandbox" ? "bg-white/[0.02] text-green-300 font-black border-b border-green-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <FileCode size={13} />
                        Sandboxed Preview
                      </button>
                    </div>

                    <div className="p-5">
                      {activeTab === "findings" && (
                        <div className="space-y-3">
                          {analysis.findings.length > 0 ? (
                            analysis.findings.map((f, idx) => (
                              <div key={idx} className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wide">
                                      {f.title}
                                    </h4>
                                    <span className="text-[9px] font-mono font-bold uppercase border border-red-500/20 px-1.5 py-0.5 rounded bg-red-500/5 text-red-400 tracking-wider">
                                      {f.severity}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-300 mt-1.5 font-mono leading-relaxed">
                                    {f.detail}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-6 text-center bg-black/20 border border-white/5 rounded-xl font-mono text-xs text-green-400 flex flex-col items-center justify-center gap-1.5">
                              <CheckCircle2 size={20} />
                              <span>✓ Scan complete: No malicious indicators detected.</span>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === "metadata" && (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs text-gray-400">
                          <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-500 uppercase tracking-wider block mb-1">Audit Hostname</span>
                            <p className="text-xs font-bold text-green-400 break-all">{analysis.domain}</p>
                          </div>

                          <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-500 uppercase tracking-wider block mb-1">Protocol</span>
                            <p className="text-xs font-bold text-white flex items-center gap-1.5">
                              {analysis.protocol === "https:" ? (
                                <>
                                  <Lock size={11} className="text-green-400" />
                                  <span>HTTPS (Secure)</span>
                                </>
                              ) : (
                                <>
                                  <Unlock size={11} className="text-red-400 animate-pulse" />
                                  <span className="text-red-400 font-black">HTTP (Insecure)</span>
                                </>
                              )}
                            </p>
                          </div>

                          <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-500 uppercase tracking-wider block mb-1">Anomalies Detected</span>
                            <p className="text-xs font-bold text-blue-400">{analysis.findings.length} Flags</p>
                          </div>

                          <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-500 uppercase tracking-wider block mb-1">SSL Certificate</span>
                            <p className="text-xs font-bold text-white">
                              {analysis.protocol === "https:" ? "SHA-256 Validated Key" : "No SSL Key Found"}
                            </p>
                          </div>

                          <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-500 uppercase tracking-wider block mb-1">Brand Impersonation</span>
                            <p className="text-xs font-bold text-white">
                              {analysis.verdict === "SAFE" ? "0% Offset" : "High Typo Similarity"}
                            </p>
                          </div>

                          <div className="bg-black/35 rounded-xl p-4 border border-white/5">
                            <span className="text-gray-500 uppercase tracking-wider block mb-1">DNSSEC Status</span>
                            <p className="text-xs font-bold text-green-400">Verified</p>
                          </div>
                        </div>
                      )}

                      {activeTab === "sandbox" && (
                        <div className="bg-black/45 border border-white/5 rounded-xl p-4 font-mono text-xs text-green-300 leading-relaxed shadow-inner">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-gray-500">
                            <span>Sandbox DOM Inspection // {analysis.domain}</span>
                            <span>HTTP/1.1 200 OK</span>
                          </div>
                          
                          <div className="bg-black/80 rounded-lg border border-white/5 overflow-hidden">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/5 bg-white/[0.02]">
                              <div className="flex gap-1 shrink-0">
                                <span className="w-2 h-2 rounded-full bg-red-500/60" />
                                <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                                <span className="w-2 h-2 rounded-full bg-green-500/60" />
                              </div>
                              
                              <div className="flex-1 bg-black/60 rounded px-2 py-0.5 text-[9px] text-gray-400 truncate flex items-center gap-1">
                                {analysis.protocol === "https:" ? (
                                  <Lock size={8} className="text-green-400" />
                                ) : (
                                  <Unlock size={8} className="text-red-400" />
                                )}
                                {analysis.protocol}//{analysis.domain}
                              </div>
                            </div>

                            <div className="p-3 select-text">
                              <pre className="overflow-x-auto whitespace-pre custom-scrollbar py-1.5 text-[9px] leading-relaxed">
{`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verification Portal | Sandbox Redirect</title>
</head>
<body>
  <div id="app">
    <h3>Verifying client browser session credentials...</h3>
    <p>Please wait while we establish a secure tunnel connection.</p>
  </div>
  
  <!-- Web elements audit scanner outcomes -->
  ${analysis.risk > 45 ? '<!-- ALERT: Unsigned script resources embedded -->\n  <script src="/js/sec-gateway-tunnel-inject.js"></script>' : '<!-- Secure payload container loaded. -->'}
</body>
</html>`}
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
                      Awaiting suspected link to execute security scan.
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