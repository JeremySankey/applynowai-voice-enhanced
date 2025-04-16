# ApplyNowAI — Voice-Enhanced Resume & Cover Letter Generator 🎤📄

ApplyNowAI is a full-stack AI-powered tool that helps users generate tailored cover letters and resume rewrites — all from either typed input **or spoken job experience** using voice-to-text technology. Built to demonstrate secure API usage, voice integration, and full-stack architecture.

> **Live demo coming soon** (currently localhost only)

---

## 🚀 Features

- 🎤 **Voice-to-Resume**: Use your mic to describe your job history — Deepgram transcribes it directly into the resume field.
- ✍️ **Smart AI Generation**: Generate cover letters or resume rewrites using OpenAI's GPT-3.5.
- 🎯 **Tone + Role Customization**: Choose tone (friendly, professional, etc.) and target job title.
- 🔐 **Secure API Handling**: Backend handles OpenAI requests securely with environment variables.
- 💻 **Modern Tech Stack**: HTML, CSS, JS frontend + Node.js backend with Express.

---

## 🧠 Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js + Express
- **APIs**:
  - [OpenAI GPT-3.5](https://platform.openai.com/docs)
  - [Deepgram STT](https://developers.deepgram.com/)
- **Security**: Environment variables via `.env`
- **Voice Recording**: Web MediaRecorder API

---

## 📦 Project Structure

applynowai-voice-enhanced/ │ ├── index.html # Frontend layout ├── style.css # UI styling ├── script.js # Handles form logic, fetch, Deepgram recording ├── backend/ │ ├── server.js # Express backend for OpenAI │ └── package.json # Node dependencies └── .env # (Not tracked) Stores API keys

---

## 🔧 Setup Instructions

### 1. Clone the repo:
```bash
git clone https://github.com/JeremySankey/applynowai-voice-enhanced.git
2. Install backend dependencies:
cd backend
npm install

3. Add .env file in /backend:
env

OPENAI_API_KEY=your-openai-key
4. Start the backend server:
node server.js

5. Open index.html in your browser and click Generate or Record Resume Summary.
📷 Screenshots 

🤝 Why I Built This
This project showcases my ability to:

Build and secure full-stack AI integrations

Work with voice technologies and real-world APIs

Refactor for production (handling secrets, moving logic server-side)

Handle Git/GitHub like a pro (filter-repo, rebase, pushes, deployment)

I’d love to continue evolving this tool into a fully deployable voice-based job search assistant.

📬 Contact
Jeremy Sankey
LinkedIn
📫 jjsankey@gmail.com