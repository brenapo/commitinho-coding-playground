import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, Lock, Terminal, Type, Shuffle } from 'lucide-react';
import { useCapacitor } from '@/hooks/useCapacitor';
import SuccessModal from '@/components/ui/SuccessModal';
import ErrorModal from '@/components/ui/ErrorModal';
import { getChildName } from '@/utils/templateEngine';
import { Textarea } from '@/components/ui/textarea';

interface LessonActivity {
  id: string;
  type: string;
  title: string;
  helper: { text: string };
  explain: string;
  prompt: string;
  example?: {
    code: string;
    runLabel: string;
    observation: string;
  };
  chips?: string[];
  expectedOutput: (string | { regex: string })[];
  successTemplate: string;
  successExplain: string;
  runLabel: string;
  xp: number;
}

interface StandardLessonPlayerProps {
  activity: LessonActivity;
  onComplete: (xp: number) => void;
}

// Simple Python runner simulator
const runPythonCode = (code: string): string[] => {
  const lines = code.trim().split('\n');
  const output: string[] = [];
  const variables: { [key: string]: string } = {};
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;
    
    // Match variable assignment: var = "value"
    const varAssignMatch = trimmedLine.match(/^(\w+)\s*=\s*['"](.*)['"]\s*$/);
    if (varAssignMatch) {
      variables[varAssignMatch[1]] = varAssignMatch[2];
      continue;
    }
    
    // Match print("text"), print('text'), or print(variable)
    const printMatch = trimmedLine.match(/^print\s*\(\s*(['"](.*)['"']|(\w+))\s*\)$/);
    if (printMatch) {
      let text = printMatch[2] || variables[printMatch[3]] || printMatch[3] || '';
      
      // Replace variable references in string literals
      if (printMatch[2]) {
        for (const [varName, varValue] of Object.entries(variables)) {
          text = text.replace(new RegExp(`\\b${varName}\\b`, 'g'), varValue);
        }
      }
      
      output.push(text);
    }
  }
  
  return output;
};

// Validation function
const validateOutput = (
  output: string[], 
  expected: (string | { regex: string })[]
): boolean => {
  if (expected.length === 0) return output.length > 0; // Any output is valid
  
  return expected.every((expectedItem, index) => {
    const actualLine = output[index] || '';
    
    if (typeof expectedItem === 'string') {
      return actualLine.trim() === expectedItem.trim();
    } else {
      return new RegExp(expectedItem.regex, 'i').test(actualLine);
    }
  });
};

const StandardLessonPlayer: React.FC<StandardLessonPlayerProps> = ({ activity, onComplete }) => {
  const { hapticSuccess, hapticError, isNative } = useCapacitor();
  
  // Mode state (default to organize on mobile, type on desktop)
  const [mode, setMode] = useState<'type' | 'organize'>(() => {
    return (isNative || window.innerWidth < 768) ? 'organize' : 'type';
  });
  
  // Student code state
  const [studentCode, setStudentCode] = useState('');
  const [hasExecuted, setHasExecuted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [studentOutput, setStudentOutput] = useState<string[]>([]);
  const [studentError, setStudentError] = useState('');
  
  // Example state
  const [exampleOutput, setExampleOutput] = useState<string[]>([]);
  const [exampleLoading, setExampleLoading] = useState(false);
  
  // Modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Organize mode state
  const [availableChips, setAvailableChips] = useState<string[]>([]);
  const [usedChips, setUsedChips] = useState<string[]>([]);
  
  // Initialize organize mode chips
  useEffect(() => {
    if (activity.chips && mode === 'organize') {
      // Shuffle chips for variety
      const shuffled = [...activity.chips].sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
      setUsedChips([]);
      setStudentCode('');
    }
  }, [activity.chips, mode]);
  
  // Update student code when chips change
  useEffect(() => {
    if (mode === 'organize') {
      setStudentCode(usedChips.join(''));
    }
  }, [usedChips, mode]);
  
  // Run example code
  const handleRunExample = () => {
    if (!activity.example) return;
    
    setExampleLoading(true);
    
    setTimeout(() => {
      try {
        const output = runPythonCode(activity.example!.code);
        setExampleOutput(output);
      } catch (error) {
        console.error('Example execution error:', error);
        setExampleOutput(['Erro no exemplo']);
      } finally {
        setExampleLoading(false);
      }
    }, 800); // Simulate execution delay
  };
  
  // Execute student code
  const handleExecuteCode = () => {
    if (!studentCode.trim()) {
      setErrorMessage('Por favor, escreva algum código primeiro!');
      setShowErrorModal(true);
      hapticError();
      return;
    }
    
    setHasExecuted(true);
    setStudentError('');
    
    try {
      const output = runPythonCode(studentCode);
      setStudentOutput(output);
      
      // Validate output
      const isValid = validateOutput(output, activity.expectedOutput);
      setIsCorrect(isValid);
      
      if (isValid) {
        hapticSuccess();
        setShowSuccessModal(true);
      } else {
        hapticError();
        setErrorMessage('Resultado não está correto ainda. Tente novamente!');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Execution error:', error);
      setStudentError('Erro na execução do código');
      hapticError();
    }
  };
  
  // Handle chip selection in organize mode
  const handleChipClick = (chip: string, fromUsed: boolean = false) => {
    if (fromUsed) {
      // Move from used back to available
      setUsedChips(prev => prev.filter(c => c !== chip));
      setAvailableChips(prev => [...prev, chip]);
    } else {
      // Move from available to used
      setAvailableChips(prev => prev.filter(c => c !== chip));
      setUsedChips(prev => [...prev, chip]);
    }
  };
  
  // Handle success
  const handleSuccess = () => {
    onComplete(activity.xp);
    setShowSuccessModal(false);
  };
  
  // Reset exercise
  const handleReset = () => {
    setStudentCode('');
    setHasExecuted(false);
    setIsCorrect(false);
    setStudentOutput([]);
    setStudentError('');
    setShowErrorModal(false);
    
    if (mode === 'organize' && activity.chips) {
      const shuffled = [...activity.chips].sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
      setUsedChips([]);
    }
  };
  
  const childName = getChildName();
  
  return (
    <div className="space-y-6">
      {/* Helper Text */}
      {activity.helper && (
        <Card className="bg-commitinho-warning/10 border-commitinho-warning/20">
          <CardContent className="p-4">
            <p className="text-sm text-commitinho-text">
              {activity.helper.text}
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Example Section */}
      {activity.example && (
        <Card className="bg-commitinho-surface border-commitinho-surface-2">
          <CardHeader>
            <CardTitle className="text-lg text-commitinho-text flex items-center">
              <Play className="h-5 w-5 mr-2 text-commitinho-success" />
              Exemplo para Observar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Example Code Display */}
            <div className="bg-commitinho-bg border border-commitinho-surface-2 rounded-lg p-4 font-mono text-sm">
              <div className="text-commitinho-text-soft mb-2">Código de exemplo:</div>
              <pre className="text-commitinho-text whitespace-pre-wrap">
                {activity.example.code}
              </pre>
            </div>
            
            {/* Example Run Button */}
            <Button
              onClick={handleRunExample}
              disabled={exampleLoading}
              variant="outline"
              className="w-full border-commitinho-success text-commitinho-success hover:bg-commitinho-success hover:text-white"
            >
              {exampleLoading ? 'Executando...' : activity.example.runLabel}
            </Button>
            
            {/* Example Output */}
            {exampleOutput.length > 0 && (
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div className="text-gray-400 mb-2">Saída:</div>
                {exampleOutput.map((line, i) => (
                  <div key={i}>&gt; {line}</div>
                ))}
              </div>
            )}
            
            {/* Example Observation */}
            {exampleOutput.length > 0 && activity.example.observation && (
              <div className="text-sm text-commitinho-text-soft p-3 bg-commitinho-success/10 border border-commitinho-success/20 rounded-lg">
                {activity.example.observation.replace('{{childName}}', childName)}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Explanation */}
      {activity.explain && (
        <Card className="bg-commitinho-surface border-commitinho-surface-2">
          <CardContent className="p-4">
            <div 
              className="text-commitinho-text"
              dangerouslySetInnerHTML={{ 
                __html: activity.explain.replace('{{childName}}', childName) 
              }} 
            />
          </CardContent>
        </Card>
      )}
      
      {/* Main Activity */}
      <Card className="bg-commitinho-surface border-commitinho-surface-2">
        <CardHeader>
          <CardTitle className="text-xl text-commitinho-text">
            {activity.prompt}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode Toggle */}
          {activity.chips && (
            <div className="flex justify-center space-x-2 mb-4">
              <Button
                variant={mode === 'organize' ? 'default' : 'outline'}
                onClick={() => setMode('organize')}
                size="sm"
                className="text-xs"
              >
                <Shuffle className="h-4 w-4 mr-1" />
                Organizar
              </Button>
              <Button
                variant={mode === 'type' ? 'default' : 'outline'}
                onClick={() => setMode('type')}
                size="sm"
                className="text-xs"
              >
                <Type className="h-4 w-4 mr-1" />
                Digitar
              </Button>
            </div>
          )}
          
          {/* Student Input */}
          {mode === 'organize' && activity.chips ? (
            /* Organize Mode */
            <div className="space-y-4">
              {/* Code Assembly Area */}
              <div className="bg-commitinho-bg border-2 border-dashed border-commitinho-surface-2 rounded-lg p-4 min-h-[100px]">
                <div className="text-sm text-commitinho-text-soft mb-2">Seu código:</div>
                <div className="flex flex-wrap gap-2 min-h-[60px] items-start">
                  {usedChips.length > 0 ? (
                    usedChips.map((chip, index) => (
                      <Badge
                        key={`${chip}-${index}`}
                        className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/80"
                        onClick={() => handleChipClick(chip, true)}
                      >
                        {chip === '{{childName}}' ? childName : chip}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-commitinho-text-soft italic">
                      Clique nas palavras abaixo para montar seu código
                    </div>
                  )}
                </div>
              </div>
              
              {/* Available Chips */}
              <div>
                <div className="text-sm text-commitinho-text-soft mb-2">Palavras disponíveis:</div>
                <div className="flex flex-wrap gap-2">
                  {availableChips.map((chip, index) => (
                    <Badge
                      key={`${chip}-${index}`}
                      variant="outline"
                      className="cursor-pointer hover:bg-commitinho-surface-2"
                      onClick={() => handleChipClick(chip)}
                    >
                      {chip === '{{childName}}' ? childName : chip}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Type Mode */
            <div className="space-y-2">
              <Textarea
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                placeholder="Digite seu código Python aqui..."
                className="font-mono text-sm bg-commitinho-bg border-commitinho-surface-2 min-h-[100px]"
              />
            </div>
          )}
          
          {/* Execute Button */}
          <Button
            onClick={handleExecuteCode}
            disabled={!studentCode.trim()}
            className="w-full bg-gradient-arcade text-white font-semibold py-6 text-lg shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300"
          >
            <Terminal className="h-5 w-5 mr-2" />
            {activity.runLabel || 'Executar Código'}
          </Button>
          
          {/* Student Output */}
          {hasExecuted && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <div className="text-gray-400 mb-2">Resultado:</div>
              {studentOutput.length > 0 ? (
                studentOutput.map((line, i) => (
                  <div key={i}>&gt; {line}</div>
                ))
              ) : (
                <div className="text-gray-500">Nenhuma saída</div>
              )}
              {studentError && (
                <div className="text-red-400 mt-2">Erro: {studentError}</div>
              )}
            </div>
          )}
          
          {/* Next Button (only show when correct) */}
          {isCorrect && (
            <Button
              onClick={handleSuccess}
              className="w-full bg-commitinho-success text-commitinho-success-foreground font-semibold py-3"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Continuar para a Próxima Lição
            </Button>
          )}
        </CardContent>
      </Card>
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Parabéns! 🎉"
        message={activity.successTemplate.replace('{{childName}}', childName)}
        explanation={activity.successExplain}
        xpGained={activity.xp}
        onContinue={handleSuccess}
      />
      
      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Ops! Vamos tentar de novo"
        message={errorMessage}
        onTryAgain={() => {
          setShowErrorModal(false);
          handleReset();
        }}
      />
    </div>
  );
};

export default StandardLessonPlayer;