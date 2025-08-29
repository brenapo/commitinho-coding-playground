import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Lightbulb, Heart, Play, Trophy, Star, Zap } from "lucide-react";
import { ValidationFeedback, LiveValidationFeedback } from '@/components/ui/ValidationFeedback';
import { usePersonalization } from '@/utils/personalization';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGamification } from '@/utils/gamificationSystem';
import { usePythonSimulator } from '@/utils/pythonSimulator';
import { validarResposta, ExerciseData, validarExercicioModulo1, obterMensagemCommitinho } from '@/utils/exerciseValidation';
import {
  ExerciseHeader,
  ExercisePrompt,
  CodeTerminal,
  WordChip,
  ChipTray,
  ExerciseFeedback,
  HintButton,
  ExerciseMascot,
  ActionButtons,
  ExerciseContainer
} from '@/components/ui/ExerciseDesignSystem';
import '@/styles/exercise-design-system.css';

// Funções do sistema de pop-ups
const obterNomeUsuario = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('nomeUsuario') || 'amiguinho';
  }
  return 'amiguinho';
};

const obterPalavrasSelecionadas = (selectedWords: string[]) => {
  return selectedWords;
};

const fecharPopup = (popupId: string) => {
  const popup = document.getElementById(popupId);
  if (popup) {
    popup.style.display = 'none';
    popup.classList.remove('popup-entrando');
  }
};

const fecharPopupErro = () => {
  fecharPopup('popupResultado');
};

const mostrarTab = (tabName: string) => {
  // Esconder todas as tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.add('oculto');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('ativa');
  });
  
  // Mostrar tab selecionada
  const targetTab = document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
  if (targetTab) {
    targetTab.classList.remove('oculto');
  }
  
  // Marcar botão como ativo
  const targetBtn = document.querySelector(`[onclick="mostrarTab('${tabName}')"]`);
  if (targetBtn) {
    targetBtn.classList.add('ativa');
  }
};

const simularExecucaoEspecifica = (exercicioId: number, respostaMontada: string[]) => {
  const nome = obterNomeUsuario();
  const codigo = respostaMontada.join(' ');
  
  const simulacoes: Record<number, () => any> = {
    1: () => ({ // print('Olá, [NOME]!')
      output: `Olá, ${nome}!`,
      explicacao: `O Python disse exatamente isso na tela!`,
      tipoOutput: "texto"
    }),
    
    2: () => ({ // print('Como você está, [NOME]?')
      output: `Como você está, ${nome}?`,
      explicacao: `O Python fez essa pergunta na tela!`,
      tipoOutput: "pergunta"
    }),
    
    3: () => ({ // meu_nome = '[NOME]'
      output: null,
      explicacao: `Guardei "${nome}" na caixinha 'meu_nome'! 📦`,
      tipoOutput: "atribuicao"
    }),
  };
  
  const simulacao = simulacoes[exercicioId];
  return simulacao ? simulacao() : { output: "Código executado!", explicacao: "Funcionou!" };
};

