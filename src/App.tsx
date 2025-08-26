import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navigation from "@/components/ui/navigation";
import ChatWidget from "@/components/ui/chat-widget";
import { AuthProvider } from "@/components/auth/AuthProvider";

import Index from "./pages/Index";
import Jogos from "./pages/Jogos";
import Aventura from "./pages/Aventura";
import BoasVindas from "./pages/BoasVindas";
import ProgressoAventura from "./pages/ProgressoAventura";
import Licao from "./pages/Licao";
import NotFound from "./pages/NotFound";

import RoboCorreioGame from "@/components/games/robocorreiogame";
import PotionLabGame from "@/components/games/potionlabgame";
import BugHuntGame from "./components/games/bughuntgame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-commitinho-bg">
            <Navigation />
            <main>
              <Routes>
                {/* Páginas principais */}
                <Route path="/" element={<Index />} />
                <Route path="/jogos" element={<Jogos />} />
                <Route path="/aventura" element={<Aventura />} />
                <Route path="/aventura/boas-vindas" element={<BoasVindas />} />
                <Route path="/aventura/progresso" element={<ProgressoAventura />} />
                <Route path="/licao/:lessonId" element={<Licao />} />

                {/* Jogo: Robo-Correio */}
                <Route
                  path="/jogo/robocorreio"
                  element={<Navigate to="/jogo/robocorreio/1" replace />}
                />
                <Route
                  path="/jogo/robocorreio/:levelId"
                  element={<RoboCorreioGame />}
                />

                {/* Jogo: Laboratório de Poções */}
                <Route
                  path="/jogo/pocoes"
                  element={<Navigate to="/jogo/pocoes/1" replace />}
                />
                <Route
                  path="/jogo/pocoes/:levelId"
                  element={<PotionLabGame />}
                />

                <Route
                  path="/jogo/caca-aos-bugs" 
                  element={<BugHuntGame />} 
                 />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <ChatWidget />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
