// Sistema de Validação de Respostas - Commitinho

// Templates do Módulo 1 com placeholders [NOME]
interface ExerciseTemplate {
  id: number;
  titulo: string;
  pergunta: string;
  respostas_templates: string[][];
  opcoes_templates: string[];
  output_template: string | null;
  codigo_inicial_template?: string;
  dica: string;
}

const MODULO1_TEMPLATES: Record<number, ExerciseTemplate> = {
  1: {
    id: 1,
    titulo: "Seu primeiro print",
    pergunta: "Complete o código para o Python dizer olá para você:",
    
    // Templates com placeholder [NOME]
    respostas_templates: [
      ['print', '(', "'Olá, [NOME]!'", ')'],
      ['print', '(', '"Olá, [NOME]!"', ')'],
      ['print', '(', "'Oi, [NOME]!'", ')'],
      ['print', '(', '"Oi, [NOME]!"', ')']
    ],
    
    opcoes_templates: ['print', '(', ')', "'Olá, [NOME]!'", 'input', 'say', "'Hello'"],
    
    output_template: "Olá, [NOME]!",
    dica: "print() faz o computador 'falar'! Coloque sua mensagem entre aspas."
  },
  
  2: {
    id: 2,
    titulo: "Python pergunta",
    pergunta: "Faça o Python perguntar como você está:",
    
    respostas_templates: [
      ['print', '(', "'Como você está, [NOME]?'", ')'],
      ['print', '(', '"Como você está, [NOME]?"', ')'],
      ['print', '(', "'Como vai, [NOME]?'", ')'],
      ['print', '(', '"Como vai, [NOME]?"', ')']
    ],
    
    opcoes_templates: ['print', '(', ')', "'Como você está, [NOME]?'", 'input', 'pergunta', "'Oi'"],
    
    output_template: "Como você está, [NOME]?",
    dica: "Use print() para fazer perguntas também! Lembre-se das aspas."
  },
  
  3: {
    id: 3,
    titulo: "Guardando seu nome",
    pergunta: "Guarde seu nome em uma caixinha chamada 'meu_nome':",
    
    respostas_templates: [
      ['meu_nome', '=', "'[NOME]'"],
      ['meu_nome', '=', '"[NOME]"']
    ],
    
    opcoes_templates: ['meu_nome', '=', "'[NOME]'", 'nome', 'print', '(', ')', '"nome"'],
    
    output_template: null,
    dica: "Variáveis são caixinhas! Use = para guardar algo dentro."
  },
  
  4: {
    id: 4,
    titulo: "Usando a caixinha",
    pergunta: "Mostre o que está na caixinha 'meu_nome':",
    codigo_inicial_template: "meu_nome = '[NOME]'\n",
    
    respostas_templates: [
      ['print', '(', 'meu_nome', ')']
    ],
    
    opcoes_templates: ['print', '(', ')', 'meu_nome', "'meu_nome'", '=', '[NOME]', "'[NOME]'"],
    
    output_template: "[NOME]",
    dica: "Para ver o que está na caixinha, use o nome dela SEM aspas!"
  },
  
  5: {
    id: 5,
    titulo: "Python faz perguntas",
    pergunta: "Faça o Python perguntar qual é sua cor favorita:",
    
    respostas_templates: [
      ['cor', '=', 'input', '(', "'[NOME], qual sua cor favorita?'", ')'],
      ['cor', '=', 'input', '(', '"[NOME], qual sua cor favorita?"', ')'],
      ['cor', '=', 'input', '(', "'Qual sua cor favorita, [NOME]?'", ')'],
      ['cor', '=', 'input', '(', '"Qual sua cor favorita, [NOME]?"', ')']
    ],
    
    opcoes_templates: ['cor', '=', 'input', '(', ')', "'[NOME], qual sua cor favorita?'", 'print', 'pergunta'],
    
    output_template: null,
    dica: "input() faz perguntas e guarda as respostas em uma caixinha!"
  }
};

// Sistema de Personalização Dinâmica
function obterNomeUsuario(): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('nomeUsuario') || 'amiguinho';
  }
  return 'amiguinho';
}

function personalizarTexto(texto: string | null, nome: string): string | null {
  if (!texto) return texto;
  return texto.replace(/\[NOME\]/g, nome);
}

function personalizarArray(array: string[], nome: string): string[] {
  return array.map(item => personalizarTexto(item, nome) || item);
}

