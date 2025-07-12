import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.3s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "bounce-in": "bounce-in 0.6s ease-out",
        "pulse-slow": "pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "gradient-secondary": "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        "gradient-accent": "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        "gradient-success": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "gradient-warning": "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        "gradient-destructive": "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        "gradient-app": "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        "gradient-sky": "linear-gradient(135deg, #87ceeb 0%, #4682b4 100%)",
        "gradient-grass": "linear-gradient(135deg, #90ee90 0%, #32cd32 100%)",
        "gradient-sunset": "linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)",
        "gradient-ocean": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "gradient-forest": "linear-gradient(135deg, #228b22 0%, #006400 100%)",
        "gradient-desert": "linear-gradient(135deg, #f4a460 0%, #cd853f 100%)",
        "gradient-mountain": "linear-gradient(135deg, #696969 0%, #2f4f4f 100%)",
        "gradient-river": "linear-gradient(135deg, #4169e1 0%, #1e90ff 100%)",
        "gradient-meadow": "linear-gradient(135deg, #98fb98 0%, #90ee90 100%)",
        "gradient-orchard": "linear-gradient(135deg, #ffa500 0%, #ff8c00 100%)",
        "gradient-vineyard": "linear-gradient(135deg, #8b0000 0%, #800020 100%)",
        "gradient-harvest": "linear-gradient(135deg, #daa520 0%, #b8860b 100%)",
        "gradient-spring": "linear-gradient(135deg, #98fb98 0%, #32cd32 100%)",
        "gradient-summer": "linear-gradient(135deg, #ffd700 0%, #ffa500 100%)",
        "gradient-autumn": "linear-gradient(135deg, #ff6347 0%, #cd5c5c 100%)",
        "gradient-winter": "linear-gradient(135deg, #f0f8ff 0%, #e6e6fa 100%)",
      },
      boxShadow: {
        "glow": "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-green": "0 0 20px rgba(16, 185, 129, 0.3)",
        "glow-yellow": "0 0 20px rgba(245, 158, 11, 0.3)",
        "glow-red": "0 0 20px rgba(239, 68, 68, 0.3)",
        "inner-glow": "inset 0 0 10px rgba(59, 130, 246, 0.2)",
        "soft": "0 2px 15px rgba(0, 0, 0, 0.1)",
        "medium": "0 4px 25px rgba(0, 0, 0, 0.15)",
        "strong": "0 8px 40px rgba(0, 0, 0, 0.2)",
        "floating": "0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.2)",
        "card": "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
        "card-hover": "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)",
        "button": "0 2px 4px rgba(0, 0, 0, 0.1)",
        "button-hover": "0 4px 8px rgba(0, 0, 0, 0.15)",
        "input": "0 0 0 3px rgba(59, 130, 246, 0.1)",
        "input-error": "0 0 0 3px rgba(239, 68, 68, 0.1)",
        "input-success": "0 0 0 3px rgba(16, 185, 129, 0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      minHeight: {
        "screen-75": "75vh",
        "screen-50": "50vh",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
