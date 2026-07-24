"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Shield, Lock, Mail, ArrowRight, Cpu } from "lucide-react";
import Link from "next/link";
import { apiUrl } from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // 🛡️ State to control PhishGuard Security Access Popup
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  // 🔐 FORGOT PASSWORD STEP-BY-STEP STATE ENGINE
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP Only, 3: Passwords Only
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added Confirm Password field
  const [bannerMessage, setBannerMessage] = useState("");

  // 📡 1. Normal Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); 
    setIsAuthenticating(true); 

    try {
      const res = await fetch(apiUrl("/api/v1/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Identity vector authorization rejected.");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user_profile));

      // 🛡️ Redirect rok kar loading screen band karenge aur Popup open karenge
      setIsAuthenticating(false); 
      setShowPermissionModal(true);
    } catch (err: any) {
      console.error("Auth Terminal Error:", err);
      setErrorMsg(err.message || "Connection to Auth Portal lost.");
      setIsAuthenticating(false); 
    }
  };

  // 📡 2. Forgot Password - Step 1: Submit Email
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setErrorMsg("");
    setIsAuthenticating(true);

    try {
      const res = await fetch(apiUrl("/api/v1/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        setBannerMessage("✅ RESET OTP DISPATCH SUCCESSFUL! CHECK EMAIL.");
        setResetStep(2); // Move strictly to OTP input screen only
      } else {
        setErrorMsg(data.detail || "Email identity verification failed.");
      }
    } catch (err) {
      setErrorMsg("Backend server unreachable.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // 📡 3. Forgot Password - Step 2: Verify Inbound OTP
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtp) return;
    setErrorMsg("");
    setIsAuthenticating(true);

    try {
      // Connecting directly to your core verification node
      const res = await fetch(apiUrl("/api/v1/auth/verify-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp: resetOtp }),
      });

      const data = await res.json();
      if (res.ok) {
        setBannerMessage("✅ OTP VERIFIED! SECURITY GATEWAY UNLOCKED.");
        setResetStep(3); // Successfully unlocked Step 3: Password Fields
      } else {
        setErrorMsg(data.detail || "Invalid or expired OTP key.");
      }
    } catch (err) {
      setErrorMsg("Verification pipeline connection error.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // 📡 4. Forgot Password - Step 3: Overwrite Credential Signature
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;
    
    if (newPassword !== confirmPassword) {
      setErrorMsg("Security master tokens do not match!");
      return;
    }
    
    setErrorMsg("");
    setIsAuthenticating(true);

    try {
      const res = await fetch(apiUrl("/api/v1/auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: resetEmail, 
          otp: resetOtp, 
          new_password: newPassword 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password updated successfully! Initializing login portal...");
        setIsForgotMode(false);
        setResetStep(1);
        setBannerMessage("");
        setEmail(resetEmail); // autofill for user convenience
        setPassword("");
        setResetEmail("");
        setResetOtp("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMsg(data.detail || "Password override transaction failed.");
      }
    } catch (err) {
      setErrorMsg("Password override failed.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#040612] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-200">
      
      {/* 🚨 PURE TAILWIND SCI-FI LOADING SCREEN 🚨 */}
      {isAuthenticating && (
        <div className="fixed inset-0 z-[100] bg-[#040612]/95 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-fuchsia-500 border-l-transparent rounded-full animate-spin shadow-[0_0_25px_rgba(168,85,247,0.4)]"></div>
            <div className="absolute inset-3 border-2 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin [animation-duration:0.8s]"></div>
            <Cpu className="absolute inset-0 m-auto w-10 h-10 text-purple-400 animate-pulse drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
          </div>
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 font-black text-lg uppercase tracking-widest animate-pulse text-center px-4">
            {isForgotMode ? "Processing Cryptographic Keys..." : "Authenticating Identity..."}
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

      {/* Main Login/Reset Card */}
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
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2">
              {isForgotMode ? "Commit Secure Key Verification" : "Access Unified Forensic Engine"}
            </p>
          </div>

          {/* 🟢 SUCCESS BANNER */}
          {bannerMessage && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold rounded-xl text-center uppercase tracking-wide">
              {bannerMessage}
            </div>
          )}

          {/* 🚨 ERROR BANNER */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold rounded-xl text-center uppercase tracking-wide">
              🚨 {errorMsg}
            </div>
          )}

          {/* 📑 CONDITIONAL RENDERING CONTROLLER */}
          {!isForgotMode ? (
            /* ================= MODE A: NORMAL LOGIN FORM ================= */
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
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-purple-300/70 uppercase tracking-wider">Security Vector (Password)</label>
                  <button 
                    type="button"
                    onClick={() => { setIsForgotMode(true); setErrorMsg(""); setResetStep(1); setBannerMessage(""); }}
                    className="text-[10px] font-bold text-fuchsia-400 hover:text-fuchsia-300 hover:underline uppercase tracking-wider transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
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
          ) : (
            /* ================= MODE B: FORGOT PASSWORD FLOW ================= */
            <div className="space-y-5">
              
              {/* ⏳ STEP 1: INPUT EMAIL FIELD ONLY */}
              {resetStep === 1 && (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-purple-300/70 uppercase tracking-wider pl-1">Target Email Vector</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                      <input 
                        type="email" 
                        required
                        placeholder="analyst@phishguard.ai"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full bg-[#040612] border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-400 focus:shadow-[0_0_25px_rgba(217,70,239,0.6)] transition-all"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                    Request Reset Code <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* ⏳ STEP 2: VERIFY OTP BOX ONLY (No password fields) */}
              {resetStep === 2 && (
                <form onSubmit={handleVerifyOtpSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-purple-300/70 uppercase tracking-wider pl-1">Reset Verification Key (OTP)</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                      <input 
                        type="text" 
                        required
                        placeholder="Enter 6-Digit OTP"
                        value={resetOtp}
                        onChange={(e) => setResetOtp(e.target.value)}
                        className="w-full bg-[#040612] border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-400 focus:shadow-[0_0_25px_rgba(217,70,239,0.6)] transition-all font-mono text-center tracking-widest"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:brightness-110 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(217,70,239,0.5)] transition-all">
                    Verify Identity Code <ArrowRight className="w-4 h-4" />
                  </button>

                  <button 
                    type="button" 
                    onClick={() => { setResetStep(1); setBannerMessage(""); setErrorMsg(""); setResetOtp(""); }} 
                    className="text-[10px] font-black text-cyan-400 hover:text-cyan-300 hover:underline block mx-auto uppercase tracking-widest font-mono transition-colors"
                  >
                    ← Request New Code
                  </button>
                </form>
              )}

              {/* ⏳ STEP 3: NEW PASSWORD & CONFIRM PASSWORD CHANNELS */}
              {resetStep === 3 && (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-purple-300/70 uppercase tracking-wider pl-1">New Security Master Token (Password)</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#040612] border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-400 focus:shadow-[0_0_25px_rgba(217,70,239,0.6)] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-purple-300/70 uppercase tracking-wider pl-1">Confirm Security Master Token</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#040612] border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-400 focus:shadow-[0_0_25px_rgba(217,70,239,0.6)] transition-all"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:brightness-110 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(217,70,239,0.5)] transition-all">
                    Commit Identity Overwrite <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Back to Login redirection option */}
              <button 
                type="button" 
                onClick={() => { setIsForgotMode(false); setResetStep(1); setBannerMessage(""); setErrorMsg(""); setResetEmail(""); setResetOtp(""); setNewPassword(""); setConfirmPassword(""); }}
                className="text-[10px] font-bold text-slate-400 hover:text-white block mx-auto uppercase tracking-wider transition-colors pt-2"
              >
                ← Back to Login
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-col items-center space-y-4">
            <p className="text-xs text-slate-400">
              No access vector? <Link href="/register" className="text-purple-400 font-bold hover:text-purple-300 underline underline-offset-4 decoration-purple-500/30">Create an account</Link>
            </p>
          </div>
        </div>
        {/* ================= 🛡️ PHISHGUARD-AI CUSTOM SECURITY POPUP MODAL ================= */}
          {showPermissionModal && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <div className="bg-[#080c1b] border-2 border-purple-500 rounded-3xl max-w-md w-full p-6 shadow-[0_0_40px_rgba(168,85,247,0.6)] text-slate-200">
                
                {/* Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-400 font-bold">
                    🛡️
                  </div>
                  <h2 className="text-lg font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                    Security Access Requested
                  </h2>
                </div>

                {/* Terms & Conditions Box */}
                <div className="text-xs font-mono bg-[#040612] rounded-xl p-4 space-y-4 max-h-60 overflow-y-auto border border-purple-500/20 text-slate-300">
                  <p className="text-purple-300 font-bold uppercase tracking-wider text-[10px]">
                    ⚠️ MANDATORY SECURITY DIRECTIVE & AGREEMENT:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <span className="text-fuchsia-400 font-bold font-sans">▪</span>
                      <p><b>SMS INTERCEPTOR PIPELINE:</b> PhishGuard AI ka hybrid engine aapke device par aane wale SMS links ko real-time analyze karega taaki fraudulent lottery ya bank spoofing attack ko instant block kiya ja sake.</p>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <span className="text-fuchsia-400 font-bold font-sans">▪</span>
                      <p><b>GMAIL THREAT MONITOR:</b> Application aapke secure email metadata ko monitor karegi taaki spear-phishing campaigns aur malicious mail attachments ko dashboard par alert kiya ja sake.</p>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <span className="text-fuchsia-400 font-bold font-sans">▪</span>
                      <p><b>FORENSIC SCREENSHOT SCANNER:</b> Image OCR upload channel ke chalte, system ko aapke documents/screenshots ke andr fraudulent text aur URLs scan karne ke liye canvas access chahiye.</p>
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-500 uppercase tracking-tight pt-2 border-t border-purple-500/10">
                    *Privacy Protocol: Aapka data servers par save nahi hota. Analysis zero-knowledge encryption node par run hoti hai.
                  </p>
                </div>

                {/* Accept / Reject Action Buttons */}
                <div className="flex items-center justify-end space-x-3 mt-5">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowPermissionModal(false);
                      localStorage.clear(); // Session clear karenge kyunki user ne refuse kiya
                      window.location.reload(); // Portal ko reload kar denge
                    }}
                    className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest bg-transparent border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    Reject / Exit
                  </button>
                  
                  <button 
                    type="button"
                    onClick={async () => {
                      setShowPermissionModal(false);
                      // Yahan user ne allow kar diya, ab hum usko dashboard par bhej denge
                      window.location.href = "/"; 
                    }}
                    className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
                  >
                    Accept & Allow
                  </button>
                </div>

              </div>
            </div>
          )}
      </div>
    </div>
  );
}