interface ExercisePersonalizado {
  id: number;
  titulo: string;
  pergunta: string;
  respostas_aceitas: string[][];
  opcoes: string[];
  output_esperado: string | null;
  codigo_inicial: string | null;
  dica: string;
}

function gerarExercicioPersonalizado(exercicioId: number): ExercisePersonalizado | null {
  const template = MODULO1_TEMPLATES[exercicioId];
  if (!template) return null;
  
  const nome = obterNomeUsuario();
  
  return {
    id: template.id,
    titulo: template.titulo,
    pergunta: template.pergunta,
    
    // Gerar respostas aceitas com nome real
    respostas_aceitas: template.respostas_templates.map(resposta => 
      personalizarArray(resposta, nome)
    ),
    
    // Gerar opções da bandeja com nome real
    opcoes: template.opcoes_templates.map(opcao => 
      personalizarTexto(opcao, nome) || opcao
    ),
    
    // Output esperado personalizado
    output_esperado: personalizarTexto(template.output_template, nome),
    
    // Código inicial personalizado (se existir)
    codigo_inicial: template.codigo_inicial_template ? 
      personalizarTexto(template.codigo_inicial_template, nome) : null,
    
    dica: template.dica
  };
}

interface ExerciseData {
  id: number;
  pergunta: string;
  respostaCorreta: string[];
  alternativasAceitas?: string[][];
  opcoes: string[];
  codigoEsperado: string;
  outputEsperado: string;
  validarPorExecucao?: boolean;
  outputsAceitos?: string[];
}

interface ValidationResult {
  correto: boolean;
  metodo?: 'exata' | 'alternativa' | 'execucao';
  erro?: {
    tipo: string;
    mensagem: string;
    dica: string;
  };
}

interface ExecutionResult {
  sucesso: boolean;
  output?: string;
  codigo?: string;
  erro?: string;
}

// Função auxiliar para comparação exata de arrays
function arraysExatamenteIguais(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].trim() !== arr2[i].trim()) return false;
  }
  
  return true;
}

// Função para gerar erro específico do Módulo 1
function gerarErroEspecifico(exercicioId: number, respostaMontada: string[], exercicio: ExercisePersonalizado) {
  const resposta = respostaMontada.join(' ');
  
  switch (exercicioId) {
    case 1:
    case 2:
      if (!resposta.includes('print')) {
        return {
          tipo: 'comando_faltando',
          mensagem: "Você esqueceu do comando 'print'! 🖨️",
          dica: exercicio.dica
        };
      }
      if (!resposta.includes('(')) {
        return {
          tipo: 'parentese_abertura',
          mensagem: "Cadê o parêntese de abertura '(' ?",
          dica: exercicio.dica
        };
      }
      if (!resposta.includes(')')) {
        return {
          tipo: 'parentese_fechamento',
          mensagem: "Você esqueceu de fechar o parêntese ')' !",
          dica: exercicio.dica
        };
      }
      break;
    
    case 3:
      if (!resposta.includes('=')) {
        return {
          tipo: 'operador_faltando',
          mensagem: "Para guardar algo numa caixinha, use = !",
          dica: exercicio.dica
        };
      }
      if (!resposta.includes('meu_nome')) {
        return {
          tipo: 'variavel_incorreta',
          mensagem: "A caixinha deve se chamar 'meu_nome'!",
          dica: exercicio.dica
        };
      }
      break;
    
    case 4:
      if (!resposta.includes('print')) {
        return {
          tipo: 'comando_faltando',
          mensagem: "Use print() para mostrar o que está na caixinha!",
          dica: exercicio.dica
        };
      }
      if (resposta.includes("'meu_nome'") || resposta.includes('"meu_nome"')) {
        return {
          tipo: 'aspas_incorretas',
          mensagem: "Use meu_nome SEM aspas para ver o que está dentro!",
          dica: exercicio.dica
        };
      }
      break;
    
    case 5:
      if (!resposta.includes('input')) {
        return {
          tipo: 'comando_faltando',
          mensagem: "Use input() para fazer perguntas!",
          dica: exercicio.dica
        };
      }
      if (!resposta.includes('=')) {
        return {
          tipo: 'operador_faltando',
          mensagem: "Guarde a resposta numa variável com =",
          dica: exercicio.dica
        };
      }
      break;
  }
  
  return {
    tipo: 'generico',
    mensagem: "Hmm... algo não está certo. Vamos tentar de novo?",
    dica: exercicio.dica
  };
}

