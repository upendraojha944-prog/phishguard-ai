import { Loader2, ShieldAlert, Cpu } from "lucide-react";

export default function ForensicLoader() {
  return (
    <div className="absolute inset-0 z-50 bg-[#040612]/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-t-transparent border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin-reverse"></div>
        <Cpu className="absolute inset-0 m-auto w-10 h-10 text-cyan-400 animate-pulse" />
      </div>
      <h3 className="text-sm font-black text-white uppercase tracking-widest animate-pulse">Running Forensic Analysis...</h3>
      <p className="text-[10px] text-slate-500 font-mono mt-2">Decoding Image Vectors & Extracting Metadata...</p>
    </div>
  );
}