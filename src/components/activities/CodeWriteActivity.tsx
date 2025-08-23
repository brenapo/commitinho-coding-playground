import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';


interface CodeWriteActivityProps {
  activity: {
    id: string;
    type: string;
    title: string;
    prompt: string;
    placeholder: string;
    validators?: {
      allowVarNames?: string[];
      requireTwoSteps?: boolean;
    };
    showOutput?: boolean;
    outputLabel?: string;
  };
  onSuccess: (userCode: string) => void;
}

// Extract variable assignment from a line of code
const extractAssignment = (text: string, allowedVarNames: string[] = ['mensagem', 'nome']): { varName: string; value: string } | null => {
  const varNamesPattern = allowedVarNames.join('|');
  const assignmentRegex = new RegExp(`^(${varNamesPattern})\\s*=\\s*(['"])(.*?)\\2\\s*$`);
  const match = text.trim().match(assignmentRegex);
  
  if (match) {
    return {
      varName: match[1],
      value: match[3] // The content inside quotes without the quotes
    };
  }
  return null;
};

// Check if there's a print statement for the given variable
const hasPrintForVar = (lines: string[], varName: string): boolean => {
  const printRegex = new RegExp(`^\\s*print\\s*\\(\\s*${varName}\\s*\\)\\s*$`);
  return lines.some(line => printRegex.test(line.trim()));
};

const CodeWriteActivity: React.FC<CodeWriteActivityProps> = ({ activity, onSuccess }) => {
  const [userCode, setUserCode] = useState(activity.placeholder || '');
  const [hasExecuted, setHasExecuted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = () => {
    setHasExecuted(true);
    setErrorMessage('');

    // Split code into lines, handling both \n and ; separators
    const lines = userCode
      .split(/[;\n]/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Check if we need exactly two steps
    if (activity.validators?.requireTwoSteps && lines.length !== 2) {
      setIsCorrect(false);
      setErrorMessage('Você precisa escrever exatamente 2 linhas de código.');
      return;
    }

    // Find assignment line
    let assignment = null;
    let assignmentLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const extracted = extractAssignment(lines[i], activity.validators?.allowVarNames);
      if (extracted) {
        assignment = extracted;
        assignmentLineIndex = i;
        break;
      }
    }

    if (!assignment) {
      setIsCorrect(false);
      const exampleVar = activity.validators?.allowVarNames?.[0] || 'nome';
      setErrorMessage(`Não encontrei uma atribuição de variável válida. Exemplo: ${exampleVar} = "Seu Nome"`);
      return;
    }

    // Check if variable name is allowed
    if (activity.validators?.allowVarNames && 
        !activity.validators.allowVarNames.includes(assignment.varName)) {
      setIsCorrect(false);
      setErrorMessage(`Use uma dessas variáveis: ${activity.validators.allowVarNames.join(', ')}`);
      return;
    }

    // Check for print statement
    if (!hasPrintForVar(lines, assignment.varName)) {
      setIsCorrect(false);
      setErrorMessage(`Não encontrei print(${assignment.varName}). Não esqueça de mostrar a variável na tela!`);
      return;
    }

    // All validations passed
    setIsCorrect(true);
    onSuccess(assignment.value);
  };

  const handleReset = () => {
    setHasExecuted(false);
    setIsCorrect(false);
    setErrorMessage('');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-commitinho-text-soft text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: activity.prompt }} />

      {/* Code Editor */}
      <div className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-lg font-mono border-2 border-gray-700">
        <div className="flex items-center mb-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 mr-1 sm:mr-2"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500 mr-1 sm:mr-2"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 mr-1 sm:mr-2"></div>
          <span className="text-gray-400 text-xs sm:text-sm ml-2">Python Terminal</span>
        </div>
        <textarea
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          placeholder={activity.placeholder}
          className="w-full bg-transparent text-green-400 font-mono leading-7 min-h-40 resize-none outline-none placeholder-green-600/50"
          disabled={hasExecuted && isCorrect}
          rows={4}
        />
      </div>

      {/* Verify Button */}
      {!hasExecuted && (
        <div className="text-center">
          <Button
            onClick={handleVerify}
            disabled={!userCode.trim()}
            size="lg"
            className="w-full sm:w-auto bg-gradient-arcade text-white font-semibold shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
          >
            <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Verificar
          </Button>
        </div>
      )}

      {/* Wrong Answer Feedback */}
      {hasExecuted && !isCorrect && (
        <Card className="bg-red-500/10 border-red-500">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl mb-3">❌</div>
            <h3 className="text-base sm:text-lg font-bold text-red-600 mb-2">
              Ops! Vamos tentar de novo
            </h3>
            <p className="text-commitinho-text-soft mb-4 text-sm sm:text-base">
              {errorMessage}
            </p>
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full sm:w-auto border-commitinho-surface-2 text-commitinho-text hover:bg-commitinho-surface-2 text-sm sm:text-base"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodeWriteActivity;