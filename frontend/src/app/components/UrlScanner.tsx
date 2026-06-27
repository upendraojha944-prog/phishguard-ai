import { Terminal, ShieldCheck, ShieldAlert, Loader2, Globe } from "lucide-react";

interface UrlScannerProps {
  urlInput: string;
  setUrlInput: (val: string) => void;
  isScanning: boolean;
  handleScanUrl: () => void;
  scanResult: any;
  borderEffect: string;
}

export default function UrlScanner({ urlInput, setUrlInput, isScanning, handleScanUrl, scanResult, borderEffect }: UrlScannerProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 pl-1">
        <div className="space-y-1">
          <div className="text-[10px] font-black text-cyan-400 tracking-widest uppercase">Ecosystem Operational Workspace</div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">AI URL Sandbox</h1>
        </div>
      </div>

      <div className={`backdrop-blur-xl bg-[#080c1b]/80 border ${borderEffect} p-8 rounded-2xl shadow-2xl transition-all duration-500 relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-[#040612] border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] relative">
            {isScanning ? <Loader2 className="w-10 h-10 text-blue-500 animate-spin" /> : <Globe className="w-10 h-10 text-blue-400" />}
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-xl font-black text-slate-100 tracking-tight uppercase">Deep Link Forensics</h2>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Enter a suspicious URL to isolate and analyze it inside our cloud sandbox. AI will extract threat vectors instantly.</p>
          </div>
          
          <div className="w-full max-w-2xl relative mt-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center">
              <Terminal className="absolute left-4 text-cyan-400 w-5 h-5" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://suspicious-link.com"
                className="w-full bg-[#03050e]/90 border border-blue-500/30 text-white px-12 py-5 rounded-2xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all text-sm font-mono tracking-tight placeholder-slate-600 shadow-inner"
              />
              <button
                onClick={handleScanUrl}
                disabled={!urlInput || isScanning}
                className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-wider flex items-center gap-2"
              >
                {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{isScanning ? "Scanning..." : "Initialize"}</span>
              </button>
            </div>
          </div>

          {scanResult && (
            <div className={`mt-6 w-full max-w-2xl p-6 rounded-2xl border text-left flex gap-4 ${scanResult.threat_index > 25 ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
              <div className={`p-3 rounded-xl h-fit ${scanResult.threat_index > 25 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {scanResult.threat_index > 25 ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`text-sm font-black uppercase ${scanResult.threat_index > 25 ? 'text-red-400' : 'text-emerald-400'}`}>Verdict: {scanResult.verdict}</h4>
                    <p className="text-xs text-slate-400 mt-1 font-mono">Confidence: {scanResult.confidence}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-black ${scanResult.threat_index > 25 ? 'text-red-500' : 'text-emerald-500'}`}>{scanResult.threat_index}</div>
                    <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Threat Index</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-700/50">
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">{scanResult.analysis_summary}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}