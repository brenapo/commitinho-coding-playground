import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Lightbulb, Heart, Sparkles } from 'lucide-react';
import { Button } from './button';

interface ValidationFeedbackProps {
  isCorrect: boolean;
  error?: {
    tipo: string;
    mensagem: string;
    dica: string;
  };
  onContinue: () => void;
  showCodeExecution?: boolean;
  userName?: string;
  currentExercise: number;
  totalExercises: number;
}

export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  isCorrect,
  error,
  onContinue,
  showCodeExecution = false,
  userName = 'amiguinho',
  currentExercise,
  totalExercises
}) => {
  // Animar entrada do feedback
  useEffect(() => {
    const element = document.querySelector('.validation-feedback');
    if (element) {
      element.classList.add('animate-bounce-in');
    }
  }, [isCorrect]);

  if (isCorrect) {
    return (
      <div className="validation-feedback p-6 rounded-2xl mb-20 bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-xl">
        <div className="text-center">
          {/* Ícone de sucesso animado */}
          <div className="mb-4">
            <CheckCircle className="h-16 w-16 mx-auto animate-bounce text-white drop-shadow-lg" />
          </div>
          
          {/* Mensagem principal */}
          <h3 className="text-2xl font-bold mb-2">
            🎉 Perfeito, {userName}!
          </h3>
          
          <p className="text-lg mb-4 opacity-90">
            Você arrasou! 🚀
          </p>

          {/* Conquistas visuais */}
          <div className="flex justify-center space-x-4 mb-4">
            <div className="bg-white/20 rounded-full p-3">
              <Sparkles className="h-6 w-6 text-yellow-300 animate-spin" />
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <Heart className="h-6 w-6 text-pink-300 animate-pulse" />
            </div>
          </div>

          {/* Bônus por execução de código */}
          {showCodeExecution && (
            <div className="bg-white/10 rounded-lg p-3 mb-4">
              <div className="text-sm font-medium text-green-100">
                ⚡ Bônus por testar o código: +15 XP
              </div>
            </div>
          )}
          
          {/* Botão de continuar */}
          <Button
            onClick={onContinue}
            className="w-full bg-white text-green-600 hover:bg-green-50 font-bold py-4 text-lg shadow-lg transition-all transform hover:scale-105"
          >
            {currentExercise < totalExercises - 1 ? (
              <>
                Continuar aventura! 🌟
              </>
            ) : (
              <>
                Concluir módulo! 🏆
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="validation-feedback p-6 rounded-2xl mb-20 bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-xl">
      <div className="text-center">
        {/* Ícone de erro animado */}
        <div className="mb-4">
          <XCircle className="h-16 w-16 mx-auto animate-shake text-white drop-shadow-lg" />
        </div>
        
        {/* Mensagem de erro específica */}
        <h3 className="text-xl font-bold mb-2">
          {error?.mensagem || "😅 Quase lá! Vamos tentar mais uma vez?"}
        </h3>
        
        {/* Dica específica */}
        {error?.dica && (
          <div className="bg-white/10 rounded-xl p-4 mb-4 text-left">
            <div className="flex items-start">
              <Lightbulb className="h-5 w-5 text-yellow-300 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-yellow-300 mb-1">💡 Dica do Commitinho:</div>
                <div className="text-sm text-white/90">{error.dica}</div>
              </div>
            </div>
          </div>
        )}

        {/* Motivação */}
        <p className="text-base mb-4 opacity-90">
          Não desista, {userName}! Todo programador erra às vezes. 💪
        </p>
        
        {/* Botão de tentar novamente */}
        <Button
          onClick={() => window.location.reload()}
          className="w-full bg-white text-red-600 hover:bg-red-50 font-bold py-4 text-lg shadow-lg transition-all transform hover:scale-105"
        >
          Tentar novamente! 🔄
        </Button>
      </div>
    </div>
  );
};

// Componente para feedback em tempo real durante digitação
export const LiveValidationFeedback: React.FC<{
  selectedWords: string[];
  correctAnswer: string[];
  showHints?: boolean;
}> = ({ selectedWords, correctAnswer, showHints = false }) => {
  const progress = selectedWords.length / correctAnswer.length;
  const isOnTrack = selectedWords.every((word, index) => word === correctAnswer[index]);
  
  if (selectedWords.length === 0) return null;
  
  return (
    <div className="mt-2 p-2 rounded-lg bg-gray-50 border">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {isOnTrack ? (
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          ) : (
            <XCircle className="h-4 w-4 text-orange-500 mr-2" />
          )}
          <span className="text-xs font-medium">
            {isOnTrack ? "No caminho certo! 👍" : "Hmm, vamos verificar... 🤔"}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {selectedWords.length}/{correctAnswer.length}
        </div>
      </div>
      
      {/* Barra de progresso visual */}
      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full transition-all ${
            isOnTrack ? 'bg-green-500' : 'bg-orange-500'
          }`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};