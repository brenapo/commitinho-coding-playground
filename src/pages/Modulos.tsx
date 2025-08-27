import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, Star, CheckCircle, Play } from "lucide-react";
import { usePersonalization } from '@/utils/personalization';
import { useIsMobile } from '@/hooks/use-mobile';

const Modulos = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { userData, personalizeText } = usePersonalization();

  const modules = [
    {
      id: 1,
      title: "🐍 Módulo 1: Seus Primeiros Passos",
      description: "Aprenda os básicos do Python!",
      totalExercises: 12,
      completedExercises: userData.completedExercises || 0,
      isUnlocked: true,
      difficulty: "Iniciante",
      topics: ["print()", "Variáveis", "input()", "Strings"],
      color: "from-green-400 to-green-600"
    },
    {
      id: 2,
      title: "🤔 Módulo 2: Tomando Decisões",
      description: "Aprenda a fazer o computador pensar!",
      totalExercises: 10,
      completedExercises: 0,
      isUnlocked: userData.completedExercises >= 12,
      difficulty: "Básico",
      topics: ["if/else", "Comparações", "Lógica", "bool"],
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 3,
      title: "🔄 Módulo 3: Repetindo Ações",
      description: "Ensine o computador a repetir tarefas!",
      totalExercises: 8,
      completedExercises: 0,
      isUnlocked: false,
      difficulty: "Intermediário",
      topics: ["for", "while", "range()", "Loops"],
      color: "from-purple-400 to-purple-600"
    }
  ];

  const handleModuleClick = (moduleId: number) => {
    if (moduleId === 1) {
      navigate(`/exercicio/${moduleId}/1`);
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-commitinho-bg px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/commitinho-running.png" 
              alt="Commitinho"
              className="w-20 h-20 animate-float"
            />
          </div>
          <h1 className="text-2xl font-bold text-commitinho-text mb-2">
            {personalizeText("Olá, [NOME]!")}
          </h1>
          <p className="text-sm text-commitinho-text-soft">
            Escolha sua aventura:
          </p>
        </div>

        {/* Módulos */}
        <div className="space-y-4">
          {modules.map((module) => (
            <Card 
              key={module.id} 
              className={`bg-commitinho-surface border-commitinho-surface-2 transition-all duration-300 ${
                module.isUnlocked 
                  ? 'hover:shadow-lg cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => module.isUnlocked && handleModuleClick(module.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-commitinho-text mb-2">
                      {module.title}
                    </CardTitle>
                    <p className="text-sm text-commitinho-text-soft mb-3">
                      {module.description}
                    </p>
                    <Badge 
                      variant="outline" 
                      className="text-xs border-primary text-primary"
                    >
                      {module.difficulty}
                    </Badge>
                  </div>
                  <div className="ml-3">
                    {!module.isUnlocked ? (
                      <Lock className="h-6 w-6 text-commitinho-text-soft" />
                    ) : module.completedExercises === module.totalExercises ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Play className="h-6 w-6 text-primary" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-commitinho-text">Progresso</span>
                    <span className="text-commitinho-text-soft">
                      {module.completedExercises}/{module.totalExercises} exercícios
                    </span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(module.completedExercises, module.totalExercises)} 
                    className="h-2"
                  />
                </div>
                
                {module.isUnlocked && (
                  <div className="flex flex-wrap gap-1">
                    {module.topics.map((topic, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-commitinho-surface-2 text-commitinho-text-soft px-2 py-1 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
                
                {!module.isUnlocked && (
                  <p className="text-xs text-commitinho-text-soft mt-2">
                    Complete o módulo anterior para desbloquear
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botão voltar */}
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-commitinho-text-soft hover:text-commitinho-text"
          >
            ← Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-commitinho-bg px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img 
                src="/assets/commitinho-running.png" 
                alt="Commitinho"
                className="w-24 h-24 animate-float drop-shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-arcade opacity-20 rounded-full blur-2xl animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-commitinho-text mb-4">
            {personalizeText("Olá, [NOME]! Escolha sua aventura:")}
          </h1>
          <p className="text-lg text-commitinho-text-soft">
            Cada módulo é uma nova aventura no mundo da programação!
          </p>
        </div>

        {/* Módulos Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card 
              key={module.id} 
              className={`bg-commitinho-surface border-commitinho-surface-2 transition-all duration-300 ${
                module.isUnlocked 
                  ? 'hover:shadow-2xl hover:scale-105 cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => module.isUnlocked && handleModuleClick(module.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <CardTitle className="text-xl text-commitinho-text flex-1">
                    {module.title}
                  </CardTitle>
                  <div className="ml-4">
                    {!module.isUnlocked ? (
                      <Lock className="h-8 w-8 text-commitinho-text-soft" />
                    ) : module.completedExercises === module.totalExercises ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <Play className="h-8 w-8 text-primary" />
                    )}
                  </div>
                </div>
                
                <p className="text-commitinho-text-soft mb-4">
                  {module.description}
                </p>
                
                <div className="flex gap-2 mb-4">
                  <Badge 
                    variant="outline" 
                    className="border-primary text-primary"
                  >
                    {module.difficulty}
                  </Badge>
                  {module.isUnlocked && (
                    <Badge className="bg-gradient-arcade text-white">
                      Desbloqueado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-commitinho-text font-medium">Progresso</span>
                    <span className="text-commitinho-text-soft">
                      {module.completedExercises}/{module.totalExercises} exercícios
                    </span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(module.completedExercises, module.totalExercises)} 
                    className="h-3"
                  />
                  <div className="text-xs text-commitinho-text-soft mt-1">
                    {getProgressPercentage(module.completedExercises, module.totalExercises)}% completo
                  </div>
                </div>
                
                {module.isUnlocked && (
                  <>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-commitinho-text mb-2">
                        Você vai aprender:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {module.topics.map((topic, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-commitinho-surface-2 text-commitinho-text px-3 py-1 rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full bg-gradient-arcade text-white font-semibold hover:shadow-lg transition-all duration-300">
                      {module.completedExercises > 0 ? 'Continuar' : 'Começar'}
                    </Button>
                  </>
                )}
                
                {!module.isUnlocked && (
                  <div className="text-center py-4">
                    <p className="text-sm text-commitinho-text-soft mb-2">
                      Complete o módulo anterior para desbloquear
                    </p>
                    <div className="text-xs text-commitinho-text-soft">
                      Faltam {12 - userData.completedExercises} exercícios
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botão voltar */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="border-commitinho-surface-2 text-commitinho-text-soft hover:bg-commitinho-surface-2 hover:text-commitinho-text"
          >
            ← Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modulos;