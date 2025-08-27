import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Lightbulb, Heart, Play, Trophy, Star, Zap } from "lucide-react";
import { usePersonalization } from '@/utils/personalization';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGamification } from '@/utils/gamificationSystem';
import { usePythonSimulator } from '@/utils/pythonSimulator';

// Exercícios reformulados com dicas infantis e explicações visuais
const exercisesModule1 = [
  {
    id: 1,
    titulo: "Vamos falar com o computador, [NOME]!",
    pergunta: "Complete o código para o Python dizer olá para você:",
    resposta_correta: ["print", "(", "'Olá, [NOME]!'", ")"],
    opcoes: ["print", "(", ")", "'Olá, [NOME]!'", "input", "'Hello'", "say"],
    dica: "print() faz o computador 'falar'! 🗣️ É como se ele tivesse uma boca que repete tudo que você mandar!",
    balao_commitinho: "Vamos ensinar o Python a falar com você, [NOME]!",
    codigo_inicial: "",
    explicacao: {
      conceito: "print() é como dar uma voz para o computador! 🗣️",
      para_que_serve: "print() serve para o computador 'falar' e mostrar coisas na tela!",
      como_usar: ["1️⃣ Escreva: print(", "2️⃣ Coloque sua mensagem entre aspas", "3️⃣ Feche com: )"],
      analogia: "É como se você tivesse um megafone mágico! 📢 Tudo que você gritar no megafone, todo mundo vai escutar!",
      exemplo_pratico: {
        codigo: "print('Oi, mamãe!')",
        resultado: "Oi, mamãe!"
      }
    }
  },
  {
    id: 2,
    titulo: "Sua primeira conversa, [NOME]!",
    pergunta: "Faça o Python perguntar como você está:",
    resposta_correta: ["print", "(", "'Como você está, [NOME]?'", ")"],
    opcoes: ["print", "(", ")", "'Como você está, [NOME]?'", "'Oi'", "input", "pergunta"],
    dica: "Você pode fazer o Python falar qualquer coisa colocando entre aspas! É como ensinar palavras novas para ele! 💬",
    balao_commitinho: "Que legal, [NOME]! O Python está aprendendo a conversar!",
    codigo_inicial: "",
    explicacao: {
      conceito: "O computador pode dizer qualquer coisa que você quiser! 💬",
      para_que_serve: "Para fazer o computador falar diferentes frases e se comunicar!",
      como_usar: ["1️⃣ Coloque print(", "2️⃣ Escreva sua frase entre aspas ''", "3️⃣ Feche com )"],
      analogia: "É como ensinar um papagaio a falar! 🦜 Ele vai repetir exatamente o que você ensinar!",
      exemplo_pratico: {
        codigo: "print('Bom dia!')",
        resultado: "Bom dia!"
      }
    }
  },
  {
    id: 3,
    titulo: "Python sabe seu nome, [NOME]!",
    pergunta: "Guarde seu nome em uma caixinha chamada 'meu_nome':",
    resposta_correta: ["meu_nome", "=", "'[NOME]'"],
    opcoes: ["meu_nome", "=", "'[NOME]'", "nome", "print", "(", ")", "'nome'"],
    dica: "Imagine uma caixinha de brinquedos! 📦 Você pode guardar qualquer coisa dentro e dar um nome para ela!",
    balao_commitinho: "Agora o Python vai lembrar do seu nome para sempre, [NOME]!",
    codigo_inicial: "",
    explicacao: {
      conceito: "Variáveis são como caixinhas mágicas com etiquetas! 📦✨",
      para_que_serve: "Para guardar informações importantes que você quer usar depois!",
      como_usar: ["1️⃣ Escolha um nome para a caixinha", "2️⃣ Use = para 'guardar'", "3️⃣ Coloque o que quiser guardar"],
      analogia: "É como ter gavetas organizadas no seu quarto! 🗄️ Cada gaveta tem uma etiqueta e você sabe o que tem dentro!",
      exemplo_pratico: {
        codigo: "minha_cor = 'azul'",
        resultado: "Guardou 'azul' na caixinha chamada 'minha_cor'"
      }
    }
  }
];

