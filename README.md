# Commitinho — Robo-Mail (Vite + React + TypeScript)

An educational coding game to teach core programming ideas (sequence and repetition) by guiding a little mail robot to **pick up a letter** and **deliver it to the mailbox**. Built for kids, with gentle feedback and a playful UI.

## Tech Stack
- **Vite** + **React** + **TypeScript**
- **shadcn-ui** + **Tailwind CSS**
- **Supabase** (auth/data)
- Icons: **lucide-react**


## Getting Started

### Prerequisites
- **Node.js 18+** and **npm** (or pnpm/yarn)

### Install & Run
```bash
npm i
npm run dev
Vite will print the local URL in the terminal (e.g. http://localhost:5173 or your configured port).

Environment Variables
Create a .env.local file in the project root:

ini
Copy
Edit
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
App Routes
Games catalog: /jogos

Play Robo-Mail (Level 1): /jogo/robocorreio/1

Lessons: /licao/:lessonId

Adventure / home: /aventura

Tip: during development, open http://localhost:<PORT>/jogo/robocorreio/1.

Project Structure (excerpt)
bash
Copy
Edit
src/
  components/
    games/
      robocorreiogame.tsx        # Robo-Mail Level 1 (board, commands, execution)
  pages/
    Jogos.tsx                    # Games catalog (Robo-Mail enabled)
    Licao.tsx                    # Lesson player
    Aventura.tsx                 # Adventure / home
  components/ui/…                # shadcn-ui components
  index.css                      # global styles (includes robot “bump” animation)
  main.tsx                       # Vite entry
  App.tsx                        # Router
Available Scripts
npm run dev — start Vite dev server with HMR

npm run build — production build to dist/

npm run preview — preview the built app locally

Supabase Configuration (Auth/CORS)
In your Supabase project:

Authentication → URL Configuration

Site URL: your production URL (when you deploy)

Additional Redirect URLs: add your dev URL (e.g., http://localhost:5173)

CORS (and Storage CORS, if you use Storage):

Add your dev and production URLs

Deployment (without Lovable)
Any static host works. Example with Vercel or Netlify:

Build command: npm run build

Output directory: dist

Set the env vars VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the hosting dashboard.

Roadmap (next)
Execution speed control (Slow / Normal / Fast)

More Robo-Mail levels (introduce obstacles, turns, and efficiency goals)

Stars/XP integration with Supabase progress

Optional PNGs for letter/mailbox; sound effects and polish

License
MIT

css
Copy
Edit

If you want a shorter or more formal version, tell me your preference and I’ll tailor 
