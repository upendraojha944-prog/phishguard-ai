"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Smartphone, RefreshCw, Sparkles, Terminal, Activity, ShieldCheck, ShieldAlert, Server, Radio, ShieldX, Cpu, Layers, Globe, User, ListFilter, AlertOctagon, CheckCircle2, Eye, Trash2, X, Copy, Camera, ScanFace, MessageSquareCode, Send, LogOut, Unplug, Loader2, TrendingUp, BarChart2, PieChart, Target, Bell, Download, FileText, FileSpreadsheet } from "lucide-react";
import Sidebar from "./components/Sidebar";
import UrlScanner from "./components/UrlScanner";
import BotWidget from "./components/BotWidget";
import { apiUrl } from "./lib/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "analytics" | "url" | "ocr" | "email" | "sms" | "soar" | "bot" | "profile" | "history">("dashboard");
  const [urlInput, setUrlInput] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [borderEffect, setBorderEffect] = useState("border-blue-500/30");
  const [isSplashLoading, setIsSplashLoading] = useState(true);
  const [scoreData, setScoreData] = useState({ 
    overall_score: 100,
    breakdown: { phishing_emails: 0, fraud_sms: 0, dangerous_urls: 0, ocr_threats: 0 }
  });

  const [chatQuery, setChatQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([
    { sender: "bot", text: "Hello! I am PhishGuard AI. How can I assist your security ops today?" }
  ]);

  // 🤖 1. Secure Bot Send Message Handler Widget
  const handleSendMessage = async () => {
    if (!chatQuery.trim()) return;
    
    const newUserMsg = { sender: "user", text: chatQuery };
    setChatHistory((prev) => [...prev, newUserMsg]);
    setChatQuery("");
    setIsScanning(true);

    try {
      const token = localStorage.getItem("token"); 
      const res = await fetch(apiUrl("/api/v1/bot/chat"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ question: chatQuery }),
      });
      
      if (!res.ok) { // 👈 Fixed: response ki jagah res kiya
         throw new Error("Backend connection failed.");
      }
      
      const data = await res.json(); // 👈 Fixed: response ki jagah res kiya
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: data.response || "No response generated from AI Core." },
      ]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { sender: "bot", text: "Error: AI Core unreachable. Check FastAPI backend." }]);
    } finally {
      setIsScanning(false);
    }
  }; 

  // 🌐 2. Secure Sidebar URL Scan Handler
  const handleScanUrl = async () => {
    if (!urlInput) return;
    setIsScanning(true);
    setScanResult(null);
    setBorderEffect("border-blue-500 animate-pulse");

    try {
      const token = localStorage.getItem("token"); 
      const res = await fetch(apiUrl("/api/v1/scan"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ url: urlInput }),
      });

      if (!res.ok) throw new Error("Scan failed");
      const data = await res.json(); // 👈 Fixed: response ki jagah res kiya
      setScanResult(data);

      if (data.threat_index > 25) {
        setBorderEffect("border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]");
      } else {
        setBorderEffect("border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]");
      }
    } catch (error) {
      console.error("Error scanning URL:", error);
      setBorderEffect("border-red-500/50");
    } finally {
      setIsScanning(false);
    }
  };
  const [currentLang, setCurrentLang] = useState<"en" | "hi" | "hinglish">("en");
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const [isBotOpen, setIsBotOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "USER" | "AI"; text: string; mode?: string }>>([
    { sender: "AI", text: "Welcome Analyst. Ask me anything about Phishing, Firewall configurations, or SOAR rules in English, Hindi, or Hinglish chat style!" }
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const botEndRef = useRef<HTMLDivElement>(null);
    
  const [gmailData, setGmailData] = useState({ connected_email: null, status: "DISCONNECTED", total_in_account: 0, harmful_count: 0, normal_count: 0, emails: [] as any[] });
  const [smsData, setSmsData] = useState({ total_in_account: 0, harmful_count: 0, normal_count: 0, logs: [] as any[] });
  const [soarBlacklist, setSoarBlacklist] = useState<any[]>([]);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  
  const [gmailFilter, setGmailFilter] = useState<"ALL" | "FRAUD" | "SAFE">("ALL");
  const [smsFilter, setSmsFilter] = useState<"ALL" | "FRAUD" | "SAFE">("ALL");

  const [selectedIncidentReport, setSelectedIncidentReport] = useState<string | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  const [severityCounts, setSeverityCounts] = useState({ critical: 0, hg: 0, medium: 0 });
  const [categoryCounts, setCategoryCounts] = useState({ creds: 0, malware: 0, fraud: 0 });
  const router = useRouter();

  const [userProfile, setUserProfile] = useState({
    name: "SOC Analyst",
    email: "analyst@phishguard.ai",
    security_score: 100,
    joined_date: new Date().toISOString(),
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUserProfile(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error loading user:", e);
      }
    }
  }, []);

  const avatarText = userProfile.name  
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    // 1. Local storage se sab kuch saaf karo
    localStorage.clear(); 
    
    // 2. Session storage bhi saaf karo
    sessionStorage.clear();
    
    // 3. Force refresh ke sath login page par bhejo
    window.location.href = "/login";
};

  const [notifications, setNotifications] = useState<Array<{ id: string, type: string, title: string, message: string, time: string, read: boolean }>>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [activeToast, setActiveToast] = useState<any | null>(null);

  const prevHarmfulEmails = useRef(0);
  const prevHarmfulSms = useRef(0);

  const triggerNotification = (type: string, title: string, message: string) => {
    const newNotif = { id: Date.now().toString(), type, title, message, time: new Date().toLocaleTimeString(), read: false };
    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);
    setTimeout(() => setActiveToast(null), 4000); 
  };

  useEffect(() => {
    botEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isBotTyping]);

  const textDict = {
    en: {
      gatewayTitle: "Secure Account Authorization Gateway",
      gatewayDesc: "Link your actual cloud communication servers endpoint scopes for live dynamic scanning execution loops.",
      connectBtn: "Connect Real Gmail Account",
      monitorActive: "Ecosystem Integration Monitoring Active",
      monitorDesc: "Real-time centralized endpoint heuristics vectors analysis tracking intelligence hashes.",
      activeThreats: "Active Threats",
      severityTitle: "SOC Threat Severity Distribution Matrix",
      categoryTitle: "Threat Intel Category Classification",
      gmailCard: "Real-Time Gmail Scanning Metrics",
      smsCard: "Real-Time SMS Intercept Metrics",
      totalMails: "Total Mails",
      totalSms: "Total SMS",
      fraudHits: "Fraud Hits",
      safeClean: "Safe Clean",
      critRisk: "Critical Risk Vector",
      highExp: "High Exposure Alerts",
      medScope: "Medium Risk Scope",
      credHarvest: "Credential Harvest",
      malwareBundles: "Malware Bundles",
      finScam: "Financial Scam"
    },
    hi: {
      gatewayTitle: "सुरक्षित खाता प्राधिकरण गेटवे",
      gatewayDesc: "लाइव डायनेमिक स्कैनिंग निष्पादन छोर के लिए अपने वास्तविक क्लाउड संचार सर्वर को लिंक करें।",
      connectBtn: "वास्तविक Gmail खाता जोड़ें",
      monitorActive: "पारिस्थितिकी तंत्र एकीकरण निगरानी सक्रिय",
      monitorDesc: "रीयल-टाइम केंद्रित एंडपॉइंट हेयुरिस्टिक्स वैक्टर विश्लेषण इंटेलिजेंस हैश को ट्रैक करता है।",
      activeThreats: "सक्रिय खतरे",
      severityTitle: "SOC थ्रेट गंभीरता वितरण मैट्रिक्स",
      categoryTitle: "थ्रेट इंटेल श्रेणी वर्गीकरण",
      gmailCard: "रीयल-टाइम Gmail इनजेशन मेट्रिक्स",
      smsCard: "रीयल-टाइम SMS इंटरसेप्ट मेट्रिक्स",
      totalMails: "कुल मेल्स",
      totalSms: "कुल SMS",
      fraudHits: "धोखाधड़ी हिट्स",
      safeClean: "सुरक्षित / साफ",
      critRisk: "गंभीर जोखिम वेक्टर",
      highExp: "उच्च जोखिम अलर्ट",
      medScope: "मध्यम जोखिम दायरा",
      credHarvest: "क्रेडेंशियल हार्वेस्ट",
      malwareBundles: "मालवेयर बंडल",
      finScam: "वित्तीय धोखाधड़ी"
    },
    hinglish: {
      gatewayTitle: "Secure Account Authorization Gateway",
      gatewayDesc: "Apne real cloud communication servers ko live dynamic scanning loops ke liye yahan link karein.",
      connectBtn: "Connect Real Gmail Account",
      monitorActive: "Ecosystem Integration Monitoring Active Hai",
      monitorDesc: "Real-time algorithms se end-point threats aur intelligence logs track ho rahe hain.",
      activeThreats: "Active Alerts",
      severityTitle: "SOC Threat Severity Metrics Panel",
      categoryTitle: "Threat Intelligence Category Classification",
      gmailCard: "Real-Time Gmail Scanning Metrics",
      smsCard: "Real-Time SMS Intercept Dashboard",
      totalMails: "Total Mails Content",
      totalSms: "Total Intercept SMS",
      fraudHits: "Fraud Hits / Danger",
      safeClean: "Safe / Clean Data",
      critRisk: "Critical Danger Risk",
      highExp: "High Threat Alerts",
      medScope: "Medium Risk Level",
      credHarvest: "ID/Password Stealing",
      malwareBundles: "Malware APK Viruses",
      finScam: "Paisa Fraud Scam"
    }
  };

  // 🔐 LEVEL 4: PROTECTED ROUTE INTERLOCK + MASTER SYNC
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setTimeout(() => setIsSplashLoading(false), 1500);
    fetchLiveEcosystemMetrics();

    const liveInterval = setInterval(() => {
      fetchLiveEcosystemMetrics();
    }, 5000);

    return () => clearInterval(liveInterval);
  }, [router]);

  // 🔐 3. Secure Core Polling Engine (Metrics, Blacklists, Scores)
  const fetchLiveEcosystemMetrics = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const secureHeaders = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const resEmail = await fetch(apiUrl("/api/v1/automation/gmail/inbox"), { headers: secureHeaders });  
      if (resEmail.ok) {
        const emailJson = await resEmail.json();
        if (prevHarmfulEmails.current !== 0 && emailJson.harmful_count > prevHarmfulEmails.current) {
          triggerNotification("EMAIL", "⚠️ New phishing email detected", `Automated SOAR isolated ${emailJson.harmful_count - prevHarmfulEmails.current} new threats.`);
        }
        prevHarmfulEmails.current = emailJson.harmful_count;
        setGmailData(emailJson);
      }
      
      const resSms = await fetch(apiUrl("/api/v1/automation/sms/logs"), { headers: secureHeaders });

      if (resSms.ok) {
        const smsJson = await resSms.json();
        if (prevHarmfulSms.current !== 0 && smsJson.harmful_count > prevHarmfulSms.current) {
          triggerNotification("SMS", "⚠️ Suspicious SMS detected", `Malicious sender intercepted and blocked by AI.`);
        }
        prevHarmfulSms.current = smsJson.harmful_count;
        setSmsData(smsJson);
      }

      const resSoar = await fetch(apiUrl("/api/v1/soar/blacklist"), { headers: secureHeaders });
      if (resSoar.ok) {
        const blacklistData = await resSoar.json();
        setSoarBlacklist(blacklistData);
        calculateSocAnalytics(blacklistData);
      }
      
      const resHistory = await fetch(apiUrl("/api/v1/history/scans"), { headers: secureHeaders });
      if (resHistory.ok) setScanHistory(await resHistory.json());

      const resScore = await fetch(apiUrl("/api/v1/security-score"), { headers: secureHeaders });
      if (resScore.ok) {
        const scoreJson = await resScore.json();
        setScoreData(scoreJson); 
      }

    } catch (err) { 
      console.error("Metrics Update Error:", err); 
    }
  };

  const calculateSocAnalytics = (items: any[]) => {
    // 🔐 FIXED: Galti se yahan character glitch ho gaya tha, ab proper variables hain
    let crit = 0, hg = 0, md = 0;
    let crd = 0, mal = 0, frd = 0;

    items.forEach(item => {
      if (item.severity === "CRITICAL") crit++;
      else if (item.severity === "HIGH") hg++;
      else md++;

      if (item.category === "Credential Harvesting") crd++;
      else if (item.category === "Malware Distribution") mal++;
      else frd++;
    });

    setSeverityCounts({ critical: crit, hg: hg, medium: md });
    setCategoryCounts({ creds: crd, malware: mal, fraud: frd });
  };

  // 🔐 5. Secure Forensic Reports Fetching Channel
  const handleFetchForensicReport = async (incidentId: string) => {
    setIsReportLoading(true);
    setActiveReportId(incidentId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl(`/api/v1/soar/report/${incidentId}`), {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedIncidentReport(data.report_text);
      }
    } catch (err) { console.error(err); }
    setIsReportLoading(false);
  };

  const handleDownloadCSV = () => {
    if (soarBlacklist.length === 0) {
      alert("No active threats in SOAR to export.");
      return;
    }
    const headers = ["Incident ID,Threat Domain/IP,Category,Severity,Vector Trigger,Action Taken"];
    const rows = soarBlacklist.map((item: any) => 
      `${item.id},${item.domain || item.ip},${item.category},${item.severity},${item.source},${item.action_taken}`
    );
    
    const csvContent = headers.concat(rows).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `SOAR_Threat_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadExecutiveReport = () => {
    if (!selectedIncidentReport) return;
    const blob = new Blob([selectedIncidentReport], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Executive_Forensic_Report_${activeReportId}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLocalIncidentDelete = (incidentId: string) => {
    const updatedList = soarBlacklist.filter(item => item.id !== incidentId);
    setSoarBlacklist(updatedList);
    calculateSocAnalytics(updatedList);
  };

  const [disconnecting, setDisconnecting] = useState(false);

  // 🔐 6. Secure Disconnect Mail Scope Channel
  const handleDisconnectGmail = async () => {
    setDisconnecting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/api/v1/auth/gmail/disconnect"), {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if(res.ok) {
        alert("Gmail account successfully disconnected!");
        window.location.reload();
      } else {
        alert("Failed to disconnect Gmail.");
      }
    } catch (error) {
      console.error("Disconnect error:", error);
      alert("Failed to disconnect Gmail.");
    } finally {
      setDisconnecting(false);
    }
  };

  // 🔐 7. Secure Oauth Auth URL Request Scope
  const handleConnectGmailAuthFlow = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/api/v1/auth/google-login"), {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        window.open(data.url, "_blank", "width=600,height=700");
      }
    } catch (err) { console.error(err); }
  };

  // 🔐 8. Secure Unified URL Scan Engine 
  const handleUrlScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setIsScanning(true); setScanResult(null);
    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(apiUrl("/api/v1/scan"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ url: urlInput })
      });
      if (!res.ok) {
        const errorText = await res.text();
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          alert("Session expired. Please login again.");
          router.push("/login");
          return;
        }
        throw new Error(`Server returned ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      
      setTimeout(() => {
        const isSafe = data.threat_index <= 25;
        setScanResult({ 
          status: data.verdict || "Scanned", 
          score: data.threat_index || 0, 
          desc: data.analysis_summary || "Analysis complete", 
          isSafe 
        });
        setIsScanning(false);
        
        if (isSafe) { 
          setBorderEffect("safe"); 
          setTimeout(() => setBorderEffect("none"), 4000); 
        } else { 
          triggerNotification("URL", "⚠️ High-risk URL scanned", `Target endpoint flagged as malicious. Index: ${data.threat_index}`);
          setBorderEffect("malicious"); 
          setTimeout(() => setBorderEffect("none"), 4000); 
        }
        fetchLiveEcosystemMetrics();
      }, 1200);

    } catch (err) { 
      console.error("Scan Error:", err);
      setIsScanning(false);
      alert("Scan failed! Backend terminal check karo.");
    }
  };

  // 🔐 9. Secure Multipart Form Image OCR Scanner 
  const handleOcrScreenshotUploadAndScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setOcrFile(file);
    setIsOcrScanning(true);
    setOcrResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/api/v1/scan/screenshot-ocr"), {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }, // Form-data needs NO manual Content-Type header
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setOcrResult(data);
        setIsOcrScanning(false);
        const isSafe = data.threat_index <= 25;
        if (isSafe) { setBorderEffect("safe"); setTimeout(() => setBorderEffect("none"), 4000); }
        else { setBorderEffect("malicious"); setTimeout(() => setBorderEffect("none"), 4000); }
        fetchLiveEcosystemMetrics();
      } else {
  setIsOcrScanning(false);
  alert("OCR scan failed. Check if python-multipart is installed.");
}
} catch (err) {
  setIsOcrScanning(false);
  console.error("OCR Scan Exception:", err);
}
  };

  // 🔐 10. Secure Main AI Core Bot Interface Channel
  const handleSendChatMessageToBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { sender: "USER", text: userMsg }]);
    setIsBotTyping(true);

    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(apiUrl("/api/v1/bot/chat"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ question: userMsg })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { sender: "AI", text: data.response, mode: data.detected_mode }]);
      }
    } catch (err) { console.error(err); }
    setIsBotTyping(false);
  };

  const t = textDict[currentLang];

  const filteredEmails = gmailData.emails?.filter((email: any) => {
    if (gmailFilter === "FRAUD") return email.is_harmful === true;
    if (gmailFilter === "SAFE") return email.is_harmful === false;
    return true;
  }) || [];

  const filteredSmsLogs = smsData.logs?.filter((log: any) => {
    if (smsFilter === "FRAUD") return log.is_harmful === true;
    if (smsFilter === "SAFE") return log.is_harmful === false;
    return true;
  }) || [];

  return (
    <div className="h-screen w-screen bg-[#040612] text-slate-100 font-sans antialiased overflow-hidden relative flex p-6 sm:p-10 select-none">
      
      <div className="absolute inset-0 pointer-events-none z-50 p-2">
        <svg className="w-full h-full text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.95)]" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M 90,20 L 400,20 L 430,45 L 1490,45 L 1520,20 L 1830,20 L 1900,100 L 1900,980 L 1830,1060 L 1450,1060 L 1420,1035 L 500,1035 L 470,1060 L 90,1060 L 20,980 L 20,100 Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 110,35 L 385,35 L 415,60 L 1505,60 L 1535,35 L 1810,35" stroke="rgba(168,85,247,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 110,1045 L 455,1045 L 485,1020 L 1435,1020 L 1465,1045 L 1810,1045" stroke="rgba(168,85,247,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 15,130 L 15,220 M 1905,130 L 1905,220 M 15,860 L 15,950 M 1905,860 L 1905,950" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="450" cy="52" r="3" fill="currentColor" className="animate-pulse" />
          <line x1="455" y1="52" x2="490" y2="52" stroke="currentColor" strokeWidth="2" />
          <circle cx="1470" cy="52" r="3" fill="currentColor" className="animate-pulse" />
          <line x1="1465" y1="52" x2="1430" y2="52" stroke="currentColor" strokeWidth="2" />
          <path d="M 600,1048 Q 630,1055 660,1048 T 720,1048 T 780,1048 T 840,1048 T 900,1048" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 1020,1048 Q 1050,1055 1080,1048 T 1140,1048 T 1200,1048 T 1260,1048 T 1320,1048" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-cyber-grid pointer-events-none z-0 opacity-70" />
      <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none z-0" />

      {borderEffect === "malicious" && <div className="absolute inset-0 z-[100] border-[10px] border-red-500 pointer-events-none shadow-[0_0_50px_rgba(239,68,68,0.3)_inset]" />}
      {borderEffect === "safe" && <div className="absolute inset-0 z-[100] border-[10px] border-emerald-500 pointer-events-none shadow-[0_0_50px_rgba(16,185,129,0.3)_inset]" />}

      <div className="w-full h-full flex overflow-hidden rounded-xl bg-[#040612]/20 relative z-10 p-2 sm:p-4">

        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          fetchLiveEcosystemMetrics={fetchLiveEcosystemMetrics} 
        />

        <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden relative z-10 pl-5">
          
          <header className="w-full h-16 border-b border-indigo-500/10 pr-6 sm:pr-10 flex items-center justify-end gap-4 bg-[#040612]/30 backdrop-blur-md z-40 flex-shrink-0">
            
            <div className="flex items-center space-x-1.5 bg-slate-950/60 border border-indigo-500/10 px-3 py-1.5 rounded-xl transition-all duration-200 hover:border-cyan-500/30">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <select value={currentLang} onChange={(e) => setCurrentLang(e.target.value as "en" | "hi" | "hinglish")} className="bg-transparent text-xs font-bold text-slate-300 focus:outline-none cursor-pointer">
                <option value="en" className="bg-[#040612] text-slate-300">English</option>
                <option value="hinglish" className="bg-[#040612] text-slate-300">Hinglish / चैट स्टाइल</option>
                <option value="hi" className="bg-[#040612] text-slate-300">Hindi / हिंदी</option>
              </select>
            </div>

            <div className="relative z-50">
              <button onClick={() => setShowNotifMenu(!showNotifMenu)} className="relative p-2 rounded-xl bg-[#040612]/60 border border-indigo-500/20 hover:border-cyan-500/40 transition-all">
                <Bell className="w-4 h-4 text-cyan-400" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-[#040612]"></span>
                  </span>
                )}
              </button>

              {showNotifMenu && (
                 <div className="absolute top-full right-0 mt-3 w-80 bg-[#060a17]/95 backdrop-blur-2xl border border-indigo-500/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-indigo-500/20 flex justify-between items-center bg-slate-950/80">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2"><Bell className="w-3 h-3 text-cyan-400"/> System Alerts</span>
                        <button onClick={() => {setNotifications(n => n.map(x => ({...x, read: true}))); setShowNotifMenu(false);}} className="text-[9px] text-cyan-400 hover:text-cyan-300 font-bold uppercase border border-cyan-500/20 px-2 py-1 rounded bg-cyan-500/10">Clear All</button>
                    </div>
                    <div className="max-h-72 overflow-y-auto p-2 space-y-2 scrollbar-thin">
                        {notifications.length === 0 ? (
                          <div className="text-[10px] text-slate-500 text-center p-6 uppercase tracking-widest font-bold">No active threats</div>
                        ) : notifications.map(n => (
                          <div key={n.id} className={`p-3 rounded-xl border transition-all ${n.read ? "bg-[#040612]/40 border-indigo-500/10" : "bg-red-500/10 border-red-500/30 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]"}`}>
                            <h4 className={`text-[10px] font-black uppercase tracking-wider ${n.read ? "text-slate-300" : "text-red-400"}`}>{n.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-1 font-mono leading-relaxed">{n.message}</p>
                            <span className="text-[8px] text-slate-600 block mt-2 font-bold">{n.time}</span>
                          </div>
                        ))}
                    </div>
                 </div>
              )}
            </div>

            <div className="flex items-center space-x-2.5 border-l border-indigo-500/10 pl-4">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-black text-white block">{userProfile.name}</span>
                <span className="text-[9px] font-bold text-cyan-400/80 font-mono block uppercase tracking-wider">SOC Analyst</span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                <span className="text-[10px] font-black text-slate-950">{avatarText}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-6 w-full">
            <div className="max-w-4xl w-full mx-auto space-y-8 pb-12">
              
              {activeTab === "dashboard" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-1 mb-6 pl-1">
                    <div className="text-[10px] font-black text-cyan-400 tracking-widest uppercase">ECOSYSTEM OPERATIONAL WORKSPACE</div>
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase">OVERVIEW MONITOR</h1>
                  </div>

                  <div className="backdrop-blur-md bg-[#080c1b]/60 border border-blue-500/20 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(59,130,246,0.2),inset_0_0_20px_rgba(59,130,246,0.15)]">
                    <div className="space-y-1">
                      <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-cyan-400" /><span>{t.gatewayTitle}</span></h3>
                      <p className="text-xs text-slate-400 font-medium">{t.gatewayDesc}</p>
                      {gmailData.status === "CONNECTED" && (
                        <div className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-md border border-emerald-500/20 w-fit mt-1.5 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)] flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                          </span>
                          <span>ACTIVE CONNECTED MAILBOX: {gmailData.connected_email}</span>
                        </div>
                      )}
                    </div>
                    
                    {gmailData.status === "CONNECTED" ? (
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase rounded-xl tracking-wider select-none shadow-[inset_0_0_10px_rgba(16,185,129,0.1)] flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                          </span>
                          <span>Verified Sync Active</span>
                        </div>
                        
                        <button
                          onClick={handleDisconnectGmail}
                          disabled={disconnecting}
                          className="relative group px-4 py-2.5 border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-[10px] font-black tracking-widest uppercase rounded-xl shadow-[0_0_10px_rgba(239,68,68,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          title="Sever link with current Gmail account"
                        >
                          {disconnecting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Unplug className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          )}
                          SEVER CONNECTION
                        </button>
                      </div>
                    ) : (
                      <button onClick={handleConnectGmailAuthFlow} className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs rounded-xl shadow-xl shadow-cyan-500/10 whitespace-nowrap hover:brightness-110 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition duration-300">{t.connectBtn}</button>
                    )}
                  </div>

                  <div className="backdrop-blur-md bg-[#080c1b]/60 border border-cyan-500/20 shadow-[inset_0_0_25px_rgba(6,182,212,0.1)] p-6 rounded-2xl flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(6,182,212,0.2),inset_0_0_25px_rgba(6,182,212,0.15)]">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 rounded-xl border transition-all duration-300 bg-cyan-500/10 border-cyan-500/20 text-cyan-400 shadow-[inset_0_0_15px_rgba(6,182,212,0.15)]"><Shield className="w-6 h-6" /></div>
                      <div><h2 className="text-sm font-extrabold text-white">{t.monitorActive}</h2><p className="text-[11px] text-slate-400 mt-0.5">{t.monitorDesc}</p></div>
                    </div>
                    <div className="text-center border-l border-indigo-500/10 pl-8"><span className="text-4xl font-black text-red-500 tracking-tight drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]">{gmailData.harmful_count + smsData.harmful_count}</span><div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">{t.activeThreats}</div></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="backdrop-blur-md bg-[#080c1b]/60 border border-rose-500/20 shadow-[inset_0_0_20px_rgba(244,63,94,0.08)] rounded-2xl p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(244,63,94,0.2),inset_0_0_20px_rgba(244,63,94,0.15)]">
                      <div className="text-xs font-bold uppercase text-slate-200 flex items-center gap-2"><Cpu className="w-4 h-4 text-red-400" /><span>{t.severityTitle}</span></div>
                      <div className="space-y-3 border-t border-indigo-500/10 pt-3">
                        <div>
                          <div className="flex justify-between text-[10px] uppercase font-bold text-red-500 mb-1"><span>{t.critRisk}</span><span>{severityCounts.critical} Hits</span></div>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden"><div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${soarBlacklist.length > 0 ? (severityCounts.critical / soarBlacklist.length) * 100 : 0}%` }} /></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] uppercase font-bold text-orange-400 mb-1"><span>{t.highExp}</span><span>{severityCounts.hg} Hits</span></div>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden"><div className="h-full bg-orange-400 transition-all duration-500" style={{ width: `${soarBlacklist.length > 0 ? (severityCounts.hg / soarBlacklist.length) * 100 : 0}%` }} /></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] uppercase font-bold text-yellow-400 mb-1"><span>{t.medScope}</span><span>{severityCounts.medium} Hits</span></div>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 transition-all duration-500" style={{ width: `${soarBlacklist.length > 0 ? (severityCounts.medium / soarBlacklist.length) * 100 : 0}%` }} /></div>
                        </div>
                      </div>
                    </div>

                    <div className="backdrop-blur-md bg-[#080c1b]/60 border border-cyan-500/20 shadow-[inset_0_0_20px_rgba(6,182,212,0.08)] rounded-2xl p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(6,182,212,0.2),inset_0_0_20px_rgba(6,182,212,0.15)]">
                      <div className="text-xs font-bold uppercase text-slate-200 flex items-center gap-2"><Layers className="w-4 h-4 text-cyan-400" /><span>{t.categoryTitle}</span></div>
                      <div className="grid grid-cols-3 gap-2 text-center border-t border-indigo-500/10 pt-4">
                        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-indigo-500/10 shadow-[inset_0_0_10px_rgba(239,68,68,0.05)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                          <span className="text-xl font-black text-red-400 block tracking-tight">{categoryCounts.creds}</span>
                          <span className="text-[7px] text-slate-400 uppercase font-bold block mt-1 tracking-tight">{t.credHarvest}</span>
                        </div>
                        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-indigo-500/10 shadow-[inset_0_0_10px_rgba(251,146,60,0.05)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(251,146,60,0.2)]">
                          <span className="text-xl font-black text-orange-400 block tracking-tight">{categoryCounts.malware}</span>
                          <span className="text-[7px] text-slate-400 uppercase font-bold block mt-1 tracking-tight">{t.malwareBundles}</span>
                        </div>
                        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-indigo-500/10 shadow-[inset_0_0_10px_rgba(250,204,21,0.05)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                          <span className="text-xl font-black text-yellow-400 block tracking-tight">{categoryCounts.fraud}</span>
                          <span className="text-[7px] text-slate-400 uppercase font-bold block mt-1 tracking-tight">{t.finScam}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-1 mb-6 pl-1">
                    <div className="text-[10px] font-black text-cyan-400 tracking-widest uppercase">STATISTICAL INTELLIGENCE</div>
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase">ANALYTICS DASHBOARD</h1>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="backdrop-blur-md bg-[#080c1b]/60 border border-indigo-500/20 shadow-[inset_0_0_15px_rgba(99,102,241,0.05)] rounded-2xl p-5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Total Scans</p>
                        <p className="text-2xl font-black text-white mt-1">{scanHistory.length + gmailData.total_in_account + smsData.total_in_account}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                        <Activity className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="backdrop-blur-md bg-[#080c1b]/60 border border-red-500/20 shadow-[inset_0_0_15px_rgba(239,68,68,0.05)] rounded-2xl p-5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Threats Blocked</p>
                        <p className="text-2xl font-black text-red-400 mt-1">{soarBlacklist.length + gmailData.harmful_count + smsData.harmful_count}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-500">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="backdrop-blur-md bg-[#080c1b]/60 border border-emerald-500/20 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)] rounded-2xl p-5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Mitigation Rate</p>
                        <p className="text-2xl font-black text-emerald-400 mt-1">100%</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="backdrop-blur-md bg-[#080c1b]/60 border border-cyan-500/20 shadow-[inset_0_0_20px_rgba(6,182,212,0.08)] rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <BarChart2 className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Monthly Threat Volume</h2>
                      </div>
                      
                      <div className="h-48 flex items-end justify-between gap-2 px-2 mt-4">
                        {Array.from({ length: 6 }).map((_, i) => {
                          const d = new Date();
                          d.setMonth(d.getMonth() - (5 - i));
                          const monthName = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                          const pastDummyData = [25, 45, 20, 60, 40]; 
                          const currentRealData = Math.min((soarBlacklist.length * 10) + (gmailData.harmful_count * 5) + (smsData.harmful_count * 5) + 10, 100);
                          const val = i === 5 ? currentRealData : pastDummyData[i];
                          
                          return { month: monthName, val };
                        }).map((data, i) => (
                          <div key={i} className="flex flex-col items-center w-full h-full group">
                            <div className="w-full relative flex justify-center items-end flex-1">
                              <div className="absolute opacity-0 group-hover:opacity-100 -top-8 bg-slate-900 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold py-1 px-2 rounded transition-opacity z-10 pointer-events-none">
                                {data.val}
                              </div>
                              <div 
                                className="w-full max-w-[40px] bg-gradient-to-t from-cyan-900/40 to-cyan-400/80 rounded-t-sm border-t-2 border-cyan-300 transition-all duration-500 group-hover:to-cyan-300 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                                style={{ height: `${data.val}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase mt-2 shrink-0">{data.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="backdrop-blur-md bg-[#080c1b]/60 border border-purple-500/20 shadow-[inset_0_0_20px_rgba(168,85,247,0.08)] rounded-2xl p-6 flex flex-col">
                      <div className="flex items-center gap-2 mb-6">
                        <PieChart className="w-5 h-5 text-purple-400" />
                        <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Attack Categories</h2>
                      </div>
                      <div className="flex-1 flex flex-col justify-center space-y-5">
                        {[
                          { label: 'Credential Harvesting', count: categoryCounts.creds || 12, color: 'bg-red-500' },
                          { label: 'Malware Distribution', count: categoryCounts.malware || 8, color: 'bg-orange-500' },
                          { label: 'Financial Scam', count: categoryCounts.fraud || 15, color: 'bg-yellow-500' },
                        ].map((cat, i) => {
                          const total = (categoryCounts.creds || 12) + (categoryCounts.malware || 8) + (categoryCounts.fraud || 15);
                          const percentage = Math.round((cat.count / total) * 100);
                          return (
                            <div key={i} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
                                <span>{cat.label}</span>
                                <span className="text-slate-500">{percentage}%</span>
                              </div>
                              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                <div className={`h-full ${cat.color} shadow-[0_0_10px_currentColor]`} style={{ width: `${percentage}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-md bg-[#080c1b]/60 border border-rose-500/20 shadow-[inset_0_0_20px_rgba(244,63,94,0.08)] rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Target className="w-5 h-5 text-rose-400" />
                      <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Top Threat Sources (IOCs)</h2>
                    </div>
                    <div className="space-y-3">
                      {soarBlacklist.length > 0 ? (
                        soarBlacklist.slice(0, 5).map((threat, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-[#040612]/60 border border-rose-500/10 rounded-xl hover:border-rose-500/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-black text-rose-500 bg-rose-500/10 px-2 py-1 rounded">#{i + 1}</span>
                              <span className="text-xs text-slate-300 font-mono tracking-wide">{threat.domain || threat.ip}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                              {threat.category}
                            </span>
                          </div>
                        ))
                      ) : (
                        ['secure-update-icici.com', '192.168.45.21 (Malware Botnet)', 'free-lottery-winner.net'].map((source, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-[#040612]/60 border border-rose-500/10 rounded-xl">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-black text-rose-500 bg-rose-500/10 px-2 py-1 rounded">#{i + 1}</span>
                              <span className="text-xs text-slate-300 font-mono tracking-wide">{source}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                              Intercepted
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "profile" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-1 mb-6 pl-1">
                    <div className="text-[10px] font-black text-cyan-400 tracking-widest uppercase">ACCOUNT CONTROL</div>
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase">USER PROFILE</h1>
                  </div>

                  <div className="bg-[#080c1b]/70 border border-cyan-500/20 rounded-2xl p-6 shadow-[inset_0_0_25px_rgba(6,182,212,0.08)]">
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center text-slate-950 text-2xl font-black">
                        {avatarText}
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white">{userProfile.name}</h2>
                        <p className="text-sm text-slate-400">{userProfile.email}</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-[#040612]/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-center">
                        <p className="text-xs uppercase font-black text-slate-500 mb-2">Overall Security Score</p>
                        <div className="flex items-end gap-3">
                          <p className={`text-5xl font-black tracking-tighter ${scoreData.overall_score > 70 ? 'text-emerald-400' : scoreData.overall_score > 40 ? 'text-orange-400' : 'text-red-500'}`}>
                            {scoreData.overall_score}
                          </p>
                          <span className="text-slate-500 font-bold mb-1">/ 100</span>
                        </div>
                      </div>

                      <div className="bg-[#040612]/70 border border-slate-800 rounded-xl p-4">
                        <p className="text-[10px] uppercase font-black text-slate-500 mb-3 border-b border-slate-800 pb-2">Score Penalties Based On:</p>
                        <div className="space-y-2 text-xs font-mono">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Phishing Emails</span>
                            <span className="text-red-400 font-bold">{scoreData.breakdown.phishing_emails} Detected</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Fraud SMS</span>
                            <span className="text-red-400 font-bold">{scoreData.breakdown.fraud_sms} Detected</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Dangerous URLs</span>
                            <span className="text-red-400 font-bold">{scoreData.breakdown.dangerous_urls} Detected</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">OCR Threats</span>
                            <span className="text-red-400 font-bold">{scoreData.breakdown.ocr_threats} Detected</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="mt-6 w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500 hover:text-white font-black py-3 rounded-xl transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      LOGOUT
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "url" && (
                <UrlScanner 
                  urlInput={urlInput}
                  setUrlInput={setUrlInput}
                  isScanning={isScanning}
                  handleScanUrl={handleUrlScan}
                  scanResult={scanResult}
                  borderEffect={borderEffect}
                />
              )}

              {activeTab === "ocr" && (
                <div className="space-y-6 animate-in fade-in duration-200 relative">
                  <div className="space-y-1 mb-6 pl-1">
                    <div className="text-[10px] font-black text-cyan-400 tracking-widest uppercase">ECOSYSTEM OPERATIONAL WORKSPACE</div>
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase">IMAGE OCR SCANNER</h1>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2 pl-1">
                    <Camera className="w-4 h-4 text-slate-400" />
                    <h3 className="text-base font-bold text-slate-200 tracking-wide">Image OCR Threat Scanner</h3>
                  </div>
                  <p className="text-xs text-slate-400 pl-1 -mt-4 mb-4">
                    Upload screen captures from WhatsApp/SMS to extract text vectors and decode hidden payloads.
                  </p>

                  <div className="bg-[#080c1b]/30 border border-[#141b38] rounded-xl p-5 shadow-xl relative">
                    {isOcrScanning && (
                      <div className="absolute inset-0 z-50 bg-[#040612]/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center animate-in fade-in">
                        <div className="relative w-24 h-24 mb-6">
                          <div className="absolute inset-0 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                          <Cpu className="absolute inset-0 m-auto w-8 h-8 text-cyan-400 animate-pulse" />
                        </div>
                        <h3 className="text-[11px] font-black text-white uppercase tracking-widest animate-pulse">Running Forensic Analysis...</h3>
                        <p className="text-[9px] text-slate-500 font-mono mt-1">Decoding Image Vectors & Extracting Metadata...</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="border border-[#1e295d]/30 bg-[#050814]/70 rounded-xl p-5 relative">
                        <div className="text-[10px] font-bold text-slate-400 tracking-widest mb-3.5 uppercase">SELECT THREAT SNAPSHOT FILE:</div>
                        <div className="border border-dashed border-[#1e295d]/50 hover:border-cyan-500/40 rounded-lg p-12 text-center relative bg-[#040612]/40 transition-colors flex flex-col items-center justify-center min-h-[150px]">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleOcrScreenshotUploadAndScan} 
                            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                          />
                          <div className="flex items-center gap-2.5 text-slate-300 font-medium text-xs">
                            <Camera className="w-4 h-4 text-slate-400" />
                            <span className="truncate max-w-[320px]">{ocrFile ? ocrFile.name : "Drop or Browse Screenshot Image."}</span>
                          </div>
                        </div>

                        <div className="text-center mt-4 text-[9px] font-bold text-slate-500 tracking-wider uppercase">
                          {isOcrScanning ? <span className="text-cyan-400 animate-pulse">EXTRACTING HINDI/ENGLISH INTEL LOGS...</span> : "SUPPORTS MULTI-LINGUAL ENGLISH, HINDI & CHAT HINGLISH TRANSLATIONS"}
                        </div>
                      </div>

                      <button 
                        disabled={isOcrScanning || !ocrFile}
                        onClick={() => {
                          const ocrForm = document.querySelector('input[type="file"]') as HTMLInputElement;
                          if(ocrForm && ocrForm.files && ocrForm.files.length > 0) {
                            const mockInputEvent = { target: { files: ocrForm.files } } as any;
                            handleOcrScreenshotUploadAndScan(mockInputEvent);
                          }
                        }}
                        className="w-full py-3 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-800 disabled:to-slate-700 text-white font-bold text-xs tracking-widest uppercase rounded-xl transition-all shadow-md"
                      >
                        {isOcrScanning ? "Executing OCR Parsing Protocol..." : "Execute OCR Parsing Protocol"}
                      </button>
                    </div>
                  </div>

                  {ocrResult && !isOcrScanning && (
                    <div className={`p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${ocrResult.threat_index > 30 ? "bg-red-500/5 border-red-500/20 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]" : "bg-emerald-500/5 border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]"} space-y-4 animate-in slide-in-from-bottom-3 duration-300`}>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-indigo-500/10 pb-3">
                        <div className="space-y-1">
                          <div className={`flex items-center space-x-2 font-extrabold text-sm uppercase tracking-wide ${ocrResult.threat_index > 30 ? "text-red-400" : "text-emerald-400"}`}>
                            <ScanFace className="w-5 h-5" />
                            <span>{ocrResult.verdict}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium font-mono">{ocrResult.analysis_summary}</p>
                        </div>
                        <div className="bg-slate-950/80 px-4 py-2 rounded-xl text-center min-w-[90px] border border-indigo-500/10">
                          <span className={`text-2xl font-black block leading-none tracking-tight ${ocrResult.threat_index > 30 ? "text-red-500" : "text-emerald-400"}`}>{ocrResult.threat_index}</span>
                          <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mt-1 block">Risk Score</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 bg-[#03050e]/60 border border-indigo-500/10 p-4 rounded-xl">
                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-wider block">Extracted Image Text Content (OCR Data Log):</span>
                        <p className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap select-text">{ocrResult.extracted_text}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="bg-slate-950/40 border border-indigo-500/10 p-3 rounded-xl transition-all duration-200 hover:border-red-500/30">
                          <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Extracted Core Threat URLs:</span>
                          {ocrResult.detected_urls?.map((u: string, idx: number) => (
                            <span key={idx} className="text-red-400 font-bold block break-all">{u}</span>
                          ))}
                        </div>
                        <div className="bg-slate-950/40 border border-indigo-500/10 p-3 rounded-xl transition-all duration-200 hover:border-cyan-500/30">
                          <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Target Source Sender / Identity Labels:</span>
                          {ocrResult.detected_numbers?.map((n: string, idx: number) => (
                            <span key={idx} className="text-cyan-400 font-bold block">{n}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "bot" && (
                <div className="space-y-4 animate-in fade-in duration-200 flex flex-col h-[550px]">
                  <div className="space-y-1 mb-6 pl-1 flex-shrink-0">
                    <div className="text-[10px] font-black text-cyan-400 tracking-widest uppercase">ECOSYSTEM OPERATIONAL WORKSPACE</div>
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase">AI SECURITY BOT</h1>
                  </div>

                  <div className="space-y-1 flex-shrink-0">
                    <h2 className="text-lg font-black text-white flex items-center gap-2"><MessageSquareCode className="w-5 h-5 text-indigo-400" /><span>AI Security Bot Terminal</span></h2>
                    <p className="text-xs text-slate-400">Interact with full-scale multi-lingual adaptive core framework intelligence model layout.</p>
                  </div>

                  <div className="flex-1 backdrop-blur-md bg-[#080c1b]/60 border border-indigo-500/20 shadow-[inset_0_0_25px_rgba(99,102,241,0.1)] rounded-2xl p-4 overflow-y-auto space-y-4 font-sans text-xs transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.18)]">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.sender === "USER" ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md border font-medium leading-relaxed transition-all duration-300 ${msg.sender === "USER" ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 border-cyan-400/20 rounded-tr-none shadow-[0_4px_15px_rgba(6,182,212,0.2)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.4)]" : "bg-slate-950/80 border-indigo-500/10 text-slate-200 rounded-tl-none"}`}>
                          <p className={msg.sender === "AI" ? "font-mono text-[11px]" : ""}>{msg.text}</p>
                        </div>
                        {msg.mode && (
                          <span className="text-[7px] uppercase font-black text-indigo-400 mt-1 tracking-widest px-1">Detected Language Mode: {msg.mode}</span>
                        )}
                      </div>
                    ))}
                    {isBotTyping && (
                      <div className="text-[10px] font-bold text-cyan-400 animate-pulse bg-cyan-500/5 border border-cyan-500/10 px-3 py-1.5 rounded-xl w-fit">
                        🤖 Analyzing linguistic signatures & compiling intelligence...
                      </div>
                    )}
                    <div ref={botEndRef} />
                  </div>

                  <form onSubmit={handleSendChatMessageToBot} className="flex gap-2 flex-shrink-0 bg-slate-950/60 p-3 rounded-xl border border-indigo-500/10">
                    <input 
                      type="text" 
                      placeholder="Ask security bot..." 
                      value={chatInput} 
                      onChange={(e) => setChatInput(e.target.value)} 
                      className="flex-1 bg-[#040612] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-medium placeholder-slate-600" 
                    />
                    <button type="submit" className="p-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 font-black rounded-xl hover:brightness-110 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition duration-300 shadow-md">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "email" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1 mb-6 pl-1">
                    <div className="text-[10px] font-black text-cyan-400 tracking-widest uppercase">ECOSYSTEM OPERATIONAL WORKSPACE</div>
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase">GMAIL SECURITY</h1>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div onClick={() => setGmailFilter("ALL")} className={`border p-4 rounded-2xl flex items-center space-x-4 cursor-pointer backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 ${gmailFilter === "ALL" ? "bg-blue-950/40 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.25)]" : "bg-[#080c1b]/60 border-indigo-500/10 shadow-[inset_0_0_15px_rgba(99,102,241,0.05)] hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]"}`}>
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400"><ListFilter className="w-5 h-5" /></div>
                      <div>
                        <span className="text-xl font-black text-white block leading-none tracking-tight">{gmailData.total_in_account}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-1 block">{t.totalMails}</span>
                      </div>
                    </div>

                    <div onClick={() => setGmailFilter("FRAUD")} className={`border p-4 rounded-2xl flex items-center space-x-4 cursor-pointer backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 ${gmailFilter === "FRAUD" ? "bg-red-950/40 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]" : "bg-[#080c1b]/60 border-indigo-500/10 shadow-[inset_0_0_15px_rgba(239,68,68,0.05)] hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]"}`}>
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500"><AlertOctagon className="w-5 h-5" /></div>
                      <div>
                        <span className="text-xl font-black text-red-500 block leading-none tracking-tight">{gmailData.harmful_count}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-1 block">{t.fraudHits}</span>
                      </div>
                    </div>

                    <div onClick={() => setGmailFilter("SAFE")} className={`border p-4 rounded-2xl flex items-center space-x-4 cursor-pointer backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 ${gmailFilter === "SAFE" ? "bg-emerald-950/40 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]" : "bg-[#080c1b]/60 border-indigo-500/10 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]"}`}>
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400"><CheckCircle2 className="w-5 h-5" /></div>
                      <div>
                        <span className="text-xl font-black text-emerald-400 block leading-none tracking-tight">{gmailData.normal_count}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-1 block">{t.safeClean}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Isolated Mailbox Ingestion Stream</h3>
                    {filteredEmails.map((email: any) => (
                      <div 
                        key={email.id} 
                        className={`backdrop-blur-md bg-[#080c1b]/60 p-4 rounded-2xl flex items-center justify-between border-l-4 transition-all duration-300 ${
                          email.is_harmful 
                            ? "border-l-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] border-red-500/60" 
                            : "border-l-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] border-emerald-500/60"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] text-slate-400 font-bold block truncate">{email.sender}</span>
                          <span className="text-xs text-white font-extrabold block truncate mt-0.5">{email.subject}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "sms" && (
  <div className="space-y-6 animate-in fade-in duration-200">
    <div className="space-y-1 mb-6 pl-1">
      <div className="text-[10px] font-black text-cyan-400 tracking-widest uppercase">ECOSYSTEM OPERATIONAL WORKSPACE</div>
      <h1 className="text-3xl font-black tracking-tight text-white uppercase">SMS SECURITY</h1>
    </div>

    {/* Metric Counter Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div onClick={() => setSmsFilter("ALL")} className={`border p-4 rounded-2xl flex items-center space-x-4 cursor-pointer backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 ${smsFilter === "ALL" ? "bg-cyan-950/40 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]" : "bg-[#080c1b]/60 border-indigo-500/10 shadow-[inset_0_0_15px_rgba(99,102,241,0.05)] hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]"}`}>
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400"><ListFilter className="w-5 h-5" /></div>
        <div>
          <span className="text-xl font-black text-white block tracking-tight">{smsData.total_in_account}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-1 block">{t.totalSms}</span>
        </div>
      </div>

      <div onClick={() => setSmsFilter("FRAUD")} className={`border p-4 rounded-2xl flex items-center space-x-4 cursor-pointer backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 ${smsFilter === "FRAUD" ? "bg-red-950/40 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]" : "bg-[#080c1b]/60 border-indigo-500/10 shadow-[inset_0_0_15px_rgba(239,68,68,0.05)] hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]"}`}>
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500"><AlertOctagon className="w-5 h-5" /></div>
        <div>
          <span className="text-xl font-black text-red-500 block leading-none tracking-tight">{smsData.harmful_count}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-1 block">{t.fraudHits}</span>
        </div>
      </div>

      <div onClick={() => setSmsFilter("SAFE")} className={`border p-4 rounded-2xl flex items-center space-x-4 cursor-pointer backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 ${smsFilter === "SAFE" ? "bg-emerald-950/40 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]" : "bg-[#080c1b]/60 border-indigo-500/10 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]"}`}>
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400"><CheckCircle2 className="w-5 h-5" /></div>
        <div>
          <span className="text-xl font-black text-emerald-400 block leading-none tracking-tight">{smsData.normal_count}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-1 block">{t.safeClean}</span>
        </div>
      </div>
    </div>

    {/* SMS Stream Logs Section */}
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Simulated Threat SMS Stream Logs</h3>
      {filteredSmsLogs.map((log: any, idx: number) => {
        // Yeh line check karegi agar backend se koi bhi variable mein time aa raha ho
        const exactSmsTime = log.timestamp || log.time || log.created_at;

        return (
          <div 
            key={idx} 
            className={`backdrop-blur-md bg-[#080c1b]/60 p-4 rounded-2xl flex flex-col border-l-4 transition-all duration-300 ${
              log.is_harmful 
                ? "border-l-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)] border-red-500/60" 
                : "border-l-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)] border-emerald-500/60"
            }`}
          >
            {/* Top Row: Sender & Timestamp */}
            <div className="flex justify-between items-center w-full border-b border-slate-800/40 pb-2 mb-2">
              <span className="text-[11px] text-slate-400 font-bold">
                Sender: <span className="font-mono text-cyan-400">{log.sender}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {exactSmsTime ? new Date(exactSmsTime).toLocaleString('en-IN') : "Simulated Log"}
              </span>
            </div>

            {/* Middle Row: Message Text */}
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white font-medium font-mono tracking-wide mt-1 bg-black/20 p-2 rounded border border-slate-900/30 break-words">
                {log.message}
              </p>
            </div>

            {/* Bottom Row: Threat Indicator Status */}
            <div className="mt-2 flex items-center">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${
                log.is_harmful ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
              }`}>
                {log.is_harmful ? "⚠️ THREAT DETECTED" : "✅ VERIFIED CLEAN"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

              {activeTab === "history" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1 mb-6 pl-1">
                    <div className="text-[10px] font-black text-cyan-400 tracking-widest uppercase">PERMANENT SCAN LEDGER</div>
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase">SCAN HISTORY</h1>
                  </div>

                  {scanHistory.length === 0 ? (
                    <div className="text-center p-10 backdrop-blur-md bg-[#080c1b]/40 border border-dashed border-cyan-900/40 rounded-2xl text-slate-400 text-xs italic">
                      No scan history available yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {scanHistory.map((item: any) => (
                        <div 
                          key={item.id} 
                          className={`bg-[#080c1b]/70 border-l-4 p-5 rounded-2xl transition-all duration-300 ${
                            item.risk_score > 50 
                              ? "border-l-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] border-red-500/30" 
                              : "border-l-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] border-emerald-500/30"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[9px] font-black px-2 py-1 rounded bg-slate-900 text-slate-300">{item.scan_type}</span>
                                <span className={item.risk_score > 50 ? "text-red-400 text-[9px] font-black" : "text-emerald-400 text-[9px] font-black"}>
                                  {item.verdict}
                                </span>
                              </div>
                              <h2 className="text-sm font-black text-white break-all">{item.title}</h2>
                              <p className="text-[11px] text-slate-400 line-clamp-2">{item.summary}</p>
                            </div>
                            
                            <button 
                              onClick={() => {
                                  const updated = scanHistory.filter(s => s.id !== item.id);
                                  setScanHistory(updated);
                              }}
                              className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "soar" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 pl-1">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-cyan-400 tracking-widest uppercase">ECOSYSTEM OPERATIONAL WORKSPACE</div>
                      <h1 className="text-3xl font-black tracking-tight text-white uppercase">SOAR FIREWALL</h1>
                    </div>
                    
                    <button 
                      onClick={handleDownloadCSV}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 text-xs font-black rounded-xl hover:brightness-110 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition duration-200 flex items-center gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4" /> EXPORT THREATS (CSV)
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-lg font-black text-red-400 flex items-center gap-2"><Server className="w-5 h-5" /><span>SOAR Automated Incident Remediation Center</span></h2>
                    <p className="text-xs text-slate-400">Real-time network firewall isolation matrix mapping attacker infrastructure hashes.</p>
                  </div>

                  {soarBlacklist.length === 0 ? (
                    <div className="text-center p-10 backdrop-blur-md bg-[#080c1b]/40 border border-dashed border-red-900/40 rounded-2xl text-slate-400 text-xs italic">No attacker infrastructure active in blacklist registry.</div>
                  ) : (
                    <div className="space-y-4">
                      {soarBlacklist.map((incident: any) => (
                        <div 
                          key={incident.id} 
                          className={`backdrop-blur-md bg-[#080c1b]/80 border-l-4 p-5 rounded-2xl flex flex-col md:flex-row items-start justify-between gap-4 transition-all duration-300 hover:-translate-y-1 ${
                            incident.severity === "CRITICAL" || incident.severity === "HIGH"
                              ? "border-l-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                              : "border-l-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                          }`}
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-black font-mono bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded">{incident.id}</span>
                              <span className="text-xs font-black text-slate-100 font-mono tracking-tight">{incident.domain}</span>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${incident.severity === "CRITICAL" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"}`}>{incident.severity}</span>
                            </div>
                            <div className="text-[11px] font-medium text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                              <div><span className="text-slate-500 uppercase text-[9px] font-bold">Target IP:</span> <span className="text-cyan-400 font-mono">{incident.ip}</span></div>
                              <div><span className="text-slate-500 uppercase text-[9px] font-bold">Vector Trigger:</span> <span className="text-slate-300">{incident.source}</span></div>
                            </div>
                            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10 w-fit mt-1">
                              <ShieldX className="w-3.5 h-3.5" /><span>{incident.action_taken}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 z-20">
                            <button 
                              onClick={() => handleFetchForensicReport(incident.id)}
                              className="p-2.5 bg-slate-950/60 border border-indigo-500/10 rounded-xl text-cyan-400 hover:border-cyan-500/40 hover:bg-slate-900 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all shadow-md"
                              title="View Forensic Lab Report"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleLocalIncidentDelete(incident.id)}
                              className="p-2.5 bg-slate-950/60 border border-indigo-500/10 rounded-xl text-red-400 hover:bg-red-950/20 hover:border-red-500/40 hover:shadow-[0_0_12px_rgba(239,68,68,0.3)] transition-all shadow-md"
                              title="Delete from Blacklist Node"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="px-3.5 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 font-black font-mono text-[9px] uppercase rounded-xl tracking-wider text-center">{incident.remediation_status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </main>
        </div>

        <BotWidget 
          isBotOpen={isBotOpen}
          setIsBotOpen={setIsBotOpen}
          chatHistory={chatHistory}
          chatQuery={chatQuery}
          setChatQuery={setChatQuery}
          handleSendMessage={handleSendMessage}
          isScanning={isScanning}
        />

        {selectedIncidentReport && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#060a17]/90 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] backdrop-blur-md">
              <div className="p-4 border-b border-indigo-500/10 bg-[#090e21]/80 flex justify-between items-center">
                <span className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-2"><Terminal className="w-4 h-4 text-cyan-400" /> Forensic Log View ({activeReportId})</span>
                <button onClick={() => setSelectedIncidentReport(null)} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 transition"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 bg-[#03050e]/60">
                <pre className="text-emerald-400 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-text">{selectedIncidentReport}</pre>
              </div>
              <div className="p-4 border-t border-indigo-500/10 bg-[#060a17]/80 flex flex-wrap justify-end gap-3">
                <button onClick={handleDownloadExecutiveReport} className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-600 hover:text-white hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all duration-200">
                  <FileText className="w-3.5 h-3.5" /> Download Exec Report
                </button>
                <button onClick={() => { navigator.clipboard.writeText(selectedIncidentReport || ""); alert("Copied raw data log stream matrix!"); }} className="px-4 py-2 bg-slate-900/60 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-slate-800 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] transition-all duration-200">
                  <Copy className="w-3.5 h-3.5" /> Copy Raw Report
                </button>
                <button onClick={() => setSelectedIncidentReport(null)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 text-xs font-black rounded-xl hover:brightness-110 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition duration-200">Dismiss</button>
              </div>
            </div>
          </div>
        )}

        {activeToast && (
          <div className="fixed top-20 right-6 z-[200] animate-in slide-in-from-right-8 fade-in duration-300 pointer-events-none">
              <div className="backdrop-blur-xl bg-[#080c1b]/95 border-l-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] p-4 rounded-xl flex items-start gap-3 w-[340px]">
                  <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                    <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                  </div>
                  <div>
                      <h4 className="text-xs font-black text-red-400 uppercase tracking-wider drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">{activeToast.title}</h4>
                      <p className="text-[10px] text-slate-300 mt-1 font-mono leading-relaxed">{activeToast.message}</p>
                      <div className="mt-2 text-[8px] font-bold text-slate-500 tracking-widest uppercase">System Defense Triggered</div>
                  </div>
              </div>
          </div>
        )}

      </div>
    </div>
  );
}

