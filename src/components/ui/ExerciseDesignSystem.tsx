import React from 'react';
import { Button } from './button';
import { Progress } from './progress';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Lightbulb } from 'lucide-react';

// 🎨 Design System - Exercícios
// Inspirado no Duolingo com tipografia divertida e cores vibrantes

export interface ExerciseHeaderProps {
  title: string;
  subtitle: string;
  icon?: string;
  progress?: number;
  currentExercise?: number;
  totalExercises?: number;
}

export interface ExercisePromptProps {
  children: React.ReactNode;
  centered?: boolean;
}

export interface CodeTerminalProps {
  children: React.ReactNode;
  placeholder?: string;
  showInitialCode?: boolean;
  initialCode?: string;
}

export interface WordChipProps {
  word: string;
  isSelected?: boolean;
  isCommand?: boolean;
  isString?: boolean;
  isSymbol?: boolean;
  onClick?: () => void;
  variant?: 'lego' | 'default';
}

export interface ChipTrayProps {
  children: React.ReactNode;
  organized?: boolean;
}

export interface FeedbackProps {
  type: 'success' | 'error';
  message: string;
  showConfetti?: boolean;
}

export interface HintButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

// 1. Typography Components - COMPACTO E LIMPO
export const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  title,
  subtitle,
  icon = "🤖",
  progress,
  currentExercise,
  totalExercises
}) => {
  return (
    <div className="exercise-header">
      {/* Progress Bar compacta */}
      {progress !== undefined && (
        <div className="flex items-center gap-2 mb-3 px-2">
          <Progress value={progress} className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </Progress>
        </div>
      )}

      {/* Header limpo - só título + exercício */}
      <div className="exercise-center px-2">
        <h1 className="exercise-title">
          <span className="exercise-icon" role="img" aria-label="exercise icon">
            {icon}
          </span>
          {title}
        </h1>
        {currentExercise && (
          <p className="exercise-subtitle">
            Exercício {currentExercise}
          </p>
        )}
      </div>
    </div>
  );
};

// 2. Prompt/Question Component
export const ExercisePrompt: React.FC<ExercisePromptProps> = ({ 
  children, 
  centered = true 
}) => {
  return (
    <div className="exercise-section">
      <div className={`exercise-prompt ${centered ? 'exercise-center' : ''}`}>
        {children}
      </div>
    </div>
  );
};

// 3. Code Terminal Component - COMPACTO SEM HEADER
export const CodeTerminal: React.FC<CodeTerminalProps> = ({
  children,
  placeholder = "Monte seu código aqui ✨",
  showInitialCode = false,
  initialCode = ""
}) => {
  return (
    <div className="code-terminal">
      {/* Header removido para ser mais compacto */}
      
      {showInitialCode && initialCode && (
        <div className="code-initial">
          {initialCode}
        </div>
      )}
      <div className="code-area">
        {children || (
          <div className="code-placeholder">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

// 4. Word Chip Component (Lego-style)
export const WordChip: React.FC<WordChipProps> = ({
  word,
  isSelected = false,
  isCommand = false,
  isString = false,
  isSymbol = false,
  onClick,
  variant = 'lego'
}) => {
  const getChipStyle = () => {
    if (isCommand) return 'chip-command';
    if (isString) return 'chip-string';
    if (isSymbol) return 'chip-symbol';
    return isSelected ? 'chip-selected' : 'chip-default';
  };

  return (
    <button
      onClick={onClick}
      className={`word-chip ${getChipStyle()} ${variant === 'lego' ? 'chip-lego' : ''}`}
    >
      {word}
      {isSelected && (
        <span className="chip-remove">×</span>
      )}
    </button>
  );
};

// 5. Chip Tray Component - COMPACTO
export const ChipTray: React.FC<ChipTrayProps> = ({ children, organized = false }) => {
  return (
    <div className={`chip-tray ${organized ? 'chip-tray-organized' : ''}`}>
      <div className="chip-tray-title">
        📦 Blocos
      </div>
      <div className="chip-tray-content">
        {children}
      </div>
    </div>
  );
};

// 6. Feedback Components
export const ExerciseFeedback: React.FC<FeedbackProps> = ({
  type,
  message,
  showConfetti = false
}) => {
  return (
    <div className={`exercise-feedback ${type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
      {showConfetti && type === 'success' && (
        <div className="confetti">🎉</div>
      )}
      <div className="feedback-icon">
        {type === 'success' ? '🎉' : '🤔'}
      </div>
      <div className="feedback-message">
        {message}
      </div>
    </div>
  );
};

// 7. Hint Button Component - COMPACTO
export const HintButton: React.FC<HintButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="hint-button"
      title="Dica"
    >
      <Lightbulb className="h-4 w-4 text-yellow-500" />
    </button>
  );
};

// Mascot Component (Commitinho)
export interface MascotProps {
  message?: string;
  variant?: 'corner' | 'inline';
  showPulse?: boolean;
}

export const ExerciseMascot: React.FC<MascotProps> = ({
  message,
  variant = 'inline',
  showPulse = false
}) => {
  return (
    <div className={`mascot ${variant === 'corner' ? 'mascot-corner' : 'mascot-inline'}`}>
      <img 
        src="/assets/commitinho-running.png" 
        alt="Commitinho"
        className="mascot-image"
      />
      {showPulse && (
        <div className="mascot-pulse">💡</div>
      )}
      {message && (
        <div className="mascot-balloon">
          {message}
        </div>
      )}
    </div>
  );
};

// Action Buttons Container - MELHORADO
export interface ActionButtonsProps {
  children: React.ReactNode;
  layout?: 'horizontal' | 'vertical';
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  children, 
  layout = 'horizontal' 
}) => {
  return (
    <div className={`action-buttons exercise-center ${layout === 'vertical' ? 'flex-col' : 'flex-row'}`}>
      {children}
    </div>
  );
};

// Container principal para exercícios - ESTÁTICO
export interface ExerciseContainerProps {
  children: React.ReactNode;
}

export const ExerciseContainer: React.FC<ExerciseContainerProps> = ({ children }) => {
  return (
    <div className="exercise-dark-bg exercise-static-layout">
      <div className="exercise-container">
        <div className="exercise-content">
          {children}
        </div>
      </div>
    </div>
  );
};

// Botão de ajuda apenas com ícone
export interface HelpIconButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export const HelpIconButton: React.FC<HelpIconButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-help-icon"
      title="Precisa de ajuda?"
    >
      💡
    </button>
  );
};