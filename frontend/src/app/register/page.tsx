"use client";
import React, { useState } from "react";
import { Shield, User, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, BadgeCheck, Send } from "lucide-react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { apiUrl } from "../lib/api";

type ApiErrorResponse = { detail?: string };

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
    return (error.response?.data as ApiErrorResponse | undefined)?.detail || fallback;
  }
  return fallback;
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", otp: "" });
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const sendOtp = async () => {
    setError("");
    setMessage("");

    if (!formData.email) {
      setError("Pehle email enter karo.");
      return;
    }

    setOtpLoading(true);
    setIsOtpSent(true);
    setIsVerified(false);
    try {
      const res = await axios.post(apiUrl("/api/v1/auth/send-otp"), { email: formData.email });
      setMessage(res.data?.message || "OTP generated. Email ya backend terminal check karo.");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "OTP request fail hua, lekin OTP box open hai. Backend terminal check karo."));
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    setMessage("");

    if (!formData.otp) {
      setError("OTP enter karo.");
      return;
    }

    setVerifyLoading(true);
    try {
      await axios.post(apiUrl("/api/v1/auth/verify-otp"), {
        email: formData.email,
        otp: formData.otp,
      });
      setIsVerified(true);
      setMessage("OTP verified. Ab registration complete kar sakte ho.");
    } catch (err: unknown) {
      setIsVerified(false);
      setError(getErrorMessage(err, "OTP verify nahi ho paya."));
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Access Keys do not match.");
      return;
    }

    if (!isVerified) {
      setError("Registration se pehle OTP verify karo.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(apiUrl("/api/v1/auth/register"), {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: formData.otp,
      });
      router.push("/login");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Registration failed. Try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#040612] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-200">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />
      
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(to right, rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="w-full max-w-md relative z-10">

        {/* Pura Page/Card par Neon Purple Border lagaya gaya hai */}
        <div className="bg-[#080c1b]/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5),inset_0_0_20px_rgba(168,85,247,0.2)] relative z-10">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(168,85,247,0.2)] relative">
              <div className="absolute inset-0 bg-purple-500 blur-md opacity-20 rounded-2xl animate-pulse" />
              <Shield className="w-7 h-7 text-purple-400" />
            </div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400 uppercase tracking-widest text-center">
              PHISHGUARD AI
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Initialize Analyst Identity Schema</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-fuchsia-300/70 uppercase tracking-wider pl-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full bg-[#040612] border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-400 focus:shadow-[0_0_25px_rgba(217,70,239,0.6)] transition-all"
                />
              </div>
            </div>

            {/* Email + OTP Send */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-fuchsia-300/70 uppercase tracking-wider pl-1">Email Node</label>
              <div className="flex gap-2">
                <div className="relative group flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    placeholder="analyst@phishguard.ai"
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setIsOtpSent(false);
                      setIsVerified(false);
                    }}
                    className="w-full bg-[#040612] border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-400 focus:shadow-[0_0_25px_rgba(217,70,239,0.6)] transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={otpLoading}
                  className="w-12 shrink-0 bg-[#040612] border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] text-fuchsia-300 rounded-xl flex items-center justify-center hover:bg-fuchsia-600 hover:text-white transition-all focus:border-fuchsia-400 focus:shadow-[0_0_25px_rgba(217,70,239,0.6)]"
                  title="Send OTP"
                >
                  {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* OTP Input + Verify */}
            {isOtpSent && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-bold text-fuchsia-300/70 uppercase tracking-wider pl-1">Email OTP</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.otp}
                    maxLength={6}
                    placeholder="6 digit OTP"
                    onChange={(e) => {
                      setFormData({ ...formData, otp: e.target.value.replace(/\D/g, "") });
                      setIsVerified(false);
                    }}
                    className="flex-1 bg-[#040612] border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-xl py-3 px-4 text-sm tracking-[0.2em] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-400 focus:shadow-[0_0_25px_rgba(217,70,239,0.6)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={verifyLoading || isVerified}
                    className="w-12 shrink-0 bg-[#040612] border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] text-emerald-300 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50"
                    title="Verify OTP"
                  >
                    {verifyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BadgeCheck className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-fuchsia-300/70 uppercase tracking-wider pl-1">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  placeholder="••••••••••••"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#040612] border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-xl py-3 pl-10 pr-12 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-400 focus:shadow-[0_0_25px_rgba(217,70,239,0.6)] transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-fuchsia-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-fuchsia-300/70 uppercase tracking-wider pl-1">Confirm Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  placeholder="••••••••••••"
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-[#040612] border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-xl py-3 pl-10 pr-12 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-400 focus:shadow-[0_0_25px_rgba(217,70,239,0.6)] transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-fuchsia-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Status Messages */}
            {message && <p className="text-emerald-400 text-[11px] font-bold text-center mt-2 bg-emerald-500/10 py-1.5 rounded-lg border border-emerald-500/20">{message}</p>}
            {error && <p className="text-red-400 text-[11px] font-bold text-center mt-2 bg-red-500/10 py-1.5 rounded-lg border border-red-500/20">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isVerified}
              className="w-full py-3.5 mt-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.4)] disabled:shadow-none hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              {!loading && isVerified && <div className="absolute inset-0 bg-white/20 w-full h-full -translate-x-full skew-x-12 group-hover:animate-[shimmer_1.5s_infinite]" />}
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Initialize Profile Registry <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center">
            <p className="text-xs text-slate-500">
              Already registered? <Link href="/login" className="text-fuchsia-400 font-bold hover:text-fuchsia-300 underline underline-offset-4 decoration-fuchsia-500/30">Secure Login</Link>
            </p>
          </div>
        </div>
      </div>
      <style jsx global>{`@keyframes shimmer { 100% { transform: translateX(100%) skewX(12deg); } }`}</style>
    </div>
  );
}
