import type { Config } from "tailwindcss"
const shadcnConfig = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      ...shadcnConfig.theme.extend,
      colors: {
        ...shadcnConfig.theme.extend.colors,
        solana: {
          purple: "#9945FF",
          cyan: "#14F195",
          blue: "#00C2FF",
        },
        // New premium color palette
        premium: {
          purple: "#9333ea",
          pink: "#ec4899",
          blue: "#3b82f6",
          lightBlue: "#60a5fa",
          "dark-blue": "#0f172a",
        },
        // Gradient definitions
        gradient: {
          blue: "#1e40af",
          purple: "#7e22ce",
          pink: "#be185d",
        },
      },
      animation: {
        ...shadcnConfig.theme.extend.animation,
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        "gradient-xy": "gradient-xy 15s ease infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        ...shadcnConfig.theme.extend.keyframes,
        "gradient-y": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "center top",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "center center",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      backgroundImage: {
        "gradient-premium":
          "linear-gradient(to right, #0f172a, #1e293b, #0f172a), radial-gradient(circle at top right, rgba(126, 34, 206, 0.3), rgba(236, 72, 153, 0.3), rgba(0, 0, 0, 0))",
        "gradient-card": "linear-gradient(to bottom right, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))",
        "gradient-button": "linear-gradient(to right, #7e22ce, #be185d)",
        "gradient-header": "linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))",
        "gradient-sidebar": "linear-gradient(to bottom, #0f172a, #1e293b)",
        "gradient-glow":
          "radial-gradient(circle at center, rgba(126, 34, 206, 0.15), rgba(236, 72, 153, 0.15), rgba(0, 0, 0, 0))",
      },
      boxShadow: {
        premium:
          "0 10px 30px -10px rgba(2, 6, 23, 0.8), 0 0 5px 0 rgba(126, 34, 206, 0.2), 0 0 10px 0 rgba(236, 72, 153, 0.1)",
        "premium-hover":
          "0 10px 40px -10px rgba(2, 6, 23, 0.8), 0 0 10px 0 rgba(126, 34, 206, 0.3), 0 0 15px 0 rgba(236, 72, 153, 0.2)",
        glow: "0 0 15px rgba(126, 34, 206, 0.5), 0 0 30px rgba(236, 72, 153, 0.3)",
        card: "0 4px 20px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
      },
    },
  },
  plugins: [...shadcnConfig.plugins],
}
export default config
