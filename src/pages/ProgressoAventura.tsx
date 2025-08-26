import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Play, RotateCcw, Star, Trophy } from 'lucide-react';
import { useSupabaseProgress } from '@/hooks/useSupabaseProgress';
import { getChildName } from '@/utils/templateEngine';

const ProgressoAventura = () => {
  const navigate = useNavigate();
  const { progress, resetUserProgress, getProgressStats } = useSupabaseProgress();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [childName, setChildName] = useState('');

  useEffect(() => {
    setChildName(getChildName());
  }, []);

  const stats = getProgressStats();

  const handleContinueAdventure = () => {
    // Check if there's a specific next lesson, otherwise go to adventure tree
    navigate('/aventura');
  };

  const handleResetAdventure = async () => {
    setIsResetting(true);
    try {
      // Reset all progress
      await resetUserProgress();
      // Clear the name to restart welcome flow
      localStorage.removeItem('commitinho.display_name');
      // Close dialog and go to welcome
      setShowResetDialog(false);
      navigate('/aventura/boas-vindas');
    } catch (error) {
      console.error('Error resetting progress:', error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-commitinho-bg flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center space-y-8">
          {/* Hero Image */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <img
                src="/assets/commitinho/hero.png"
                alt="Commitinho comemorando progresso"
                className="w-full h-full object-contain rounded-2xl"
                loading="eager"
              />
            </div>
          </div>

          {/* Welcome Back Message */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-commitinho-text">
              Que bom te ver de volta, {childName}! 🎉
            </h1>
            
            <p className="text-lg md:text-xl text-commitinho-text-soft leading-relaxed">
              Você está indo muito bem na sua aventura de programação! Continue assim e se torne um programador incrível.
            </p>
          </div>

          {/* Progress Stats */}
          <Card className="bg-commitinho-surface border-commitinho-surface-2 shadow-xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-6 w-6 text-commitinho-warning mr-2" />
                    <span className="text-2xl font-bold text-commitinho-text">{stats.totalStars}</span>
                  </div>
                  <p className="text-sm text-commitinho-text-soft">Estrelas</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="h-6 w-6 text-commitinho-success mr-2" />
                    <span className="text-2xl font-bold text-commitinho-text">{stats.totalXP}</span>
                  </div>
                  <p className="text-sm text-commitinho-text-soft">XP Total</p>
                </div>
                
                <div className="text-center col-span-2 md:col-span-1">
                  <div className="flex items-center justify-center mb-2">
                    <Play className="h-6 w-6 text-primary mr-2" />
                    <span className="text-2xl font-bold text-commitinho-text">{stats.completedLessons}</span>
                  </div>
                  <p className="text-sm text-commitinho-text-soft">Lições Completas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleContinueAdventure}
              className="bg-gradient-arcade text-white font-semibold py-3 px-8 text-lg shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5" />
              Continuar Aventura
            </Button>

            <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-commitinho-surface-2 hover:bg-commitinho-surface text-commitinho-text-soft py-3 px-8 text-lg"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reiniciar Aventura
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-commitinho-surface border-commitinho-surface-2">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-commitinho-text text-center flex items-center justify-center">
                    <AlertTriangle className="mr-2 h-6 w-6 text-yellow-500" />
                    Reiniciar Aventura?
                  </DialogTitle>
                  <DialogDescription className="text-commitinho-text-soft text-center space-y-3 mt-4">
                    <p className="font-medium">Atenção, {childName}!</p>
                    <p>
                      Se você reiniciar a aventura, <strong>todo o seu progresso será deletado</strong> e você começará do zero.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Você perderá:</strong>
                        <br />• {stats.totalStars} estrelas conquistadas
                        <br />• {stats.totalXP} XP acumulado
                        <br />• {stats.completedLessons} lições completas
                      </p>
                    </div>
                    <p className="text-sm">
                      Tem certeza de que deseja recomeçar?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowResetDialog(false)}
                    disabled={isResetting}
                    className="flex-1 border-commitinho-surface-2 hover:bg-commitinho-surface text-commitinho-text"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleResetAdventure}
                    disabled={isResetting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                  >
                    {isResetting ? 'Reiniciando...' : 'Sim, Reiniciar'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Encouragement Message */}
          <div className="bg-gradient-to-r from-commitinho-success/10 to-primary/10 rounded-2xl p-6 border border-commitinho-success/20">
            <p className="text-commitinho-text font-medium">
              💡 <strong>Dica do Commitinho:</strong> Cada lição que você completa te deixa mais perto de se tornar um programador incrível! Continue praticando e explorando. 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressoAventura;