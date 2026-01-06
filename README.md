# AI Chat System with Web Search

A Next.js AI chatbot with Google OAuth authentication, streaming responses, and integrated web search powered by OpenAI.

## 🚀 Live Demo

**[View Live Application](https://next-ai-chatbot-nu.vercel.app)**

## 📸 Screenshots

![Screenshot 1](https://github.com/user-attachments/assets/be8d4fa1-3ee1-4cd9-9fd0-50d2334d0f9d)
![Screenshot 2](https://github.com/user-attachments/assets/05fac2f4-0e78-4639-ad8b-a9bdf4ec393d)


## ✨ Features

- **Google OAuth Authentication**: Secure single sign-on with protected routes
- **AI Streaming Responses**: Real-time streaming chat powered by OpenAI (RayyanGPT)
- **Web Search Mode**: Toggle between regular chat and web search with GPT-5 models
- **Responsive Design**: Clean, modern UI that works on desktop and mobile
- **Image Rendering**: Inline display of images from web search results

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Authentication**: NextAuth.js with Google OAuth
- **AI Integration**: OpenAI API with AI SDK (@ai-sdk/openai, @ai-sdk/react)
- **Search**: OpenAI Web Search Preview tool
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ installed
- Google Cloud Console account (for OAuth credentials)
- OpenAI API key

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/ralajaji/next-ai-chatbot
cd next-ai-chatbot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### 4. Get API Keys

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

#### OpenAI API

1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Navigate to API Keys section
3. Create new secret key

### 5. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📖 Usage

1. **Sign In**: Redirects automatically to Google sign-in
2. **Chat Mode**: Default mode - ask questions and receive AI responses from RayyanGPT
3. **Web Search Mode**: Toggle the search switch to enable web search with GPT-5 models and image results
4. **Sign Out**: Click the sign-out button in the header

## 🏗️ Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth configuration
│   │   ├── chat/          # AI chat endpoint with web search & regular chat
│   ├── chat/              # Main chat interface
│   ├── components/        # React components
│   ├── lib/               # Utility functions
│   ├── login/             # Login page
│   └── page.tsx           # Landing page
├── public/                # Static assets
└── .env.local             # Environment variables
```

## 🔒 Security

- All API keys are stored as environment variables
- Routes are protected with NextAuth

## 📝 Environment Variables Reference

|Variable              |Description               |
|----------------------|--------------------------|
|`GOOGLE_CLIENT_ID`    |Google OAuth client ID    |
|`GOOGLE_CLIENT_SECRET`|Google OAuth client secret|
|`NEXTAUTH_URL`        |Application URL           |
|`NEXTAUTH_SECRET`     |Random secret for NextAuth|
|`OPENAI_API_KEY`      |OpenAI API key            |
