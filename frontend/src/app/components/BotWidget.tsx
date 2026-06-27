import { MessageSquareCode, X, Send, Loader2, Bot } from "lucide-react";

interface BotWidgetProps {
  isBotOpen: boolean;
  setIsBotOpen: (val: boolean) => void;
  chatHistory: any[];
  chatQuery: string;
  setChatQuery: (val: string) => void;
  handleSendMessage: () => void;
  isScanning: boolean;
}

export default function BotWidget({ isBotOpen, setIsBotOpen, chatHistory, chatQuery, setChatQuery, handleSendMessage, isScanning }: BotWidgetProps) {
  return (
    <div className="fixed bottom-12 right-12 z-50 flex flex-col items-end">
      {/* CHAT BOX PANEL */}
      {isBotOpen && (
        <div className="w-96 h-[500px] backdrop-blur-md bg-[#080c1b]/95 border border-blue-500/20 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.15)] flex flex-col overflow-hidden relative mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="p-4 border-b border-indigo-500/20 bg-[#060813] flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <MessageSquareCode className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xs font-black uppercase text-slate-200 tracking-wider">AI Security Bot</span>
            </div>
            <button onClick={() => setIsBotOpen(false)} className="text-slate-400 hover:text-red-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-blue-500/20">
            {chatHistory.map((chat: any, i: number) => (
              <div key={i} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${chat.sender === "user" ? "bg-blue-600 text-white rounded-tr-sm shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "bg-[#1e293b]/80 border border-slate-700/50 text-slate-300 rounded-tl-sm"}`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{chat.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-indigo-500/20 bg-[#060813] z-10 relative">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about threats, phishing, or code..."
                className="flex-1 bg-[#0a0f25] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50"
              />
              <button onClick={handleSendMessage} disabled={isScanning} className="p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-colors disabled:opacity-50">
                {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING ROBOT BUTTON */}
      {/* 🤖 FLOATING ROBOT BUTTON (TRYHACKME STYLE RESTORED) */}
      <button 
        onClick={() => setIsBotOpen(!isBotOpen)}
        className="w-16 h-16 bg-[#0b1021] border-2 border-cyan-500/50 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:-translate-y-2 hover:bg-cyan-900/30 transition-all duration-300 relative group overflow-visible z-50"
      >
        {/* Background Radar Ping Effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400 animate-ping opacity-20"></div>
        
        {/* The Animated Robot Face */}
        <Bot className="w-9 h-9 text-cyan-400 group-hover:text-white transition-colors duration-300 group-hover:animate-bounce drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        
        {/* Glowing Red Threat Notification Dot */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 border-2 border-[#0b1021] rounded-full animate-pulse shadow-[0_0_12px_rgba(239,68,68,1)]"></div>
      </button>
    </div>
  );
}