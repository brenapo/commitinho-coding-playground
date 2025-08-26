import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Gamepad2, Trophy, MessageCircle, Play, RotateCcw, Star } from "lucide-react";
import { useSupabaseProgress } from '@/hooks/useSupabaseProgress';

const Index = () => {
  const navigate = useNavigate();
  const { 
    progress, 
    hasProgress, 
    isLoading,
    resetUserProgress, 
    getProgressStats, 
    getNextLessonId, 
    shouldShowReviewPrompt 
  } = useSupabaseProgress();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleStartAdventure = () => {
    // Don't proceed if still loading
    if (isLoading) {
      return;
    }
    
    // Check if user has a name saved (completed welcome flow)
    const savedName = localStorage.getItem('commitinho.display_name');
    const hasCompletedWelcome = savedName && savedName.length >= 2;
    
    if (hasProgress && hasCompletedWelcome) {
      // User has progress AND completed welcome - go to progress page
      navigate('/aventura/progresso');
    } else {
      // First time OR hasn't completed welcome - go to welcome page
      navigate('/aventura/boas-vindas');
    }
  };

  const handleResetProgress = () => {
    resetUserProgress();
    setShowResetDialog(false);
  };

  const stats = getProgressStats();
  return (
    <div className="min-h-screen bg-commitinho-bg">
      {/* Hero Section */}
      <section className="relative px-4 py-12 sm:py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Conteúdo do Hero */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="text-commitinho-text">Aprenda programação </span>
                <span className="gradient-text">brincando!</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-commitinho-text-soft mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                Mini-jogos divertidos para explorar lógica e criatividade.
                Descubra o mundo da programação de um jeito super legal!
              </p>
              
              <div className="text-xs sm:text-sm text-commitinho-warning mb-6 sm:mb-8 font-medium">
                "Commitinho, seu amiguinho &lt;3"
              </div>
              
              <div className="flex flex-col gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  onClick={handleStartAdventure}
                  className="w-full sm:w-auto bg-gradient-arcade text-white font-semibold shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
                >
                  <Gamepad2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {hasProgress ? 'Continuar Aventura' : 'Começar Aventura'}
                </Button>
                {hasProgress ? (
                  <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="w-full sm:w-auto border-commitinho-surface-2 text-commitinho-text-soft hover:bg-commitinho-surface-2 hover:text-commitinho-text text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
                      >
                        <RotateCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Reiniciar Progresso
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-commitinho-surface border-commitinho-surface-2 mx-4 max-w-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-commitinho-text text-lg sm:text-xl">Reiniciar Progresso?</AlertDialogTitle>
                        <AlertDialogDescription className="text-commitinho-text-soft text-sm sm:text-base">
                          Esta ação irá apagar todo o seu progresso atual, incluindo XP, estrelas e desbloqueios. Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto bg-commitinho-surface-2 text-commitinho-text border-commitinho-surface-2 hover:bg-commitinho-surface">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleResetProgress}
                          className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Sim, Reiniciar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate('/jogos')}
                    className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
                  >
                    Ver Jogos
                  </Button>
                )}
              </div>
            </div>
            
            {/* Mascote Hero */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative">
                <img 
                  src="/assets/commitinho-running.png" 
                  alt="Commitinho - Mascote da programação"
                  className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 commitinho-mascot animate-float drop-shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-arcade opacity-20 rounded-full blur-3xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section for returning users */}
      {hasProgress && stats && (
        <section className="px-4 py-8 sm:py-12 bg-commitinho-surface-2">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-commitinho-text">
              Seu Progresso
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Card className="bg-commitinho-surface border-commitinho-surface-2 text-center">
                <CardContent className="p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-commitinho-warning mb-1">{stats.xp}</div>
                  <div className="text-xs sm:text-sm text-commitinho-text-soft">XP Total</div>
                </CardContent>
              </Card>
              
              <Card className="bg-commitinho-surface border-commitinho-surface-2 text-center">
                <CardContent className="p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-primary mb-1">{stats.streak}</div>
                  <div className="text-xs sm:text-sm text-commitinho-text-soft">Dias Seguidos</div>
                </CardContent>
              </Card>
              
              <Card className="bg-commitinho-surface border-commitinho-surface-2 text-center">
                <CardContent className="p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-secondary mb-1">{stats.stars}</div>
                  <div className="text-xs sm:text-sm text-commitinho-text-soft">Estrelas</div>
                </CardContent>
              </Card>
              
              <Card className="bg-commitinho-surface border-commitinho-surface-2 text-center">
                <CardContent className="p-3 sm:p-4">
                  <div className="text-xs sm:text-sm font-bold text-commitinho-success mb-1 leading-tight">{stats.currentSkill}</div>
                  <div className="text-xs text-commitinho-text-soft">Posição Atual</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <p className="text-commitinho-text-soft mb-4">
                Continue de onde parou ou explore a árvore de habilidades!
              </p>
              <Button 
                onClick={handleStartAdventure}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Trophy className="mr-2 h-4 w-4" />
                Ver Árvore de Habilidades
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Cards "O que vem por aí" */}
      <section className="px-4 py-12 sm:py-16 bg-commitinho-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4 text-commitinho-text">
            O que vem por aí
          </h2>
          <p className="text-center text-commitinho-text-soft mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Estamos preparando experiências incríveis para tornar seu aprendizado ainda mais divertido!
          </p>
          
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {/* Card 1: Mini-jogos */}
            <Card className="bg-commitinho-surface-2 border-commitinho-surface-2 hover:shadow-glow-primary transition-all duration-300 group">
              <CardHeader className="text-center px-4 py-4 sm:px-6 sm:py-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-arcade rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:animate-pixel-glow">
                  <Gamepad2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-commitinho-text text-lg sm:text-xl">Mini-jogos</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                <CardDescription className="text-commitinho-text-soft text-center text-sm sm:text-base">
                  Jogos interativos que ensinam conceitos de programação como sequência, repetição e condições de forma divertida.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 2: Conquistas */}
            <Card className="bg-commitinho-surface-2 border-commitinho-surface-2 hover:shadow-glow-secondary transition-all duration-300 group">
              <CardHeader className="text-center px-4 py-4 sm:px-6 sm:py-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:animate-pixel-glow">
                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-commitinho-text text-lg sm:text-xl">Conquistas</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                <CardDescription className="text-commitinho-text-soft text-center text-sm sm:text-base">
                  Colete estrelas e adesivos conforme completa os desafios. Cada vitória é uma nova descoberta!
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 3: Dicas do Commitinho */}
            <Card className="bg-commitinho-surface-2 border-commitinho-surface-2 hover:shadow-glow-warning transition-all duration-300 group">
              <CardHeader className="text-center px-4 py-4 sm:px-6 sm:py-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-commitinho-success rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:animate-pixel-glow">
                  <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-commitinho-success-foreground" />
                </div>
                <CardTitle className="text-commitinho-text text-lg sm:text-xl">Dicas do Commitinho</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                <CardDescription className="text-commitinho-text-soft text-center text-sm sm:text-base">
                  Seu amiguinho digital sempre pronto para te ajudar com dicas e encorajamento durante a jornada.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