// Sistema de validação SUPER simplificado e robusto
const validacaoModulo1Simples = {
  verificarResposta(exercicioId: number, palavrasArray: string[]) {
    console.log("🔍 === VALIDAÇÃO SUPER SIMPLIFICADA ===");
    console.log("🎯 Exercício ID:", exercicioId);
    console.log("📝 Palavras recebidas:", palavrasArray);
    
    // Obter nome do usuário de forma mais robusta
    let nome = 'amiguinho'; // padrão
    if (typeof window !== 'undefined' && window.localStorage) {
      nome = localStorage.getItem('nomeUsuario') || 'amiguinho';
    }
    
    // Se vier da personalização, tentar extrair o nome real
    if (palavrasArray.some(word => word.includes('Breno') || word.includes('breno'))) {
      nome = 'breno';
    }
    
    console.log("👤 Nome detectado:", nome);
    
    // Converter tudo para minúsculo e normalizar
    const respostaNormalizada = palavrasArray
      .map(item => item.toString().trim().toLowerCase())
      .filter(item => item.length > 0);
    
    console.log("🔧 Resposta normalizada:", respostaNormalizada);
    
    // Patterns mais flexíveis para cada exercício
    let respostaCorreta = false;
    
    switch (exercicioId) {
      case 1:
        // Exercício 1: print('Olá, NOME!')
        const contemPrint1 = respostaNormalizada.includes('print');
        const contemParenteses1 = respostaNormalizada.includes('(') && respostaNormalizada.includes(')');
        const contemSaudacao = respostaNormalizada.some(word => 
          word.includes('olá') || word.includes('oi') || word.includes('hello')
        );
        const contemNome1 = respostaNormalizada.some(word => 
          word.includes(nome.toLowerCase()) || word.includes('[nome]')
        );
        
        respostaCorreta = contemPrint1 && contemParenteses1 && contemSaudacao && contemNome1;
        console.log(`📊 Ex1: print=${contemPrint1}, parenteses=${contemParenteses1}, saudacao=${contemSaudacao}, nome=${contemNome1}`);
        break;
        
      case 2:
        // Exercício 2: print('Como você está, NOME?')
        const contemPrint2 = respostaNormalizada.includes('print');
        const contemParenteses2 = respostaNormalizada.includes('(') && respostaNormalizada.includes(')');
        const contemPergunta = respostaNormalizada.some(word => 
          word.includes('como') || word.includes('está') || word.includes('vai') || word.includes('?')
        );
        const contemNome2 = respostaNormalizada.some(word => 
          word.includes(nome.toLowerCase()) || word.includes('[nome]')
        );
        
        respostaCorreta = contemPrint2 && contemParenteses2 && contemPergunta && contemNome2;
        console.log(`📊 Ex2: print=${contemPrint2}, parenteses=${contemParenteses2}, pergunta=${contemPergunta}, nome=${contemNome2}`);
        break;
        
      case 3:
        // Exercício 3: meu_nome = 'NOME'
        const contemVariavel = respostaNormalizada.includes('meu_nome');
        const contemIgual = respostaNormalizada.includes('=');
        const contemNome3 = respostaNormalizada.some(word => 
          word.includes(nome.toLowerCase()) || word.includes('[nome]')
        );
        
        respostaCorreta = contemVariavel && contemIgual && contemNome3;
        console.log(`📊 Ex3: variavel=${contemVariavel}, igual=${contemIgual}, nome=${contemNome3}`);
        break;
        
      case 4:
        // Exercício 4: print(meu_nome)
        const contemPrint4 = respostaNormalizada.includes('print');
        const contemParenteses4 = respostaNormalizada.includes('(') && respostaNormalizada.includes(')');
        const contemMeuNome = respostaNormalizada.includes('meu_nome');
        const naoTemAspas = !respostaNormalizada.some(word => word.includes("'meu_nome'") || word.includes('"meu_nome"'));
        
        respostaCorreta = contemPrint4 && contemParenteses4 && contemMeuNome && naoTemAspas;
        console.log(`📊 Ex4: print=${contemPrint4}, parenteses=${contemParenteses4}, meu_nome=${contemMeuNome}, sem_aspas=${naoTemAspas}`);
        break;
        
      case 5:
        // Exercício 5: cor = input('NOME, qual sua cor favorita?')
        const contemVariavelCor = respostaNormalizada.includes('cor');
        const contemIgual5 = respostaNormalizada.includes('=');
        const contemInput = respostaNormalizada.includes('input');
        const contemParenteses5 = respostaNormalizada.includes('(') && respostaNormalizada.includes(')');
        const contemNome5 = respostaNormalizada.some(word => 
          word.includes(nome.toLowerCase()) || word.includes('[nome]')
        );
        
        respostaCorreta = contemVariavelCor && contemIgual5 && contemInput && contemParenteses5 && contemNome5;
        console.log(`📊 Ex5: cor=${contemVariavelCor}, igual=${contemIgual5}, input=${contemInput}, parenteses=${contemParenteses5}, nome=${contemNome5}`);
        break;
        
      default:
        console.log("❌ Exercício não implementado:", exercicioId);
        return { correto: false, erro: this.gerarErroEspecifico(exercicioId, respostaNormalizada, nome) };
    }
    
    if (respostaCorreta) {
      console.log("🎉 ✅ RESPOSTA CORRETA!");
      return {
        correto: true,
        exercicioId: exercicioId,
        nome: nome
      };
    } else {
      console.log("🚫 ❌ RESPOSTA INCORRETA");
      return {
        correto: false,
        exercicioId: exercicioId,
        erro: this.gerarErroEspecifico(exercicioId, respostaNormalizada, nome)
      };
    }
  },
  
  gerarErroEspecifico(exercicioId: number, respostaMontada: string[], nome: string) {
    const resposta = respostaMontada.join(' ').toLowerCase();
    
    switch (exercicioId) {
      case 1:
      case 2:
        if (!resposta.includes('print')) {
          return {
            tipo: 'comando_faltando',
            mensagem: "Você esqueceu do comando 'print'! 🖨️",
            dica: "print() é como dar voz ao computador!"
          };
        }
        if (!resposta.includes('(') || !resposta.includes(')')) {
          return {
            tipo: 'parenteses_faltando',
            mensagem: "Cadê os parênteses ( ) ?",
            dica: "print() precisa dos parênteses!"
          };
        }
        break;
        
      case 3:
        if (!resposta.includes('=')) {
          return {
            tipo: 'operador_faltando',
            mensagem: "Para guardar algo numa caixinha, use = !",
            dica: "Use = para guardar valores em variáveis"
          };
        }
        if (!resposta.includes('meu_nome')) {
          return {
            tipo: 'variavel_incorreta',
            mensagem: "A caixinha deve se chamar 'meu_nome'!",
            dica: "Use exatamente 'meu_nome' como nome da variável"
          };
        }
        break;
        
      case 4:
        if (!resposta.includes('print')) {
          return {
            tipo: 'comando_faltando',
            mensagem: "Use print() para mostrar o que está na caixinha!",
            dica: "print(meu_nome) vai mostrar o conteúdo da variável"
          };
        }
        if (resposta.includes("'meu_nome'") || resposta.includes('"meu_nome"')) {
          return {
            tipo: 'aspas_incorretas',
            mensagem: "Use meu_nome SEM aspas para ver o que está dentro!",
            dica: "COM aspas = texto novo. SEM aspas = conteúdo da variável"
          };
        }
        break;
        
      case 5:
        if (!resposta.includes('input')) {
          return {
            tipo: 'comando_faltando',
            mensagem: "Use input() para fazer perguntas!",
            dica: "input() permite que o usuário digite respostas"
          };
        }
        if (!resposta.includes('=')) {
          return {
            tipo: 'operador_faltando',
            mensagem: "Guarde a resposta numa variável com =",
            dica: "Use cor = input(...) para guardar a resposta"
          };
        }
        break;
    }
    
    return {
      tipo: 'generico',
      mensagem: "Hmm... algo não está certo. Vamos tentar de novo?",
      dica: "Siga o exemplo mostrado na aba Exemplo!"
    };
  }
};

