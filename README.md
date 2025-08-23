# 🤖 Commitinho - Educational Coding Games

An educational platform for teaching programming concepts through interactive games. Designed for children and programming beginners, featuring friendly feedback and a playful interface.

## 🎮 Available Games

### 1. **Commitinho's Robot Mail**
- **Concept**: Command sequences and repetition
- **Objective**: Program the robot to pick up ✉️ and deliver to 📮
- **Commands**: Forward, Turn Left/Right, Pick Up, Deliver
- **Levels**: 1 available

### 2. **Potion Laboratory**
- **Concept**: Conditional structures (If/Then/Else)
- **Objective**: Create potions with the correct color using ingredients
- **Logic**: If/Else with ingredients (🍓 strawberry, 🫐 blueberry, 🌿 leaf)
- **Levels**: 1 available

## 🛠 Tech Stack

- **Frontend**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (authentication + progress persistence)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/brenapo/commitinho-coding-playground.git
cd commitinho-coding-playground

# Install dependencies
npm install

# Run the project
npm run dev
```

Vite will start the server at `http://localhost:5173`

### Environment Variables
Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## 📁 Project Structure

```
src/
├── components/
│   ├── games/
│   │   ├── robocorreiogame.tsx    # Robot Mail Game
│   │   └── potionlabgame.tsx      # Potion Laboratory Game
│   ├── ui/                        # shadcn/ui components
│   └── auth/                      # Authentication components
├── pages/
│   ├── Jogos.tsx                  # Games catalog
│   ├── Aventura.tsx              # Adventure page
│   ├── Licao.tsx                 # Lesson system
│   └── Index.tsx                 # Home page
├── data/
│   └── lessons/                   # Lesson data in TypeScript
├── hooks/                         # Custom hooks (auth, progress)
├── services/                      # Services (Supabase)
└── lib/                          # Utilities and configurations
```

## 🎯 Main Routes

- **`/`** - Home page
- **`/jogos`** - Games catalog
- **`/jogo/robocorreio/1`** - Robot Mail Level 1
- **`/jogo/pocoes/1`** - Potion Laboratory Level 1
- **`/aventura`** - Adventure mode
- **`/licao/:id`** - Lesson system

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm run preview      # Preview build locally

# Linting
npm run lint         # Code verification with ESLint
```

## ☁️ Supabase Configuration

### 1. Project Creation
1. Create an account on [Supabase](https://supabase.com)
2. Create a new project
3. Get URL and anonymous key from Settings > API

### 2. Authentication Setup
- **Site URL**: Production URL
- **Redirect URLs**: Add development and production URLs
- **Providers**: Configure as needed

### 3. Required Tables
The project uses Supabase to persist user progress. Tables are automatically created by the services.

## 🚢 Deployment

### Vercel/Netlify
```bash
# Build command
npm run build

# Output directory  
dist

# Environment variables
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## 🗺 Roadmap

### Upcoming Features
- [ ] More levels for existing games
- [ ] New games (loops, functions)
- [ ] Scoring system and achievements
- [ ] Execution speed control
- [ ] Sound and visual effects
- [ ] Interactive tutorial
- [ ] Multiplayer mode

### Technical Improvements
- [ ] Automated testing
- [ ] Performance optimization
- [ ] PWA (Progressive Web App)
- [ ] Internationalization (i18n)

## 🤝 Contributing

1. Fork the project
2. Create a branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'feat: add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ to make learning programming fun!**