AgriSathi – Smart Agricultural Assistance System

A comprehensive mobile-friendly web application built with React, TypeScript, and Tailwind CSS to support farmers with AI-powered disease detection, multilingual chatbot assistance, and real-time agricultural insights.

Features
Core Features

AI-Powered Chatbot: Natural language processing chatbot supporting Hindi and English languages

Disease Detection: Plant disease identification via camera upload with AI analysis

Weather Information: Real-time weather data and forecasts

Crop Recommendations: Personalized crop suggestions based on conditions

Community Forum: Farmer community interaction and knowledge sharing

Expert Consultation: Connect with agricultural experts

Wallet & Credits: Digital wallet system for agricultural services

Multilingual Support: Full Hindi and English language support

Technical Features

Responsive Design: Mobile-first design that works on all devices

Offline Capability: Core features work without internet connection

Real-time Updates: Live data synchronization

Secure Authentication: User authentication and data protection

Modern UI/UX: Clean, intuitive interface using shadcn/ui components

Getting Started
Prerequisites

Node.js (v18 or higher)

npm or yarn package manager

Installation

Clone the repository

git clone https://github.com/your-username/AgriSathi-app.git
cd AgriSathi-app


Install dependencies

npm install


Set up environment variables

cp .env.example .env


Edit the .env file with your API keys:

# Optional: Real API Keys (for production)
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_PLANT_ID_API_KEY=your_plantid_api_key
VITE_AGRICULTURE_API_KEY=your_agriculture_api_key

# API Endpoints (optional)
VITE_API_BASE_URL=https://api.agrisathi.com
VITE_AI_SERVICE_URL=https://ai.agrisathi.com


Start the development server

npm run dev


Open your browser
Navigate to http://localhost:5173 (or the URL shown in your terminal)

Available Scripts

npm run dev – Start development server

npm run build – Build for production

npm run build:dev – Build for development mode

npm run preview – Preview production build

npm run lint – Run ESLint for code quality checks

Project Structure
AgriSathi-app/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── CameraScanner.tsx
│   │   ├── CropRecommendations.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── QuickActions.tsx
│   │   └── WeatherCard.tsx
│   ├── contexts/           # React contexts
│   │   ├── LanguageContext.tsx
│   │   ├── UserContext.tsx
│   │   └── WalletContext.tsx
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and API services
│   │   ├── api.ts
│   │   ├── mockApi.ts
│   │   └── realApi.ts
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Chat.tsx
│   │   ├── Community.tsx
│   │   ├── DiseaseDetection.tsx
│   │   ├── ExpertConsultation.tsx
│   │   ├── Profile.tsx
│   │   ├── Wallet.tsx
│   │   └── AgriCredits.tsx
│   ├── types/              # TypeScript type definitions
│   └── assets/             # Static assets
├── .env.example
├── package.json
├── tailwind.config.ts
└── vite.config.ts

Technology Stack

Frontend: React 18, TypeScript, Vite

Styling: Tailwind CSS, shadcn/ui

State Management: React Context API

Routing: React Router DOM

Forms: React Hook Form with Zod validation

HTTP Client: TanStack Query (React Query)

Build Tool: Vite

Code Quality: ESLint, TypeScript

API Integration
Mock API (Development)

Full functionality without external API keys

Simulated responses for all features

Suitable for development and testing

Real API (Production)

OpenWeather API for weather data

Plant.id API for disease detection

Custom agricultural APIs for crop recommendations

Real-time chatbot responses

Usage Guide
1. Authentication

Create an account or log in

Supports English and Hindi languages

2. Dashboard

View weather information and forecasts

Access quick actions

See personalized crop recommendations

3. AI Chatbot

Ask farming-related questions in Hindi or English

Get advice on crops, diseases, fertilizers, and more

Voice input support

Image-based disease identification

4. Disease Detection

Upload or capture plant leaf images

Receive AI-powered disease analysis

Get treatment recommendations

5. Community

Interact with other farmers

Share experiences and ask questions

Learn from experts

6. Expert Consultation

Book expert sessions

Receive personalized guidance

Video and text chat support

Environment Variables

Create a .env file in the root directory:

VITE_DEV_MODE=true

VITE_OPENWEATHER_API_KEY=your_key_here
VITE_PLANT_ID_API_KEY=your_key_here
VITE_AGRICULTURE_API_KEY=your_key_here

VITE_API_BASE_URL=https://your-api.com
VITE_AI_SERVICE_URL=https://your-ai-service.com

Deployment
Build for Production
npm run build

Deploy to Vercel

Connect the repository to Vercel

Configure environment variables

Deploy automatically on push

Deploy to Netlify

Build the project using npm run build

Upload the dist folder

Configure environment variables

Contributing

Fork the repository

Create a feature branch

Commit your changes

Push to your branch

Submit a pull request

License

This project is licensed under the MIT License. See the LICENSE file for details.

Support

Open an issue in the GitHub repository

Email: support@agrisathi.com

Refer to the Wiki for detailed documentation

Acknowledgments

Farmers and agricultural experts

Open-source community

shadcn/ui component library

Agricultural research organizations