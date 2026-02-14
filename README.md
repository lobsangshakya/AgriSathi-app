# AgriSathi

AgriSathi is a mobile-friendly web app built to help farmers with AI-assisted guidance, crop disease detection, and localized support in English and Hindi.

## Live Demo

https://agrisathi-38zh.onrender.com

---

## What this app does

Core user flows:

- Authentication: Email login + Phone OTP login/signup
- AI Chatbot: Ask farming questions in English or Hindi
- Disease Detection: Upload/capture a crop image and get analysis + guidance
- Language Toggle: Switch the UI between English and Hindi

Farmer-first UI:

- Simple dashboard focused on Chatbot and Crop Scanner
- Clear toasts for success/errors
- Mobile-first layout

---

## Tech Stack

- Frontend: React, TypeScript, Vite
- UI: Tailwind CSS + shadcn/ui
- Routing: React Router
- Data/Auth: Supabase (email + phone OTP)
- APIs (optional/production):
  - OpenWeather (weather)
  - Plant.id (disease detection)
  - Custom endpoints

---

## Project Structure

```
src/
  components/   UI components
  contexts/     User/Auth, Language, Wallet contexts
  pages/        Dashboard, Chat, Disease Detection
  services/     API services
  i18n/         translations
  lib/          API adapters
```

---

## Getting Started

### Prerequisites

- Node.js 18+

### Install & Run

```bash
git clone https://github.com/lobsangshakya/AgriSathi-app.git
cd AgriSathi-app
npm install
cp .env.example .env
npm run dev
```

Open in browser:

http://localhost:5173

### Build

```bash
npm run build
npm run preview
```

---

## Environment Variables

Create a `.env` file based on `.env.example`.

Typical keys:

```
VITE_OPENWEATHER_API_KEY=
VITE_PLANT_ID_API_KEY=
VITE_AGRICULTURE_API_KEY=
VITE_API_BASE_URL=
VITE_AI_SERVICE_URL=
```

If using Supabase authentication, configure Supabase keys as required.

---

## Authentication

Supported:

- Email sign in / sign up
- Phone OTP sign in / sign up
- Logout clears session and returns to dashboard

---

## Deployment

### Render

Recommended settings:

- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

Ensure SPA routing fallback is configured for React Router.

### Vercel / Netlify

- Build: `npm run build`
- Output: `dist`
- Enable SPA fallback

---

## Security Notes

- Never commit real API keys
- Use environment variables in production
- Configure OTP/auth providers correctly

---

## Troubleshooting

Common issues:

- i18n errors → check `src/i18n/translations.ts` for duplicates or stray commas
- OTP not sending → verify Supabase settings
- Weather not loading → check browser location permissions

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a pull request

---

## License

MIT