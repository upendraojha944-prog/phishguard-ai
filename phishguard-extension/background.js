chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Jab website puri tarah load ho jaye
 // Jab website puri tarah load ho jaye (Localhost aur Chrome settings ko chhod kar)
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://') && !tab.url.includes('localhost')) {
    console.log("PhishGuard Scanning URL:", tab.url);

    // Aapke FastAPI backend par URL bhejna
    fetch('http://localhost:8000/api/v1/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: tab.url })
    })
    .then(res => res.json())
    .then(data => {
      // Agar Threat Score 25 se zyada hai, matlab website khatarnak hai!
      if (data.threat_index > 25) { 
        console.log("🚨 THREAT DETECTED! Sending alert to screen.");
        chrome.tabs.sendMessage(tabId, { action: "SHOW_WARNING", data: data });
      } else {
        console.log("✅ Safe Website.");
      }
    })
    .catch(err => console.log("PhishGuard AI Backend Offline (Please run uvicorn):", err));
  }
});
// Naya function: Tab force-close karne ke liye
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "CLOSE_TAB") {
    // Jis tab se signal aaya, usko hamesha ke liye close kardo
    chrome.tabs.remove(sender.tab.id);
  }
});