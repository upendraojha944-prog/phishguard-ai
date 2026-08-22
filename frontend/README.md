# 🛡️ PhishGuard AI: Unified Threat Detection & Automated SOAR Platform

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.12%20%7C%20FastAPI-blue?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2%20%7C%20TypeScript-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20%7C%20Persistent-cyan?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

</div>

---

## 🚀 Overview
**PhishGuard AI** is a cutting-edge, full-stack cybersecurity platform engineered to detect, analyze, and quarantine multi-vector phishing threats in real time. Moving beyond traditional URL-only filters, it provides automated security operations center (SOC) capabilities including **Image OCR Forensics**, **Live Communication Stream Ingestion (Gmail/SMS)**, and an **Automated SOAR Firewall**.

---

## 📽️ Live Demonstration
<div align="center">
  <img src="https://github.com/upendraojha944-prog/phishguard-backend/blob/main/Video%20Project.mp4" alt="PhishGuard AI Demo" width="100%"/>
</div>

---

## ✨ Key Architectural Features

* **🌐 Real-Time URL Sandbox & Heuristics:** Instant URL threat indexing, domain parsing, and risk scoring engine powered by FastAPI.
* **👁️ Computer Vision OCR Threat Parser:** Integrates *EasyOCR* and *OpenCV* to analyze raw screenshot captures (WhatsApp/SMS lures), extract hidden payloads, and decode multi-lingual text (English, Hindi, Hinglish).
* **🛡️ Automated SOAR Firewall:** Instant firewall blacklisting, IOC categorization (*Credential Harvesting, Malware Distribution, Financial Scams*), and dynamic quarantine controls.
* **📊 Comprehensive Incident Reporting:** Real-time metrics tracking, automated audit trail compilation, and one-click Executive/CSV report exports.
* **💬 Multi-Lingual AI Security Copilot:** Interactive security chatbot supporting adaptive linguistic modes for SOC analysts.

---

## 🛠️ Tech Stack

* **Backend:** Python, FastAPI, Uvicorn, SQLAlchemy, PyTorch, EasyOCR, OpenCV, Google Generative AI, JWT Auth.
* **Frontend:** Next.js (App Router), TypeScript, TailwindCSS, Lucide React Icons.
* **Database & Security:** SQLite (Persistent absolute path configuration), Bcrypt Password Hashing, Secure Tokenized Authorization.

---

## ⚙️ Local Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/upendraojha944-prog/phishguard-ai.git](https://github.com/upendraojha944-prog/phishguard-ai.git)
   cd phishguard-ai