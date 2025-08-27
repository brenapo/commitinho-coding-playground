import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Gamepad2, Trophy, MessageCircle, Play, RotateCcw, Star } from "lucide-react";
import { useSupabaseProgress } from '@/hooks/useSupabaseProgress';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePersonalization } from '@/utils/personalization';

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { userData, personalizeText, hasCompletedIntro } = usePersonalization();
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
    
    if (hasCompletedIntro) {
      // User completed intro - check if has progress
      if (hasProgress) {
        navigate('/aventura/progresso');
      } else {
        navigate('/modulos');
      }
    } else {
      // First time - go to presentation
      navigate('/apresentacao');
    }
  };

  const handleResetProgress = () => {
    resetUserProgress();
    setShowResetDialog(false);
  };

  const stats = getProgressStats();
  
  if (isMobile) {
    return (
      <div className="h-screen bg-commitinho-bg flex flex-col justify-center items-center px-4 overflow-hidden">
        {/* Mobile optimized single screen layout */}
        <div className="text-center max-w-sm mx-auto">
          {/* Mascote compacto */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img 
                src="/assets/commitinho-running.png" 
                alt="Commitinho - Mascote da programação"
                className="w-32 h-32 commitinho-mascot animate-float drop-shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-arcade opacity-20 rounded-full blur-2xl animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-4 leading-tight">
            <span className="text-commitinho-text">Aprenda programação </span>
            <span className="gradient-text">brincando!</span>
          </h1>
          
          <p className="text-sm text-commitinho-text-soft mb-6">
            Mini-jogos divertidos para explorar lógica e criatividade.
          </p>
          
          {/* Seção informativa compacta para mobile */}
          <div className="bg-commitinho-surface-2 rounded-lg p-3 mb-6">
            <div className="text-xs text-commitinho-text font-medium mb-1">💾 Por que Commitinho?</div>
            <div className="text-xs text-commitinho-text-soft">
              "Commit = salvar código!"
            </div>
          </div>
          
          <div className="text-xs text-commitinho-warning mb-8 font-medium">
            {personalizeText("Commitinho, seu amiguinho ♥")}
          </div>
          
          {/* Botões principais */}
          <div className="flex flex-col gap-3">
            <Button 
              size="lg" 
              onClick={handleStartAdventure}
              className="w-full bg-gradient-arcade text-white font-semibold shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300 py-4"
            >
              <Gamepad2 className="mr-2 h-5 w-5" />
              {hasProgress ? 'Continuar Aventura' : 'Começar Aventura'}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/jogos')}
              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground py-4"
            >
              Ver Jogos
            </Button>
            
            {hasProgress && (
              <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-commitinho-surface-2 text-commitinho-text-soft hover:bg-commitinho-surface-2 hover:text-commitinho-text py-2 text-xs"
                  >
                    <RotateCcw className="mr-2 h-3 w-3" />
                    Reiniciar Progresso
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-commitinho-surface border-commitinho-surface-2 mx-4 max-w-sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-commitinho-text">Reiniciar Progresso?</AlertDialogTitle>
                    <AlertDialogDescription className="text-commitinho-text-soft text-sm">
                      Esta ação irá apagar todo o seu progresso atual. Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col gap-2">
                    <AlertDialogCancel className="w-full bg-commitinho-surface-2 text-commitinho-text border-commitinho-surface-2 hover:bg-commitinho-surface">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleResetProgress}
                      className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Sim, Reiniciar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop layout
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
              
              {/* Seção Por que Commitinho? */}
              <div className="bg-commitinho-surface-2 rounded-lg p-4 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                <div className="text-sm text-commitinho-text font-medium mb-2">💾 Por que Commitinho?</div>
                <div className="text-xs text-commitinho-text-soft">
                  "Meu nome vem de 'commit' - que é como salvamos nosso código no computador!"
                </div>
              </div>
              
              <div className="text-xs sm:text-sm text-commitinho-warning mb-6 sm:mb-8 font-medium">
                {personalizeText("Commitinho, seu amiguinho ♥")}
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

      {/* Seção Como Funciona a Aventura - Desktop */}
      <section className="px-4 py-8 sm:py-12 bg-commitinho-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-commitinho-text">
            Como funciona a Aventura?
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <Card className="bg-commitinho-surface-2 border-commitinho-surface-2 text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="text-3xl mb-3">🎯</div>
                <div className="text-sm font-bold text-commitinho-text mb-2">Leia a dica</div>
                <div className="text-xs text-commitinho-text-soft">Entenda o desafio</div>
              </CardContent>
            </Card>
            
            <Card className="bg-commitinho-surface-2 border-commitinho-surface-2 text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="text-3xl mb-3">✅</div>
                <div className="text-sm font-bold text-commitinho-text mb-2">Escolha a resposta</div>
                <div className="text-xs text-commitinho-text-soft">Monte o código</div>
              </CardContent>
            </Card>
            
            <Card className="bg-commitinho-surface-2 border-commitinho-surface-2 text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="text-3xl mb-3">⭐</div>
                <div className="text-sm font-bold text-commitinho-text mb-2">Ganhe pontos</div>
                <div className="text-xs text-commitinho-text-soft">Acumule XP</div>
              </CardContent>
            </Card>
            
            <Card className="bg-commitinho-surface-2 border-commitinho-surface-2 text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="text-3xl mb-3">🚀</div>
                <div className="text-sm font-bold text-commitinho-text mb-2">Suba de nível</div>
                <div className="text-xs text-commitinho-text-soft">Desbloqueie conteúdo</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Progresso inicial personalizado */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 text-center">
            <h3 className="text-lg font-bold text-commitinho-text mb-4">
              {personalizeText("Sua jornada, [NOME]!")}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl">🔥</div>
                <div className="text-sm font-bold text-commitinho-text">Sequência: {userData.streakDays} dias</div>
              </div>
              <div>
                <div className="text-2xl">⭐</div>
                <div className="text-sm font-bold text-commitinho-text">Nível: {userData.level}</div>
              </div>
              <div>
                <div className="text-2xl">💪</div>
                <div className="text-sm font-bold text-commitinho-text">Meta: 3 exercícios hoje!</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section for returning users - only on desktop */}
      {!isMobile && hasProgress && stats && (
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


    </div>
  );
};

export default Index;
