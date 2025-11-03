# 🚀 Viral Content Automation Platform

An AI-powered automation workflow for creating viral social media content and automatically posting to multiple platforms including Instagram, YouTube, Facebook, Threads, and Pinterest.

## 🌟 Features

### AI Content Generation
- **GPT-4 Powered Captions**: Generates engaging, viral-optimized captions tailored to each platform
- **Smart Hashtag Generation**: Creates 10-15 trending, relevant hashtags for maximum reach
- **Visual Content Creation**: AI-generated images using Stable Diffusion XL
- **Video Support**: Framework for video content generation and posting

### Multi-Platform Publishing
- **Instagram**: Automated image/video posting with captions and hashtags
- **Facebook**: Direct posting to Facebook pages
- **YouTube**: Video upload support (requires OAuth2)
- **Threads**: Text and image posting to Meta's Threads platform
- **Pinterest**: Pin creation with images and descriptions

### Smart Features
- **Content Preview**: Review and edit generated content before posting
- **Schedule Posts**: Set specific times for automated posting
- **Platform Optimization**: Content automatically optimized for each platform's requirements
- **Batch Publishing**: Post to multiple platforms simultaneously

## 🎯 Live Demo

**Deployed at**: [https://agentic-df43dc0d.vercel.app](https://agentic-df43dc0d.vercel.app)

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI Models**: OpenAI GPT-4, Replicate (Stable Diffusion XL)
- **APIs**: Instagram Graph API, Facebook Graph API, YouTube Data API, Threads API, Pinterest API
- **Deployment**: Vercel

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and add your API keys for AI content generation and social media platforms.

### 3. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

1. **Enter Topic**: Describe the content idea or topic
2. **Select Content Type**: Choose between Image or Video
3. **Choose Platforms**: Select one or more platforms to post to
4. **Generate Content**: Click "Generate Viral Content"
5. **Review & Edit**: Preview the generated caption, hashtags, and media
6. **Post or Schedule**: Either post immediately or schedule for later

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.