const ExercicioAprimorado = () => {
  const navigate = useNavigate();
  const { moduleId, exerciseId } = useParams();
  const isMobile = useIsMobile();
  const { userData, personalizeText } = usePersonalization();
  const { addXP, checkAchievements, calculateExerciseXP } = useGamification();
  const { execute: executePython, validate: validatePython } = usePythonSimulator(userData.name);
  
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hearts, setHearts] = useState(3);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState("entenda");
  const [codeExecuted, setCodeExecuted] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [xpGained, setXPGained] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [startTime] = useState(Date.now());

  const exercises = exercisesModule1;
  const exercise = exercises[currentExercise];
  const totalExercises = exercises.length;
  const progress = ((currentExercise + 1) / totalExercises) * 100;

  useEffect(() => {
    if (exercise) {
      setAvailableWords([...exercise.opcoes]);
      setSelectedWords([]);
      setIsCorrect(null);
      setShowResult(false);
      setCodeExecuted(false);
      setExecutionResult(null);
      setUsedHint(false);
    }
  }, [currentExercise, exercise]);

  const handleWordClick = (word: string, fromSelected: boolean = false) => {
    if (fromSelected) {
      setSelectedWords(prev => prev.filter(w => w !== word));
      setAvailableWords(prev => [...prev, word]);
    } else {
      setAvailableWords(prev => prev.filter(w => w !== word));
      setSelectedWords(prev => [...prev, word]);
    }
    setIsCorrect(null);
    setShowResult(false);
  };

  const handleExecuteCode = () => {
    const codeToExecute = exercise.codigo_inicial + selectedWords.map(word => personalizeText(word)).join(' ');
    const validation = validatePython(codeToExecute);
    
    if (!validation.valid) {
      setExecutionResult({
        success: false,
        error: validation.errors[0] || "Algo não está certo no código 🤔"
      });
      return;
    }
    
    const result = executePython(codeToExecute);
    setExecutionResult(result);
    setCodeExecuted(true);
    
    if (result.success) {
      // Dar XP por executar código
      const xpBonus = calculateExerciseXP({ executedCode: true, usedHint: false, firstTry: true, timeSpent: 30 });
      addXP(15, "Código executado com sucesso!");
      triggerXPAnimation(15);
      checkAchievements('code_executed');
    }
  };

  const triggerXPAnimation = (xp: number) => {
    setXPGained(xp);
    setShowXPAnimation(true);
    setTimeout(() => setShowXPAnimation(false), 2000);
  };

  const handleVerify = () => {
    const userAnswer = selectedWords.join(' ');
    const correctAnswer = exercise.resposta_correta.map(word => personalizeText(word)).join(' ');
    const correct = userAnswer === correctAnswer;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      // Calcular XP com bônus
      const timeSpent = (Date.now() - startTime) / 1000;
      const xpData = {
        usedHint,
        firstTry: hearts === 3,
        executedCode: codeExecuted,
        timeSpent
      };
      
      const xpEarned = calculateExerciseXP(xpData);
      addXP(xpEarned, "Exercício completo!");
      triggerXPAnimation(xpEarned);
      
      // Verificar conquistas
      if (currentExercise === 0) {
        checkAchievements('first_print');
      }
      checkAchievements('exercise_completed', { usedHint });
      
    } else {
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (currentExercise < totalExercises - 1) {
      setCurrentExercise(prev => prev + 1);
    } else {
      navigate('/modulos');
    }
  };

  const handleHint = () => {
    setShowHint(true);
    setUsedHint(true);
  };

  if (!exercise) return <div>Carregando...</div>;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-commitinho-bg flex flex-col">
        {/* Header com XP */}
        <div className="flex items-center justify-between p-4 bg-commitinho-surface shadow-sm">
          <Button variant="ghost" size="sm" onClick={() => navigate('/modulos')} className="p-2">
            <X className="h-5 w-5 text-commitinho-text-soft" />
          </Button>
          
          <div className="flex-1 mx-4">
            <Progress value={progress} className="h-3" />
            <div className="text-xs text-center mt-1 text-commitinho-text-soft">
              {currentExercise + 1} de {totalExercises}
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleHint} className="p-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
          </Button>
        </div>

        {/* XP Animation */}
        {showXPAnimation && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
            <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center">
              <Star className="h-5 w-5 mr-2" />
              +{xpGained} XP
            </div>
          </div>
        )}

        {/* Hearts */}
        <div className="heart-container py-2">
          {Array.from({length: 3}).map((_, i) => (
            <Heart key={i} className={`heart-icon ${i < hearts ? 'full' : 'empty'}`} />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Commitinho Speech */}
          <div className="flex items-start mb-6">
            <div className="relative">
              <img 
                src="/assets/commitinho-running.png" 
                alt="Commitinho"
                className="w-16 h-16 mr-3 animate-float"
              />
              <div className="absolute -top-1 -right-1 text-lg animate-bounce">💫</div>
            </div>
            <div className="commitinho-speech-bubble flex-1">
              <div className="text-sm text-commitinho-text font-medium">
                {personalizeText(exercise.balao_commitinho)}
              </div>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-lg font-bold text-commitinho-text mb-6 text-center">
            {personalizeText(exercise.pergunta)}
          </h2>

          {/* Code Area */}
          <div className="code-editor mb-6">
            {exercise.codigo_inicial && (
              <div className="code-line">
                {personalizeText(exercise.codigo_inicial)}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {selectedWords.map((word, index) => (
                <div
                  key={index}
                  onClick={() => handleWordClick(word, true)}
                  className="selected-word animate-word-select"
                >
                  {personalizeText(word)}
                </div>
              ))}
              {selectedWords.length === 0 && (
                <div className="placeholder-text">
                  Clique nas palavras abaixo para montar o código ✨
                </div>
              )}
            </div>
          </div>

          {/* Word Bank */}
          <div className="mb-6">
            <div className="text-sm font-medium text-commitinho-text mb-3 text-center">
              🧩 Peças do código:
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {availableWords.map((word, index) => (
                <div
                  key={index}
                  onClick={() => handleWordClick(word)}
                  className="word-bank-item touch-feedback"
                >
                  {personalizeText(word)}
                </div>
              ))}
            </div>
          </div>

          {/* Execute Button */}
          {selectedWords.length > 0 && (
            <div className="mb-6">
              <Button
                onClick={handleExecuteCode}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center"
              >
                <Play className="h-5 w-5 mr-2" />
                ▶️ Testar meu código!
              </Button>

              {/* Terminal Output */}
              {executionResult && (
                <div className="mt-4 bg-gray-900 rounded-lg p-4">
                  <div className="text-green-400 text-sm font-mono mb-2">
                    🖥️ Resultado do seu código:
                  </div>
                  <div className="bg-black rounded p-3">
                    {executionResult.success ? (
                      <div className="text-green-300 font-mono text-sm">
                        {executionResult.output || "✅ Código executado!"}
                      </div>
                    ) : (
                      <div className="text-red-300 font-mono text-sm">
                        ❌ {executionResult.error}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Educational Section */}
          <div className="mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-commitinho-surface-2">
                <TabsTrigger value="entenda" className="text-xs">🧠 Entenda</TabsTrigger>
                <TabsTrigger value="exemplo" className="text-xs">📝 Exemplo</TabsTrigger>
                <TabsTrigger value="dica" className="text-xs">💡 Dica</TabsTrigger>
              </TabsList>
              
              <TabsContent value="entenda" className="mt-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-800 flex items-center">
                      🎯 Para que serve?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 mb-4">{exercise.explicacao.para_que_serve}</p>
                    
                    <div className="bg-white rounded-lg p-3 mb-4">
                      <h4 className="font-bold text-blue-800 mb-2">📝 Como usar:</h4>
                      <div className="space-y-1">
                        {exercise.explicacao.como_usar.map((passo, i) => (
                          <div key={i} className="text-sm text-blue-700">{passo}</div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-purple-100 rounded-lg p-3">
                      <h4 className="font-bold text-purple-800 mb-2">🤔 É como...</h4>
                      <p className="text-purple-700 text-sm">{exercise.explicacao.analogia}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="exemplo" className="mt-4">
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-800">
                      ✨ Exemplo prático:
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 rounded-lg p-4 mb-3">
                      <div className="text-green-400 font-mono text-sm">
                        {exercise.explicacao.exemplo_pratico.codigo}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border-2 border-green-300">
                      <div className="text-sm text-gray-600 mb-1">📺 Resultado na tela:</div>
                      <div className="font-mono text-green-700 font-bold">
                        {exercise.explicacao.exemplo_pratico.resultado}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="dica" className="mt-4">
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-yellow-800 flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2" />
                      Dica especial:
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-yellow-700 text-sm leading-relaxed">
                      {personalizeText(exercise.dica)}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Verify Button */}
          {!showResult ? (
            <Button
              onClick={handleVerify}
              disabled={selectedWords.length === 0}
              className="w-full bg-gradient-arcade text-white font-semibold py-4 text-lg shadow-lg disabled:opacity-50 mb-20"
            >
              Verificar Resposta ✨
            </Button>
          ) : (
            <div className={`p-4 rounded-lg mb-20 ${isCorrect ? 'result-success' : 'result-error'}`}>
              <div className="result-title">
                {isCorrect 
                  ? personalizeText("🎉 Perfeito, [NOME]! Você arrasou!") 
                  : "😅 Quase lá! Vamos tentar mais uma vez?"
                }
              </div>
              {isCorrect && codeExecuted && (
                <div className="text-center mb-3">
                  <div className="text-sm text-green-600 font-medium">
                    ⚡ Bônus por testar o código: +15 XP
                  </div>
                </div>
              )}
              <Button
                onClick={handleNext}
                className={`w-full font-semibold py-3 text-lg ${
                  isCorrect 
                    ? 'bg-gradient-success text-white' 
                    : 'bg-gradient-error text-white'
                }`}
              >
                {currentExercise < totalExercises - 1 ? 'Continuar 🚀' : 'Concluir 🏆'}
              </Button>
            </div>
          )}
        </div>

        {/* Hint Modal */}
        <Dialog open={showHint} onOpenChange={setShowHint}>
          <DialogContent className="bg-commitinho-surface border-commitinho-surface-2 mx-4 max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-commitinho-text flex items-center">
                <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                💡 Dica do Commitinho
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-commitinho-text-soft text-sm leading-relaxed">
                {personalizeText(exercise.dica)}
              </p>
              <div className="bg-blue-100 rounded-lg p-3">
                <div className="text-xs text-blue-700 font-medium">
                  💡 {exercise.explicacao.conceito}
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowHint(false)}
              className="w-full bg-gradient-arcade text-white"
            >
              Entendi! Vamos lá! 🚀
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Desktop layout (simplificado por ora)
  return (
    <div className="min-h-screen bg-commitinho-bg">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-center text-commitinho-text mb-4">
          Interface Desktop - Versão completa em desenvolvimento
        </h2>
        <Button onClick={() => navigate('/modulos')} className="mt-4">
          Voltar aos módulos
        </Button>
      </div>
    </div>
  );
};

export default ExercicioAprimorado;