// Função principal de validação para Módulo 1
export function validarExercicioModulo1(exercicioId: number, respostaMontada: string[]): ValidationResult & { exercicio?: ExercisePersonalizado } {
  console.log("=== VALIDAÇÃO MÓDULO 1 ===");
  console.log("Exercício ID:", exercicioId);
  console.log("Nome do usuário:", obterNomeUsuario());
  console.log("Resposta montada:", respostaMontada);
  
  // Gerar exercício personalizado
  const exercicio = gerarExercicioPersonalizado(exercicioId);
  if (!exercicio) {
    console.error("Exercício não encontrado:", exercicioId);
    return { correto: false, erro: { tipo: 'not_found', mensagem: 'Exercício não encontrado', dica: '' } };
  }
  
  console.log("Exercício personalizado:", exercicio.titulo);
  console.log("Respostas aceitas:", exercicio.respostas_aceitas);
  
  // Verificar cada resposta aceita
  for (let i = 0; i < exercicio.respostas_aceitas.length; i++) {
    const respostaAceita = exercicio.respostas_aceitas[i];
    console.log(`Comparando com resposta ${i + 1}:`, respostaAceita);
    
    if (arraysExatamenteIguais(respostaMontada, respostaAceita)) {
      console.log("✅ RESPOSTA CORRETA!");
      return { 
        correto: true, 
        metodo: 'exata',
        exercicio: exercicio 
      };
    }
  }
  
  console.log("❌ Nenhuma resposta bateu");
  return { 
    correto: false, 
    erro: gerarErroEspecifico(exercicioId, respostaMontada, exercicio),
    exercicio: exercicio
  };
}

// Função principal de validação
export function validarResposta(respostaMontada: string[], exercicioAtual: ExerciseData): ValidationResult {
  console.log("Validando resposta:", respostaMontada);
  console.log("Resposta correta:", exercicioAtual.respostaCorreta);
  
  // Método 1: Verificação exata
  if (arraysIguais(respostaMontada, exercicioAtual.respostaCorreta)) {
    return { correto: true, metodo: "exata" };
  }
  
  // Método 2: Verificação de alternativas aceitas
  if (exercicioAtual.alternativasAceitas) {
    for (const alternativa of exercicioAtual.alternativasAceitas) {
      if (arraysIguais(respostaMontada, alternativa)) {
        return { correto: true, metodo: "alternativa" };
      }
    }
  }
  
  // Método 3: Validação por execução simulada
  if (exercicioAtual.validarPorExecucao) {
    const codigoMontado = respostaMontada.join(' ');
    const resultadoExecucao = simularExecucao(codigoMontado, exercicioAtual);
    
    if (resultadoExecucao.sucesso) {
      // Verifica se o output está correto
      const outputsParaVerificar = exercicioAtual.outputsAceitos || [exercicioAtual.outputEsperado];
      
      for (const outputAceito of outputsParaVerificar) {
        if (resultadoExecucao.output === outputAceito) {
          return { correto: true, metodo: "execucao" };
        }
      }
    }
  }
  
  return { 
    correto: false, 
    erro: identificarErro(respostaMontada, exercicioAtual) 
  };
}

// Função para comparar arrays
function arraysIguais(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  
  for (let i = 0; i < arr1.length; i++) {
    // Normalizar espaços e comparar
    if (arr1[i].trim() !== arr2[i].trim()) return false;
  }
  
  return true;
}

// Simulador de execução Python melhorado
function simularExecucao(codigo: string, exercicio: ExerciseData): ExecutionResult {
  console.log("Executando código:", codigo);
  
  try {
    // Limpar e normalizar código
    codigo = codigo.trim();
    
    // Validações básicas de sintaxe
    if (!codigo.includes('print')) {
      return { 
        sucesso: false, 
        erro: "Você esqueceu do comando 'print'! 🖨️" 
      };
    }
    
    if (!codigo.includes('(') || !codigo.includes(')')) {
      return { 
        sucesso: false, 
        erro: "print() precisa dos parênteses! ( )" 
      };
    }
    
    // Extrair conteúdo do print
    const match = codigo.match(/print\s*\(\s*(.+)\s*\)/);
    if (!match) {
      return { 
        sucesso: false, 
        erro: "Algo não está certo com seu print()... 🤔" 
      };
    }
    
    const conteudo = match[1].trim();
    
    // Processar diferentes tipos de conteúdo
    const output = processarConteudoPrint(conteudo);
    
    return {
      sucesso: true,
      output: output,
      codigo: codigo
    };
    
  } catch (error) {
    return {
      sucesso: false,
      erro: "Ops! Algo não está funcionando... 😅"
    };
  }
}

