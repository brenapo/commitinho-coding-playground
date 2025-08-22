import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Gamepad2, Trophy, MessageCircle, Play, RotateCcw, Star } from "lucide-react";
import { useProgress } from '@/hooks/useProgress';

const Index = () => {
  const navigate = useNavigate();
  const { 
    progress, 
    hasProgress, 
    resetUserProgress, 
    getProgressStats, 
    getNextLessonId, 
    shouldShowReviewPrompt 
  } = useProgress();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleStartAdventure = () => {
    if (hasProgress) {
      // Check if should show review
      if (shouldShowReviewPrompt()) {
        // For now, just continue to adventure
        // In a full implementation, you might show a review selection
        navigate('/aventura');
      } else {
        navigate('/aventura');
      }
    } else {
      // First time - start from lesson 1
      navigate('/licao/1-1-1');
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
      <section className="relative px-4 py-20 sm:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo do Hero */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-commitinho-text">Aprenda programação </span>
                <span className="gradient-text">brincando!</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-commitinho-text-soft mb-8 max-w-lg">
                Mini-jogos divertidos para explorar lógica e criatividade.
                Descubra o mundo da programação de um jeito super legal!
              </p>
              
              <div className="text-sm text-commitinho-warning mb-8 font-medium">
                "Commitinho, seu amiguinho &lt;3"
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  onClick={handleStartAdventure}
                  className="bg-gradient-arcade text-white font-semibold shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300"
                >
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  {hasProgress ? 'Continuar Aventura' : 'Começar Aventura'}
                </Button>
                {hasProgress ? (
                  <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-commitinho-surface-2 text-commitinho-text-soft hover:bg-commitinho-surface-2 hover:text-commitinho-text"
                      >
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Reiniciar Progresso
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-commitinho-surface border-commitinho-surface-2">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-commitinho-text">Reiniciar Progresso?</AlertDialogTitle>
                        <AlertDialogDescription className="text-commitinho-text-soft">
                          Esta ação irá apagar todo o seu progresso atual, incluindo XP, estrelas e desbloqueios. Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-commitinho-surface-2 text-commitinho-text border-commitinho-surface-2 hover:bg-commitinho-surface">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleResetProgress}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Ver Jogos
                  </Button>
                )}
              </div>
            </div>
            
            {/* Mascote Hero */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src="/lovable-uploads/ee82c2e5-f68a-417d-9f9d-0394381c468f.png" 
                  alt="Commitinho - Mascote da programação"
                  className="w-80 h-80 commitinho-mascot animate-float drop-shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-arcade opacity-20 rounded-full blur-3xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section for returning users */}
      {hasProgress && stats && (
        <section className="px-4 py-12 bg-commitinho-surface-2">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-commitinho-text">
              Seu Progresso
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-commitinho-surface border-commitinho-surface-2 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-commitinho-warning mb-1">{stats.xp}</div>
                  <div className="text-sm text-commitinho-text-soft">XP Total</div>
                </CardContent>
              </Card>
              
              <Card className="bg-commitinho-surface border-commitinho-surface-2 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary mb-1">{stats.streak}</div>
                  <div className="text-sm text-commitinho-text-soft">Dias Seguidos</div>
                </CardContent>
              </Card>
              
              <Card className="bg-commitinho-surface border-commitinho-surface-2 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-secondary mb-1">{stats.stars}</div>
                  <div className="text-sm text-commitinho-text-soft">Estrelas</div>
                </CardContent>
              </Card>
              
              <Card className="bg-commitinho-surface border-commitinho-surface-2 text-center">
                <CardContent className="p-4">
                  <div className="text-sm font-bold text-commitinho-success mb-1">{stats.currentSkill}</div>
                  <div className="text-xs text-commitinho-text-soft">Posição Atual</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <p className="text-commitinho-text-soft mb-4">
                Continue de onde parou ou explore a árvore de habilidades!
              </p>
              <Button 
                onClick={() => navigate('/aventura')}
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
      <section className="px-4 py-16 bg-commitinho-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-commitinho-text">
            O que vem por aí
          </h2>
          <p className="text-center text-commitinho-text-soft mb-12 max-w-2xl mx-auto">
            Estamos preparando experiências incríveis para tornar seu aprendizado ainda mais divertido!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Mini-jogos */}
            <Card className="bg-commitinho-surface-2 border-commitinho-surface-2 hover:shadow-glow-primary transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-arcade rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pixel-glow">
                  <Gamepad2 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-commitinho-text">Mini-jogos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-commitinho-text-soft text-center">
                  Jogos interativos que ensinam conceitos de programação como sequência, repetição e condições de forma divertida.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 2: Conquistas */}
            <Card className="bg-commitinho-surface-2 border-commitinho-surface-2 hover:shadow-glow-secondary transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pixel-glow">
                  <Trophy className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-commitinho-text">Conquistas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-commitinho-text-soft text-center">
                  Colete estrelas e adesivos conforme completa os desafios. Cada vitória é uma nova descoberta!
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 3: Dicas do Commitinho */}
            <Card className="bg-commitinho-surface-2 border-commitinho-surface-2 hover:shadow-glow-warning transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-commitinho-success rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pixel-glow">
                  <MessageCircle className="h-8 w-8 text-commitinho-success-foreground" />
                </div>
                <CardTitle className="text-commitinho-text">Dicas do Commitinho</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-commitinho-text-soft text-center">
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
