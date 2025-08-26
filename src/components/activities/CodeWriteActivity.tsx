import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle } from 'lucide-react';
import ActivityShell from './ActivityShell';
import SuccessModal from '@/components/ui/SuccessModal';
import ErrorModal from '@/components/ui/ErrorModal';
import { getChildName } from '@/utils/templateEngine';

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
  const variables: { [key: string]: string } = {};
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Match variable assignment: var = "value"
    const varAssignMatch = trimmedLine.match(/^(\w+)\s*=\s*['"](.*)['"]\s*$/);
    if (varAssignMatch) {
      variables[varAssignMatch[1]] = varAssignMatch[2];
      continue;
    }
    
    // Match print("text") or print('text')
    const printMatch = trimmedLine.match(/^print\s*\(\s*['"](.*)['"]\s*\)$/);
    if (printMatch) {
      let text = printMatch[1];
      // Replace variable references in the print statement
      for (const [varName, varValue] of Object.entries(variables)) {
        text = text.replace(new RegExp(`\\b${varName}\\b`, 'g'), varValue);
      }
      output.push(text);
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
  
  // Source of truth for student code
  const [studentCode, setStudentCode] = useState(getInitialCode());
  const [hasExecuted, setHasExecuted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
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
  const [usedChips, setUsedChips] = useState<string[]>([]); // Track which chips have been used
  const [hasExecutedOnce, setHasExecutedOnce] = useState(false);

  // Secret box exercise state (for secret_box)
  const [selectedSecret, setSelectedSecret] = useState<string>('');
  const [selectedMessageTemplate, setSelectedMessageTemplate] = useState<string>('');

  // Initialize and shuffle chips for basic-03, basic-04, and basic-05
  useEffect(() => {
    if (activity.id === 'double_print') {
      // Use simple set of chips - just shuffled
      const chips = ['print', '("', 'Olá, Commitinho', '")'];
      // Shuffle the chips so they're not in correct order
      const shuffled = [...chips].sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else if (activity.id === 'triple_echo') {
      // Basic-04: Echo exercise with multiple difficulty levels
      const chips = ['print("eco")', 'print("eco")', 'print("eco")'];
      // Add some distractors
      const distractors = ['"Ecooo!"', '"eco?"'];
      const allChips = [...chips, ...distractors];
      // Shuffle the chips
      const shuffled = allChips.sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else if (activity.id === 'one_line_story') {
      // Basic-05: Story chips with print syntax for creating one-line stories
      const syntaxChips = ['print', '("', '")'];
      const characters = ['um robô,', 'um gato,', 'um dragão,', 'a turma,'];
      const actions = ['dançou,', 'voou,', 'achou uma banana,', 'contou uma piada,'];
      const places = ['na lua,', 'no parque,', 'hoje cedo,'];
      const endings = ['e todos riram!,', 'foi incrível!,', 'fim!,'];
      const extras = ['🎉,', '😂,', '🍌,', '🚀,'];
      
      const allChips = [
        ...syntaxChips,
        ...characters,
        ...actions, 
        ...places,
        ...endings,
        ...extras
      ];
      // Shuffle the chips
      const shuffled = allChips.sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else if (activity.id === 'primeira_fala') {
      // Basic-01: Presentation phrases with improved syntax + child's name
      const childName = getChildName();
      const chips = ['print', '("', '")', 'Olá!,', 'Olá Commitinho!,', 'Eu sou o,', 'Eu sou a,', childName + ','];
      const shuffled = [...chips].sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else if (activity.id === 'frutas_falantes') {
      // Basic-02: Fruits with print syntax
      const chips = ['print', '("', '")', '"Banana!, 🍌"', '"Maçã!, 🍎"', '"Uva!, 🍇"', '"Manga!, 🥭"', '"Abacaxi!, 🍍"'];
      const shuffled = [...chips].sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else if (activity.id === 'show_emojis') {
      // Basic-06: Emojis with simplified syntax
      const chips = ['print', '("', '")', '🚀,', '😂,', '🍕,', '🐱,', '✨,', '💡,'];
      const shuffled = [...chips].sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else if (activity.id === 'cartaz_divertido') {
      // Basic-07: Commitinho FC poster with organized chips
      const syntaxChips = ['print', '("', '")'];
      const teamWords = ['Commitinho FC,', 'Vamos Commitinho!,', 'Gol do Commitinho!,'];
      const actions = ['Rumo à vitória!,', 'Força total!,', 'Somos campeões!,'];
      const emojis = ['⚽,', '🏆,', '🎉,', '💪,', '🔥,', '⭐,'];
      const decorations = ['===,', '***,', '<<<,', '>>>,'];
      
      const allChips = [
        ...syntaxChips,
        ...teamWords,
        ...actions,
        ...emojis,
        ...decorations
      ];
      // Shuffle the chips
      const shuffled = allChips.sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else if (activity.id === 'placa_aviso') {
      // Basic-08: Warning signs with print syntax
      const chips = ['print', '("', '")', '"Cuidado!,"', '"Bem-vindos!,"', '"Por favor, não corra!,"', '"Atenção!,"'];
      const shuffled = [...chips].sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else if (activity.id === 'cartao_visita') {
      // Basic-09: 2-line business card (line-based)
      setAvailableChips([]);
    } else if (activity.id === 'checkpoint_1') {
      // Basic-10: Checkpoint (no chips - complex validation)
      setAvailableChips([]);
    }
  }, [activity.id]);

  // Sync studentCode when chips change in organize mode
  useEffect(() => {
    if (mode === 'organize' && (activity.id === 'double_print' || activity.id === 'triple_echo' || activity.id === 'one_line_story' || activity.id === 'primeira_fala' || activity.id === 'frutas_falantes' || activity.id === 'show_emojis' || activity.id === 'placa_aviso' || activity.id === 'cartaz_divertido')) {
      let organizedCode;
      if (activity.id === 'triple_echo') {
        // For echo exercise, join non-empty chips with newlines
        organizedCode = selectedChips.filter(chip => chip && chip.trim()).join('\n');
      } else if (activity.id === 'one_line_story') {
        // For story: special handling to put words with spaces inside quotes
        let result = '';
        let insideQuotes = false;
        let firstWordInQuotes = true;
        
        for (const chip of selectedChips) {
          if (chip === '("') {
            result += '("';
            insideQuotes = true;
            firstWordInQuotes = true;
          } else if (chip === '")') {
            result += '")';
            insideQuotes = false;
          } else if (chip === 'print') {
            result += chip;
          } else if (insideQuotes) {
            // Add space before content words when inside quotes, except for the very first word
            if (firstWordInQuotes) {
              result += chip;
              firstWordInQuotes = false;
            } else {
              result += ' ' + chip;
            }
          } else {
            result += chip;
          }
        }
        
        organizedCode = result;
      } else if (activity.id === 'show_emojis') {
        // For emojis: same special handling as story
        let result = '';
        let insideQuotes = false;
        let firstWordInQuotes = true;
        
        for (const chip of selectedChips) {
          if (chip === '("') {
            result += '("';
            insideQuotes = true;
            firstWordInQuotes = true;
          } else if (chip === '")') {
            result += '")';
            insideQuotes = false;
          } else if (chip === 'print') {
            result += chip;
          } else if (insideQuotes) {
            // Add space before emojis when inside quotes, except for the very first one
            if (firstWordInQuotes) {
              result += chip;
              firstWordInQuotes = false;
            } else {
              result += ' ' + chip;
            }
          } else {
            result += chip;
          }
        }
        
        organizedCode = result;
      } else if (activity.id === 'cartaz_divertido') {
        // For poster: same special handling as story and emojis
        let result = '';
        let insideQuotes = false;
        let firstWordInQuotes = true;
        
        for (const chip of selectedChips) {
          if (chip === '("') {
            result += '("';
            insideQuotes = true;
            firstWordInQuotes = true;
          } else if (chip === '")') {
            result += '")';
            insideQuotes = false;
          } else if (chip === 'print') {
            result += chip;
          } else if (insideQuotes) {
            // Add space before content when inside quotes, except for the very first word
            if (firstWordInQuotes) {
              result += chip;
              firstWordInQuotes = false;
            } else {
              result += ' ' + chip;
            }
          } else {
            result += chip;
          }
        }
        
        organizedCode = result;
      } else if (activity.id === 'primeira_fala' || activity.id === 'frutas_falantes' || activity.id === 'placa_aviso') {
        // For assembly exercises, join chips without spaces (like basic-03)
        organizedCode = selectedChips.join('');
      } else {
        // For greeting exercise, join chips without spaces
        organizedCode = selectedChips.join('');
      }
      setStudentCode(organizedCode);
    }
  }, [selectedChips, mode, activity.id]);

  // Sync studentCode for secret_box exercise
  useEffect(() => {
    if (activity.id === 'secret_box' && mode === 'organize' && selectedSecret && selectedMessageTemplate) {
      const message = selectedMessageTemplate.replace('[segredo]', selectedSecret);
      const code = `segredo = "${selectedSecret}"\nprint("${message}")`;
      setStudentCode(code);
    }
  }, [selectedSecret, selectedMessageTemplate, mode, activity.id]);

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

    const codeToValidate = studentCode;

    // Run the code and show output in terminal
    try {
      const output = runPythonCode(codeToValidate);
      setStudentOutput(output.join('\n'));
      
      // Enhanced validation for basic-03 with tolerances
      if (activity.id === 'double_print') {
        if (output.length !== 1) {
          setIsCorrect(false);
          setErrorMessage('Deve haver exatamente uma linha de saída. Verifique se há apenas um print.');
          setShowErrorModal(true);
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
          
          // Don't show success modal immediately, let user click next mission
        } else {
          setIsCorrect(false);
          setErrorMessage(`Esperado algo como "Olá, Commitinho". Recebido: "${output[0]}"`);
          setShowErrorModal(true);
        }
      }
      // Enhanced validation for basic-04 (triple echo)
      else if (activity.id === 'triple_echo') {
        if (output.length < 3) {
          setIsCorrect(false);
          const missing = 3 - output.length;
          setErrorMessage(`A caverna está tímida… falta${missing > 1 ? 'm' : ''} ${missing} eco${missing > 1 ? 's' : ''}!`);
          setShowErrorModal(true);
          return;
        } else if (output.length > 3) {
          setIsCorrect(false);
          setErrorMessage('Muitos gritos! Use só 3 ecos.');
          setShowErrorModal(true);
          return;
        }

        // Check each line - should be exactly "eco" (case-insensitive, spaces ok)
        const validEchos = output.every(line => {
          const normalized = normalizeText(line);
          return /^eco\s*$/.test(normalized);
        });

        if (validEchos) {
          setIsCorrect(true);
          
          // Show confetti animation on successful execution
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
          
          const message = activity.successTemplate || 'Perfeito! Os três ecos voltaram!';
          setSuccessMessage(message);
          
          // Don't show success modal immediately, let user click next mission
        } else {
          setIsCorrect(false);
          // Check what kind of error
          const hasWrongWords = output.some(line => {
            const normalized = normalizeText(line);
            return normalized.includes('ecooo') || normalized.includes('eco?');
          });
          
          if (hasWrongWords) {
            setErrorMessage('O eco volta igualzinho: escreva apenas "eco".');
          } else {
            setErrorMessage('Use print("eco") — as aspas e os parênteses fazem a mágica.');
          }
          setShowErrorModal(true);
        }
      }
      // Enhanced validation for basic-05 (one line story)
      else if (activity.id === 'one_line_story') {
        if (output.length !== 1) {
          setIsCorrect(false);
          if (output.length === 0) {
            setErrorMessage('Sua história precisa dizer algo.');
          } else {
            setErrorMessage('Use apenas um print — sua história deve ser de uma linha só.');
          }
          setShowErrorModal(true);
          return;
        }

        const story = output[0].trim();
        
        // Check for profanity (basic filter - expand as needed)
        const badWords = ['merda', 'caralho', 'porra', 'buceta', 'puta', 'fdp'];
        const containsBadWords = badWords.some(word => story.toLowerCase().includes(word));
        
        if (containsBadWords) {
          setIsCorrect(false);
          setErrorMessage('Vamos manter nossa história legal e apropriada! 😊');
          setShowErrorModal(true);
          return;
        }

        // Check if story is too long (80-100 char limit)
        if (story.length > 100) {
          setIsCorrect(false);
          setErrorMessage('História grande demais! Tente uma frase mais curtinha 😉');
          setShowErrorModal(true);
          return;
        }

        // Check if story is empty
        if (story.length === 0) {
          setIsCorrect(false);
          setErrorMessage('Sua história precisa dizer algo.');
          setShowErrorModal(true);
          return;
        }

        // Check if the code matches a single print pattern
        const singlePrintPattern = /^\s*print\s*\(\s*['"'][^'"]*['"]\s*\)\s*$/;
        const codeValidation = singlePrintPattern.test(codeToValidate.trim());
        
        if (!codeValidation) {
          setIsCorrect(false);
          if (!codeToValidate.includes('print')) {
            setErrorMessage('Use print("texto") — as aspas e os parênteses fazem a mágica.');
          } else if (!codeToValidate.includes('"') && !codeToValidate.includes("'")) {
            setErrorMessage('Use print("texto") — as aspas e os parênteses fazem a mágica.');
          } else {
            setErrorMessage('Verifique se está usando o formato correto: print("sua história")');
          }
          setShowErrorModal(true);
          return;
        }

        // If we get here, the story is valid!
        setIsCorrect(true);
        
        // Show confetti animation on successful execution
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        const message = activity.successTemplate || 'Que história legal! 📚';
        setSuccessMessage(message);
      }
      // Enhanced validation for basic-07 (secret box - variable + message)
      else if (activity.id === 'secret_box') {
        if (output.length !== 1) {
          setIsCorrect(false);
          if (output.length === 0) {
            setErrorMessage('Sua mensagem ficou vazia');
          } else {
            setErrorMessage('Use apenas uma mensagem na tela.');
          }
          setShowErrorModal(true);
          return;
        }

        const message = output[0].trim();
        
        if (message.length < 5) {
          setIsCorrect(false);
          setErrorMessage('Sua mensagem precisa ser mais longa que isso.');
          setShowErrorModal(true);
          return;
        }

        if (message.length > 100) {
          setIsCorrect(false);
          setErrorMessage('Muito longo — tente uma frase curtinha');
          setShowErrorModal(true);
          return;
        }

        // In organize mode, check if the selected secret appears in output
        if (mode === 'organize') {
          if (!selectedSecret) {
            setIsCorrect(false);
            setErrorMessage('Guarde um segredo primeiro 😉');
            setShowErrorModal(true);
            return;
          }

          if (!message.toLowerCase().includes(selectedSecret.toLowerCase())) {
            setIsCorrect(false);
            setErrorMessage('Use o seu segredo dentro da mensagem');
            setShowErrorModal(true);
            return;
          }
        } else {
          // In type mode, check if code has both variable assignment and print
          const hasVariableAssignment = /\w+\s*=\s*['"]/m.test(codeToValidate);
          const hasPrint = /print\s*\(/m.test(codeToValidate);
          
          if (!hasVariableAssignment || !hasPrint) {
            setIsCorrect(false);
            setErrorMessage('Use uma variável para guardar o segredo e print para mostrar a mensagem.');
            setShowErrorModal(true);
            return;
          }
        }

        // Success!
        setIsCorrect(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        const successMsg = activity.successTemplate || 'Segredo revelado! 🔓';
        setSuccessMessage(successMsg);
      }
      // Special handling for cartaz_divertido - very flexible
      else if (activity.id === 'cartaz_divertido') {
        // For cartaz_divertido: accept any code that looks like print with quotes
        const code = codeToValidate.trim().toLowerCase();
        if (output.length >= 1 || 
            (code.includes('print') && (code.includes('"') || code.includes("'")))) {
          setIsCorrect(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
          
          const successMsg = activity.successTemplate || 'Que cartaz animado! ⚽';
          setSuccessMessage(successMsg);
          return;
        } else {
          setIsCorrect(false);
          setErrorMessage('Use print("seu cartaz") para criar o cartaz.');
          setShowErrorModal(true);
          return;
        }
      }
      // Enhanced validation for Module 1 exercises (basic-01 to basic-10) - but keep one_line_story separate  
      else if (activity.id === 'primeira_fala' || activity.id === 'frutas_falantes' || activity.id === 'show_emojis' || activity.id === 'placa_aviso') {
        // Single line exercises
        if (output.length !== 1) {
          setIsCorrect(false);
          if (output.length === 0) {
            setErrorMessage('Escreva algo entre aspas.');
          } else {
            setErrorMessage('Use apenas uma fala (1 print).');
          }
          setShowErrorModal(true);
          return;
        }

        const line = output[0].trim();
        if (line.length === 0 && activity.id !== 'cartaz_divertido') {
          setIsCorrect(false);
          setErrorMessage(activity.id === 'primeira_fala' ? 'Escreva algo entre aspas.' : 'Sua fala precisa dizer algo.');
          setShowErrorModal(true);
          return;
        }

        // Additional validation for show_emojis - must contain emoji
        if (activity.id === 'show_emojis') {
          const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
          if (!emojiRegex.test(line)) {
            setIsCorrect(false);
            setErrorMessage('Coloque algo entre aspas (pode ser emoji).');
            setShowErrorModal(true);
            return;
          }
        }

        // For cartaz_divertido - accept any content as long as it has proper syntax
        if (activity.id === 'cartaz_divertido') {
          // No additional content validation - any text in quotes is valid
        }

        // Check if code matches proper print syntax for assembly exercises (except cartaz_divertido which is more flexible)
        if (activity.id === 'primeira_fala' || activity.id === 'frutas_falantes' || activity.id === 'show_emojis' || activity.id === 'placa_aviso') {
          const printSyntaxPattern = /^\s*print\s*\(\s*['"'].*['"']\s*\)\s*$/;
          if (!printSyntaxPattern.test(codeToValidate.trim())) {
            setIsCorrect(false);
            if (!codeToValidate.includes('print')) {
              setErrorMessage('Use print("texto") — as aspas e os parênteses fazem a mágica.');
            } else if (!codeToValidate.includes('(') || !codeToValidate.includes(')')) {
              setErrorMessage('Use print("texto") — as aspas e os parênteses fazem a mágica.');
            } else if (!codeToValidate.includes('"') && !codeToValidate.includes("'")) {
              setErrorMessage('Use print("texto") — as aspas e os parênteses fazem a mágica.');
            } else {
              setErrorMessage('Verifique se está usando o formato correto: print("texto")');
            }
            setShowErrorModal(true);
            return;
          }
        }


        // Success for single-line exercises
        setIsCorrect(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        const successMsg = activity.successTemplate || 'Perfeito!';
        setSuccessMessage(successMsg);
      }
      else if (activity.id === 'cartaz_divertido') {
        // 3-line poster
        if (output.length !== 3) {
          setIsCorrect(false);
          if (output.length < 3) {
            setErrorMessage('Faltam linhas.');
          } else {
            setErrorMessage('Use só 3 linhas.');
          }
          setShowErrorModal(true);
          return;
        }

        // Check that all lines are non-empty
        const hasEmptyLines = output.some(line => line.trim().length === 0);
        if (hasEmptyLines) {
          setIsCorrect(false);
          setErrorMessage('Todas as 3 linhas precisam ter conteúdo.');
          setShowErrorModal(true);
          return;
        }

        // Success!
        setIsCorrect(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        const successMsg = activity.successTemplate || 'Que cartaz legal! 📋';
        setSuccessMessage(successMsg);
      }
      else if (activity.id === 'cartao_visita') {
        // 2-line business card
        if (output.length !== 2) {
          setIsCorrect(false);
          if (output.length < 2) {
            setErrorMessage('Faltam linhas.');
          } else {
            setErrorMessage('Use só 2 linhas.');
          }
          setShowErrorModal(true);
          return;
        }

        // Check that all lines are non-empty
        const hasEmptyLines = output.some(line => line.trim().length === 0);
        if (hasEmptyLines) {
          setIsCorrect(false);
          setErrorMessage('As 2 linhas precisam ter conteúdo.');
          setShowErrorModal(true);
          return;
        }

        // Success!
        setIsCorrect(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        const successMsg = activity.successTemplate || 'Ótima apresentação! 👋';
        setSuccessMessage(successMsg);
      }
      else if (activity.id === 'checkpoint_1') {
        // Checkpoint: flexible validation (accept any valid output for now)
        if (output.length === 0) {
          setIsCorrect(false);
          setErrorMessage('Complete os desafios!');
          setShowErrorModal(true);
          return;
        }

        // Success!
        setIsCorrect(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        const successMsg = activity.successTemplate || 'Você dominou o print! 🏆';
        setSuccessMessage(successMsg);
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
          setShowErrorModal(true);
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
          setShowErrorModal(true);
        }
      }
    } catch (error) {
      setStudentError('Erro ao executar o código');
      setIsCorrect(false);
      setErrorMessage('Erro ao executar o código. Verifique se está no formato correto.');
      setShowErrorModal(true);
    }
  };

  // Complete reset function for "Try Again"
  const handleTryAgain = () => {
    setHasExecuted(false);
    setHasExecutedOnce(false);
    setIsCorrect(false);
    setErrorMessage('');
    setSuccessMessage('');
    setStudentOutput('');
    setStudentError('');
    setShowConfetti(false);
    setShowErrorModal(false);
    setShowSuccessModal(false);
    
    // Reset code and chips for exercises with organize mode
    if (activity.id === 'double_print') {
      setSelectedChips([]);
      setUsedChips([]);
      setStudentCode('');
      // Re-shuffle the chips
      const chips = ['print', '("', 'Olá, Commitinho', '")'];
      const shuffled = [...chips].sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else if (activity.id === 'triple_echo') {
      setSelectedChips([]);
      setUsedChips([]);
      setStudentCode('');
      // Re-shuffle the chips
      const chips = ['print("eco")', 'print("eco")', 'print("eco")'];
      const distractors = ['"Ecooo!"', '"eco?"'];
      const allChips = [...chips, ...distractors];
      const shuffled = allChips.sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else if (activity.id === 'one_line_story') {
      setSelectedChips([]);
      setUsedChips([]);
      setStudentCode('');
      // Re-shuffle the story chips with syntax
      const syntaxChips = ['print', '("', '")'];
      const characters = ['um robô,', 'um gato,', 'um dragão,', 'a turma,'];
      const actions = ['dançou,', 'voou,', 'achou uma banana,', 'contou uma piada,'];
      const places = ['na lua,', 'no parque,', 'hoje cedo,'];
      const endings = ['e todos riram!,', 'foi incrível!,', 'fim!,'];
      const extras = ['🎉,', '😂,', '🍌,', '🚀,'];
      
      const allChips = [...syntaxChips, ...characters, ...actions, ...places, ...endings, ...extras];
      const shuffled = allChips.sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else if (activity.id === 'secret_box') {
      setSelectedChips([]);
      setUsedChips([]);
      setStudentCode('');
      setSelectedSecret('');
      setSelectedMessageTemplate('');
    } else if (activity.id === 'primeira_fala') {
      setSelectedChips([]);
      setUsedChips([]);
      setStudentCode('');
      // Re-shuffle the chips for basic-01 + child's name
      const childName = getChildName();
      const chips = ['print', '("', '")', 'Olá!,', 'Olá Commitinho!,', 'Eu sou o,', 'Eu sou a,', childName + ','];
      const shuffled = [...chips].sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else if (activity.id === 'frutas_falantes') {
      setSelectedChips([]);
      setUsedChips([]);
      setStudentCode('');
      // Re-shuffle the chips for basic-02
      const chips = ['print', '("', '")', '"Banana!, 🍌"', '"Maçã!, 🍎"', '"Uva!, 🍇"', '"Manga!, 🥭"', '"Abacaxi!, 🍍"'];
      const shuffled = [...chips].sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else if (activity.id === 'show_emojis') {
      setSelectedChips([]);
      setUsedChips([]);
      setStudentCode('');
      // Re-shuffle the chips for basic-06
      const chips = ['print', '("', '")', '🚀,', '😂,', '🍕,', '🐱,', '✨,', '💡,'];
      const shuffled = [...chips].sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else if (activity.id === 'cartaz_divertido') {
      setSelectedChips([]);
      setUsedChips([]);
      setStudentCode('');
      // Re-shuffle the chips for basic-07
      const syntaxChips = ['print', '("', '")'];
      const teamWords = ['Commitinho FC,', 'Vamos Commitinho!,', 'Gol do Commitinho!,'];
      const actions = ['Rumo à vitória!,', 'Força total!,', 'Somos campeões!,'];
      const emojis = ['⚽,', '🏆,', '🎉,', '💪,', '🔥,', '⭐,'];
      const decorations = ['===,', '***,', '<<<,', '>>>,'];
      
      const allChips = [...syntaxChips, ...teamWords, ...actions, ...emojis, ...decorations];
      const shuffled = allChips.sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else if (activity.id === 'placa_aviso') {
      setSelectedChips([]);
      setUsedChips([]);
      setStudentCode('');
      // Re-shuffle the chips for basic-08
      const chips = ['print', '("', '")', '"Cuidado!,"', '"Bem-vindos!,"', '"Por favor, não corra!,"', '"Atenção!,"'];
      const shuffled = [...chips].sort(() => Math.random() - 0.5);
      setAvailableChips(shuffled);
    } else {
      setStudentCode(getInitialCode());
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
    // Check if chip is already used (not available in tray anymore)
    if (usedChips.includes(chip)) return;
    
    // Mark chip as used (remove from available tray)
    setUsedChips(prev => [...prev, chip]);
    
    if (activity.id === 'triple_echo') {
      // For triple echo, add to the first empty slot
      setSelectedChips(prev => {
        const newChips = [...prev];
        for (let i = 0; i < 3; i++) {
          if (!newChips[i]) {
            newChips[i] = chip;
            break;
          }
        }
        return newChips;
      });
    } else {
      // For other exercises, add to the end
      setSelectedChips(prev => [...prev, chip]);
    }
  };

  const removeChip = (index: number) => {
    let removedChip = '';
    
    if (activity.id === 'triple_echo') {
      // For triple echo, clear the specific slot but maintain array structure
      setSelectedChips(prev => {
        const newChips = [...prev];
        removedChip = newChips[index];
        newChips[index] = '';
        return newChips;
      });
    } else {
      // For other exercises, remove by index
      setSelectedChips(prev => {
        removedChip = prev[index];
        return prev.filter((_, i) => i !== index);
      });
    }
    
    // Return chip to available tray (remove from used chips)
    setUsedChips(prev => prev.filter(chip => chip !== removedChip));
  };

  const clearChips = () => {
    setSelectedChips([]);
    setUsedChips([]); // Return all chips to tray
  };

  const undoLastChip = () => {
    if (selectedChips.length === 0) return;
    
    if (activity.id === 'triple_echo') {
      // For triple echo, find the last non-empty slot
      const lastIndex = selectedChips.map((chip, index) => chip ? index : -1).filter(i => i >= 0).pop();
      if (lastIndex !== undefined) {
        removeChip(lastIndex);
      }
    } else {
      // For other exercises, remove the last chip
      removeChip(selectedChips.length - 1);
    }
  };

  // Reset execution state when switching modes or difficulty
  const resetExecutionState = () => {
    setHasExecuted(false);
    setIsCorrect(false);
    setErrorMessage('');
    setStudentOutput('');
    setStudentError('');
  };

  // Handle mode switching with proper synchronization
  const handleModeSwitch = (newMode: 'type' | 'organize') => {
    if (newMode === mode) return;

    if (newMode === 'type') {
      // When switching to type mode, studentCode is already synchronized
      // Just clear chips for organize mode
      setSelectedChips([]);
      setUsedChips([]);
    } else {
      // When switching to organize mode, clear chips
      // studentCode remains as is for potential reconstruction
      setSelectedChips([]);
      setUsedChips([]);
    }
    
    setMode(newMode);
    resetExecutionState();
  };

  // Handle student code changes in type mode
  const handleStudentCodeChange = (code: string) => {
    setStudentCode(code);
    resetExecutionState();
  };

  // Handle next mission button click
  const handleNextMission = () => {
    setShowSuccessModal(true);
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
          
          {/* Example observation */}
          {activity.example?.observation && (
            <div className="mt-3 text-xs text-gray-400 italic">
              {activity.example.observation}
            </div>
          )}
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
    >
      {/* Unified Student Terminal for all code_write exercises - Inside ActivityShell */}
      {(activity.id === 'double_print' || activity.id === 'triple_echo' || activity.id === 'one_line_story' || 
        activity.id === 'primeira_fala' || activity.id === 'frutas_falantes' || activity.id === 'show_emojis' ||
        activity.id === 'cartaz_divertido' || activity.id === 'placa_aviso' || activity.id === 'cartao_visita' ||
        activity.id === 'checkpoint_1') ? (
        <div className="space-y-4">

          {/* Single Student Terminal */}
          <div className="rounded-xl border border-white/10 bg-[#0c0f1a]">
          {/* Terminal Header with toggle */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <div className="ml-3 text-sm opacity-80 text-gray-300">Python Terminal (Seu código)</div>
            </div>

            {/* Mode Toggle inside terminal header */}
            <div className="bg-gray-800 rounded-md p-0.5 flex text-xs">
              <button
                onClick={() => handleModeSwitch('organize')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  mode === 'organize' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Organizar palavras
              </button>
              <button
                onClick={() => handleModeSwitch('type')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  mode === 'type' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Digitar
              </button>
            </div>
          </div>

          <div className="p-4">
            {/* Organize Mode */}
            {mode === 'organize' && (
              <div className="space-y-4">
                {/* Assembly line (dropzone) - Different layout for basic-04 and basic-05 */}
                {activity.id === 'triple_echo' ? (
                  // For triple echo: 3 slots for lines
                  <div className="bg-black/20 rounded-lg p-4 min-h-[120px]">
                    <div className="text-xs text-gray-400 mb-3">Monte suas 3 linhas:</div>
                    <div className="space-y-2">
                      {[0, 1, 2].map((lineIndex) => (
                        <div key={lineIndex} className="bg-black/30 rounded p-2 min-h-[32px] flex items-center">
                          <span className="text-gray-500 text-xs mr-2">Linha {lineIndex + 1}:</span>
                          <div className="flex gap-1">
                            {selectedChips[lineIndex] ? (
                              <button
                                onClick={() => removeChip(lineIndex)}
                                className="inline-flex items-center px-2 py-1 rounded bg-primary text-primary-foreground text-sm font-mono hover:bg-primary/80 transition-colors"
                              >
                                {selectedChips[lineIndex]}
                                <span className="ml-1 text-xs">×</span>
                              </button>
                            ) : (
                              <div className="text-gray-600 text-sm font-mono">Clique em um chip abaixo</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (activity.id === 'one_line_story' || activity.id === 'cartaz_divertido') ? (
                  // For story and poster: sentence building area with categories
                  <div className="bg-black/20 rounded-lg p-4 min-h-[100px]">
                    <div className="text-xs text-gray-400 mb-2">
                      {activity.id === 'one_line_story' ? 'Monte sua história:' : 'Monte seu cartaz:'}
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[60px] items-center bg-black/30 rounded p-3">
                      {selectedChips.length > 0 ? (
                        selectedChips.map((chip, index) => (
                          <button
                            key={index}
                            onClick={() => removeChip(index)}
                            className={`inline-flex items-center px-2 py-1 rounded text-sm hover:bg-primary/80 transition-colors ${
                              ['print', '("', '")'].includes(chip)
                                ? 'bg-red-600 text-white font-mono' // Syntax chips in red
                                : 'bg-primary text-primary-foreground'
                            }`}
                          >
                            {chip}
                            <span className="ml-1 text-xs">×</span>
                          </button>
                        ))
                      ) : (
                        <div className="text-gray-500 text-sm">
                          {activity.id === 'one_line_story' 
                            ? 'Clique nas palavras abaixo para construir print("sua história")' 
                            : 'Clique nas palavras abaixo para construir print("seu cartaz")'}
                        </div>
                      )}
                    </div>
                    
                    {/* Story controls */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={clearChips}
                        className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                      >
                        Limpar
                      </button>
                      <button
                        onClick={() => {
                          // "Surprise me" - random story generation with syntax
                          const syntaxStart = ['print', '("'];
                          const characters = ['um robô', 'um gato', 'um dragão', 'a turma'];
                          const actions = ['dançou', 'voou', 'achou uma banana', 'contou uma piada'];
                          const places = ['na lua', 'no parque', 'hoje cedo'];
                          const endings = ['e todos riram!', 'foi incrível!', 'fim!'];
                          const extras = ['🎉', '😂', '🍌', '🚀'];
                          const syntaxEnd = ['")'];
                          
                          const randomStory = [
                            ...syntaxStart,
                            characters[Math.floor(Math.random() * characters.length)],
                            actions[Math.floor(Math.random() * actions.length)],
                            places[Math.floor(Math.random() * places.length)],
                            endings[Math.floor(Math.random() * endings.length)],
                            extras[Math.floor(Math.random() * extras.length)],
                            ...syntaxEnd
                          ];
                          
                          setSelectedChips(randomStory);
                        }}
                        className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                      >
                        Surpreenda-me
                      </button>
                    </div>
                  </div>
                ) : activity.id === 'secret_box' ? (
                  // For secret box: two-step UI (secret selection + message template)
                  <div className="space-y-4">
                    {/* Step 1: Choose your secret */}
                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="text-xs text-gray-400 mb-3">1. Escolha seu segredo:</div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {['banana', 'robô', 'pizza', 'mistério 🤫', 'estrela ✨'].map((secret, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedSecret(secret)}
                            className={`px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedSecret === secret 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                            }`}
                          >
                            {secret}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => {
                            const custom = prompt('Digite seu segredo personalizado:', selectedSecret || '');
                            if (custom !== null && custom.trim()) {
                              // Basic validation
                              if (custom.length > 80) {
                                alert('Segredo muito longo! Máximo 80 caracteres.');
                                return;
                              }
                              // Basic profanity filter
                              const badWords = ['merda', 'caralho', 'porra', 'buceta', 'puta', 'fdp'];
                              if (badWords.some(word => custom.toLowerCase().includes(word))) {
                                alert('Vamos manter o segredo apropriado! 😊');
                                return;
                              }
                              setSelectedSecret(custom.trim());
                            }
                          }}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                        >
                          ✏️ Editar texto
                        </button>
                      </div>
                      
                      {selectedSecret && (
                        <div className="text-sm text-green-400">
                          Segredo selecionado: "{selectedSecret}"
                        </div>
                      )}
                    </div>

                    {/* Step 2: Choose message template */}
                    {selectedSecret && (
                      <div className="bg-black/20 rounded-lg p-4">
                        <div className="text-xs text-gray-400 mb-3">2. Monte a mensagem:</div>
                        
                        <div className="space-y-2">
                          {[
                            'Segredo revelado: [segredo]',
                            'Pssiu… [segredo]',
                            'Do cofre saiu: [segredo]',
                            'Shhh… [segredo]!'
                          ].map((template, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedMessageTemplate(template)}
                              className={`w-full p-3 rounded-md text-sm text-left transition-colors ${
                                selectedMessageTemplate === template 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-gray-700 hover:bg-gray-600 text-white'
                              }`}
                            >
                              {template.replace('[segredo]', selectedSecret)}
                            </button>
                          ))}
                          
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => {
                                const templates = [
                                  'Segredo revelado: [segredo]',
                                  'Pssiu… [segredo]',
                                  'Do cofre saiu: [segredo]',
                                  'Shhh… [segredo]!'
                                ];
                                const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
                                setSelectedMessageTemplate(randomTemplate);
                              }}
                              className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                            >
                              Surpreenda-me
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // For basic-01, basic-05 and other assembly exercises: single assembly line
                  <div className="bg-black/20 rounded-lg p-4 min-h-[80px]">
                    <div className="text-xs text-gray-400 mb-2">
                      {activity.id === 'one_line_story' ? 'Monte sua história:' : 'Linha de montagem:'}
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                      {selectedChips.length > 0 ? (
                        selectedChips.map((chip, index) => (
                          <button
                            key={index}
                            onClick={() => removeChip(index)}
                            className="inline-flex items-center px-2 py-1 rounded bg-primary text-primary-foreground text-sm font-mono hover:bg-primary/80 transition-colors"
                          >
                            {chip}
                            <span className="ml-1 text-xs">×</span>
                          </button>
                        ))
                      ) : (
                        <div className="text-gray-500 text-sm font-mono">
                          {activity.id === 'one_line_story' ? 'Clique nas palavras para montar: print("sua história")' : 'Clique nas palavras abaixo para montar'}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Clear All and Undo buttons */}
                <div className="flex justify-center gap-2">
                  <button
                    onClick={undoLastChip}
                    className="px-3 py-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors flex items-center gap-1"
                    disabled={selectedChips.length === 0}
                  >
                    <span>↶</span>
                    Desfazer Último
                  </button>
                  <button
                    onClick={clearChips}
                    className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center gap-1"
                  >
                    <span>🗑️</span>
                    Limpar Tudo
                  </button>
                </div>

                {/* Final code display */}
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Código final:</div>
                  <code className="text-[#d1ffd1] font-mono text-sm whitespace-pre-line">
                    {studentCode || (
                      activity.id === 'triple_echo' ? 'print("eco")\nprint("eco")\nprint("eco")' :
                      activity.id === 'one_line_story' ? 'print("um robô dançou na lua e todos riram! 🎉")' :
                      activity.id === 'secret_box' ? 'segredo = "seu segredo"\nprint("Sua mensagem com " + segredo)' :
                      activity.id === 'primeira_fala' ? 'print("Olá!")' :
                      activity.id === 'frutas_falantes' ? 'print("Banana! 🍌")' :
                      activity.id === 'show_emojis' ? 'print("🚀 😂 🍕")' :
                      activity.id === 'cartaz_divertido' ? 'print("seu cartaz aqui")' :
                      activity.id === 'placa_aviso' ? 'print("Cuidado!")' :
                      'print("Olá, Commitinho")'
                    )}
                  </code>
                </div>

                {/* Story preview for basic-05 */}
                {activity.id === 'one_line_story' && selectedChips.length > 0 && (
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Prévia da história:</div>
                    <div className="text-[#cde3ff] font-mono text-sm">
                      {selectedChips.join('')}
                    </div>
                  </div>
                )}

                {/* Message preview for basic-07 */}
                {activity.id === 'secret_box' && selectedSecret && selectedMessageTemplate && (
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Prévia da mensagem:</div>
                    <div className="text-[#cde3ff] font-mono text-sm">
                      "{selectedMessageTemplate.replace('[segredo]', selectedSecret)}"
                    </div>
                  </div>
                )}

                {/* Available chips tray - show only for exercises with chips */}
                {(activity.id === 'double_print' || activity.id === 'triple_echo' || activity.id === 'one_line_story' ||
                  activity.id === 'primeira_fala' || activity.id === 'frutas_falantes' || activity.id === 'show_emojis' ||
                  activity.id === 'placa_aviso' || activity.id === 'cartaz_divertido') && (
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-2">
                      {activity.id === 'one_line_story' ? 'Palavras para sua história:' : 
                       activity.id === 'cartaz_divertido' ? 'Palavras para seu cartaz do Commitinho FC:' : 
                       'Bandeja de palavras:'}
                    </div>
                  
                  {activity.id === 'one_line_story' ? (
                    // For story: organized by categories with syntax section
                    <div className="space-y-3">
                      {/* Syntax Section */}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">🔧 Sintaxe (para formar print("história")):</div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {['print', '("', '")'].filter(chip => !usedChips.includes(chip)).map((chip, index) => (
                            <button
                              key={index}
                              onClick={() => addChip(chip)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-mono transition-colors whitespace-nowrap"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">👥 Personagens:</div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {['um robô', 'um gato', 'um dragão', 'a turma'].filter(chip => !usedChips.includes(chip)).map((chip, index) => (
                            <button
                              key={index}
                              onClick={() => addChip(chip)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors whitespace-nowrap"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">🎭 Ações:</div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {['dançou', 'voou', 'achou uma banana', 'contou uma piada'].filter(chip => !usedChips.includes(chip)).map((chip, index) => (
                            <button
                              key={index}
                              onClick={() => addChip(chip)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors whitespace-nowrap"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">📍 Lugar/tempo:</div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {['na lua', 'no parque', 'hoje cedo'].filter(chip => !usedChips.includes(chip)).map((chip, index) => (
                            <button
                              key={index}
                              onClick={() => addChip(chip)}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors whitespace-nowrap"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">🎬 Final:</div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {['e todos riram!', 'foi incrível!', 'fim!'].filter(chip => !usedChips.includes(chip)).map((chip, index) => (
                            <button
                              key={index}
                              onClick={() => addChip(chip)}
                              className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm transition-colors whitespace-nowrap"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">😊 Emojis:</div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {['🎉', '😂', '🍌', '🚀'].filter(chip => !usedChips.includes(chip)).map((chip, index) => (
                            <button
                              key={index}
                              onClick={() => addChip(chip)}
                              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm transition-colors whitespace-nowrap"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : activity.id === 'cartaz_divertido' ? (
                    // For poster: organized by categories with syntax section  
                    <div className="space-y-3">
                      {/* Syntax Section */}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">🔧 Sintaxe (para formar print("cartaz")):</div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {['print', '("', '")'].filter(chip => !usedChips.includes(chip)).map((chip, index) => (
                            <button
                              key={index}
                              onClick={() => addChip(chip)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-mono transition-colors whitespace-nowrap"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">⚽ Time:</div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {['Commitinho FC', 'Vamos Commitinho!', 'Gol do Commitinho!'].filter(chip => !usedChips.includes(chip)).map((chip, index) => (
                            <button
                              key={index}
                              onClick={() => addChip(chip)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors whitespace-nowrap"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">💪 Frases de força:</div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {['Rumo à vitória!', 'Força total!', 'Somos campeões!'].filter(chip => !usedChips.includes(chip)).map((chip, index) => (
                            <button
                              key={index}
                              onClick={() => addChip(chip)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors whitespace-nowrap"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">🏆 Emojis esportivos:</div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {['⚽', '🏆', '🎉', '💪', '🔥', '⭐'].filter(chip => !usedChips.includes(chip)).map((chip, index) => (
                            <button
                              key={index}
                              onClick={() => addChip(chip)}
                              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm transition-colors whitespace-nowrap"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">✨ Decorações:</div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {['===', '***', '<<<', '>>>'].filter(chip => !usedChips.includes(chip)).map((chip, index) => (
                            <button
                              key={index}
                              onClick={() => addChip(chip)}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors whitespace-nowrap"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // For other exercises: single row
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {availableChips.filter(chip => !usedChips.includes(chip)).map((chip, index) => (
                        <button
                          key={index}
                          onClick={() => addChip(chip)}
                          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-green-400 rounded-md text-sm font-mono transition-colors whitespace-nowrap"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                  </div>
                )}
              </div>
            )}

            {/* Type Mode */}
            {mode === 'type' && (
              <div className="space-y-4">
                <textarea
                  value={studentCode}
                  onChange={(e) => handleStudentCodeChange(e.target.value)}
                  placeholder={activity.id === 'triple_echo' 
                    ? '# Escreva três prints com "eco" (um por linha)' 
                    : activity.id === 'one_line_story'
                    ? '# Escreva 1 print com sua história'
                    : activity.id === 'primeira_fala'
                    ? '# Escreva 1 fala com print("texto")'
                    : activity.id === 'frutas_falantes'
                    ? '# 1 fala: sua fruta favorita'
                    : activity.id === 'show_emojis'
                    ? '# 1 fala com emoji'
                    : activity.id === 'cartaz_divertido'
                    ? '# 3 linhas: título, frase, emoji'
                    : activity.id === 'placa_aviso'
                    ? '# 1 fala de aviso'
                    : activity.id === 'cartao_visita'
                    ? '# 2 linhas: seu nome + algo que você gosta'
                    : activity.id === 'checkpoint_1'
                    ? '# Complete os 3 desafios'
                    : '# Digite seu código aqui'}
                  className="w-full bg-black/20 text-[#d1ffd1] font-mono leading-7 min-h-32 p-4 rounded-lg resize-none outline-none placeholder-green-600/50 border-0"
                  disabled={hasExecuted && isCorrect}
                  rows={6}
                />
                
                {/* Mobile quick buttons for exercises that can use emojis */}
                {(activity.id === 'one_line_story' || activity.id === 'show_emojis' || activity.id === 'cartaz_divertido') && typeof window !== 'undefined' && window.innerWidth < 768 && (
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                        if (textarea) {
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const newValue = studentCode.substring(0, start) + '"' + studentCode.substring(end);
                          setStudentCode(newValue);
                          setTimeout(() => {
                            textarea.focus();
                            textarea.setSelectionRange(start + 1, start + 1);
                          }, 0);
                        }
                      }}
                      className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                    >
                      "
                    </button>
                    
                    {['🎉', '😂', '🍌', '🚀'].map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const newValue = studentCode.substring(0, start) + emoji + studentCode.substring(end);
                            setStudentCode(newValue);
                            setTimeout(() => {
                              textarea.focus();
                              textarea.setSelectionRange(start + emoji.length, start + emoji.length);
                            }, 0);
                          }
                        }}
                        className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Execute Button - Inside Terminal */}
            <div className="flex justify-center mt-4">
              <Button
                id="run-student-code"
                onClick={handleExecute}
                disabled={hasExecuted && !isCorrect}
                className="bg-gradient-arcade hover:shadow-glow-primary px-8 py-3 text-lg font-semibold text-white"
              >
                Executar código
              </Button>
            </div>

            {/* Output Panel - Inside terminal, appears after execution */}
            {hasExecutedOnce && (studentOutput || studentError) && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs opacity-60 text-gray-400">Saída do programa:</div>
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
                    {showConfetti && (
                      <div className="text-lg animate-bounce">🎉</div>
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
            )}
          </div>
        </div>

        {/* Next Mission Button - After successful execution */}
        {hasExecutedOnce && isCorrect && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={handleNextMission}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 font-semibold text-white"
            >
              🚀 Próxima missão
            </Button>
          </div>
        )}

        {/* Next Mission Button - Only after failure */}
        {hasExecutedOnce && !isCorrect && (
          <div className="flex justify-center mt-4">
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
      ) : (
        // For other activities, show regular textarea
        <div className="space-y-4">
          <textarea
            value={studentCode}
            onChange={(e) => handleStudentCodeChange(e.target.value)}
            placeholder="Digite seu código aqui…"
            className="w-full bg-gray-800 text-green-400 font-mono leading-7 min-h-32 p-4 rounded-lg resize-none outline-none placeholder-green-600/50 border border-gray-700"
            disabled={hasExecuted && isCorrect}
            rows={6}
          />
        </div>
      )}
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

    {/* Error Modal */}
    <ErrorModal
      open={showErrorModal}
      onOpenChange={setShowErrorModal}
      title="Ops! Vamos tentar de novo"
      message={errorMessage}
      onTryAgain={handleTryAgain}
    />
  </>
  );
};

export default CodeWriteActivity;