// Processa o conteúdo dentro do print()
function processarConteudoPrint(conteudo: string): string {
  // String simples com aspas
  if ((conteudo.startsWith("'") && conteudo.endsWith("'")) || 
      (conteudo.startsWith('"') && conteudo.endsWith('"'))) {
    return conteudo.slice(1, -1); // Remove as aspas
  }
  
  // Concatenação de strings
  if (conteudo.includes('+')) {
    const partes = conteudo.split('+').map(p => p.trim());
    let resultado = '';
    
    for (const parte of partes) {
      if ((parte.startsWith("'") && parte.endsWith("'")) || 
          (parte.startsWith('"') && parte.endsWith('"'))) {
        resultado += parte.slice(1, -1);
      } else {
        // Variável ou número
        resultado += parte;
      }
    }
    
    return resultado;
  }
  
  // Número
  if (!isNaN(Number(conteudo))) {
    return conteudo;
  }
  
  return conteudo;
}

// Sistema de identificação de erros específicos
function identificarErro(respostaMontada: string[], exercicio: ExerciseData) {
  const resposta = respostaMontada.join(' ');
  const correta = exercicio.respostaCorreta.join(' ');
  
  // Erros comuns identificados
  if (!resposta.includes('print')) {
    return {
      tipo: 'comando_faltando',
      mensagem: "Você esqueceu do comando 'print'! 🖨️",
      dica: "print() é como dar voz ao computador!"
    };
  }
  
  if (!resposta.includes('(')) {
    return {
      tipo: 'parentese_abertura',
      mensagem: "Cadê o parêntese de abertura '(' ? 🤔",
      dica: "print precisa dos parênteses: print( )"
    };
  }
  
  if (!resposta.includes(')')) {
    return {
      tipo: 'parentese_fechamento', 
      mensagem: "Você esqueceu de fechar o parêntese ')' ! 😊",
      dica: "Sempre feche o que você abriu: ( )"
    };
  }
  
  if (resposta.includes('print') && resposta.includes('(') && resposta.includes(')')) {
    return {
      tipo: 'conteudo_incorreto',
      mensagem: "Quase lá! Verifique o que está dentro do print() 🎯",
      dica: "Lembre-se: textos ficam entre aspas!"
    };
  }
  
  return {
    tipo: 'generico',
    mensagem: "Hmm... algo não está certo. Vamos tentar de novo? 💪",
    dica: "Compare sua resposta com o exemplo!"
  };
}

// Sistema de carregamento personalizado
export function carregarExercicioPersonalizado(exercicioId: number): ExercisePersonalizado | null {
  console.log("Carregando exercício:", exercicioId);
  
  // Gerar exercício com nome da criança
  const exercicio = gerarExercicioPersonalizado(exercicioId);
  
  if (!exercicio) {
    console.error("Exercício não encontrado:", exercicioId);
    return null;
  }
  
  console.log("Exercício personalizado gerado:", exercicio);
  console.log("Carregado para:", obterNomeUsuario());
  
  return exercicio;
}

export function obterMensagemCommitinho(exercicioId: number, nome?: string): string {
  const nomeUsuario = nome || obterNomeUsuario();
  
  const mensagens: Record<number, string> = {
    1: `Vamos ensinar o Python a falar com você, ${nomeUsuario}! 🗣️`,
    2: `Que legal, ${nomeUsuario}! O Python pode fazer perguntas! 🤔`,
    3: `Agora vamos guardar seu nome, ${nomeUsuario}! 📦`,
    4: `Vamos ver o que está na caixinha, ${nomeUsuario}! 👀`,
    5: `Python adora ser curioso, ${nomeUsuario}! 🤔`
  };
  
  return mensagens[exercicioId] || `Continue assim, ${nomeUsuario}! Você está indo bem! 🚀`;
}

