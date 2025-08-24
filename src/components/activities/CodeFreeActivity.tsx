import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import ActivityShell from './ActivityShell';
import SuccessModal from '@/components/ui/SuccessModal';

interface CodeFreeActivityProps {
  activity: {
    id: string;
    type: string;
    title: string;
    prompt: string;
    expectedOutput?: string[];
    expectedRegex?: string;
    explain?: string;
    helper?: { text: string };
    runLabel?: string;
    successTemplate?: string;
    successExplain?: string;
    commit_label?: string;
    xp: number;
  };
  onComplete: (xp: number) => void;
}

// Simple Python runner simulator
const runPythonCode = (code: string): string[] => {
  const lines = code.trim().split('\n');
  const output: string[] = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    // Match print("text") or print('text')
    const printMatch = trimmedLine.match(/^print\s*\(\s*['"](.*)['"]\s*\)$/);
    if (printMatch) {
      output.push(printMatch[1]);
    }
  }
  
  return output;
};

const CodeFreeActivity: React.FC<CodeFreeActivityProps> = ({ activity, onComplete }) => {
  const [userCode, setUserCode] = useState('');
  const [hasExecuted, setHasExecuted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleExecute = () => {
    setHasExecuted(true);
    setErrorMessage('');

    // Validate using expectedOutput
    if (activity.expectedOutput) {
      const output = runPythonCode(userCode);
      
      // Check if output matches expected
      const isValid = output.length === activity.expectedOutput.length &&
        output.every((line, index) => line === activity.expectedOutput![index]);
      
      if (isValid) {
        setIsCorrect(true);
        const message = activity.successTemplate || 'Perfeito! Código executado com sucesso!';
        setSuccessMessage(message);
        setShowSuccessModal(true);
      } else {
        setIsCorrect(false);
        setErrorMessage(`Esperado: ${activity.expectedOutput.join(', ')}. Recebido: ${output.join(', ')}`);
      }
    }
    // Validate using regex
    else if (activity.expectedRegex) {
      const regex = new RegExp(activity.expectedRegex, 'm');
      const isValid = regex.test(userCode);
      
      if (isValid) {
        setIsCorrect(true);
        const message = activity.successTemplate || 'Perfeito! Código válido!';
        setSuccessMessage(message);
        setShowSuccessModal(true);
      } else {
        setIsCorrect(false);
        setErrorMessage('O código não está no formato esperado. Verifique se está seguindo o padrão solicitado.');
      }
    }
  };

  const handleReset = () => {
    setHasExecuted(false);
    setIsCorrect(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleComplete = () => {
    setShowSuccessModal(false);
    onComplete(activity.xp);
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
      feedback={hasExecuted && !isCorrect ? (
        <Card className="bg-red-500/10 border-red-500 max-w-lg mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">❌</div>
            <h3 className="text-lg font-bold text-red-600 mb-2">
              Ops! Vamos tentar de novo
            </h3>
            <p className="text-commitinho-text-soft mb-4">
              {errorMessage}
            </p>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-commitinho-surface-2 text-commitinho-text hover:bg-commitinho-surface-2"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      ) : undefined}
    >
      <textarea
        value={userCode}
        onChange={(e) => setUserCode(e.target.value)}
        placeholder="Digite seu código Python aqui..."
        className="w-full bg-gray-800 text-green-400 font-mono leading-7 min-h-40 p-4 rounded-lg resize-none outline-none placeholder-green-600/50 border border-gray-700"
        disabled={hasExecuted && isCorrect}
        rows={8}
      />
    </ActivityShell>

    {/* Success Modal */}
    <SuccessModal
      open={showSuccessModal}
      onOpenChange={setShowSuccessModal}
      title={successMessage}
      xp={activity.xp}
      explanation={activity.successExplain || "Parabéns! Você completou a atividade!"}
      onNext={handleComplete}
    />
  </>
  );
};

export default CodeFreeActivity;