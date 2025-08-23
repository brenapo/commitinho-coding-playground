import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoboCorreioGame from "@/components/games/robocorreiogame";
import Navigation from "@/components/ui/navigation";
import ChatWidget from "@/components/ui/chat-widget";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Index from "./pages/Index";
import Jogos from "./pages/Jogos";
import Aventura from "./pages/Aventura";
import Licao from "./pages/Licao";
import NotFound from "./pages/NotFound";

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
  <Route path="/" element={<Index />} />
  <Route path="/jogos" element={<Jogos />} />
  <Route path="/aventura" element={<Aventura />} />
  <Route path="/licao/:lessonId" element={<Licao />} />

              {/* Jogo: Robo-Correio do Commitinho */}
  <Route
    path="/jogo/robocorreio"
    element={<Navigate to="/jogo/robocorreio/1" replace />}
  />
  <Route
    path="/jogo/robocorreio/:levelId"
    element={<RoboCorreioGame />}
  />

  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