// Função para testar o sistema de validação
export function testarValidacao() {
  const exercicioTeste: ExerciseData = {
    id: 1,
    pergunta: "Complete o código para o Python dizer olá para você:",
    respostaCorreta: ["print", "(", "'Olá, Breno!'", ")"],
    alternativasAceitas: [
      ["print", "(", "'Olá, Breno!'", ")"],
      ["print", "(", '"Olá, Breno!"', ")"],
      ["print", "(", "'Oi, Breno!'", ")"]
    ],
    opcoes: ["print", "(", ")", "'Olá, Breno!'", "input", "say", "'Hello'"],
    codigoEsperado: "print('Olá, Breno!')",
    outputEsperado: "Olá, Breno!",
    validarPorExecucao: true
  };
  
  // Teste 1: Resposta correta
  console.log("Teste 1:", validarResposta(["print", "(", "'Olá, Breno!'", ")"], exercicioTeste));
  
  // Teste 2: Resposta com erro
  console.log("Teste 2:", validarResposta(["print", "'Olá, Breno!'", ")"], exercicioTeste));
  
  // Teste 3: Aspas diferentes mas correto
  console.log("Teste 3:", validarResposta(["print", "(", '"Olá, Breno!"', ")"], exercicioTeste));
  
  // Teste 4: Alternativa aceita
  console.log("Teste 4:", validarResposta(["print", "(", "'Oi, Breno!'", ")"], exercicioTeste));
}

// Sistema de teste dinâmico
export function testarExerciciosPersonalizados() {
  console.log("=== TESTE COM NOMES DIFERENTES ===");
  
  // Testar com diferentes nomes
  const nomes = ['Ana', 'João', 'Maria', 'Pedro'];
  
  nomes.forEach(nome => {
    console.log(`\n--- Testando para ${nome} ---`);
    
    // Simular nome no localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('nomeUsuario', nome);
    }
    
    // Testar exercício 1
    const exercicio1 = gerarExercicioPersonalizado(1);
    if (exercicio1) {
      console.log("Exercício 1 gerado:", exercicio1.opcoes);
      
      const resultado = validarExercicioModulo1(1, ['print', '(', `'Olá, ${nome}!'`, ')']);
      console.log(`Exercício 1 para ${nome}:`, resultado.correto ? "✅ PASSOU" : "❌ FALHOU");
    }
    
    // Testar exercício 2
    const resultado2 = validarExercicioModulo1(2, ['print', '(', `'Como você está, ${nome}?'`, ')']);
    console.log(`Exercício 2 para ${nome}:`, resultado2.correto ? "✅ PASSOU" : "❌ FALHOU");
    
    // Testar exercício 3
    const resultado3 = validarExercicioModulo1(3, ['meu_nome', '=', `'${nome}'`]);
    console.log(`Exercício 3 para ${nome}:`, resultado3.correto ? "✅ PASSOU" : "❌ FALHOU");
  });
  
  // Restaurar nome original
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('nomeUsuario', 'Breno');
  }
}

// Função para testar exercício específico
export function testarExercicioEspecifico(exercicioId: number, resposta: string[]): boolean {
  const nome = obterNomeUsuario();
  console.log(`Testando exercício ${exercicioId} para ${nome}:`, resposta);
  
  const resultado = validarExercicioModulo1(exercicioId, resposta);
  console.log("Resultado:", resultado.correto ? "✅ CORRETO" : "❌ INCORRETO");
  
  if (!resultado.correto && resultado.erro) {
    console.log("Erro:", resultado.erro.mensagem);
    console.log("Dica:", resultado.erro.dica);
  }
  
  return resultado.correto;
}

// Função de debug para desenvolvimento
export function debugExercicio(exercicioId: number): void {
  console.log("=== DEBUG EXERCÍCIO ===");
  console.log("ID:", exercicioId);
  console.log("Nome usuário:", obterNomeUsuario());
  
  const template = MODULO1_TEMPLATES[exercicioId];
  console.log("Template original:", template);
  
  const exercicioPersonalizado = gerarExercicioPersonalizado(exercicioId);
  console.log("Exercício personalizado:", exercicioPersonalizado);
  
  if (exercicioPersonalizado) {
    console.log("Respostas aceitas:");
    exercicioPersonalizado.respostas_aceitas.forEach((resposta, i) => {
      console.log(`  ${i + 1}: [${resposta.map(r => `"${r}"`).join(', ')}]`);
    });
    
    console.log("Opções disponíveis:");
    exercicioPersonalizado.opcoes.forEach((opcao, i) => {
      console.log(`  ${i + 1}: "${opcao}"`);
    });
    
    if (exercicioPersonalizado.output_esperado) {
      console.log("Output esperado:", `"${exercicioPersonalizado.output_esperado}"`);
    }
    
    if (exercicioPersonalizado.codigo_inicial) {
      console.log("Código inicial:", `"${exercicioPersonalizado.codigo_inicial}"`);
    }
    
    console.log("Dica:", exercicioPersonalizado.dica);
  }
}

export { ExerciseData, ValidationResult, ExecutionResult, ExercisePersonalizado, ExerciseTemplate };