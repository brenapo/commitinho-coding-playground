import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, Code } from 'lucide-react';
import ActivityShell from './ActivityShell';
import SuccessModal from '@/components/ui/SuccessModal';

interface CodeFillActivityProps {
  activity: {
    id: string;
    title: string;
    prompt: string;
    starter: string;
    solutions: string[];
    choices: string[];
    run_feedback_success?: string;
    successTemplate?: string;
    successExplain?: string;
    explain?: string;
    helper?: { text: string };
    runLabel?: string;
    commit_label?: string;
    xp: number;
  };
  onComplete: (xp: number) => void;
}

const CodeFillActivity: React.FC<CodeFillActivityProps> = ({ activity, onComplete }) => {
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [hasExecuted, setHasExecuted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChoiceSelect = (choice: string) => {
    if (!hasExecuted) {
      setSelectedChoice(choice);
    }
  };

  const renderSuccess = (template: string, userAnswer: string) => {
    const clean = userAnswer.replace(/^"|"$/g, ""); // tira aspas se vierem junto
    return template.replace(/\{\{\s*answer\s*\}\}/g, clean);
  };

  const handleExecute = () => {
    if (!selectedChoice) return;

    const correct = activity.solutions.includes(selectedChoice);
    setIsCorrect(correct);
    setHasExecuted(true);
    
    if (correct) {
      // Show success modal instead of inline feedback
      const message = activity.successTemplate 
        ? renderSuccess(activity.successTemplate, selectedChoice)
        : 'Correto!';
      setSuccessMessage(message);
      setShowSuccessModal(true);
    } else {
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    setShowSuccessModal(false);
    onComplete(activity.xp);
  };

  const getDisplayCode = () => {
    if (selectedChoice) {
      return activity.starter.replace('____', selectedChoice);
    }
    return activity.starter;
  };

  return (
    <>
    <ActivityShell
      title={activity.title}
      helperText={activity.helper?.text}
      explain={activity.explain}
      prompt={activity.prompt}
      onRun={!hasExecuted ? handleExecute : undefined}
      runLabel={activity.runLabel || "Executar"}
      feedback={showFeedback && !isCorrect ? (
        <Card className="bg-red-500/10 border-red-500 max-w-lg mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">❌</div>
            <h3 className="text-lg font-bold text-red-600 mb-2">
              Ops! Tente novamente
            </h3>
            <p className="text-commitinho-text-soft mb-4">
              Essa não é a resposta correta. Tente escolher outra opção!
            </p>
            <Button
              onClick={() => {
                setSelectedChoice('');
                setHasExecuted(false);
                setShowFeedback(false);
                setIsCorrect(false);
              }}
              variant="outline"
              className="border-commitinho-surface-2 text-commitinho-text hover:bg-commitinho-surface-2"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      ) : undefined}
    >
      <div className="space-y-4">
        {/* Code Display */}
        <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-lg">
          <code className="block">{getDisplayCode()}</code>
          {hasExecuted && isCorrect && (
            <div className="mt-2 text-white">
              <span className="text-gray-400">{'> '}</span>
              {selectedChoice}
            </div>
          )}
        </div>

        {/* Choices */}
        <div className="space-y-3">
          {activity.choices.map((choice, index) => (
            <Button
              key={index}
              onClick={() => handleChoiceSelect(choice)}
              variant={selectedChoice === choice ? "default" : "outline"}
              className={`w-full justify-start text-left h-auto p-4 ${
                selectedChoice === choice 
                  ? "bg-primary text-primary-foreground" 
                  : "border-commitinho-surface-2 text-commitinho-text hover:bg-commitinho-surface-2"
              }`}
              disabled={hasExecuted}
            >
              "{choice}"
            </Button>
          ))}
        </div>
      </div>
    </ActivityShell>

    {/* Success Modal */}
    <SuccessModal
      open={showSuccessModal}
      onOpenChange={setShowSuccessModal}
      title={successMessage}
      xp={activity.xp}
      explanation={activity.successExplain || "Parabéns! Você completou a atividade!"}
      onNext={handleNext}
    />
  </>
  );
};

export default CodeFillActivity;