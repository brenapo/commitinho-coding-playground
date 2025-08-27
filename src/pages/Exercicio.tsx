import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Lightbulb, Heart } from "lucide-react";
import { usePersonalization } from '@/utils/personalization';
import { useIsMobile } from '@/hooks/use-mobile';

// Dados dos exercícios do Módulo 1
const exercisesModule1 = [
  {
    id: 1,
    titulo: "Vamos falar com o computador, [NOME]!",
    pergunta: "Complete o código para o Python dizer olá para você:",
    resposta_correta: ["print", "(", "'Olá, [NOME]!'", ")"],
    opcoes: ["print", "(", ")", "'Olá, [NOME]!'", "input", "'Hello'", "say"],
    dica: "Em Python, usamos 'print()' para mostrar mensagens na tela. É como se o computador estivesse falando com você, [NOME]!",
    balao_commitinho: "Vamos ensinar o Python a falar com você, [NOME]!",
    codigo_inicial: ""
  },
  {
    id: 2,
    titulo: "Sua primeira conversa, [NOME]!",
    pergunta: "Faça o Python perguntar como você está:",
    resposta_correta: ["print", "(", "'Como você está, [NOME]?'", ")"],
    opcoes: ["print", "(", ")", "'Como você está, [NOME]?'", "'Oi'", "input", "pergunta"],
    dica: "Você pode fazer o Python falar qualquer coisa colocando entre aspas!",
    balao_commitinho: "Que legal, [NOME]! O Python está aprendendo a conversar!",
    codigo_inicial: ""
  },
  {
    id: 3,
    titulo: "Python sabe seu nome, [NOME]!",
    pergunta: "Guarde seu nome em uma caixinha chamada 'meu_nome':",
    resposta_correta: ["meu_nome", "=", "'[NOME]'"],
    opcoes: ["meu_nome", "=", "'[NOME]'", "nome", "print", "(", ")", "'nome'"],
    dica: "Variáveis são como caixinhas mágicas que guardam informações, [NOME]!",
    balao_commitinho: "Agora o Python vai lembrar do seu nome para sempre, [NOME]!",
    codigo_inicial: ""
  },
  {
    id: 4,
    titulo: "Usando sua caixinha mágica!",
    pergunta: "Agora mostre o que está na caixinha 'meu_nome':",
    resposta_correta: ["print", "(", "meu_nome", ")"],
    opcoes: ["print", "(", ")", "meu_nome", "'meu_nome'", "=", "[NOME]"],
    dica: "Para ver o que está na caixinha, usamos o nome dela sem aspas!",
    balao_commitinho: "Perfeito, [NOME]! Agora você sabe usar as caixinhas!",
    codigo_inicial: "meu_nome = '[NOME]'\n"
  },
  {
    id: 5,
    titulo: "Python pode fazer perguntas, [NOME]!",
    pergunta: "Faça o Python perguntar qual é sua cor favorita:",
    resposta_correta: ["cor", "=", "input", "(", "'[NOME], qual sua cor favorita? '", ")"],
    opcoes: ["cor", "=", "input", "(", ")", "'[NOME], qual sua cor favorita? '", "print", "pergunta"],
    dica: "input() faz perguntas e guarda as respostas, [NOME]!",
    balao_commitinho: "Que curioso você é, [NOME]! Python também adora fazer perguntas!",
    codigo_inicial: ""
  }
];

