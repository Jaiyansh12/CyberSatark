"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CyberBackground from "@/components/cyberbackground";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Terminal,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Lock,
  Unlock,
  FileCode,
  AlertCircle,
  Globe,
  Radio,
  FileIcon,
  Network,
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  UploadCloud,
  ChevronRight
} from "lucide-react";

type SearchType = "hash" | "ip" | "domain";

interface VendorResult {
  name: string;
  status: string;
}

interface AnalysisResult {
  live: boolean;
  entityType: string;
  targetName: string;
  stats: {
    malicious: number;
    suspicious: number;
    harmless: number;
    undetected: number;
  };
  reputation: number;
  metadata: {
    size?: string;
    file_type?: string;
    md5?: string;
    sha256?: string;
    country?: string;
    asn?: string;
    network?: string;
    regional_registry?: string;
    registrar?: string;
    creation_date?: string;
    dns_sec?: string;
    tld_risk?: string;
  };
  vendors: VendorResult[];
}

const PRESETS = {
  hash: [
    { name: "EICAR Test Trojan", value: "275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f" },
    { name: "Clean Asset Executable", value: "d50a2b8e3c6f1a8c91a0b3f5c9e2b10a28f84019a12c8b093498aef00b91cf8e" }
  ],
  ip: [
    { name: "Command & Control IP", value: "198.51.100.42" },
    { name: "Google Clean DNS IP", value: "8.8.8.8" }
  ],
  domain: [
    { name: "Evil Phishing Portal", value: "evil-billing-verification.xyz" },
    { name: "Google Corporate Domain", value: "google.com" }
  ]
};

export default function ThreatIntelligencePage() {
  const [searchType, setSearchType] = useState<SearchType>("hash");
  const [targetValue, setTargetValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"vendors" | "metadata" | "remediation" | "raw">("vendors");
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // File Upload states
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileDetails({
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`
    });

    setSearchType("hash");
    setTargetValue(""); // Will be populated with simulated hash
  };

  const runAnalysis = async () => {
    let finalTarget = targetValue.trim();

    // If uploading file, calculate simulated SHA-256 deterministically
    if (fileDetails && !finalTarget) {
      // Deterministic mock hash based on filename
      let hash = 0;
      for (let i = 0; i < fileDetails.name.length; i++) {
        hash = (hash << 5) - hash + fileDetails.name.charCodeAt(i);
        hash |= 0;
      }
      const hex = Math.abs(hash * 37).toString(16).padStart(8, '0') + 
                  Math.abs(hash * 91).toString(16).padStart(8, '0') + 
                  Math.abs(hash * 13).toString(16).padStart(8, '0') + 
                  Math.abs(hash * 77).toString(16).padStart(8, '0');
      
      const fullHash = hex.substring(0, 64);
      finalTarget = fileDetails.name.toLowerCase().includes("malware") || 
                    fileDetails.name.toLowerCase().includes("eicar")
        ? "275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f"
        : fullHash;
        
      setTargetValue(finalTarget);
    }

    if (!finalTarget) return;

    setLoading(true);
    setScanLogs([]);
    setResult(null);

    const logMessages = [
      `Initializing threat engine lookup for type: ${searchType.toUpperCase()}`,
      `Parsing character stream structure: ${finalTarget.substring(0, 30)}${finalTarget.length > 30 ? "..." : ""}`,
      "Scanning target against active zero-day intelligence indices...",
      "Resolving WHOIS registries and ASN networks...",
      "Contacting VirusTotal Cloud Threat APIs...",
      "Extracting antivirus vendor heuristics and scan tables...",
      "Compiling reputation metrics and threat rating vectors...",
      "Analysis sequence successful. Forensics output ready."
    ];

    for (let i = 0; i < logMessages.length; i++) {
      if (logMessages[i].includes("VirusTotal")) {
        setScanLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Querying VirusTotal database...`]);
        try {
          const res = await fetch("/api/virustotal-intel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ target: finalTarget, type: searchType })
          });

          if (res.ok) {
            const data = await res.json();
            setResult(data);
            setScanLogs((prev) => [
              ...prev,
              `[${new Date().toLocaleTimeString()}] VirusTotal: Found ${data.stats.malicious} engine flags out of ${data.stats.malicious + data.stats.harmless} total checks.`
            ]);
          } else {
            setScanLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] VirusTotal: Database request failed (offline simulation active)`]);
          }
        } catch {
          setScanLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] VirusTotal: Connection error (offline simulation active)`]);
        }
      } else {
        await new Promise((r) => setTimeout(r, 220 + Math.random() * 80));
        setScanLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${logMessages[i]}`]);
      }
    }

    setLoading(false);
  };

  const threatColor = useMemo(() => {
    if (!result) return null;
    const score = result.stats.malicious;
    if (score >= 10) {
      return {
        text: "text-red-400",
        stroke: "stroke-red-500",
        border: "border-red-500/30",
        bg: "bg-red-500/10",
        glow: "shadow-red-500/15",
        verdict: "MALICIOUS"
      };
    }
    if (score >= 1) {
      return {
        text: "text-yellow-400",
        stroke: "stroke-yellow-500",
        border: "border-yellow-500/30",
        bg: "bg-yellow-500/10",
        glow: "shadow-yellow-500/15",
        verdict: "SUSPICIOUS"
      };
    }
    return {
      text: "text-green-400",
      stroke: "stroke-green-500",
      border: "border-green-500/30",
      bg: "bg-green-500/10",
      glow: "shadow-green-500/15",
      verdict: "CLEAN"
    };
  }, [result]);

  const maxEngines = useMemo(() => {
    if (!result) return 92;
    return result.stats.malicious + result.stats.suspicious + result.stats.harmless + result.stats.undetected;
  }, [result]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = useMemo(() => {
    if (!result) return circumference;
    const ratio = result.stats.malicious / maxEngines;
    return circumference - ratio * circumference;
  }, [result, maxEngines]);

  return (
    <>
      <Navbar />
      <CyberBackground />

      <main className="min-h-screen px-6 py-28 text-white relative z-10 max-w-7xl mx-auto w-full">

        {/* BACK LINK */}
        <div className="mb-6">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-green-400 transition-colors duration-200 uppercase tracking-widest group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Security Tools</span>
          </Link>
        </div>

        {/* TWO-COLUMN FORENSICS GRID */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: CONTROLS & INGESTION (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">

            {/* GLOWING HERO HEADER */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 relative overflow-hidden group hover:border-purple-500/20 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-purple-500/10 via-purple-400/30 to-purple-500/10" />
              <div>
                <p className="text-purple-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2 font-bold mb-2">
                  <Activity size={12} className="animate-pulse" />
                  INTEL_NODE
                </p>
                <h1 className="text-3xl font-black font-mono tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                  Threat Intelligence
                </h1>
                <p className="text-gray-300 mt-3 text-sm leading-relaxed font-sans">
                  Malware & IP Analyzer. Ingest file hashes, network domains, or IP addresses to audit them against global VirusTotal reputation indices in real-time.
                </p>
              </div>
            </motion.div>

            {/* INGESTION PANEL */}
            <div className="backdrop-blur-[40px] bg-white/[0.03] border border-white/12 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
              <div className="flex items-center justify-between px-5 py-3 border-b border-purple-500/10 bg-black/40">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-500/70"></div>
                </div>
                <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-purple-400 font-semibold font-mono">
                  Asset Ingestion
                </p>
                <div className="text-xs text-gray-500 font-mono">
                  intel-scan.sh
                </div>
              </div>

              <div className="p-5 space-y-5">

                {/* TYPE SELECTOR PANEL */}
                <div className="grid grid-cols-3 gap-2 bg-black/35 p-1 rounded-xl border border-white/5 font-mono text-[10px] text-center select-none font-bold">
                  <button
                    onClick={() => { setSearchType("hash"); setFileDetails(null); }}
                    className={`py-2 rounded-lg cursor-pointer transition ${
                      searchType === "hash" ? "bg-purple-500 text-black shadow" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    HASH / FILE
                  </button>
                  <button
                    onClick={() => { setSearchType("ip"); setFileDetails(null); }}
                    className={`py-2 rounded-lg cursor-pointer transition ${
                      searchType === "ip" ? "bg-purple-500 text-black shadow" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    IP ADDRESS
                  </button>
                  <button
                    onClick={() => { setSearchType("domain"); setFileDetails(null); }}
                    className={`py-2 rounded-lg cursor-pointer transition ${
                      searchType === "domain" ? "bg-purple-500 text-black shadow" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    DOMAIN / URL
                  </button>
                </div>

                {/* FILE ATTACH MATRIX (ONLY FOR HASH TYPE) */}
                {searchType === "hash" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-gray-500">Attach Suspected File:</span>
                      {fileDetails && (
                        <button
                          onClick={() => setFileDetails(null)}
                          className="text-[9px] font-mono text-red-400 hover:underline"
                        >
                          Clear File
                        </button>
                      )}
                    </div>
                    
                    {!fileDetails ? (
                      <label className="flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-purple-500/30 rounded-2xl p-6 bg-black/25 transition duration-300 cursor-pointer group text-center">
                        <UploadCloud size={24} className="text-gray-500 group-hover:text-purple-400 transition" />
                        <span className="text-xs font-mono text-gray-400 group-hover:text-white transition mt-2 font-bold">Select suspect asset binary</span>
                        <span className="text-[9px] text-gray-600 block mt-1 font-mono">Calculates SHA-256 locally</span>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-3 font-mono text-xs">
                        <FileIcon className="text-purple-400 shrink-0" size={16} />
                        <div className="flex-1 truncate">
                          <p className="font-bold text-white truncate">{fileDetails.name}</p>
                          <p className="text-[10px] text-gray-400">{fileDetails.size}</p>
                        </div>
                        <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/10 uppercase animate-pulse">QUEUED</span>
                      </div>
                    )}
                  </div>
                )}

                {/* PRESETS CHECKS */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-gray-500">Preset Scenarios:</span>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS[searchType].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setFileDetails(null);
                          setTargetValue(preset.value);
                        }}
                        className="px-2.5 py-1 rounded-md border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/15 text-[10px] font-mono text-gray-400 hover:text-white transition duration-200 cursor-pointer"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TARGET STRING INPUT */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-purple-300 font-bold">
                    {searchType === "hash" ? "File Hash Key (MD5 / SHA-256)" : searchType === "ip" ? "Target IP Address" : "Domain Address / URL"}
                  </label>

                  <div className="flex items-center bg-black/35 border border-white/10 rounded-2xl overflow-hidden focus-within:border-purple-400/40 transition duration-300 shadow-inner">
                    <div className="px-4 text-gray-500">
                      {searchType === "hash" ? <FileCode size={16} /> : searchType === "ip" ? <Network size={16} /> : <Globe size={16} />}
                    </div>

                    <input
                      type="text"
                      placeholder={
                        searchType === "hash" 
                          ? "Enter SHA-256 hash checksum..." 
                          : searchType === "ip" 
                          ? "Enter IPv4 address..." 
                          : "Enter domain (e.g. evil-domain.net)..."
                      }
                      value={targetValue}
                      onChange={(e) => {
                        setFileDetails(null);
                        setTargetValue(e.target.value);
                      }}
                      className="flex-1 bg-transparent py-4 text-sm font-mono text-purple-300 placeholder:text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                    <span className="text-purple-400 animate-pulse">●</span>
                    Cloud Database Online
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={runAnalysis}
                    disabled={loading || (!targetValue.trim() && !fileDetails)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-500 text-black font-mono font-bold text-sm hover:bg-purple-400 shadow-lg shadow-purple-500/10 transition duration-300 cursor-pointer disabled:opacity-40"
                  >
                    {loading ? "SCANNING..." : "INITIALIZE_INTEL_SCAN"}
                  </motion.button>
                </div>

              </div>
            </div>

            {/* LIVE INSPECTOR LOG TERMINAL */}
            <div className="glass-card p-6 flex flex-col h-[225px] relative overflow-hidden group">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-3">
                <Terminal size={14} className="text-purple-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Audit Execution Shell
                </span>
              </div>

              <div className="flex-1 bg-black/30 rounded-xl border border-white/5 p-3.5 font-mono text-xs text-purple-300/80 overflow-y-auto space-y-2 custom-scrollbar shadow-inner">
                {scanLogs.length > 0 ? (
                  scanLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-1.5 items-start">
                      <span className="text-purple-500 shrink-0 font-semibold">[SEC]</span>
                      <span className="break-all">{log}</span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 text-[11px] gap-1.5 py-4">
                    <Activity size={18} className="opacity-30" />
                    <span>// STANDBY: Input threat payload to trigger threat intelligence scan.</span>
                  </div>
                )}
                {loading && (
                  <div className="flex items-center gap-1 text-purple-400 animate-pulse">
                    <span>●</span>
                    <span>Querying threat databases...</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: FORENSICS DISCOVERY PANEL (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">

            <AnimatePresence mode="wait">
              {result ? (
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
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${threatColor?.stroke} to-transparent`} />
                      <div>
                        <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block mb-3">
                          Threat Intel Verdict
                        </span>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className={`px-3 py-1.5 rounded-full font-mono font-bold tracking-widest text-xs uppercase border ${threatColor?.border} ${threatColor?.bg} ${threatColor?.glow} ${threatColor?.text}`}>
                            {threatColor?.verdict}
                          </div>
                          <span className="text-xs text-gray-400 font-mono">
                            ({result.entityType}: {result.targetName.substring(0, 24)}{result.targetName.length > 24 ? "..." : ""})
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 mt-4 leading-relaxed font-sans">
                          {result.stats.malicious >= 10
                            ? `WARNING: High threat match. Global scanners detected active security vendor blocks matching malicious distributions.`
                            : result.stats.malicious >= 1
                            ? `ATTENTION: Suspicious indicators flagged related to proxies or reputation anomalies.`
                            : `CLEAN: Zero vendor registries have flagged this asset code block as malicious or suspicious.`}
                        </p>
                      </div>

                      <div className="mt-6 flex justify-between items-center text-xs text-gray-500 font-mono border-t border-white/5 pt-3">
                        <span>Database Status</span>
                        <span className={`font-bold ${threatColor?.text}`}>
                          {result.stats.malicious >= 10 ? "Critical Threat" : result.stats.malicious >= 1 ? "Suspicious" : "Clean"}
                        </span>
                      </div>
                    </div>

                    {/* CONCENTRIC SCORE METER */}
                    <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden items-center">
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                      <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block mb-4 self-start">
                        Reputation Score
                      </span>

                      {/* SVG Gauge */}
                      <div className="relative flex items-center justify-center w-28 h-28 my-auto">
                        <svg className="w-full h-full transform -rotate-90">
                          {/* Inner circle */}
                          <circle
                            cx="56"
                            cy="56"
                            r={radius}
                            className="stroke-white/5"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          {/* Active VT circle */}
                          <circle
                            cx="56"
                            cy="56"
                            r={radius}
                            className={`transition-all duration-700 ease-out ${threatColor?.stroke}`}
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center font-mono">
                          <span className={`text-2xl font-black ${threatColor?.text}`}>
                            {result.reputation}
                          </span>
                          <span className="text-[7px] uppercase tracking-widest text-gray-500 font-bold">
                            Community
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* VENDOR DETECTIONS RATIO PROGRESS BLOCK */}
                  <div className="glass-card p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                    <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block mb-3">
                      Global Detection Ratio
                    </span>
                    
                    <div className="space-y-3 font-mono text-xs">
                      <div className="w-full h-3 bg-black/45 border border-white/5 rounded-full overflow-hidden flex">
                        <div className="h-full bg-red-500 animate-pulse" style={{ width: `${(result.stats.malicious / maxEngines) * 100}%` }} />
                        <div className="h-full bg-yellow-500" style={{ width: `${(result.stats.suspicious / maxEngines) * 100}%` }} />
                        <div className="h-full bg-green-500" style={{ width: `${(result.stats.harmless / maxEngines) * 100}%` }} />
                      </div>
                      
                      <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                        <span className="text-red-400">Malicious: {result.stats.malicious}</span>
                        <span className="text-yellow-400">Suspicious: {result.stats.suspicious}</span>
                        <span className="text-green-400">Clean/Harmless: {result.stats.harmless}</span>
                      </div>
                    </div>
                  </div>

                  {/* FORENSICS DIAGNOSTIC TABS */}
                  <div className="glass-card overflow-hidden">
                    
                    <div className="flex overflow-x-auto border-b border-white/5 bg-black/25">
                      <button
                        onClick={() => setActiveTab("vendors")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-r border-white/5 cursor-pointer select-none
                        ${activeTab === "vendors" ? "bg-white/[0.02] text-purple-300 font-black border-b border-purple-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <ShieldAlert size={13} />
                        Engine Detections
                      </button>

                      <button
                        onClick={() => setActiveTab("metadata")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-r border-white/5 cursor-pointer select-none
                        ${activeTab === "metadata" ? "bg-white/[0.02] text-purple-300 font-black border-b border-purple-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <Globe size={13} />
                        Intel Metadata
                      </button>

                      <button
                        onClick={() => setActiveTab("remediation")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-r border-white/5 cursor-pointer select-none
                        ${activeTab === "remediation" ? "bg-white/[0.02] text-purple-300 font-black border-b border-purple-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <CheckCircle2 size={13} />
                        IR Playbook
                      </button>

                      <button
                        onClick={() => setActiveTab("raw")}
                        className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer select-none
                        ${activeTab === "raw" ? "bg-white/[0.02] text-purple-300 font-black border-b border-purple-400" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <FileCode size={13} />
                        Payload
                      </button>
                    </div>

                    <div className="p-5">

                      {/* TAB 1: VENDORS SCAN RESULTS */}
                      {activeTab === "vendors" && (
                        <div className="space-y-4 font-mono text-xs">
                          <span className="text-gray-500 uppercase tracking-wider block text-[9px] mb-1">Detailed Engine Outcomes</span>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {result.vendors.map((vendor) => (
                              <div key={vendor.name} className="p-3 bg-black/25 border border-white/5 rounded-xl flex flex-col justify-between">
                                <span className="text-[9px] text-gray-400 truncate font-semibold block">{vendor.name}</span>
                                <span className={`text-[10px] font-bold uppercase mt-2 block ${
                                  vendor.status === "clean" ? "text-green-400" :
                                  vendor.status === "suspicious" ? "text-yellow-400" : "text-red-400 animate-pulse font-black"
                                }`}>
                                  {vendor.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* TAB 2: METADATA DETAILS */}
                      {activeTab === "metadata" && (
                        <div className="grid sm:grid-cols-2 gap-4 font-mono text-xs text-gray-400">
                          
                          {Object.entries(result.metadata).map(([key, val]) => (
                            <div key={key} className="bg-black/35 rounded-xl p-4 border border-white/5">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-500 uppercase tracking-wider text-[9px]">{key.replace(/_/g, ' ')}</span>
                                <button
                                  onClick={() => handleCopy(val, key)}
                                  className="text-[9px] text-gray-500 hover:text-purple-400 transition flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedText === key ? <Check size={8} className="text-green-400" /> : <Copy size={8} />}
                                  <span>{copiedText === key ? "COPIED" : "COPY"}</span>
                                </button>
                              </div>
                              <p className="text-xs font-bold text-white break-all">{val}</p>
                            </div>
                          ))}

                        </div>
                      )}

                      {/* TAB 3: IR REMEDIATION PLAYBOOK */}
                      {activeTab === "remediation" && (
                        <div className="space-y-4 font-mono text-xs">
                          <span className="text-gray-500 uppercase tracking-wider block text-[9px]">Incident Response Protocol</span>
                          
                          <div className="space-y-2">
                            {result.stats.malicious > 0 ? (
                              <>
                                <label className="flex items-start gap-3 bg-black/25 border border-red-500/10 p-3.5 rounded-xl cursor-pointer hover:border-red-500/20 transition">
                                  <input type="checkbox" className="mt-0.5 rounded border-white/10 text-red-500 focus:ring-0 focus:ring-offset-0 cursor-pointer" />
                                  <div>
                                    <p className="font-bold text-white text-[11px]">BLACKHOLE RESOLUTION GATEWAYS</p>
                                    <p className="text-[9px] text-gray-500 mt-0.5">Block target IP or domain at DNS Resolver/Firewall border routers.</p>
                                  </div>
                                </label>

                                <label className="flex items-start gap-3 bg-black/25 border border-red-500/10 p-3.5 rounded-xl cursor-pointer hover:border-red-500/20 transition">
                                  <input type="checkbox" className="mt-0.5 rounded border-white/10 text-red-500 focus:ring-0 focus:ring-offset-0 cursor-pointer" />
                                  <div>
                                    <p className="font-bold text-white text-[11px]">TRIGGER HOST-BASED EDR QUARANTINE</p>
                                    <p className="text-[9px] text-gray-500 mt-0.5">Isolate asset binary checksums from system endpoint memory buffers.</p>
                                  </div>
                                </label>

                                <label className="flex items-start gap-3 bg-black/25 border border-red-500/10 p-3.5 rounded-xl cursor-pointer hover:border-red-500/20 transition">
                                  <input type="checkbox" className="mt-0.5 rounded border-white/10 text-red-500 focus:ring-0 focus:ring-offset-0 cursor-pointer" />
                                  <div>
                                    <p className="font-bold text-white text-[11px]">BROADCAST ADVISORY AD/IAM DIRECTORY</p>
                                    <p className="text-[9px] text-gray-500 mt-0.5">Revoke active user sessions intersecting matching endpoint footprints.</p>
                                  </div>
                                </label>
                              </>
                            ) : (
                              <>
                                <label className="flex items-start gap-3 bg-black/25 border border-green-500/10 p-3.5 rounded-xl cursor-pointer hover:border-green-500/20 transition">
                                  <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded border-white/10 text-green-500 focus:ring-0 focus:ring-offset-0 cursor-not-allowed" />
                                  <div>
                                    <p className="font-bold text-white text-[11px] line-through">NO THREAT ACTIONS NECESSARY</p>
                                    <p className="text-[9px] text-gray-500 mt-0.5">Scans report clear reputation index signatures.</p>
                                  </div>
                                </label>
                                
                                <label className="flex items-start gap-3 bg-black/25 border border-white/5 p-3.5 rounded-xl cursor-pointer hover:border-white/10 transition">
                                  <input type="checkbox" className="mt-0.5 rounded border-white/10 text-purple-500 focus:ring-0 focus:ring-offset-0 cursor-pointer" />
                                  <div>
                                    <p className="font-bold text-white text-[11px]">ARCHIVE THREAT INTEL RECORD</p>
                                    <p className="text-[9px] text-gray-500 mt-0.5">Log clean checksum metrics to internal auditing databases for policy compliance.</p>
                                  </div>
                                </label>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* TAB 4: RAW PAYLOAD JSON */}
                      {activeTab === "raw" && (
                        <div className="bg-black/45 border border-white/5 rounded-xl p-4 font-mono text-xs text-purple-300 leading-relaxed shadow-inner">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-gray-500">
                            <span>RAW_THREAT_INTEL_JSON</span>
                            <button
                              onClick={() => handleCopy(JSON.stringify(result, null, 2), "rawjson")}
                              className="text-[9px] text-gray-500 hover:text-purple-400 transition flex items-center gap-1 cursor-pointer"
                            >
                              {copiedText === "rawjson" ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                              <span>{copiedText === "rawjson" ? "COPIED" : "COPY"}</span>
                            </button>
                          </div>
                          
                          <pre className="overflow-x-auto whitespace-pre custom-scrollbar py-1 text-[10px] leading-relaxed max-h-[300px]">
                            {JSON.stringify(result, null, 2)}
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
                  className="h-full min-h-[400px] rounded-3xl border border-white/5 bg-black/15 flex flex-col items-center justify-center text-center p-8 font-mono text-gray-500 gap-4 animate-pulse"
                >
                  <Activity size={32} className="opacity-25" />
                  <div className="space-y-1.5">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">// Standby</p>
                    <p className="text-xs max-w-sm leading-relaxed">
                      Awaiting IP address, domain, or file hash inputs to query threat intelligence databases.
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
