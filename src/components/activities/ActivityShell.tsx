import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CommitinhoBubble from "@/components/ui/CommitinhoBubble";

interface ActivityShellProps {
  title: string;
  helperText?: string;
  explain?: string;
  prompt: string;
  children: React.ReactNode; // choices ou editor
  onRun?: () => void;
  runLabel?: string;
  feedback?: React.ReactNode;
  isRunning?: boolean;
  exampleTerminal?: React.ReactNode; // optional example terminal
  executionMessage?: string; // message above run button
  showNextButton?: boolean; // whether to show next button
  onNext?: () => void; // next button handler
  nextButtonDisabled?: boolean; // next button state
  nextButtonTooltip?: string; // tooltip for disabled next button
}

const ActivityShell: React.FC<ActivityShellProps> = ({
  title,
  helperText,
  explain,
  prompt,
  children,
  onRun,
  runLabel = "Executar",
  feedback,
  isRunning = false,
  exampleTerminal,
  executionMessage,
  showNextButton,
  onNext,
  nextButtonDisabled,
  nextButtonTooltip
}) => {
  return (
    <div className="min-h-screen bg-commitinho-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-commitinho-text">
          {title}
        </h1>

        {/* Commitinho Helper Bubble */}
        {helperText && (
          <CommitinhoBubble text={helperText} />
        )}

        {/* Explanation */}
        {explain && (
          <div 
            className="mb-6 text-commitinho-text prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: explain }}
          />
        )}

        {/* Python Terminal Header */}
        <div className="mb-4">
          <div className="bg-gray-900 rounded-t-lg px-4 py-2 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-300 text-sm ml-4">Python Terminal</span>
            </div>
          </div>
        </div>

        {/* Example Terminal */}
        {exampleTerminal && (
          <div className="mb-6">
            {exampleTerminal}
          </div>
        )}

        {/* Prompt */}
        <p className="text-commitinho-text mb-4">{prompt}</p>

        {/* Content Area (choices or editor) */}
        <Card className="bg-gray-900 border-gray-700 rounded-t-none mb-6">
          <div className="p-6">
            {children}
          </div>
        </Card>

        {/* Execution Message */}
        {executionMessage && (
          <div className="text-center mb-4">
            <p className="text-commitinho-text-soft text-sm">{executionMessage}</p>
          </div>
        )}

        {/* Run Button */}
        {onRun && (
          <div className="flex justify-center mb-6">
            <Button
              id="run-student-code"
              onClick={onRun}
              disabled={isRunning}
              className="bg-gradient-arcade hover:shadow-glow-primary px-8 py-3 text-white font-semibold"
            >
              {isRunning ? "Executando..." : runLabel}
            </Button>
          </div>
        )}

        {/* Next Button */}
        {showNextButton && onNext && (
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Button
                onClick={onNext}
                disabled={nextButtonDisabled}
                className={`px-8 py-3 font-semibold ${
                  nextButtonDisabled 
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                    : "bg-gradient-arcade hover:shadow-glow-primary text-white"
                }`}
                title={nextButtonDisabled ? nextButtonTooltip : undefined}
              >
                Próxima missão
              </Button>
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="text-center">
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityShell;