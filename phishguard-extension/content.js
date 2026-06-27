chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SHOW_WARNING") {
    
    // Naya Warning UI create karna
    const warningDiv = document.createElement("div");
    warningDiv.innerHTML = `
      <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(220,38,38,0.95); z-index:2147483647; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; font-family:monospace; backdrop-filter:blur(15px);">
        
        <div style="text-align:center; max-width:800px; padding:40px; background:rgba(0,0,0,0.6); border:2px solid #ff4444; border-radius:20px; box-shadow: 0 0 50px rgba(220,38,38,0.5);">
            <h1 style="font-size:45px; font-weight:900; margin-bottom:10px; color:#ff4444; text-transform:uppercase;">⚠️ CRITICAL THREAT BLOCKED</h1>
            <p style="font-size:18px; color:#e2e8f0;">PhishGuard AI has intercepted a highly dangerous connection.</p>
            
            <div style="background:rgba(0,0,0,0.5); padding:20px; border-radius:10px; margin-top:30px; text-align:left; border-left:4px solid #ff4444;">
              <p style="margin-bottom:10px; font-size:16px;"><strong>AI Verdict:</strong> <span style="color:#f87171;">${request.data.verdict}</span></p>
              <p style="margin-bottom:10px; font-size:16px;"><strong>Threat Index:</strong> <span style="color:#f87171; font-weight:900; font-size:24px;">${request.data.threat_index} / 100</span></p>
              <p style="font-size:14px; color:#94a3b8; line-height:1.6;"><strong>Forensic Summary:</strong> ${request.data.analysis_summary}</p>
            </div>
            
            <div style="margin-top:40px; display:flex; gap:20px; justify-content:center;">
                <button id="phishguard-safe" style="padding:12px 24px; background:#10b981; border:none; color:white; font-weight:bold; cursor:pointer; border-radius:8px; font-size:14px; text-transform:uppercase;">Take Me To Safety (Close Tab)</button>
                <button id="phishguard-bypass" style="padding:12px 24px; background:transparent; border:1px solid #64748b; color:#94a3b8; cursor:pointer; border-radius:8px; font-size:12px;">I understand the risk, proceed anyway</button>
            </div>
        </div>
      </div>
    `;
    
    // Website ki body mein usko force-inject karna
    document.body.appendChild(warningDiv);

    // Buttons ka logic
    document.getElementById('phishguard-safe').addEventListener('click', () => {
      // Background.js ko SOS signal bhej rahe hain tab close karne ke liye
      chrome.runtime.sendMessage({ action: "CLOSE_TAB" });
    });
    
    document.getElementById('phishguard-bypass').addEventListener('click', () => {
      warningDiv.remove(); // Warning hata kar risk lene dega
    });
  }
});