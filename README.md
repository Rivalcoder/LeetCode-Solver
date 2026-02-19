# LeetCode Algorithm Visualizer 🚀

A Next.js application powered by Google Gemini AI that visualizes LeetCode problems with interactive flowcharts and step-by-step logic animations.

## Features ✨

- **AI-Powered Explanations**: Uses Gemini 1.5 Flash to generate deep explanations.
- **Visual Flowcharts**: Automatically renders Mermaid.js flowcharts for any algorithm.
- **Step-by-Step Animation**: Walk through the algorithm's execution logic interactively.
- **Comparison**: View both Brute Force and Optimized solutions side-by-side with complexity analysis.
- **Dark Mode Aesthetic**: Modern, glassmorphic UI with smooth animations.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Access**:
   Navigate to [http://localhost:3000](http://localhost:3000). You will need a **Google Gemini API Key** (free tier works great).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: Google Generative AI SDK (`@google/generative-ai`)
- **Visualization**: `mermaid` (Flowcharts), `framer-motion` (Animations)
- **Styling**: CSS Modules / Global CSS (No Tailwind dependency unless requested)
- **Icons**: Lucide React

## Project Structure

- `app/page.tsx`: Main application logic.
- `lib/gemini.ts`: AI interaction layer.
- `components/Visualizer.tsx`: The core visualization component.
- `components/MermaidChart.tsx`: Dynamic chart rendering.
