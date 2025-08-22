import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, Code } from 'lucide-react';

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
    explain: string;
    commit_label: string;
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
    setShowFeedback(true);
    
    if (correct && activity.successTemplate) {
      const message = renderSuccess(activity.successTemplate, selectedChoice);
      setSuccessMessage(message);
    } else if (correct && activity.run_feedback_success) {
      setSuccessMessage(activity.run_feedback_success);
    }
  };

  const handleComplete = () => {
    onComplete(activity.xp);
  };

  const getDisplayCode = () => {
    if (selectedChoice) {
      return activity.starter.replace('____', selectedChoice);
    }
    return activity.starter;
  };

  return (
    <div className="space-y-6">
      {/* Activity Header */}
      <Card className="bg-commitinho-surface border-commitinho-surface-2">
        <CardHeader>
          <CardTitle className="text-commitinho-text flex items-center">
            <Code className="mr-2 h-5 w-5" />
            {activity.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-commitinho-text-soft mb-4">
            {activity.prompt}
          </p>
        </CardContent>
      </Card>

      {/* Code Editor */}
      <Card className="bg-commitinho-surface border-commitinho-surface-2">
        <CardHeader>
          <CardTitle className="text-commitinho-text text-lg">Código</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-lg border-2 border-gray-700">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-400 text-sm ml-2">Python Terminal</span>
            </div>
            <code className="block">{getDisplayCode()}</code>
            {hasExecuted && isCorrect && (
              <div className="mt-2 text-white">
                <span className="text-gray-400">{'> '}</span>
                {selectedChoice}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Choices */}
      <Card className="bg-commitinho-surface border-commitinho-surface-2">
        <CardHeader>
          <CardTitle className="text-commitinho-text text-lg">
            Escolha o que vai dentro das aspas:
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
        </CardContent>
      </Card>

      {/* Execute Button */}
      {!hasExecuted && (
        <div className="text-center">
          <Button
            onClick={handleExecute}
            disabled={!selectedChoice}
            size="lg"
            className="bg-gradient-arcade text-white font-semibold shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300"
          >
            <Play className="mr-2 h-5 w-5" />
            Executar
          </Button>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && isCorrect && (
        <Card className="bg-commitinho-success/10 border-commitinho-success">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h3 className="text-xl font-bold text-commitinho-success">
                {successMessage}
              </h3>
              
              {/* Explanation */}
              <div className="bg-commitinho-surface p-4 rounded-lg">
                <div className="text-commitinho-text-soft" dangerouslySetInnerHTML={{ __html: activity.explain }} />
              </div>

              {/* XP Reward */}
              <div className="bg-commitinho-warning/10 p-3 rounded-lg">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-commitinho-text font-medium">XP Ganho:</span>
                  <Badge className="bg-commitinho-warning text-commitinho-warning-foreground">
                    +{activity.xp} XP
                  </Badge>
                </div>
              </div>

              {/* Complete Button */}
              <Button
                onClick={handleComplete}
                size="lg"
                className="bg-gradient-arcade text-white font-semibold shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                {activity.commit_label}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wrong Answer Feedback */}
      {showFeedback && !isCorrect && (
        <Card className="bg-red-500/10 border-red-500">
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
      )}
    </div>
  );
};

export default CodeFillActivity;