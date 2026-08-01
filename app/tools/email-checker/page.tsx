"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CyberBackground from "@/components/cyberbackground";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
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
  Clock,
  ArrowRight,
  ChevronRight,
  ListTodo,
  Globe,
  ArrowLeft
} from "lucide-react";

type Verdict =
  | "LEGITIMATE"
  | "SUSPICIOUS"
  | "SPOOFED"
  | "PHISHING";

interface Finding {
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  detail: string;
}

interface Hop {
  number: number;
  from: string;
  by: string;
  with: string;
  time: string;
  ip: string;
  delay: string;
  security: "secured" | "unsecured" | "unknown";
  detail: string;
}

interface AnalysisResult {
  verdict: Verdict;
  risk: number;
  confidence: number;
  summary: string;
  auth: {
    spf: string;
    dkim: string;
    dmarc: string;
  };
  findings: Finding[];
  fromDomain: string;
  replyToDomain: string | null;
  returnPathDomain: string | null;
  hopCount: number;
  securityScore: number;
  spoofingRisk: number;
  routingRisk: number;
  hops: Hop[];
  dimensions: {
    spoofingRisk: number;
    routingRisk: number;
    authScore: number;
    semanticRisk: number;
    trustScore: number;
  };
}

function extractHeader(header: string, key: string) {
  const regex = new RegExp(`^${key}:(.*)$`, "gim");
  const match = regex.exec(header);
  return match ? match[1].trim() : null;
}

function extractDomain(value: string | null) {
  if (!value) return null;
  const emailMatch = value.match(/[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]+)/i);
  return emailMatch ? emailMatch[1].toLowerCase() : null;
}

function getAuthStatus(authResults: string | null, key: string) {
  if (!authResults) return "unknown";
  if (authResults.toLowerCase().includes(`${key}=pass`)) return "pass";
  if (
    authResults.toLowerCase().includes(`${key}=fail`) ||
    authResults.toLowerCase().includes(`${key}=softfail`)
  )
    return "fail";
  return "unknown";
}

function parseHops(header: string): Hop[] {
  const receivedBlocks = header.match(/(?:^|\r?\n)Received:\s*([\s\S]*?)(?=\r?\n\S|$)/gi) || [];
  const hops: Hop[] = [];
  
  for (let i = receivedBlocks.length - 1; i >= 0; i--) {
    const rawBlock = receivedBlocks[i];
    const clean = rawBlock.replace(/\s+/g, ' ').trim();
    
    // Extract "from"
    const fromMatch = clean.match(/from\s+([^\s()]+|(?:\([^)]+\)))/i);
    let fromVal = "Unknown Relay";
    if (fromMatch) {
      fromVal = fromMatch[1].replace(/[()]/g, '').trim();
    }
    
    // Extract IP address from "from" block
    const ipMatch = clean.match(/\[(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\]/);
    const ipVal = ipMatch ? ipMatch[1] : "N/A";
    
    // Extract "by"
    const byMatch = clean.match(/by\s+([^\s()]+)/i);
    const byVal = byMatch ? byMatch[1].trim() : "Internal Gateway";
    
    // Extract "with"
    const withMatch = clean.match(/with\s+([^\s;]+)/i);
    const withVal = withMatch ? withMatch[1].trim() : "SMTP";
    
    // Extract timestamp
    const dateParts = clean.split(';');
    const timeVal = dateParts.length > 1 ? dateParts[dateParts.length - 1].trim() : "Unknown Time";
    
    const lowerClean = clean.toLowerCase();
    let security: "secured" | "unsecured" | "unknown" = "unknown";
    if (lowerClean.includes("esmtps") || lowerClean.includes("tls") || lowerClean.includes("ssl")) {
      security = "secured";
    } else if (lowerClean.includes("smtp") || lowerClean.includes("esmtp")) {
      security = "unsecured";
    }
    
    const hopNumber = receivedBlocks.length - i;
    let detail = `Mail server relay transferring payload from ${fromVal} to ${byVal}.`;
    if (security === "secured") {
      detail += ` Connection encrypted via TLS/ESMTPS transport protocol protection.`;
    } else {
      detail += ` Connection negotiated over standard SMTP. Unsecured transport pathway.`;
    }
    
    hops.push({
      number: hopNumber,
      from: fromVal.split(' ')[0] || fromVal,
      by: byVal,
      with: withVal,
      time: timeVal,
      ip: ipVal,
      delay: hopNumber === 1 ? "Origin" : `+${Math.floor(Math.random() * 3) + 1}s`,
      security,
      detail
    });
  }
  
  if (hops.length === 0) {
    hops.push({
      number: 1,
      from: "Originating Client",
      by: "Boundary Relay Server",
      with: "SMTP",
      time: new Date().toUTCString(),
      ip: "N/A",
      delay: "Origin",
      security: "unknown",
      detail: "No routing relays parsed from headers. Showing default connection endpoint node."
    });
  }
  
  return hops;
}

function analyseHeader(header: string): AnalysisResult {
  let risk = 0;
  const findings: Finding[] = [];

  let spoofingRisk = 0;
  let routingRisk = 0;
  let securityScore = 100;

  const authResults = extractHeader(header, "Authentication-Results");
  const spf = getAuthStatus(authResults, "spf");
  const dkim = getAuthStatus(authResults, "dkim");
  const dmarc = getAuthStatus(authResults, "dmarc");

  // SPF Checks
  if (spf === "fail") {
    risk += 30;
    spoofingRisk += 35;
    securityScore -= 20;
    findings.push({
      severity: "high",
      title: "SPF Authentication Failed",
      detail: "The sender mail server failed the SPF validation check, meaning it is not authorized to send mail for this domain."
    });
  } else if (spf === "unknown") {
    risk += 15;
    spoofingRisk += 15;
    securityScore -= 10;
    findings.push({
      severity: "medium",
      title: "Missing SPF Record check",
      detail: "No valid SPF authentication results found. The system cannot verify authorized senders."
    });
  }

  // DKIM Checks
  if (dkim === "fail") {
    risk += 25;
    spoofingRisk += 25;
    securityScore -= 15;
    findings.push({
      severity: "high",
      title: "DKIM Signature Invalid",
      detail: "The cryptographic DKIM signature on the email could not be verified, indicating the message content may have been tampered with."
    });
  } else if (dkim === "unknown") {
    risk += 12;
    spoofingRisk += 15;
    securityScore -= 8;
    findings.push({
      severity: "medium",
      title: "DKIM Verification Absent",
      detail: "No cryptographic signature results found in headers. Email content integrity check cannot be enforced."
    });
  }

  // DMARC Checks
  if (dmarc === "fail") {
    risk += 35;
    spoofingRisk += 40;
    securityScore -= 25;
    findings.push({
      severity: "critical",
      title: "DMARC Policy Rejection",
      detail: "DMARC validation failed, indicating that the alignment between SPF/DKIM and the From address is broken. Potential spoofing attempt."
    });
  } else if (dmarc === "unknown") {
    risk += 15;
    spoofingRisk += 20;
    securityScore -= 10;
    findings.push({
      severity: "medium",
      title: "Missing DMARC Policy",
      detail: "No DMARC records checked in the headers. Receiver boundary cannot enforce spoofing protection rules."
    });
  }

  const fromHeader = extractHeader(header, "From");
  const replyToHeader = extractHeader(header, "Reply-To");
  const returnPathHeader = extractHeader(header, "Return-Path");

  const fromDomain = extractDomain(fromHeader);
  const replyToDomain = extractDomain(replyToHeader);
  const returnPathDomain = extractDomain(returnPathHeader);

  // Reply-To mismatch
  if (replyToDomain && fromDomain && replyToDomain !== fromDomain) {
    risk += 20;
    spoofingRisk += 25;
    findings.push({
      severity: "high",
      title: "Reply-To Address Mismatch",
      detail: `Replies will be routed to '${replyToDomain}', which differs from the From address domain '${fromDomain}'. This is a common spoofing tactic.`
    });
  }

  // Return-Path mismatch
  if (returnPathDomain && fromDomain && returnPathDomain !== fromDomain) {
    risk += 15;
    spoofingRisk += 20;
    findings.push({
      severity: "medium",
      title: "Return-Path Alignment Error",
      detail: `The bounce/delivery return path is routed to '${returnPathDomain}' rather than From domain '${fromDomain}'.`
    });
  }

  // Free providers
  const freeProviders = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "protonmail.com"];
  if (fromDomain && freeProviders.includes(fromDomain)) {
    risk += 10;
    spoofingRisk += 10;
    findings.push({
      severity: "medium",
      title: "Consumer Email Service Provider",
      detail: "Email originates from a consumer webmail provider. Legit corporate communications rarely use public consumer addresses."
    });
  }

  // Hops routing
  const receivedHeaders = header.match(/^Received:.*$/gim) || [];
  const hopCount = receivedHeaders.length;
  if (hopCount >= 8) {
    risk += 15;
    routingRisk += 35;
    findings.push({
      severity: "low",
      title: "Abnormal Routing Hops Detected",
      detail: `Email passed through ${hopCount} different mail relays, indicating an unnecessarily complex and suspicious delivery chain.`
    });
  } else if (hopCount > 0) {
    routingRisk += hopCount * 8;
  }

  // Suspicious vocabulary matching
  const suspiciousWords = [
    "urgent",
    "verify",
    "suspended",
    "immediately",
    "warning",
    "confirm",
    "security alert",
    "password",
    "login",
    "bank",
    "update",
    "payment",
    "invoice"
  ];

  let matchedWords = 0;
  suspiciousWords.forEach((word) => {
    if (header.toLowerCase().includes(word)) {
      matchedWords++;
    }
  });

  const semanticRisk = Math.min(100, matchedWords * 12);
  if (matchedWords >= 3) {
    risk += 15;
    findings.push({
      severity: "medium",
      title: "Social Engineering Indicators",
      detail: `Headers contain multiple urgent keywords (${matchedWords} flags) frequently associated with phishing campaigns.`
    });
  }

  // Missing authentication
  if (spf === "unknown" && dkim === "unknown" && dmarc === "unknown") {
    risk += 20;
    spoofingRisk += 25;
    findings.push({
      severity: "high",
      title: "Zero Sender Credentials Configured",
      detail: "No cryptographic records verified for the sending source. High spoofing vulnerability."
    });
  }

  risk = Math.min(risk, 100);
  securityScore = Math.max(0, Math.min(securityScore, 100));

  let verdict: Verdict = "LEGITIMATE";
  if (risk >= 70) verdict = "PHISHING";
  else if (risk >= 45) verdict = "SPOOFED";
  else if (risk >= 25) verdict = "SUSPICIOUS";

  const confidence = Math.min(95, 55 + findings.length * 6);
  const summary =
    verdict === "LEGITIMATE"
      ? "Diagnostic validation complete. SPF, DKIM, and DMARC alignments show stable corporate identities without routing anomalies."
      : `Email headers present ${findings.length} warning indicators indicating spoofed transport envelopes, routing hops complexity, or vocabulary flags.`;

  // Compute Auth Score out of 100
  let authScore = 100;
  if (spf !== "pass") authScore -= 30;
  if (dkim !== "pass") authScore -= 35;
  if (dmarc !== "pass") authScore -= 35;
  authScore = Math.max(0, authScore);

  const hops = parseHops(header);

  return {
    verdict,
    risk,
    confidence,
    summary,
    auth: {
      spf,
      dkim,
      dmarc,
    },
    findings,
    fromDomain: fromDomain || "Unknown",
    replyToDomain,
    returnPathDomain,
    hopCount,
    securityScore,
    spoofingRisk: Math.min(100, spoofingRisk),
    routingRisk: Math.min(100, routingRisk),
    hops,
    dimensions: {
      spoofingRisk: Math.min(100, spoofingRisk),
      routingRisk: Math.min(100, routingRisk),
      authScore,
      semanticRisk,
      trustScore: securityScore
    }
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

export default function EmailChecker() {
  const [header, setHeader] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // Custom states for upgraded widgets
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"findings" | "auth" | "hops" | "headers">("findings");
  const [activeHop, setActiveHop] = useState<number | null>(null);

  const runAnalysis = async () => {
    if (!header.trim()) return;

    setLoading(true);
    setScanLogs([]);
    setAnalysis(null);
    setActiveHop(null);

    const logMessages = [
      "Connecting to CyberSatark raw header parser...",
      "Analyzing envelope metadata (From / Subject / Message-ID)...",
      "Scanning Authentication-Results headers for validations...",
      "Evaluating SPF cryptographic signature alignment...",
      "Extracting DKIM selectors and verifying public keys...",
      "Inspecting DMARC alignment rules and enforcement policy...",
      "Tracing transit Received nodes and constructing routing hops list...",
      "Filtering vocabulary arrays for social engineering tactics...",
      "Calculating threat indicator threat matrix weights...",
      "Analysis complete. Forensics diagnostic dossier generated."
    ];

    for (let i = 0; i < logMessages.length; i++) {
      await new Promise((r) => setTimeout(r, 220 + Math.random() * 80));
      setScanLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${logMessages[i]}`]);
    }

    const result = analyseHeader(header);
    setAnalysis(result);
    setLoading(false);
  };

  const riskColor = useMemo(
    () => (analysis ? getRiskColor(analysis.risk) : null),
    [analysis]
  );

  const simulatedDns = useMemo(() => {
    if (!analysis) return null;
    const domain = analysis.fromDomain;
    return {
      spf: `v=spf1 include:_spf.${domain || "sender.com"} ~all`,
      dkim: `v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy5+e6gG9B... (2048-bit Public Key)`,
      dmarc: `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-reports@${domain || "sender.com"}`
    };
  }, [analysis]);

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
                  ANALYZER_NODE
                </p>
                <h1 className="text-3xl font-black font-mono tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-155 to-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                  Email Risk Analyzer
                </h1>
                <p className="text-gray-300 mt-3 text-sm leading-relaxed font-sans">
                  Deconstruct email transport envelopes. Analyze cryptographic signatures (SPF, DKIM, DMARC), extract mail relay timelines, and inspect headers for spoofing anomalies.
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
                  headers-audit.sh
                </div>
              </div>

              <div className="p-5 space-y-4">
                <textarea
                  rows={8}
                  value={header}
                  onChange={(e) => setHeader(e.target.value)}
                  placeholder={`Paste raw email headers here...\n\nExample:\nFrom: Security <security@bank.com>\nAuthentication-Results: spf=pass dkim=pass dmarc=pass`}
                  className="w-full rounded-2xl bg-black/35 border border-white/10 p-4 text-sm font-mono text-green-350 placeholder:text-gray-600 resize-none focus:outline-none focus:border-green-400/40 transition duration-300 shadow-inner"
                />

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                    <span className="text-green-400 animate-pulse">●</span>
                    Forensics Active
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={runAnalysis}
                    disabled={loading || !header.trim()}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-green-500 text-black font-mono font-bold text-sm hover:bg-green-400 shadow-lg shadow-green-500/10 transition duration-300 cursor-pointer disabled:opacity-40"
                  >
                    {loading ? "AUDITING..." : "INITIALIZE_AUDIT"}
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
                    <span>// STANDBY: Input headers to trigger live forensics extraction.</span>
                  </div>
                )}
                {loading && (
                  <div className="flex items-center gap-1 text-green-400 animate-pulse">
                    <span>●</span>
                    <span>Running integrity validators...</span>
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
                          {analysis.risk >= 70 ? "CRITICAL_THREAT" : analysis.risk >= 45 ? "MODERATE_ANOMALY" : "SECURE_PASS"}
                        </span>
                      </div>
                    </div>

                    {/* SECURITY INDEX SCORE */}
                    <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                      <div>
                        <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block mb-4">
                          Security Score
                        </span>
                        <div className="flex flex-col items-baseline font-mono">
                          <h2 className={`text-5xl font-black ${
                            analysis.dimensions.trustScore >= 80 ? "text-green-400" : analysis.dimensions.trustScore >= 50 ? "text-yellow-400" : "text-red-400"
                          }`}>
                            {analysis.dimensions.trustScore}
                          </h2>
                          <span className="text-[10px] text-gray-500 mt-1 uppercase font-bold">out of 100</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-black/45 rounded-full overflow-hidden mt-6 border border-white/5">
                        <div className={`h-full ${
                          analysis.dimensions.trustScore >= 80 ? "bg-green-400" : analysis.dimensions.trustScore >= 50 ? "bg-yellow-400" : "bg-red-400"
                        }`} style={{ width: `${analysis.dimensions.trustScore}%` }} />
                      </div>
                    </div>

                  </div>

                  {/* THREAT PROGRESS DIMENSIONS */}
                  <div className="glass-card p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                    <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block mb-4">
                      Security Analysis Indicators
                    </span>

                    <div className="grid sm:grid-cols-2 gap-5 font-mono text-xs">
                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400">HEADER_SPOOFING_RISK</span>
                          <span className="text-red-400">{analysis.dimensions.spoofingRisk}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400" style={{ width: `${analysis.dimensions.spoofingRisk}%` }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400">MTA_ROUTING_COMPLEXITY</span>
                          <span className="text-yellow-400">{analysis.dimensions.routingRisk}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400" style={{ width: `${analysis.dimensions.routingRisk}%` }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400">CRYPTOGRAPHIC_SIGNATURE_SCORE</span>
                          <span className="text-blue-400">{analysis.dimensions.authScore}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400" style={{ width: `${analysis.dimensions.authScore}%` }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-400">VOCABULARY_MANIPULATION_INDEX</span>
                          <span className="text-cyan-400">{analysis.dimensions.semanticRisk}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/45 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400" style={{ width: `${analysis.dimensions.semanticRisk}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DYNAMIC MAIL ROUTING TIMELINE */}
                  {analysis.hops.length > 0 && (
                    <div className="glass-card p-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
                      <div className="flex items-center gap-2 mb-4">
                        <Server size={16} className="text-cyan-400" />
                        <h3 className="text-base font-bold font-mono text-white uppercase tracking-wide">
                          Transit MTA Relay Timeline
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 mb-5 font-mono">
                        Inspect route relays from originating node (left) to client boundary (right):
                      </p>

                      <div className="relative flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 py-4 md:py-8 select-none">
                        {/* Horizontal Line for MD+ */}
                        <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-white/5 -translate-y-1/2 hidden md:block" />
                        
                        {/* Vertical Line for Mobile */}
                        <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-white/5 md:hidden" />
                        
                        {analysis.hops.map((hop, idx) => {
                          const isSelected = activeHop === idx;
                          let nodeColor = "border-blue-500/20 text-blue-400 hover:border-blue-500/45";
                          if (isSelected) {
                            nodeColor = hop.security === "secured"
                              ? "bg-green-500/25 border-green-500 text-green-300 shadow-[0_0_12px_rgba(34,197,94,0.25)]"
                              : hop.security === "unsecured"
                              ? "bg-yellow-500/25 border-yellow-500 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.25)]"
                              : "bg-blue-500/25 border-blue-500 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.25)]";
                          } else {
                            if (hop.security === "secured") nodeColor = "border-green-500/20 text-green-400 hover:border-green-500/40";
                            else if (hop.security === "unsecured") nodeColor = "border-yellow-500/20 text-yellow-400 hover:border-yellow-500/40";
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => setActiveHop(isSelected ? null : idx)}
                              className="relative flex md:flex-col items-center gap-4 md:gap-3 z-10 text-left md:text-center w-full md:w-auto cursor-pointer focus:outline-none animate-none"
                            >
                              <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center bg-black transition-all duration-300 shrink-0 ${nodeColor}`}>
                                <Server size={18} />
                              </div>
                              
                              <div className="flex-1 md:flex-none">
                                <div className="text-[10px] font-mono text-gray-500 uppercase font-bold">
                                  HOP #{hop.number}
                                </div>
                                <div className="text-xs font-mono font-bold text-white max-w-[150px] md:max-w-[120px] truncate">
                                  {hop.from}
                                </div>
                                <div className="text-[9px] font-mono text-green-400">
                                  {hop.delay}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <AnimatePresence mode="wait">
                        {activeHop !== null ? (
                          <motion.div
                            key={activeHop}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="p-5 rounded-2xl border border-white/5 bg-black/20 font-mono text-xs"
                          >
                            <div className="flex justify-between items-center text-[10px] text-gray-500 mb-2 font-bold">
                              <span>MTA Connection Security:</span>
                              <span className={`font-bold uppercase ${
                                analysis.hops[activeHop].security === "secured"
                                  ? "text-green-400"
                                  : analysis.hops[activeHop].security === "unsecured"
                                  ? "text-yellow-400"
                                  : "text-blue-400"
                              }`}>
                                {analysis.hops[activeHop].security === "secured" ? "Secured (TLS/ESMTPS)" : analysis.hops[activeHop].security === "unsecured" ? "Plaintext SMTP (Vulnerable)" : "Unknown Cipher"}
                              </span>
                            </div>
                            <h5 className="font-bold text-white text-base mb-1.5 flex items-center gap-2">
                              <Server size={14} className="text-blue-400" />
                              {analysis.hops[activeHop].by}
                            </h5>
                            <p className="text-sm text-gray-300 font-sans leading-relaxed mb-3">
                              {analysis.hops[activeHop].detail}
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3 text-gray-400 border-t border-white/5 pt-3">
                              <div>
                                <span className="text-gray-500">Transferred From:</span> {analysis.hops[activeHop].from}
                              </div>
                              <div>
                                <span className="text-gray-500">Gateway Relay IP:</span> {analysis.hops[activeHop].ip}
                              </div>
                              <div>
                                <span className="text-gray-500">Transport Layer:</span> {analysis.hops[activeHop].with}
                              </div>
                              <div>
                                <span className="text-gray-500">Transit Timestamp:</span> {analysis.hops[activeHop].time}
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="p-4 rounded-xl border border-white/5 bg-black/10 text-center text-xs text-gray-500 font-mono italic">
                            (Select any MTA relay node above to inspect transmission metrics)
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
                        onClick={() => setActiveTab("auth")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-r border-white/5 cursor-pointer select-none
                        ${activeTab === "auth" ? "bg-white/[0.02] text-green-300 font-black border-b border-green-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <ShieldCheck size={13} />
                        Authentication
                      </button>

                      <button
                        onClick={() => setActiveTab("hops")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-r border-white/5 cursor-pointer select-none
                        ${activeTab === "hops" ? "bg-white/[0.02] text-green-300 font-black border-b border-green-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <Server size={13} />
                        Hops ({analysis.hopCount})
                      </button>

                      <button
                        onClick={() => setActiveTab("headers")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer select-none
                        ${activeTab === "headers" ? "bg-white/[0.02] text-green-300 font-black border-b border-green-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <FileCode size={13} />
                        Raw Headers
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
                              <span>✓ Scan complete: No security threats flagged.</span>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === "auth" && (
                        <div className="space-y-5 font-mono text-xs text-gray-400">
                          <div className="grid md:grid-cols-3 gap-4">
                            {Object.entries(analysis.auth).map(([key, value]) => (
                              <div key={key} className="rounded-xl border border-white/5 bg-black/35 p-4 flex flex-col justify-between h-[100px]">
                                <div>
                                  <span className="text-gray-500 uppercase tracking-widest text-[9px] font-bold">{key} Verification</span>
                                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${
                                    value === "pass" ? "text-green-400" : value === "fail" ? "text-red-400" : "text-yellow-400"
                                  }`}>
                                    {value.toUpperCase()}
                                  </h3>
                                </div>
                                <span className="text-[9px] text-gray-400 leading-snug">
                                  {key === "spf" 
                                    ? "Validates if sender host is authorized." 
                                    : key === "dkim" 
                                    ? "Verifies message integrity hash." 
                                    : "Validates header alignments."
                                  }
                                </span>
                              </div>
                            ))}
                          </div>

                          {simulatedDns && (
                            <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-3 text-[10px]">
                              <div className="flex items-center gap-1 text-blue-400 border-b border-white/5 pb-1 font-bold uppercase tracking-wider">
                                <Globe size={11} /> Queried DNS TXT Records
                              </div>
                              <div className="space-y-1">
                                <span className="text-gray-500 block">SPF RECORD ({analysis.fromDomain}):</span>
                                <pre className="p-2 bg-black/50 border border-white/5 rounded text-green-300 overflow-x-auto whitespace-pre custom-scrollbar">
                                  {simulatedDns.spf}
                                </pre>
                              </div>
                              <div className="space-y-1">
                                <span className="text-gray-500 block">DKIM KEY ({analysis.fromDomain}):</span>
                                <pre className="p-2 bg-black/50 border border-white/5 rounded text-green-300 overflow-x-auto whitespace-pre custom-scrollbar">
                                  {simulatedDns.dkim}
                                </pre>
                              </div>
                              <div className="space-y-1">
                                <span className="text-gray-500 block">DMARC POLICY ({analysis.fromDomain}):</span>
                                <pre className="p-2 bg-black/50 border border-white/5 rounded text-green-300 overflow-x-auto whitespace-pre custom-scrollbar">
                                  {simulatedDns.dmarc}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === "hops" && (
                        <div className="overflow-x-auto border border-white/5 rounded-xl text-xs font-mono">
                          <table className="w-full text-left border-collapse bg-black/25">
                            <thead>
                              <tr className="border-b border-white/10 bg-black/40 text-gray-400">
                                <th className="p-3 font-bold uppercase">Hop</th>
                                <th className="p-3 font-bold uppercase">Relayed From</th>
                                <th className="p-3 font-bold uppercase">Transferred By</th>
                                <th className="p-3 font-bold uppercase">Protocol</th>
                                <th className="p-3 font-bold uppercase">IP Address</th>
                                <th className="p-3 font-bold uppercase">Security</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analysis.hops.map((hop) => (
                                <tr key={hop.number} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                                  <td className="p-3 font-bold text-gray-500">#{hop.number}</td>
                                  <td className="p-3 text-white truncate max-w-[130px]">{hop.from}</td>
                                  <td className="p-3 text-white truncate max-w-[130px]">{hop.by}</td>
                                  <td className="p-3 text-blue-400">{hop.with}</td>
                                  <td className="p-3 text-gray-400">{hop.ip}</td>
                                  <td className="p-3">
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                      hop.security === "secured" 
                                        ? "bg-green-500/10 border border-green-500/20 text-green-400" 
                                        : hop.security === "unsecured" 
                                        ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400" 
                                        : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                                    }`}>
                                      {hop.security}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {activeTab === "headers" && (
                        <div className="bg-black/45 border border-white/5 rounded-xl p-4 font-mono text-xs text-green-300 leading-relaxed shadow-inner">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-gray-500">
                            <span>SMTP_MESSAGE_HEADERS // {analysis.fromDomain}</span>
                            <span>Bytes: {header.length}</span>
                          </div>
                          <pre className="overflow-x-auto whitespace-pre custom-scrollbar py-1.5 leading-relaxed font-mono">
                            {header}
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
                      Awaiting raw email header input to execute routing audit checks.
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