const executarSistemaIntegrado = (exercicioId: number, respostaMontada: string[]) => {
  console.log("=== SISTEMA INTEGRADO MOBILE ===");
  
  // Usar validação simplificada
  const validacao = validacaoModulo1Simples.verificarResposta(exercicioId, respostaMontada);
  
  if (!validacao.correto) {
    return {
      correto: false,
      tipo: "validacao",
      erro: validacao.erro,
      respostaMontada: respostaMontada
    };
  }
  
  // Se validação OK, simular execução específica
  const execucao = simularExecucaoEspecifica(exercicioId, respostaMontada);
  
  return {
    correto: true,
    validacao: validacao,
    execucao: execucao,
    xpGanho: 50,
    respostaMontada: respostaMontada
  };
};

// Exercícios reformulados com sistema de validação completo
const exercisesModule1: (ExerciseData & {
  titulo: string;
  dica: string;
  balao_commitinho: string;
  codigo_inicial: string;
  explicacao: {
    conceito: string;
    para_que_serve: string;
    como_funciona: string;
    como_usar: string[];
    analogia: string;
    exemplo_pratico: {
      codigo: string;
      resultado: string;
    };
    dica_extra: string;
  };
})[] = [
  {
    id: 1,
    titulo: "Vamos falar com o computador, [NOME]!",
    pergunta: "Complete o código para o Python dizer olá para você:",
    respostaCorreta: ["print", "(", "'Olá, [NOME]!'", ")"],
    alternativasAceitas: [
      ["print", "(", "'Olá, [NOME]!'", ")"],
      ["print", "(", '"Olá, [NOME]!"', ")"],
      ["print", "(", "'Oi, [NOME]!'", ")"],
      ["print", "(", '"Oi, [NOME]!"', ")"]
    ],
    opcoes: ["print", "(", ")", "'Olá, [NOME]!'", "input", "'Hello'", "say"],
    codigoEsperado: "print('Olá, [NOME]!')",
    outputEsperado: "Olá, [NOME]!",
    validarPorExecucao: true,
    outputsAceitos: ["Olá, [NOME]!", "Oi, [NOME]!"],
    dica: "print() faz o computador 'falar'! 🗣️ É como se ele tivesse uma boca que repete tudo que você mandar!",
    balao_commitinho: "Vamos ensinar o Python a falar com você, [NOME]!",
    codigo_inicial: "",
    explicacao: {
      conceito: "🧠 ENTENDA: print() é como dar uma voz para o computador!",
      para_que_serve: "O print() é como um megafone mágico que faz o computador falar! Tudo que você colocar entre aspas vai aparecer na tela.",
      como_funciona: "O que você colocar entre aspas, aparece na tela exatamente como você escreveu!",
      como_usar: [
        "1️⃣ Sempre use print( )",
        "2️⃣ Coloque texto entre aspas ' '", 
        "3️⃣ Não esqueça os parênteses!"
      ],
      analogia: "É como se você tivesse um megafone mágico! 📢 Tudo que você gritar no megafone, todo mundo vai escutar!",
      exemplo_pratico: {
        codigo: "print('Oi!')",
        resultado: "Oi!"
      },
      dica_extra: "Lembre-se: aspas são obrigatórias para texto! Sem elas, o Python não entende que é uma mensagem."
    }
  },
  {
    id: 2,
    titulo: "Sua primeira conversa, [NOME]!",
    pergunta: "Faça o Python perguntar como você está:",
    respostaCorreta: ["print", "(", "'Como você está, [NOME]?'", ")"],
    alternativasAceitas: [
      ["print", "(", "'Como você está, [NOME]?'", ")"],
      ["print", "(", '"Como você está, [NOME]?"', ")"],
      ["print", "(", "'Como está, [NOME]?'", ")"],
      ["print", "(", '"Como está, [NOME]?"', ")"]
    ],
    opcoes: ["print", "(", ")", "'Como você está, [NOME]?'", "'Oi'", "input", "pergunta"],
    codigoEsperado: "print('Como você está, [NOME]?')",
    outputEsperado: "Como você está, [NOME]?",
    validarPorExecucao: true,
    outputsAceitos: ["Como você está, [NOME]?", "Como está, [NOME]?"],
    dica: "Você pode fazer o Python falar qualquer coisa colocando entre aspas! É como ensinar palavras novas para ele! 💬",
    balao_commitinho: "Que legal, [NOME]! O Python está aprendendo a conversar!",
    codigo_inicial: "",
    explicacao: {
      conceito: "🧠 ENTENDA: O computador pode dizer qualquer coisa que você quiser!",
      para_que_serve: "Para fazer o computador falar diferentes frases e se comunicar com você!",
      como_funciona: "O Python repete exatamente o que você escrever entre aspas!",
      como_usar: [
        "1️⃣ Coloque print(",
        "2️⃣ Escreva sua frase entre aspas ''", 
        "3️⃣ Feche com )"
      ],
      analogia: "É como ensinar um papagaio a falar! 🦜 Ele vai repetir exatamente o que você ensinar!",
      exemplo_pratico: {
        codigo: "print('Bom dia!')",
        resultado: "Bom dia!"
      },
      dica_extra: "Você pode fazer o Python dizer qualquer coisa! Frases, perguntas, até poesias!"
    }
  },
  {
    id: 3,
    titulo: "Python sabe seu nome, [NOME]!",
    pergunta: "Guarde seu nome em uma caixinha chamada 'meu_nome':",
    respostaCorreta: ["meu_nome", "=", "'[NOME]'"],
    alternativasAceitas: [
      ["meu_nome", "=", "'[NOME]'"],
      ["meu_nome", "=", '"[NOME]"']
    ],
    opcoes: ["meu_nome", "=", "'[NOME]'", "nome", "print", "(", ")", "'nome'"],
    codigoEsperado: "meu_nome = '[NOME]'",
    outputEsperado: "",
    validarPorExecucao: false,
    dica: "Imagine uma caixinha de brinquedos! 📦 Você pode guardar qualquer coisa dentro e dar um nome para ela!",
    balao_commitinho: "Agora o Python vai lembrar do seu nome para sempre, [NOME]!",
    codigo_inicial: "",
    explicacao: {
      conceito: "🧠 ENTENDA: Variáveis são como caixinhas mágicas com etiquetas!",
      para_que_serve: "Para guardar informações importantes que você quer usar depois!",
      como_funciona: "O Python cria uma caixinha com o nome que você escolher e guarda o que você mandar!",
      como_usar: [
        "1️⃣ Escolha um nome para a caixinha",
        "2️⃣ Use = para 'guardar'", 
        "3️⃣ Coloque o que quiser guardar"
      ],
      analogia: "É como ter gavetas organizadas no seu quarto! 🗄️ Cada gaveta tem uma etiqueta e você sabe o que tem dentro!",
      exemplo_pratico: {
        codigo: "minha_cor = 'azul'",
        resultado: "Guardou 'azul' na caixinha chamada 'minha_cor'"
      },
      dica_extra: "O = é como uma seta mágica! Tudo do lado direito vai para dentro da caixinha do lado esquerdo!"
    }
  },
  {
    id: 4,
    titulo: "Vamos ver o que tem na caixinha, [NOME]!",
    pergunta: "Use print() para mostrar o que está guardado em 'meu_nome':",
    respostaCorreta: ["print", "(", "meu_nome", ")"],
    alternativasAceitas: [
      ["print", "(", "meu_nome", ")"]
    ],
    opcoes: ["print", "(", ")", "meu_nome", "'meu_nome'", "=", "[NOME]", "'[NOME]'"],
    codigoEsperado: "print(meu_nome)",
    outputEsperado: "[NOME]",
    validarPorExecucao: false,
    dica: "Para ver o que está na caixinha, use o nome dela SEM aspas! Aspas criam texto novo, sem aspas pega o que está guardado!",
    balao_commitinho: "Vamos descobrir o que tem dentro da caixinha, [NOME]!",
    codigo_inicial: "meu_nome = '[NOME]'\n",
    explicacao: {
      conceito: "🧠 ENTENDA: Para ver o que tem na caixinha, use o nome SEM aspas!",
      para_que_serve: "Para mostrar na tela o que você guardou nas suas caixinhas!",
      como_funciona: "Quando você usa o nome da caixinha SEM aspas, o Python pega o que tem dentro e mostra!",
      como_usar: [
        "1️⃣ Use print(",
        "2️⃣ Coloque o nome da caixinha SEM aspas", 
        "3️⃣ Feche com )"
      ],
      analogia: "É como abrir uma gaveta e mostrar para todo mundo o que tem dentro! 📦➡️👀",
      exemplo_pratico: {
        codigo: "print(minha_cor)",
        resultado: "azul"
      },
      dica_extra: "COM aspas = texto novo. SEM aspas = o que está guardado na caixinha!"
    }
  },
  {
    id: 5,
    titulo: "Python faz perguntas de verdade, [NOME]!",
    pergunta: "Use input() para perguntar qual é a cor favorita de [NOME]:",
    respostaCorreta: ["cor", "=", "input", "(", "'[NOME], qual sua cor favorita?'", ")"],
    alternativasAceitas: [
      ["cor", "=", "input", "(", "'[NOME], qual sua cor favorita?'", ")"],
      ["cor", "=", "input", "(", '"[NOME], qual sua cor favorita?"', ")"],
      ["cor", "=", "input", "(", "'Qual sua cor favorita, [NOME]?'", ")"],
      ["cor", "=", "input", "(", '"Qual sua cor favorita, [NOME]?"', ")"]
    ],
    opcoes: ["cor", "=", "input", "(", ")", "'[NOME], qual sua cor favorita?'", "print", "pergunta"],
    codigoEsperado: "cor = input('[NOME], qual sua cor favorita?')",
    outputEsperado: "",
    validarPorExecucao: false,
    dica: "input() é como um microfone mágico! Ele faz uma pergunta e guarda a resposta em uma caixinha!",
    balao_commitinho: "Agora o Python vai ser super curioso, [NOME]! Ele adora fazer perguntas!",
    codigo_inicial: "",
    explicacao: {
      conceito: "🧠 ENTENDA: input() faz perguntas de verdade e guarda as respostas!",
      para_que_serve: "Para fazer o Python conversar com você e guardar suas respostas!",
      como_funciona: "O Python mostra a pergunta, espera você responder, e guarda sua resposta numa caixinha!",
      como_usar: [
        "1️⃣ Escolha um nome para guardar a resposta",
        "2️⃣ Use = input(",
        "3️⃣ Coloque sua pergunta entre aspas",
        "4️⃣ Feche com )"
      ],
      analogia: "É como ter um amigo robô que faz perguntas e anota todas as suas respostas em um caderninho! 🤖📝",
      exemplo_pratico: {
        codigo: "nome = input('Qual seu nome?')",
        resultado: "Pergunta aparece, você digita, e fica guardado em 'nome'"
      },
      dica_extra: "O input() sempre guarda texto! Mesmo se você digitar números, ele vira texto na caixinha!"
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
  const [validationError, setValidationError] = useState<{tipo: string; mensagem: string; dica: string} | null>(null);
  const [hearts, setHearts] = useState(3);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState("entenda");
  const [codeExecuted, setCodeExecuted] = useState(false);
  const [executionResult, setExecutionResult] = useState<{success: boolean; output?: string; error?: string} | null>(null);
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
    console.log("=== VERIFICANDO EXERCÍCIO (MÉTODO ANTIGO) ===");
    
    // Personalizar palavras selecionadas
    const personalizedSelectedWords = selectedWords.map(word => personalizeText(word));
    console.log("Palavras selecionadas personalizadas:", personalizedSelectedWords);
    
    // Usar o sistema de validação do Módulo 1 (mais robusto)
    const exercicioId = currentExercise + 1;
    const validationResult = validarExercicioModulo1(exercicioId, personalizedSelectedWords);
    
    console.log("Resultado da validação (Módulo 1):", validationResult);
    
    setIsCorrect(validationResult.correto);
    
    // Ajustar para usar a estrutura de erro do sistema modulo1
    if (validationResult.erro) {
      setValidationError(validationResult.erro);
    }
    
    setShowResult(true);
    
    if (validationResult.correto) {
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
      
      // Som de sucesso e animação de celebração
      console.log("🎉 Exercício completado com sucesso!", validationResult.metodo);
      
    } else {
      setHearts(prev => Math.max(0, prev - 1));
      console.log("❌ Resposta incorreta:", validationResult.erro);
    }
  };

  const handleNext = () => {
    // Fechar o popup antes de ir para o próximo exercício
    fecharPopup('popupResultado');
    
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

  // Funções do sistema de pop-ups integrado
  const testarCodigoComPopup = () => {
    console.log("=== TESTAR CÓDIGO COM POPUP - DEBUG COMPLETO ===");
    
    const exercicioId = currentExercise + 1;
    const respostaMontada = obterPalavrasSelecionadas(selectedWords);
    const nome = userData.name || obterNomeUsuario();
    
    console.log("📊 DEBUG INFO:");
    console.log("- Exercise ID:", exercicioId);
    console.log("- Selected Words:", selectedWords);
    console.log("- Resposta Montada:", respostaMontada);
    console.log("- Nome (userData.name):", userData.name);
    console.log("- Nome (obterNomeUsuario):", obterNomeUsuario());
    console.log("- Nome final:", nome);
    
    // Verificar se montou algo
    if (respostaMontada.length === 0) {
      console.log("❌ Nenhuma palavra selecionada!");
      mostrarPopupErro({
        erro: {
          mensagem: "Monte seu código primeiro usando as palavras da bandeja!",
          dica: "Clique nas palavras azuis para criar seu código"
        }
      }, nome);
      return;
    }
    
    // Personalizar palavras
    const personalizedWords = respostaMontada.map(word => personalizeText(word));
    console.log("- Personalized Words:", personalizedWords);
    
    // USAR O SISTEMA SIMPLIFICADO EM VEZ DO validarExercicioModulo1
    const validationResult = validacaoModulo1Simples.verificarResposta(exercicioId, personalizedWords);
    console.log("- Validation Result:", validationResult);
    
    // Converter para formato do sistema integrado
    const resultado = validationResult.correto ? {
      correto: true,
      validacao: validationResult,
      execucao: simularExecucaoEspecifica(exercicioId, personalizedWords),
      xpGanho: 50,
      respostaMontada: personalizedWords
    } : {
      correto: false,
      tipo: "validacao",
      erro: validationResult.erro,
      respostaMontada: personalizedWords
    };
    
    console.log("- Resultado Final:", resultado);
    
    if (resultado.correto) {
      console.log("✅ Mostrando popup de sucesso");
      mostrarPopupSucesso(resultado, nome);
    } else {
      console.log("❌ Mostrando popup de erro");
      mostrarPopupErro(resultado, nome);
    }
  };

  const mostrarPopupSucesso = (resultado: any, nome: string) => {
    const popup = document.getElementById('popupResultado');
    const sucessoContentCompacto = document.getElementById('sucessoContentCompacto');
    const erroContentCompacto = document.getElementById('erroContentCompacto');
    
    if (!popup || !sucessoContentCompacto || !erroContentCompacto) return;
    
    // Mostrar conteúdo de sucesso compacto
    sucessoContentCompacto.style.display = 'block';
    erroContentCompacto.style.display = 'none';
    
    // Personalizar conteúdo
    const h2 = sucessoContentCompacto.querySelector('.titulo-sucesso');
    if (h2) h2.textContent = `Perfeito, ${nome}!`;
    
    // Mostrar output simulado compacto
    const outputEl = document.getElementById('outputSimuladoCompacto');
    if (outputEl && resultado.execucao && resultado.execucao.output) {
      outputEl.textContent = resultado.execucao.output;
    }
    
    // Atualizar XP
    const xpTexto = sucessoContentCompacto.querySelector('.xp-texto');
    if (xpTexto && resultado.xpGanho) {
      xpTexto.textContent = `+${resultado.xpGanho} XP`;
    }
    
    // Mostrar popup
    popup.style.display = 'flex';
    popup.classList.add('popup-entrando');
    
    // Atualizar XP e marcar como correto
    const xpEarned = resultado.xpGanho || 50;
    addXP(xpEarned, "Exercício completo!");
    triggerXPAnimation(xpEarned);
    setIsCorrect(true);
    
    // Mostrar popup com animação
    popup.style.display = 'flex';
    popup.classList.add('popup-entrando');
  };

  const mostrarPopupErro = (resultado: any, nome: string) => {
    const popup = document.getElementById('popupResultado');
    const sucessoContentCompacto = document.getElementById('sucessoContentCompacto');
    const erroContentCompacto = document.getElementById('erroContentCompacto');
    
    if (!popup || !sucessoContentCompacto || !erroContentCompacto) return;
    
    // Mostrar conteúdo de erro compacto
    sucessoContentCompacto.style.display = 'none';
    erroContentCompacto.style.display = 'block';
    
    // Personalizar conteúdo
    const h2 = erroContentCompacto.querySelector('.titulo-sucesso');
    if (h2) h2.textContent = `Quase lá, ${nome}!`;
    
    // Mostrar explicação específica do erro compacto
    const erroExplicacaoCompacto = document.getElementById('erroExplicacaoCompacto');
    if (erroExplicacaoCompacto && resultado.erro && resultado.erro.mensagem) {
      erroExplicacaoCompacto.textContent = resultado.erro.mensagem;
    }
    
    // Mostrar dica específica compacta
    const dicaEspecificaCompacto = document.getElementById('dicaEspecificaCompacto');
    if (dicaEspecificaCompacto && resultado.erro && resultado.erro.dica) {
      dicaEspecificaCompacto.textContent = `💡 ${resultado.erro.dica}`;
    }
    
    // Mostrar popup
    popup.style.display = 'flex';
    popup.classList.add('popup-entrando');
    
    // Reduzir vida/corações
    setHearts(prev => Math.max(0, prev - 1));
  };

  const abrirPopupAjuda = () => {
    const exercicioId = currentExercise + 1;
    const nome = userData.name;
    
    // Carregar conteúdo específico do exercício
    carregarConteudoEducativo(exercicioId, nome);
    
    // Mostrar popup
    const popup = document.getElementById('popupAjuda');
    if (popup) {
      popup.style.display = 'flex';
      popup.classList.add('popup-entrando');
    }
    
    // Atualizar Commitinho professor
    atualizarCommitinhoProfessor(exercicioId, nome);
  };

  const carregarConteudoEducativo = (exercicioId: number, nome: string) => {
    const exercicio = exercise;
    if (!exercicio) return;
    
    // Atualizar conteúdo da aba "Entenda"
    const tabEntenda = document.getElementById('explicacaoConceito');
    if (tabEntenda) {
      tabEntenda.innerHTML = `
        <div class="conceito-visual">
          <div class="conceito-titulo">
            <h3>${personalizeText(exercicio.explicacao.conceito)}</h3>
          </div>
          
          <div class="para-que-serve">
            <h4>🎯 Para que serve:</h4>
            <p>${personalizeText(exercicio.explicacao.para_que_serve)}</p>
          </div>
          
          <div class="como-funciona">
            <h4>⚙️ Como funciona:</h4>
            <p>${personalizeText(exercicio.explicacao.como_funciona)}</p>
          </div>
          
          <div class="como-usar">
            <h4>📝 Como usar:</h4>
            ${exercicio.explicacao.como_usar.map(passo => `<div class="passo-uso">${personalizeText(passo)}</div>`).join('')}
          </div>
          
          <div class="analogia">
            <h4>💡 Analogia:</h4>
            <p>${personalizeText(exercicio.explicacao.analogia)}</p>
          </div>
          
          <div class="dica-extra">
            <h4>🚀 Dica extra:</h4>
            <p>${personalizeText(exercicio.explicacao.dica_extra)}</p>
          </div>
        </div>
      `;
    }
    
    // Atualizar conteúdo da aba "Exemplo"
    const exemploEl = document.getElementById('exemploCodigoVisual');
    if (exemploEl) {
      exemploEl.innerHTML = `
        <div class="exemplo-interativo">
          <h4>📝 EXEMPLO:</h4>
          <div class="codigo-exemplo">${personalizeText(exercicio.explicacao.exemplo_pratico.codigo)}</div>
          <div class="seta-resultado">↓ Resultado:</div>
          <div class="resultado-exemplo">${personalizeText(exercicio.explicacao.exemplo_pratico.resultado)}</div>
        </div>
      `;
    }
    
    // Atualizar conteúdo da aba "Dica"
    const dicaEl = document.getElementById('dicaDetalhada');
    if (dicaEl) {
      dicaEl.innerHTML = `
        <div class="dica-completa">
          <h4>💡 DICA:</h4>
          <p>${personalizeText(exercicio.dica)}</p>
          <div class="dica-adicional">
            <strong>Lembre-se:</strong> ${personalizeText(exercicio.explicacao.dica_extra)}
          </div>
        </div>
      `;
    }
  };

  const atualizarCommitinhoProfessor = (exercicioId: number, nome: string) => {
    const mensagem = obterMensagemCommitinho(exercicioId, nome);
    
    const balaoCommitinho = document.getElementById('balaoCommitinho');
    if (balaoCommitinho) {
      balaoCommitinho.textContent = mensagem;
    }
  };

  if (!exercise) return <div>Carregando...</div>;

  // USANDO NOVA INTERFACE MOBILE
  if (true) {
    return (
      <ExerciseContainer>
        {/* Navigation */}
        <div className="absolute top-4 right-4 z-10">
          <Button variant="ghost" size="sm" onClick={() => navigate('/modulos')} className="p-2 rounded-full bg-black bg-opacity-30 backdrop-blur-sm text-white shadow-lg hover:bg-opacity-50">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Header com novo design */}
        <div className="exercise-section mt-16">
          <ExerciseHeader
            title={personalizeText(exercise.titulo)}
            subtitle={`${exercise.explicacao.conceito} • Exercício ${currentExercise + 1} de ${totalExercises}`}
            icon="🤖💻"
            progress={progress}
            currentExercise={currentExercise + 1}
            totalExercises={totalExercises}
          />
        </div>
        
        {/* Animação de XP */}
        {showXPAnimation && (
          <div className="fixed top-24 right-4 z-50">
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl animate-bounce">
              <Star className="h-4 w-4 inline mr-1" />
              +{xpGained} XP
            </div>
          </div>
        )}
        
        {/* Prompt da pergunta */}
        <ExercisePrompt centered>
          {personalizeText(exercise.pergunta)}
        </ExercisePrompt>
        
        {/* Terminal de código */}
        <div className="exercise-section">
          <CodeTerminal 
            placeholder="Monte seu código aqui ✨"
            showInitialCode={!!exercise.codigo_inicial}
            initialCode={exercise.codigo_inicial ? personalizeText(exercise.codigo_inicial) : ""}
          >
            <div className="flex flex-wrap gap-3 justify-center">
              {selectedWords.map((word, index) => (
                <WordChip
                  key={index}
                  word={personalizeText(word)}
                  isSelected={true}
                  isCommand={word === 'print'}
                  isString={word.includes("'") || word.includes('"')}
                  isSymbol={['(', ')', '='].includes(word)}
                  onClick={() => handleWordClick(word, true)}
                  variant="lego"
                />
              ))}
            </div>
          </CodeTerminal>
        </div>
        
        {/* Bandeja de palavras */}
        <div className="exercise-section">
          <ChipTray>
            <div className="flex flex-wrap gap-3 justify-center">
              {availableWords.map((word, index) => (
                <WordChip
                  key={index}
                  word={personalizeText(word)}
                  isCommand={word === 'print'}
                  isString={word.includes("'") || word.includes('"')}
                  isSymbol={['(', ')', '='].includes(word)}
                  onClick={() => handleWordClick(word)}
                  variant="lego"
                />
              ))}
            </div>
          </ChipTray>
        </div>
        
        {/* Mascot de ajuda no canto */}
        <div className="fixed bottom-24 right-4 z-40" onClick={() => abrirPopupAjuda()}>
          <ExerciseMascot 
            variant="corner"
            showPulse={true}
          />
        </div>
        
        {/* Botões de ação */}
        <div className="exercise-section">
          <ActionButtons layout="vertical">
            <button
              onClick={() => abrirPopupAjuda()}
              className="btn-secondary w-full max-w-xs mb-4 px-6 py-3 text-base font-semibold"
            >
              💡 Precisa de ajuda?
            </button>
            <button
              onClick={testarCodigoComPopup}
              disabled={selectedWords.length === 0}
              className="btn-primary w-full max-w-xs disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 text-xl font-bold"
            >
              ▶ Testar código!
            </button>
          </ActionButtons>
        </div>

        {/* Pop-up de resultado compacto */}
        <div className="popup-resultado" id="popupResultado" style={{display: 'none', alignItems: 'center', justifyContent: 'center'}}>
          {/* Pop-up de SUCESSO compacto */}
          <div className="popup-sucesso-compacto" id="sucessoContentCompacto" style={{display: 'none'}}>
            <div className="popup-header-mini">
              <div className="commitinho-mini">🤖</div>
              <button className="btn-fechar-x" onClick={() => fecharPopup('popupResultado')}>×</button>
            </div>
            
            <div className="sucesso-content-compacto">
              <div className="icone-sucesso-grande">🎉</div>
              <h2 className="titulo-sucesso">Perfeito, {personalizeText('[NOME]')}!</h2>
              
              <div className="resultado-mini">
                <div className="output-box" id="outputSimuladoCompacto">Olá, {personalizeText('[NOME]')}!</div>
              </div>
              
              <div className="xp-linha">
                <span className="xp-icone">⭐</span>
                <span className="xp-texto">+50 XP</span>
              </div>
              
              <button className="btn-proximo-compacto" onClick={handleNext}>Próximo exercício! 🚀</button>
            </div>
          </div>
          
          {/* Pop-up de ERRO compacto */}
          <div className="popup-erro-compacto" id="erroContentCompacto" style={{display: 'none'}}>
            <div className="popup-header-mini">
              <div className="commitinho-mini">🤔</div>
              <button className="btn-fechar-x" onClick={() => fecharPopup('popupResultado')}>×</button>
            </div>
            
            <div className="sucesso-content-compacto">
              <div className="icone-erro-grande">🤔</div>
              <h2 className="titulo-sucesso">Quase lá, {personalizeText('[NOME]')}!</h2>
              
              <div className="erro-detalhes-compacto" id="erroExplicacaoCompacto">
                Hmm... algo não está certo. Vamos tentar de novo?
              </div>
              
              <div className="erro-detalhes-compacto" id="dicaEspecificaCompacto" style={{background: 'rgba(255,255,0,0.2)'}}>
                💡 Dica: Siga o exemplo mostrado na aba Exemplo!
              </div>
              
              <button className="btn-tentar-compacto" onClick={() => fecharPopupErro()}>Vou tentar de novo! 💪</button>
            </div>
          </div>
        </div>

        {/* Pop-up educativo unificado */}
        <div className="popup-ajuda" id="popupAjuda" style={{display: 'none'}}>
          <div className="popup-content ajuda">
            <div className="ajuda-header">
              <div className="commitinho-professor">
                <img src="/assets/commitinho-running.png" alt="Professor Commitinho" />
                <div className="balao-professor" id="balaoCommitinho">
                  Vou te explicar tudo, {personalizeText('[NOME]')}!
                </div>
              </div>
              <button className="btn-fechar" onClick={() => fecharPopup('popupAjuda')}>×</button>
            </div>
            
            {/* Tabs integradas */}
            <div className="tabs-ajuda">
              <button className="tab-btn ativa" onClick={() => mostrarTab('entenda')}>🧠 Entenda</button>
              <button className="tab-btn" onClick={() => mostrarTab('exemplo')}>📝 Exemplo</button>
              <button className="tab-btn" onClick={() => mostrarTab('dica')}>💡 Dica</button>
            </div>
            
            {/* Conteúdo das tabs */}
            <div className="tab-content" id="tabEntenda">
              <div className="explicacao-visual" id="explicacaoConceito">
                {exercise.explicacao.para_que_serve}
              </div>
            </div>
            
            <div className="tab-content oculto" id="tabExemplo">
              <div className="exemplo-pratico" id="exemploCodigoVisual">
                <div className="codigo-exemplo">
                  {exercise.explicacao.exemplo_pratico.codigo}
                </div>
                <div className="resultado-exemplo">
                  {exercise.explicacao.exemplo_pratico.resultado}
                </div>
              </div>
            </div>
            
            <div className="tab-content oculto" id="tabDica">
              <div className="dica-detalhada" id="dicaDetalhada">
                {personalizeText(exercise.dica)}
              </div>
            </div>
            
            <button className="btn-voltarExercicio" onClick={() => fecharPopup('popupAjuda')}>
              Agora eu entendi! ✨
            </button>
          </div>
        </div>
      </ExerciseContainer>
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