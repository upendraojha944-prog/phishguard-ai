"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 👈 FIXED: Yahan 'next/navigation' kar diya hai
import { Shield, Lock, Mail, ArrowRight, Cpu } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); 
    setIsAuthenticating(true); 

    try {
      // 📡 Connecting to your FastAPI Backend Node
      const res = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Identity vector authorization rejected.");
      }

      // 🔐 LEVEL 1 TRIGGER: Token and Profile saved securely to Browser Context
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user_profile));

      // ⏳ Delay mechanism to match your premium authentication loader widget
      await new Promise((resolve) => setTimeout(resolve, 2500));
      
      router.push("/"); // Successfully authorized redirection
    } catch (err: any) {
      console.error("Auth Terminal Error:", err);
      setErrorMsg(err.message || "Connection to Auth Portal lost.");
      setIsAuthenticating(false); 
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#040612] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-200">
      
      {/* 🚨 PURE TAILWIND SCI-FI LOADING SCREEN 🚨 */}
      {isAuthenticating && (
        <div className="fixed inset-0 z-[100] bg-[#040612]/95 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 mb-8">
            {/* Outer Rotating Glowing Ring */}
            <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-fuchsia-500 border-l-transparent rounded-full animate-spin shadow-[0_0_25px_rgba(168,85,247,0.4)]"></div>
            {/* Inner Fast Ring */}
            <div className="absolute inset-3 border-2 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin [animation-duration:0.8s]"></div>
            <Cpu className="absolute inset-0 m-auto w-10 h-10 text-purple-400 animate-pulse drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
          </div>
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 font-black text-lg uppercase tracking-widest animate-pulse text-center px-4">
            Authenticating Identity...
          </h2>
          <p className="text-[9px] text-slate-500 font-mono mt-2 uppercase tracking-widest">
            Verifying Security Token Signatures & Cryptographic Hashes...
          </p>
        </div>
      )}

      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-600/10 blur-[150px] pointer-events-none" />
      
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(to right, rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        
        <div className="bg-[#080c1b]/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5),inset_0_0_20px_rgba(168,85,247,0.2)] relative z-10">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)] relative">
              <div className="absolute inset-0 bg-purple-500 blur-md opacity-20 rounded-2xl animate-pulse" />
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 uppercase tracking-widest text-center">
              Authorization Portal
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2">Access Unified Forensic Engine</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold rounded-xl text-center uppercase tracking-wide">
              🚨 {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-purple-300/70 uppercase tracking-wider pl-1">Target Email Vector</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input 
                  type="email" 
                  required
                  placeholder="analyst@phishguard.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#040612] border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-400 focus:shadow-[0_0_25px_rgba(217,70,239,0.6)] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-purple-300/70 uppercase tracking-wider pl-1">Security Vector (Password)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#040612] border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-400 focus:shadow-[0_0_25px_rgba(217,70,239,0.6)] transition-all"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 mt-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all group relative overflow-hidden">
              Initialize Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center space-y-4">
            <p className="text-xs text-slate-400">
              No access vector? <Link href="/register" className="text-purple-400 font-bold hover:text-purple-300 underline underline-offset-4 decoration-purple-500/30">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}