import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle } from 'lucide-react';
import ActivityShell from './ActivityShell';
import SuccessModal from '@/components/ui/SuccessModal';

type ExampleBlock = {
  code: string;        // código de exemplo read-only
  runLabel?: string;   // rótulo do botão (default: "▶ Rodar exemplo")
};

interface CodeWriteActivityProps {
  activity: {
    id: string;
    type: string;
    title: string;
    prompt: string;
    starter?: string;
    expectedOutput?: string[];
    expectedRegex?: string;
    explain?: string;
    helper?: { text: string };
    runLabel?: string;
    successTemplate?: string;
    successExplain?: string;
    commit_label?: string;
    example?: ExampleBlock; // NOVO (opcional)
    wordChips?: string[]; // NOVO (opcional) - chips para organizar
    distractorChips?: string[]; // NOVO (opcional) - chips distratores
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

const CodeWriteActivity: React.FC<CodeWriteActivityProps> = ({ activity, onComplete }) => {
  // For basic-03, start with empty code in typing mode instead of using starter
  const getInitialCode = () => {
    if (activity.id === 'double_print') {
      return ''; // Always start blank for basic-03
    }
    return activity.starter || '';
  };
  
  const [userCode, setUserCode] = useState(getInitialCode());
  const [hasExecuted, setHasExecuted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Student execution terminal states
  const [studentOutput, setStudentOutput] = useState('');
  const [studentError, setStudentError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Example terminal states
  const [exampleOutput, setExampleOutput] = useState('');
  const [exampleError, setExampleError] = useState('');
  const [exampleLoading, setExampleLoading] = useState(false);

  // Word organization mode states
  const [mode, setMode] = useState<'type' | 'organize'>(() => {
    // Default to organize on mobile, type on desktop
    return typeof window !== 'undefined' && window.innerWidth < 768 ? 'organize' : 'type';
  });
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [availableChips, setAvailableChips] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'challenge'>('easy');
  const [hasExecutedOnce, setHasExecutedOnce] = useState(false);

  // Initialize chips based on activity ID and difficulty (only for basic-03)
  useEffect(() => {
    if (activity.id === 'double_print') {
      let chips: string[] = [];
      let distractors: string[] = [];
      
      if (difficulty === 'easy') {
        chips = ['print', '(', '"Olá, Commitinho"', ')'];
        distractors = [];
      } else if (difficulty === 'medium') {
        chips = ['print', '(', '"Olá,"', '"Commitinho"', ')'];
        distractors = [';'];
      } else if (difficulty === 'challenge') {
        chips = ['print', '(', '"', 'Olá,', 'Commitinho', '"', ')'];
        distractors = [';', 'input', '='];
      }
      
      setAvailableChips([...chips, ...distractors]);
      // Clear selected chips when difficulty changes
      setSelectedChips([]);
    }
  }, [activity.id, difficulty]);

  // Normalize text for validation
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[áàâãä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòôõö]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/\r\n/g, '\n')
      .trimEnd()
      .replace(/\s+/g, ' ');
  };

  const runExample = useCallback(async () => {
    if (!activity.example?.code) return;
    setExampleLoading(true);
    setExampleOutput('');
    setExampleError('');
    
    try {
      const output = runPythonCode(activity.example.code);
      setExampleOutput(output.join('\n'));
    } catch (error) {
      setExampleError('Erro ao executar exemplo');
    }
    
    setExampleLoading(false);
  }, [activity.example?.code]);

  // Keyboard shortcut for executing student code
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isCmd = navigator.platform.includes("Mac");
      if ((isCmd ? e.metaKey : e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        document.getElementById("run-student-code")?.click();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleExecute = () => {
    setHasExecuted(true);
    setHasExecutedOnce(true);
    setErrorMessage('');
    setStudentError('');

    // If in organize mode, sync chips to code first
    if (mode === 'organize') {
      const organizedCode = selectedChips.join('');
      setUserCode(organizedCode);
    }

    const codeToValidate = mode === 'organize' ? selectedChips.join('') : userCode;

    // Run the code and show output in terminal
    try {
      const output = runPythonCode(codeToValidate);
      setStudentOutput(output.join('\n'));
      
      // Enhanced validation for basic-03 with tolerances
      if (activity.id === 'double_print') {
        if (output.length !== 1) {
          setIsCorrect(false);
          setErrorMessage('Deve haver exatamente uma linha de saída. Verifique se há apenas um print.');
          return;
        }

        const actualOutput = normalizeText(output[0]);
        
        // Enhanced regex validation as specified
        const validPattern = /^ola[,!\s]*commitinho[!\s]*$/;
        const isValidGreeting = validPattern.test(actualOutput);
        
        if (isValidGreeting) {
          setIsCorrect(true);
          
          // Show confetti animation on successful execution
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
          
          const message = activity.successTemplate || 'Perfeito! Código executado com sucesso!';
          setSuccessMessage(message);
          
          // Show success modal immediately after validation
          setShowSuccessModal(true);
        } else {
          setIsCorrect(false);
          setErrorMessage(`Esperado algo como "Olá, Commitinho". Recebido: "${output[0]}"`);
        }
      }
      // Fallback to original validation for other activities
      else if (activity.expectedOutput) {
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
        const isValid = regex.test(codeToValidate);
        
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
    } catch (error) {
      setStudentError('Erro ao executar o código');
      setIsCorrect(false);
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

  // Chip management functions
  const addChip = (chip: string) => {
    setSelectedChips(prev => [...prev, chip]);
  };

  const removeChip = (index: number) => {
    setSelectedChips(prev => prev.filter((_, i) => i !== index));
  };

  const clearChips = () => {
    setSelectedChips([]);
  };

  // Reset execution state when switching modes or difficulty
  const resetExecutionState = () => {
    setHasExecuted(false);
    setIsCorrect(false);
    setErrorMessage('');
    setStudentOutput('');
    setStudentError('');
  };

  const renderExampleTerminal = () => {
    if (!activity.example?.code) return null;
    
    return (
      <div className="rounded-xl border border-white/10 bg-[#0c0f1a]">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
          <div className="flex gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <div className="ml-3 text-sm opacity-80 text-gray-300">Python Terminal (Exemplo)</div>
          <div className="ml-auto">
            <button
              onClick={runExample}
              className="px-3 py-1.5 text-sm rounded-md bg-white/10 hover:bg-white/15 text-white disabled:opacity-50"
              disabled={exampleLoading}
            >
              {exampleLoading ? "Executando..." : (activity.example.runLabel ?? "▶ Rodar exemplo")}
            </button>
          </div>
        </div>

        <div className="p-4">
          <pre className="rounded-lg bg-black/20 p-4 overflow-x-auto text-[#d1ffd1] text-sm font-mono">
{activity.example.code}
          </pre>
          <div className="mt-4 rounded-lg bg-black/30 p-3">
            <div className="text-xs opacity-60 mb-1 text-gray-400">Saída</div>
            <pre className="text-[#cde3ff] whitespace-pre-wrap text-sm font-mono min-h-[20px]">
              {exampleOutput || " "}
            </pre>
            {exampleError && (
              <pre className="mt-2 text-red-400 whitespace-pre-wrap text-sm font-mono">
                {exampleError}
              </pre>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
    <ActivityShell
      title={activity.title}
      helperText={activity.helper?.text}
      explain={activity.explain}
      prompt={activity.prompt}
      exampleTerminal={renderExampleTerminal()}
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
      <div className="space-y-4">
        {/* Mode Toggle (only for basic-03) */}
        {activity.id === 'double_print' && availableChips.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-gray-700 rounded-lg p-1 flex">
                <button
                  onClick={() => {
                    if (mode !== 'organize') {
                      setSelectedChips([]);
                      resetExecutionState();
                    }
                    setMode('organize');
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === 'organize' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Organizar palavras
                </button>
                <button
                  onClick={() => {
                    if (mode !== 'type') {
                      const organizedCode = selectedChips.join('');
                      setUserCode(organizedCode);
                      resetExecutionState();
                    }
                    setMode('type');
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === 'type' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Digitar
                </button>
              </div>
            </div>

            {/* Difficulty selector for organize mode */}
            {mode === 'organize' && (
              <div className="flex justify-center">
                <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
                  <button
                    onClick={() => {
                      setDifficulty('easy');
                      resetExecutionState();
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      difficulty === 'easy' 
                        ? 'bg-green-600 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    Fácil
                  </button>
                  <button
                    onClick={() => {
                      setDifficulty('medium');
                      resetExecutionState();
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      difficulty === 'medium' 
                        ? 'bg-yellow-600 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    Mais peças
                  </button>
                  <button
                    onClick={() => {
                      setDifficulty('challenge');
                      resetExecutionState();
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      difficulty === 'challenge' 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    Modo desafio
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Organize Mode */}
        {mode === 'organize' && activity.id === 'double_print' && (
          <div className="space-y-4">
            {/* Selected chips area */}
            <div className="min-h-[80px] bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-2">Código montado:</div>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {selectedChips.length > 0 ? (
                  selectedChips.map((chip, index) => (
                    <button
                      key={index}
                      onClick={() => removeChip(index)}
                      className="inline-flex items-center px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/80 transition-colors"
                    >
                      {chip}
                      <span className="ml-2 text-xs">×</span>
                    </button>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">Clique nas palavras abaixo para montar o código</div>
                )}
              </div>
              {selectedChips.length > 0 && (
                <button
                  onClick={clearChips}
                  className="mt-2 text-xs text-red-400 hover:text-red-300"
                >
                  Limpar tudo
                </button>
              )}
            </div>

            {/* Available chips */}
            <div>
              <div className="text-xs text-gray-400 mb-2">Arraste ou clique para organizar:</div>
              <div className="flex flex-wrap gap-2">
                {availableChips.map((chip, index) => (
                  <button
                    key={index}
                    onClick={() => addChip(chip)}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-green-400 rounded-md text-sm font-mono transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview of organized code */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Prévia:</div>
              <code className="text-green-400 font-mono text-sm">
                {selectedChips.join('') || 'print("Olá, Commitinho")'}
              </code>
            </div>
          </div>
        )}

        {/* Type Mode - Traditional textarea */}
        {mode === 'type' && (
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            placeholder="Digite seu código aqui…"
            className="w-full bg-gray-800 text-green-400 font-mono leading-7 min-h-32 p-4 rounded-lg resize-none outline-none placeholder-green-600/50 border border-gray-700"
            disabled={hasExecuted && isCorrect}
            rows={6}
          />
        )}

      </div>
    </ActivityShell>

    {/* Student Terminal - Outside ActivityShell for proper layout */}
    {activity.id === 'double_print' && (
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {/* Student Terminal (Editor) */}
        <div className="mb-4 rounded-xl border border-white/10 bg-[#0c0f1a]">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <div className="ml-3 text-sm opacity-80 text-gray-300">Python Terminal (Seu código)</div>
          </div>

          <div className="p-4">
            {/* Show current code */}
            <pre className="rounded-lg bg-black/20 p-4 overflow-x-auto text-[#d1ffd1] text-sm font-mono min-h-[80px] flex items-center">
              <code>
{mode === 'organize' 
  ? (selectedChips.length > 0 ? selectedChips.join('') : '# Monte o código usando as palavras acima')
  : (userCode || '# Digite seu código aqui…')
}
              </code>
            </pre>
          </div>
        </div>

        {/* Warning message above execute button */}
        {!hasExecutedOnce && (
          <div className="text-center mb-4">
            <p className="text-commitinho-text-soft text-sm">
              Clique em Executar código para ver como ficou.
            </p>
          </div>
        )}

        {/* Execute Button - Large and prominent */}
        <div className="flex justify-center mb-6">
          <Button
            id="run-student-code"
            onClick={handleExecute}
            disabled={hasExecuted && !isCorrect}
            className="bg-gradient-arcade hover:shadow-glow-primary px-12 py-4 text-lg font-semibold text-white"
          >
            Executar código
          </Button>
        </div>

        {/* Output Panel - Appears after execution */}
        {hasExecutedOnce && (studentOutput || studentError) && (
          <div className="mt-6 rounded-xl border border-white/10 bg-[#0c0f1a]">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <div className="ml-3 text-sm opacity-80 text-gray-300">Saída do Programa</div>
              {showConfetti && (
                <div className="ml-auto text-2xl animate-bounce">🎉</div>
              )}
            </div>

            <div className="p-4">
              <div className="rounded-lg bg-black/30 p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs opacity-60 text-gray-400">Resultado</div>
                  {studentOutput && isCorrect && (
                    <button
                      onClick={() => {
                        try {
                          const utterance = new SpeechSynthesisUtterance(studentOutput);
                          utterance.lang = 'pt-BR';
                          speechSynthesis.speak(utterance);
                        } catch (e) {
                          console.log('TTS not available');
                        }
                      }}
                      className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                      title="Ouvir saída"
                    >
                      🔊 Ouvir
                    </button>
                  )}
                </div>
                <pre className="text-[#cde3ff] whitespace-pre-wrap text-sm font-mono min-h-[20px]">
                  {studentOutput || " "}
                </pre>
                {studentError && (
                  <pre className="mt-2 text-red-400 whitespace-pre-wrap text-sm font-mono">
                    {studentError}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Next Mission Button - Only after success */}
        {hasExecutedOnce && !isCorrect && (
          <div className="flex justify-center mt-6">
            <div className="relative">
              <Button
                disabled={true}
                className="bg-gray-600 text-gray-400 cursor-not-allowed px-8 py-3 font-semibold"
                title="Execute e acerte seu código para avançar."
              >
                Próxima missão
              </Button>
            </div>
          </div>
        )}
      </div>
    )}

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

export default CodeWriteActivity;