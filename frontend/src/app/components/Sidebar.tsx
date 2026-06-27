"use client";

import { 
  Shield, 
  Activity, 
  Terminal, 
  Camera, 
  MessageSquareCode, 
  Mail, 
  Smartphone, 
  Radio, 
  User, 
  ListFilter, 
  RefreshCw, 
  BarChart2 // 👈 FIXED: Analytics icon import kiya
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  fetchLiveEcosystemMetrics: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, fetchLiveEcosystemMetrics }: SidebarProps) {
  return (
    <aside className="w-72 h-full bg-[#080c1b]/80 border border-indigo-500/10 flex flex-col justify-between z-40 flex-shrink-0 select-none rounded-xl backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
      <div className="p-6 space-y-8">
        <div className="flex items-center space-x-2.5 mb-6">
          <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 p-2 rounded-xl text-slate-950 font-black">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-black text-sm text-white tracking-wide">PhishGuard AI</span>
        </div>

        {/* 🌟 NEON CAPSULE NAVIGATION SYSTEM 🌟 */}
        <nav className="space-y-3">
          {[
            { id: "dashboard", label: "Overview", icon: Activity },
            { id: "analytics", label: "Analytics", icon: BarChart2 }, // 👈 FIXED: Analytics loop array mein add kiya
            { id: "url", label: "Sandbox", icon: Terminal },
            { id: "ocr", label: "OCR Scanner", icon: Camera },
            { id: "bot", label: "AI Security Bot", icon: MessageSquareCode },
            { id: "email", label: "Gmail Security", icon: Mail },
            { id: "sms", label: "SMS Security", icon: Smartphone },
            { id: "soar", label: "SOAR Firewall", icon: Radio },
            { id: "profile", label: "User Profile", icon: User },
            { id: "history", label: "Scan History", icon: ListFilter },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-[25px] transition-all duration-300 border group
                ${activeTab === item.id 
                  ? "bg-[#1a0f2e] border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
                  : "border-transparent hover:bg-white/5 hover:-translate-y-1 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                }`}
            >
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                activeTab === item.id 
                  ? "bg-purple-600/20 border-purple-400" 
                  : "bg-[#040612] border-purple-500/30 group-hover:border-purple-400"
              }`}>
                <item.icon className={`w-4 h-4 transition-colors ${activeTab === item.id ? "text-purple-300" : "text-purple-500 group-hover:text-purple-300"}`} />
              </div>
              
              <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                activeTab === item.id ? "text-purple-100" : "text-slate-500 group-hover:text-slate-300"
              }`}>
                {item.label}
              </span>
              
              <div className={`absolute inset-0 rounded-[25px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-[inset_0_0_10px_rgba(168,85,247,0.2)]`} />
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-indigo-500/10 bg-[#060813]/90 rounded-b-xl">
        <button onClick={fetchLiveEcosystemMetrics} className="w-full flex items-center justify-center space-x-2 text-[10px] uppercase font-bold bg-[#080c1b]/60 border border-blue-500/20 shadow-[inset_0_0_12px_rgba(59,130,246,0.1)] hover:bg-[#101730] hover:shadow-[0_0_20px_rgba(59,130,246,0.45),inset_0_0_12px_rgba(59,130,246,0.2)] text-blue-400 py-3 rounded-xl transition-all duration-300">
          <RefreshCw className="w-3.5 h-3.5" /><span>Refresh Cache Logs</span>
        </button>
      </div>
    </aside>
  );
}