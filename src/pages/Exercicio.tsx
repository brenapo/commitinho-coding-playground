import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Lightbulb, Heart } from "lucide-react";
import { usePersonalization } from '@/utils/personalization';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ExerciseHeader,
  ExercisePrompt,
  CodeTerminal,
  WordChip,
  ChipTray,
  ExerciseFeedback,
  HintButton,
  ExerciseMascot,
  ActionButtons,
  ExerciseContainer
} from '@/components/ui/ExerciseDesignSystem';
import '@/styles/exercise-design-system.css';

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
      <ExerciseContainer>
        {/* Navigation e Hint */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2 rounded-full bg-black bg-opacity-30 backdrop-blur-sm text-white shadow-lg hover:bg-opacity-50"
          >
            <X className="h-5 w-5" />
          </Button>
          
          {/* Hearts */}
          <div className="flex gap-1">
            {Array.from({length: 3}).map((_, i) => (
              <Heart
                key={i}
                className={`h-6 w-6 ${
                  i < hearts ? 'text-red-500 fill-current' : 'text-gray-400'
                }`}
              />
            ))}
          </div>
          
          <HintButton onClick={() => setShowHint(true)} />
        </div>

        {/* Header com novo design */}
        <div className="exercise-section mt-16">
          <ExerciseHeader
            title={personalizeText(exercise.titulo)}
            subtitle={`${personalizeText(exercise.balao_commitinho)} • Exercício ${currentExercise + 1} de ${totalExercises}`}
            icon="🤖💬"
            progress={progress}
            currentExercise={currentExercise + 1}
            totalExercises={totalExercises}
          />
        </div>

        {/* Mascot inline */}
        <div className="exercise-section">
          <ExerciseMascot 
            message={personalizeText(exercise.balao_commitinho)}
            variant="inline"
          />
        </div>

        {/* Prompt da pergunta */}
        <ExercisePrompt centered>
          {personalizeText(exercise.pergunta)}
        </ExercisePrompt>

        {/* Terminal de código */}
        <div className="exercise-section">
          <CodeTerminal 
            placeholder="Monte seu código aqui ✨"
            showInitialCode={!!exercise.codigo_inicial}
            initialCode={exercise.codigo_inicial ? personalizeText(exercise.codigo_inicial) : ""}
          >
            <div className="flex flex-wrap gap-3 justify-center">
              {selectedWords.map((word, index) => (
                <WordChip
                  key={index}
                  word={personalizeText(word)}
                  isSelected={true}
                  isCommand={word === 'print'}
                  isString={word.includes("'") || word.includes('"')}
                  isSymbol={['(', ')', '='].includes(word)}
                  onClick={() => handleWordClick(word, true)}
                  variant="lego"
                />
              ))}
            </div>
          </CodeTerminal>
        </div>

        {/* Bandeja de palavras */}
        <div className="exercise-section">
          <ChipTray>
            <div className="flex flex-wrap gap-3 justify-center">
              {availableWords.map((word, index) => (
                <WordChip
                  key={index}
                  word={personalizeText(word)}
                  isCommand={word === 'print'}
                  isString={word.includes("'") || word.includes('"')}
                  isSymbol={['(', ')', '='].includes(word)}
                  onClick={() => handleWordClick(word)}
                  variant="lego"
                />
              ))}
            </div>
          </ChipTray>
        </div>

        {/* Botões de ação */}
        <div className="exercise-section">
          {!showResult ? (
            <ActionButtons>
              <button
                onClick={handleVerify}
                disabled={selectedWords.length === 0}
                className="btn-primary w-full max-w-xs disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 text-xl font-bold"
              >
                ✨ Verificar Código
              </button>
            </ActionButtons>
          ) : (
            <div className="space-y-6">
              <ExerciseFeedback
                type={isCorrect ? 'success' : 'error'}
                message={isCorrect 
                  ? personalizeText("Perfeito, [NOME]! 🎉") 
                  : "Ops, não foi dessa vez! 😅"
                }
                showConfetti={isCorrect}
              />
              <ActionButtons>
                <button
                  onClick={handleNext}
                  className={`btn-primary w-full max-w-xs px-8 py-4 text-xl font-bold ${
                    isCorrect 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}
                >
                  {currentExercise < totalExercises - 1 ? '➡️ Continuar' : '🏁 Concluir'}
                </button>
              </ActionButtons>
            </div>
          )}
        </div>

        {/* Hint Modal */}
        <Dialog open={showHint} onOpenChange={setShowHint}>
          <DialogContent className="bg-white border-gray-300 mx-4 max-w-md shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-800 flex items-center text-lg font-bold">
                <Lightbulb className="h-6 w-6 text-yellow-500 mr-2" />
                💡 Dica do Commitinho
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-700 text-base leading-relaxed py-4">
              {personalizeText(exercise.dica)}
            </p>
            <Button 
              onClick={() => setShowHint(false)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 text-lg"
            >
              ✨ Entendi!
            </Button>
          </DialogContent>
        </Dialog>
      </ExerciseContainer>
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