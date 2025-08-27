import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePersonalization } from '@/utils/personalization';
import { useIsMobile } from '@/hooks/use-mobile';

const Apresentacao = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { saveUserData, personalizeText } = usePersonalization();
  const [nome, setNome] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim().length < 2) {
      alert('Por favor, digite seu nome!');
      return;
    }

    setIsSubmitting(true);
    
    // Salvar dados do usuário
    saveUserData({
      name: nome.trim(),
      age: 10, // Idade padrão para crianças
      level: 'Novato Curioso',
      points: 0,
      streakDays: 0,
      currentModule: 1,
      currentExercise: 1,
      completedExercises: 0,
      xp: 0,
      achievements: []
    });

    // Pequeno delay para efeito de loading
    setTimeout(() => {
      navigate('/modulos');
    }, 500);
  };

  // Removido: opções de idade

  if (isMobile) {
    return (
      <div className="min-h-screen bg-commitinho-bg flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-sm mx-auto">
          {/* Commitinho com balão maior e mais amigável */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img 
                  src="/assets/commitinho-running.png" 
                  alt="Commitinho"
                  className="w-32 h-32 animate-float drop-shadow-xl"
                />
                <div className="absolute -top-2 -right-2 text-2xl animate-bounce">👋</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-6 mb-6 relative shadow-lg border-4 border-blue-200">
              <div className="text-lg text-blue-800 font-medium leading-relaxed">
                "Oi! Eu sou o <strong>Commitinho</strong>! 🤖<br/>
                Vou te ensinar Python de um jeito <strong>super divertido</strong>!<br/>
                Como você se chama?"
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-200"></div>
            </div>
          </div>

          {/* Formulário Simplificado */}
          <Card className="bg-white/90 backdrop-blur border-4 border-purple-200 shadow-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite seu nome aqui"
                    className="text-xl p-4 text-center bg-white border-3 border-purple-300 rounded-xl text-purple-800 placeholder-purple-400 focus:border-purple-500 focus:ring-purple-500"
                    maxLength={20}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full text-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={isSubmitting || nome.trim().length < 2}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                      Preparando sua aventura...
                    </div>
                  ) : (
                    nome.trim() ? `Vamos começar, ${nome}! 🚀` : 'Vamos começar! 🚀'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-commitinho-bg flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header com Commitinho */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img 
                src="/assets/commitinho-running.png" 
                alt="Commitinho"
                className="w-32 h-32 animate-float drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-arcade opacity-20 rounded-full blur-3xl animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-commitinho-text mb-6">
            Bem-vindo à Aventura Python! 🐍
          </h1>
          <div className="bg-commitinho-surface-2 rounded-lg p-6 mb-6 relative max-w-md mx-auto">
            <div className="text-lg text-commitinho-text">
              "Oi! Vamos começar nossa jornada juntos!"
            </div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-commitinho-surface-2"></div>
          </div>
        </div>

        {/* Formulário */}
        <Card className="bg-commitinho-surface border-commitinho-surface-2 shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-commitinho-text text-center">
              Antes de começar, me conta:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <Label htmlFor="nome" className="text-lg text-commitinho-text font-medium">
                  Qual é o seu nome?
                </Label>
                <Input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite seu nome aqui"
                  className="mt-3 text-lg p-4 bg-commitinho-bg border-commitinho-surface-2 text-commitinho-text"
                  maxLength={20}
                />
              </div>
              
              <div>
                <Label htmlFor="idade" className="text-lg text-commitinho-text font-medium">
                  Quantos anos você tem?
                </Label>
                <select
                  id="idade"
                  value={idade}
                  onChange={(e) => setIdade(Number(e.target.value))}
                  className="mt-3 w-full p-4 text-lg bg-commitinho-bg border border-commitinho-surface-2 rounded-md text-commitinho-text"
                >
                  {ageOptions.map(age => (
                    <option key={age} value={age}>{age} anos</option>
                  ))}
                </select>
              </div>
              
              <Button
                type="submit"
                className="w-full text-xl bg-gradient-arcade text-white font-semibold py-6 shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300"
                disabled={isSubmitting || nome.trim().length < 2}
              >
                {isSubmitting ? (
                  'Preparando sua aventura...'
                ) : (
                  nome.trim() ? `Vamos começar, ${nome}! 🚀` : 'Vamos começar! 🚀'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Botão voltar discreto */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-commitinho-text-soft hover:text-commitinho-text"
          >
            ← Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Apresentacao;