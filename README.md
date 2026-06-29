# Atmos 🌤️

> Aurora weather intelligence. A premium, glassmorphic weather dashboard featuring 3D global visualizations and smart lifestyle insights.

![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Atmos is a highly interactive, responsive web application designed to provide accurate meteorological data wrapped in a beautiful "Aurora Glass" UI. It moves beyond standard weather apps by offering real-time 3D geospatial tracking and contextual lifestyle recommendations based on local atmospheric conditions.

---

## ✨ Key Features

* **Interactive 3D Globe:** Navigate global weather patterns using a fluid, WebGL-powered 3D visualization (`react-globe.gl`).
* **Aurora Glassmorphism UI:** A meticulously crafted, frosted-glass interface that adapts dynamically to current weather conditions, built with Tailwind CSS and Framer Motion.
* **Smart Decisions Engine:** Provides actionable lifestyle recommendations (e.g., UV protection, driving visibility, heat advisories) driven by a rule-based engine parsing real-time data.
* **Persistent Favorites:** Save frequently checked cities ("Starred Locations") for quick access using browser `localStorage`.
* **Global Unit State:** Instantly toggle between Celsius and Fahrenheit across the entire application without requiring new API requests.
* **High-Fidelity Forecasting:** Powered by the Open-Meteo API for accurate, low-latency current and hourly weather data.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Visualizations:** [react-globe.gl](https://globe.gl/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Weather API:** [Open-Meteo](https://open-meteo.com/) (No API key required)

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed on your local machine:
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (comes with Node.js) or **pnpm** / **yarn**
* **Git**

### 1. Clone the Repository

```bash
git clone [https://github.com/Aum-Ghodasara/weather-app.git](https://github.com/Aum-Ghodasara/weather-app.git)
cd weather-app
2. Install Dependencies
Install the required packages using your preferred package manager:

Bash
npm install
# or
yarn install
# or
pnpm install
3. Setup Environment Variables
Create a .env.local file in the root directory of the project. While Open-Meteo does not require an API key, you can define other configuration variables here if you expand the project (e.g., geocoding APIs).

Bash
touch .env.local
(Add any necessary environment variables here if you add rate-limited APIs later).

4. Run the Development Server
Start the Turbopack-enabled development server:

Bash
npm run dev
# or
yarn dev
Open http://localhost:3000 with your browser to see the application running.

📂 Project Structure
A brief overview of the core file structure:

Plaintext
atmos-weather/
├── src/
│   ├── app/                  # Next.js App Router pages and layouts
│   ├── components/
│   │   ├── weather/          # Core weather UI cards (Hero, Highlights, Globe)
│   │   └── layout/           # Theme wrappers and structural components
│   ├── hooks/                # Custom React hooks (useWeather, useLocation)
│   └── lib/                  # Utilities, API fetchers, and type definitions
├── public/                   # Static assets (fonts, images)
├── tailwind.config.ts        # Tailwind theme and plugin configuration
└── tsconfig.json             # TypeScript compiler rules

🧠 Architectural Notes
WebGL Rendering: The react-globe.gl component is dynamically imported with ssr: false to prevent Next.js server-side rendering conflicts.

Z-Index Management: Strict stacking contexts are maintained to ensure dropdown menus correctly overlay the heavy backdrop-blur utilities of the glass UI.

Grid Layouts: The dashboard utilizes strict CSS Grid (grid-rows-2, items-stretch) to maintain mathematically perfect horizontal alignment across complex asymmetrical card layouts.

🤝 Contributing
Contributions, issues, and feature requests are welcome!
If you have suggestions to improve the app, please fork the repo and create a pull request.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request
