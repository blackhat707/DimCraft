# DimCraft

## Live Demo
**Try our app on [DimCraft](https://d33owmkv3xvucj.cloudfront.net/)!**

## Inspiration  
Hong Kong’s traditional crafts—such as **hand-carved mahjong tiles, painted porcelain, cheongsam, and neon sign**—are fading due to shrinking markets and an aging artisan community. 

**More than 70%** of craft shops have shut in recent years as demand wanes and rents spike, typical **revenues have fallen 30–50%** amid mass-produced competition, and **80% of artisans** say their children won’t continue the trade because of long hours, low pay, and little recognition. 

We wanted to build a bridge between the past and the future, enabling young people and global visitors to not only appreciate but also interact with these disappearing arts, and translating the appreciation into tangible support. **Because the most meaningful way to preserve a craft is to create a thriving economy around it.**

## What it does  
DimCraft is an **AI + AR e-commerce platform** where users can:  
- Explore craft stories through a swipe-card interface.  
- Use the **AI Creation Studio** to design their own craft pieces and directly commission artisans to bring them to life.  
- Experience **AR interactive virtual exhibitions** with 360° product views, real-world photo integration, and immersive storytelling.  
- Access a **city-wide cultural events calendar** for exhibitions, workshops, and community activities.  
- Support artisans by purchasing products, attending workshops, and visiting virtual/AR exhibitions.  

## How we built it  
- **Frontend**: A React 19 + TypeScript interface bundled with Vite, styled through Tailwind CSS (via CDN) and Framer Motion for micro-interactions to deliver the swipeable, mobile-first experience.
- **Backend - Platform APIs & data layer**: Modular NestJS endpoints for crafts, products, events, orders, and messaging run on TypeORM with a SQLite store, exposing REST routes that the frontend consumes via a typed API client with authenticated fetch helpers and offline fallbacks.
- **Function - AI Creation Studio**: A NestJS AI microservice wraps Google’s Imagen 4.0 (exposed through the @google/genai SDK) and returns base64 renders that the AiStudio view consumes and stores in the shared context, so artisans receive customizable design briefs.
- **Function - AR & experiential layer**: The Play screen ships downloadable USDZ assets (scanned by Reality Composer with iPhone)so visitors can launch Quick Look/WebAR sessions from their phones, complementing the narrative exhibition content in-app.

## Challenges we ran into  
- Limited digital archives for crafts like hand-carved mahjong required manual data collection.  
- Many artisans are elderly and unfamiliar with digital tools, so onboarding needed special care and training.  
- Balancing **AI-generated creativity** with respect for authentic craft aesthetics was challenging.  
- Ensuring sustainability: making the platform engaging for users while providing artisans with fair income.  

## Accomplishments that we're proud of  
- Built an early prototype of the **AI Creation Studio** that generates personalized craft designs.  
- Successfully piloted a working **AR exhibition demo** with 360° artifact viewing and real-world photo integration.  
- Engaged real artisans in co-design workshops to validate cultural and practical feasibility.  
- Developed a model for integrating cultural heritage into everyday digital life.  

## What we learned  
- Technology must act as a **bridge, not a replacement**, for traditional knowledge.  
- AR is powerful for creating immersive cultural experiences that attract young users.  
- The sustainability of cultural projects depends on building both **emotional connection** and **economic value** for artisans.  
- Community collaboration is as important as technical innovation.  

## Quick Start

### System Requirements
- **Node.js** v18+
- **npm** v8+
- Modern browser (Chrome, Firefox, Safari)

### Installation & Setup

1. **Clone the Project**
   ```bash
   git clone https://github.com/blackhat707/DimCraft.git
   cd DimCraft
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Environment Variables**
   Create a `.env.local` file in the repository root with the following content:
   ```bash
   VITE_GOOGLE_AI_API_KEY="<replace_this_with_your_api_key>"
   ```
   Both the Vite app and the NestJS API will consume it. You can use `.env.example` as a template.

4. **Run the Full Stack with Auto-Restarting env files**
   ```bash
   npm run dev:stack:watch
   ```

### Helpful npm Scripts
- `npm run dev` – starts the development server with frontend (Vite) and backend connection.
- `npm run build` – creates a production-ready build of the application.

### AI Setup

#### Environment variables
- GEMINI_API_KEY — Google AI Studio API key

Place the variable in your shell or a .env loaded by your process manager before starting the server.

#### Images API (Imagen 4) access
The endpoint api/ai/generate-image uses the Google GenAI SDK with model gemini-2.5-flash-latest.
Google’s Images API is not available on free keys. If you see: "Imagen API is only accessible to billed users at this time."

Do this:
1. Go to Google AI Studio > API Keys > Create or select your key
2. Upgrade to a paid/billing-enabled key and ensure Images API access is enabled for that key
3. Copy the key and export it as GEMINI_API_KEY on the server
4. Restart the NestJS server

#### Troubleshooting
- 400 INVALID_ARGUMENT with billed-users message: your key isn’t Images-enabled. Use a paid AI Studio key.
- 401 or 403: wrong key, missing export, or project/org restrictions.
- Region errors: Images is only in certain regions; AI Studio routes automatically. Vertex requires explicit regions.

**Architecture**
- Frontend: React + Nginx on Cloud Run (AWS)
- Backend: NestJS API on Cloud Run (Convex)
- Database: PostgreSQL (bundled with backend)

## License
Released under the MIT License.