const Exercicio = () => {
  const navigate = useNavigate();
  const { moduleId, exerciseId } = useParams();
  const isMobile = useIsMobile();
  const { userData, personalizeText, saveUserData } = usePersonalization();
  
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hearts, setHearts] = useState(3);
  const [showResult, setShowResult] = useState(false);

  const exercises = exercisesModule1;
  const exercise = exercises[currentExercise];
  const totalExercises = exercises.length;
  const progress = ((currentExercise + 1) / totalExercises) * 100;

  useEffect(() => {
    if (exercise) {
      setAvailableWords([...exercise.opcoes]);
      setSelectedWords([]);
      setIsCorrect(null);
      setShowResult(false);
    }
  }, [currentExercise, exercise]);

  const handleWordClick = (word: string, fromSelected: boolean = false) => {
    if (fromSelected) {
      // Remove from selected, add back to available
      setSelectedWords(prev => prev.filter(w => w !== word));
      setAvailableWords(prev => [...prev, word]);
    } else {
      // Remove from available, add to selected
      setAvailableWords(prev => prev.filter(w => w !== word));
      setSelectedWords(prev => [...prev, word]);
    }
    setIsCorrect(null);
  };

  const handleVerify = () => {
    const userAnswer = selectedWords.join(' ');
    const correctAnswer = exercise.resposta_correta.map(word => personalizeText(word)).join(' ');
    const correct = userAnswer === correctAnswer;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (!correct) {
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (currentExercise < totalExercises - 1) {
      setCurrentExercise(prev => prev + 1);
    } else {
      // Completed module
      saveUserData({
        completedExercises: Math.max(userData.completedExercises, totalExercises),
        points: userData.points + (totalExercises * 10)
      });
      navigate('/modulos');
    }
  };

  const handleBack = () => {
    navigate('/modulos');
  };

  if (!exercise) {
    return <div>Carregando exercício...</div>;
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-commitinho-bg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-commitinho-surface shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2"
          >
            <X className="h-5 w-5 text-commitinho-text-soft" />
          </Button>
          
          <div className="flex-1 mx-4">
            <Progress value={progress} className="h-2" />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHint(true)}
            className="p-2"
          >
            <Lightbulb className="h-5 w-5 text-yellow-500" />
          </Button>
        </div>

        {/* Hearts */}
        <div className="flex justify-center py-2">
          {Array.from({length: 3}).map((_, i) => (
            <Heart
              key={i}
              className={`h-6 w-6 mx-1 ${
                i < hearts ? 'text-red-500 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {/* Commitinho corner */}
          <div className="flex items-start mb-6">
            <img 
              src="/assets/commitinho-running.png" 
              alt="Commitinho"
              className="w-12 h-12 mr-3"
            />
            <div className="bg-commitinho-surface-2 rounded-lg p-3 relative flex-1">
              <div className="text-sm text-commitinho-text">
                {personalizeText(exercise.balao_commitinho)}
              </div>
              <div className="absolute -left-2 top-4 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-commitinho-surface-2"></div>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-lg font-bold text-commitinho-text mb-6 text-center">
            {personalizeText(exercise.pergunta)}
          </h2>

          {/* Code area */}
          <div className="bg-gray-900 rounded-lg p-4 mb-6 min-h-[100px]">
            {exercise.codigo_inicial && (
              <div className="text-green-400 text-sm font-mono mb-2">
                {personalizeText(exercise.codigo_inicial)}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {selectedWords.map((word, index) => (
                <div
                  key={index}
                  onClick={() => handleWordClick(word, true)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-mono cursor-pointer hover:bg-blue-500 transition-colors"
                >
                  {personalizeText(word)}
                </div>
              ))}
              {selectedWords.length === 0 && (
                <div className="text-gray-500 text-sm font-mono">
                  Clique nas palavras abaixo para montar o código
                </div>
              )}
            </div>
          </div>

          {/* Word bank */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {availableWords.map((word, index) => (
                <div
                  key={index}
                  onClick={() => handleWordClick(word)}
                  className="bg-commitinho-surface border-2 border-commitinho-surface-2 text-commitinho-text px-4 py-3 rounded-lg font-mono cursor-pointer hover:bg-commitinho-surface-2 transition-all duration-200 hover:scale-105"
                >
                  {personalizeText(word)}
                </div>
              ))}
            </div>
          </div>

          {/* Verify button */}
          <div className="fixed bottom-4 left-4 right-4">
            {!showResult ? (
              <Button
                onClick={handleVerify}
                disabled={selectedWords.length === 0}
                className="w-full bg-gradient-arcade text-white font-semibold py-4 text-lg shadow-lg disabled:opacity-50"
              >
                Verificar
              </Button>
            ) : (
              <div className={`p-4 rounded-lg mb-4 ${
                isCorrect 
                  ? 'bg-green-100 border-2 border-green-500' 
                  : 'bg-red-100 border-2 border-red-500'
              }`}>
                <div className={`text-center mb-3 font-bold ${
                  isCorrect ? 'text-green-700' : 'text-red-700'
                }`}>
                  {isCorrect 
                    ? personalizeText("Perfeito, [NOME]! 🎉") 
                    : "Ops, não foi dessa vez! 😅"
                  }
                </div>
                <Button
                  onClick={handleNext}
                  className={`w-full font-semibold py-3 text-lg ${
                    isCorrect 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {currentExercise < totalExercises - 1 ? 'Continuar' : 'Concluir'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Hint Modal */}
        <Dialog open={showHint} onOpenChange={setShowHint}>
          <DialogContent className="bg-commitinho-surface border-commitinho-surface-2 mx-4 max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-commitinho-text flex items-center">
                <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                Dica
              </DialogTitle>
            </DialogHeader>
            <p className="text-commitinho-text-soft text-sm">
              {personalizeText(exercise.dica)}
            </p>
            <Button 
              onClick={() => setShowHint(false)}
              className="w-full bg-gradient-arcade text-white"
            >
              Entendi!
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Desktop layout would go here (similar structure but larger)
  return (
    <div className="min-h-screen bg-commitinho-bg">
      <div className="max-w-4xl mx-auto">
        {/* Similar desktop layout */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-commitinho-text">
            Interface Desktop - Em desenvolvimento
          </h2>
          <Button onClick={handleBack} className="mt-4">
            Voltar aos módulos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Exercicio;