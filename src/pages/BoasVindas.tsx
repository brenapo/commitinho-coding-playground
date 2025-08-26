import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, User, Sparkles, Play } from 'lucide-react';
import { useSupabase } from '@/hooks/useSupabase';

const BoasVindas = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useSupabase();
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  
  // Check if user already has a name
  useEffect(() => {
    const savedName = localStorage.getItem('commitinho.display_name');
    if (savedName && savedName.length >= 2) {
      // User already has a name, redirect to adventure
      navigate('/aventura');
    }
  }, [navigate]);

  // Validate name
  const validateName = (name: string): string | null => {
    const trimmed = name.trim();
    
    if (trimmed.length < 2) {
      return 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (trimmed.length > 16) {
      return 'Nome deve ter no máximo 16 caracteres';
    }
    
    // Simple profanity filter (can be expanded)
    const badWords = ['merda', 'porra', 'caralho', 'fdp', 'puta'];
    const lowerName = trimmed.toLowerCase();
    if (badWords.some(word => lowerName.includes(word))) {
      return 'Por favor, use um nome mais amigável';
    }
    
    // Check for line breaks
    if (trimmed.includes('\n') || trimmed.includes('\r')) {
      return 'Nome não pode ter quebras de linha';
    }
    
    return null;
  };

  const handleSaveName = async () => {
    const validationError = validateName(displayName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const finalName = displayName.trim();
      
      // Save to localStorage (always)
      localStorage.setItem('commitinho.display_name', finalName);
      
      // Save to Supabase if user is logged in
      if (user && updateUserProfile) {
        await updateUserProfile({ display_name: finalName });
      }
      
      // Close dialog and redirect to first lesson
      setShowNameDialog(false);
      navigate('/licao/basic-01');
    } catch (err) {
      console.error('Error saving name:', err);
      setError('Erro ao salvar nome. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipName = () => {
    // Use default name
    localStorage.setItem('commitinho.display_name', 'Aventureiro');
    setShowNameDialog(false);
    navigate('/licao/basic-01');
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="min-h-screen bg-commitinho-bg flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Content Section - Left side, centered */}
          <div className="md:col-span-2 text-center space-y-6">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-commitinho-text">
              Oi! Eu sou o Commitinho 👋
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-commitinho-text-soft leading-relaxed max-w-lg mx-auto">
              Eu adoro "commits": é quando salvamos um progresso. Por isso meu nome é Commitinho — um "commit" pequenininho feito com carinho!
            </p>

            {/* Micro-história (bullets) - More compact */}
            <div className="space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2 text-sm md:text-base">
                <Sparkles className="h-4 w-4 text-commitinho-warning flex-shrink-0" />
                <p className="text-commitinho-text">Salvar ideias é importante</p>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm md:text-base">
                <Sparkles className="h-4 w-4 text-commitinho-success flex-shrink-0" />
                <p className="text-commitinho-text">Testar e ver funcionando é divertido</p>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm md:text-base">
                <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                <p className="text-commitinho-text">Aprender um pouquinho por vez é mais legal</p>
              </div>
            </div>

            {/* Action Button */}
            <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-arcade text-white font-semibold py-3 px-8 text-lg shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300 mt-8">
                  <Play className="mr-2 h-5 w-5" />
                  Iniciar Aventura
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-commitinho-surface border-commitinho-surface-2">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-commitinho-text text-center">
                    Como você quer ser chamado(a)?
                  </DialogTitle>
                  <DialogDescription className="text-commitinho-text-soft text-center">
                    Vou usar esse nome durante nossa aventura!
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <div>
                    <Input
                      type="text"
                      value={displayName}
                      onChange={(e) => {
                        setDisplayName(e.target.value);
                        setError('');
                      }}
                      placeholder="Ex.: Ana, Pedro, Luli 🤩"
                      maxLength={16}
                      className="text-center text-lg py-3 bg-commitinho-bg border-commitinho-surface-2 focus:border-commitinho-warning"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isLoading) {
                          handleSaveName();
                        }
                      }}
                    />
                    
                    {/* Preview */}
                    {displayName.trim().length >= 2 && !error && (
                      <div className="mt-3 p-3 bg-commitinho-success/10 border border-commitinho-success/20 rounded-lg">
                        <p className="text-sm text-commitinho-success text-center">
                          ✨ Vai ficar assim: <strong>Olá, {displayName.trim()}!</strong>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleSaveName}
                      disabled={isLoading || displayName.trim().length < 2}
                      className="w-full bg-gradient-arcade text-white font-semibold py-3 text-lg shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300"
                    >
                      {isLoading ? 'Salvando...' : 'Salvar nome'}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleSkipName}
                      disabled={isLoading}
                      className="w-full border-commitinho-surface-2 hover:bg-commitinho-surface text-commitinho-text-soft"
                    >
                      Pular por enquanto
                    </Button>
                  </div>

                  <p className="text-xs text-center text-commitinho-text-soft">
                    Se pular, vou te chamar de "Aventureiro" 😊
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Image Section - Right side */}
          <div className="md:col-span-1 flex justify-center order-first md:order-last">
            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80">
              {!imageError ? (
                <img
                  src="/assets/commitinho/hero.png"
                  alt="Mascote Commitinho sorrindo e acenando"
                  className="w-full h-full object-contain rounded-2xl"
                  loading="eager"
                  decoding="async"
                  onError={handleImageError}
                />
              ) : (
                /* Fallback */
                <div className="w-full h-full bg-gradient-to-br from-commitinho-warning/10 to-commitinho-success/10 rounded-2xl flex items-center justify-center border-2 border-commitinho-warning/20">
                  <div className="text-center">
                    <div className="text-4xl md:text-6xl mb-4">🤖</div>
                    <p className="text-commitinho-text-soft text-sm">Commitinho</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoasVindas;