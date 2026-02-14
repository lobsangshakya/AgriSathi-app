# AgriSathi - Smart Agricultural Assistance System

AgriSathi is a mobile-friendly web application built with React, TypeScript, and Tailwind CSS, designed to empower farmers with AI-powered tools, multilingual assistance, and real-time agricultural insights.

## Features

### Core Features

- **AI Chatbot**: Ask questions in Hindi or English. Voice input and image support included.
- **Disease Detection**: Upload or capture plant leaves for AI-powered analysis.
- **Weather Information**: Real-time forecasts.
- **Crop Recommendations**: Personalized suggestions.
- **Multilingual Support**: Full support for Hindi and English.

### Technical Highlights

- Responsive design, mobile-first.
- Offline capability for core features.
- Real-time data updates.
- Secure authentication (email/phone OTP).
- Clean, farmer-focused UI/UX using shadcn/ui components.

## Authentication

Post-login redirect now goes to / (dashboard).

### Phone OTP Flow

Enter phone (and name for signup) → send OTP → verify → sign in/create account.

Uses sendOTP, signInWithPhone, signUpWithPhone from UserContext (mock + Supabase).

Success/error toasts bilingual (English/Hindi).

Logout clears session and redirects to /.

## Chatbot

Placeholder: "अपना सवाल यहाँ लिखें..." / "Type your question here...".

Added prompt line: "हिंदी या अंग्रेज़ी में पूछें" / "Ask in Hindi or English".

Send button uses primary green (bg-green-600).

Working Chatbot and API integration unchanged.

## Disease Detection / Scanner

Flow unchanged: upload or camera → Start Analysis → result (disease, confidence, treatment) in selected language.

Bilingual copy and toasts maintained.

## UI/UX

Dashboard: header (logo, user, time, Logout) + two actions (Farming Assistant, Crop Scanner). Quick Info and Account Status removed.

Bottom navigation: Home, Crop Scanner, Chat only. Tips bar and Quick Access removed.

Layout & login screen background: bg-gray-50.

Colors: green for main actions, blue for scanner, gray for text.

Font: Inter; base 16px for mobile.

## Code

Debug console.log removed or wrapped with import.meta.env.DEV.

console.error retained.

Unused variables and imports cleaned.

## Deployment

npm run build completes successfully.

npm run dev runs without errors.

Vercel/Netlify configuration unchanged; environment variables functional.

CHANGES_SUMMARY.md created for deployment/handover.

All main features (login/email/phone OTP, logout, Chatbot, Scanner) are wired end-to-end with simplified, farmer-focused UI and ready for production deployment.

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/AgriSathi-app.git
cd AgriSathi-app
npm install
cp .env.example .env
```

### Configure .env

```
VITE_OPENWEATHER_API_KEY=your_key
VITE_PLANT_ID_API_KEY=your_key
VITE_AGRICULTURE_API_KEY=your_key
VITE_API_BASE_URL=https://api.agrisathi.com
VITE_AI_SERVICE_URL=https://ai.agrisathi.com
```

### Run Locally

```bash
npm run dev
```

Open http://localhost:5173

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Run ESLint

## Project Structure

```
src/
├─ components/      # UI components (shadcn/ui)
├─ contexts/        # React contexts (User, Wallet, Language)
├─ hooks/           # Custom hooks
├─ lib/             # API services (mock & real)
├─ pages/           # Pages: Dashboard, Chat, Scanner, etc.
├─ types/           # TypeScript definitions
└─ assets/          # Static assets
```

## Deployment

### Render Web Service Settings

To deploy this app on Render as a static web service:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

The `npm run start` script uses `serve` to efficiently serve production `dist` folder on port provided by Render (`$PORT`).

### SPA Routing

A `public/_redirects` file is included to handle SPA routing fallback, ensuring that React Router works correctly on page refreshes and deep links.

```
/* /index.html 200
```

## Contributing

Fork → create branch → commit → push → pull request

## Support

Email: lobsangshakya5@gmail.com

Refer to Wiki for documentation

## License

MIT License
