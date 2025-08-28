// Testes para o Sistema de Validação do Commitinho

import { validarResposta, ExerciseData } from './exerciseValidation';

// Mock de um exercício de teste
const exercicioTeste: ExerciseData = {
  id: 1,
  pergunta: "Complete o código para o Python dizer olá para você:",
  respostaCorreta: ["print", "(", "'Olá, Breno!'", ")"],
  alternativasAceitas: [
    ["print", "(", "'Olá, Breno!'", ")"],
    ["print", "(", '"Olá, Breno!"', ")"],
    ["print", "(", "'Oi, Breno!'", ")"],
    ["print", "(", '"Oi, Breno!"', ")"]
  ],
  opcoes: ["print", "(", ")", "'Olá, Breno!'", "input", "say", "'Hello'"],
  codigoEsperado: "print('Olá, Breno!')",
  outputEsperado: "Olá, Breno!",
  validarPorExecucao: true,
  outputsAceitos: ["Olá, Breno!", "Oi, Breno!"]
};

// Função de teste principal
export function executarTestesValidacao() {
  console.log("🧪 Iniciando Testes do Sistema de Validação Commitinho");
  console.log("=" .repeat(50));
  
  let testesPassados = 0;
  let totalTestes = 0;
  
  // Teste 1: Resposta exatamente correta
  totalTestes++;
  console.log("🎯 Teste 1: Resposta exatamente correta");
  const teste1 = validarResposta(["print", "(", "'Olá, Breno!'", ")"], exercicioTeste);
  if (teste1.correto && teste1.metodo === 'exata') {
    console.log("✅ PASSOU - Resposta correta identificada pelo método exato");
    testesPassados++;
  } else {
    console.log("❌ FALHOU - Deveria aceitar resposta correta", teste1);
  }
  
  // Teste 2: Alternativa com aspas duplas aceita
  totalTestes++;
  console.log("\n🎯 Teste 2: Alternativa com aspas duplas");
  const teste2 = validarResposta(["print", "(", '"Olá, Breno!"', ")"], exercicioTeste);
  if (teste2.correto && teste2.metodo === 'alternativa') {
    console.log("✅ PASSOU - Alternativa com aspas duplas aceita");
    testesPassados++;
  } else {
    console.log("❌ FALHOU - Deveria aceitar aspas duplas", teste2);
  }
  
  // Teste 3: Alternativa "Oi" em vez de "Olá"
  totalTestes++;
  console.log("\n🎯 Teste 3: Alternativa com saudação diferente");
  const teste3 = validarResposta(["print", "(", "'Oi, Breno!'", ")"], exercicioTeste);
  if (teste3.correto && teste3.metodo === 'alternativa') {
    console.log("✅ PASSOU - Alternativa 'Oi' aceita");
    testesPassados++;
  } else {
    console.log("❌ FALHOU - Deveria aceitar 'Oi' como alternativa", teste3);
  }
  
  // Teste 4: Erro - comando print ausente
  totalTestes++;
  console.log("\n🎯 Teste 4: Erro - comando print ausente");
  const teste4 = validarResposta(["(", "'Olá, Breno!'", ")"], exercicioTeste);
  if (!teste4.correto && teste4.erro?.tipo === 'comando_faltando') {
    console.log("✅ PASSOU - Erro de comando ausente identificado");
    testesPassados++;
  } else {
    console.log("❌ FALHOU - Deveria identificar comando ausente", teste4);
  }
  
  // Teste 5: Erro - parêntese de abertura ausente
  totalTestes++;
  console.log("\n🎯 Teste 5: Erro - parêntese de abertura ausente");
  const teste5 = validarResposta(["print", "'Olá, Breno!'", ")"], exercicioTeste);
  if (!teste5.correto && teste5.erro?.tipo === 'parentese_abertura') {
    console.log("✅ PASSOU - Erro de parêntese de abertura identificado");
    testesPassados++;
  } else {
    console.log("❌ FALHOU - Deveria identificar parêntese de abertura ausente", teste5);
  }
  
  // Teste 6: Erro - parêntese de fechamento ausente
  totalTestes++;
  console.log("\n🎯 Teste 6: Erro - parêntese de fechamento ausente");
  const teste6 = validarResposta(["print", "(", "'Olá, Breno!'"], exercicioTeste);
  if (!teste6.correto && teste6.erro?.tipo === 'parentese_fechamento') {
    console.log("✅ PASSOU - Erro de parêntese de fechamento identificado");
    testesPassados++;
  } else {
    console.log("❌ FALHOU - Deveria identificar parêntese de fechamento ausente", teste6);
  }
  
  // Teste 7: Erro - conteúdo incorreto
  totalTestes++;
  console.log("\n🎯 Teste 7: Erro - conteúdo incorreto");
  const teste7 = validarResposta(["print", "(", "'Tchau, Breno!'", ")"], exercicioTeste);
  if (!teste7.correto) {
    console.log("✅ PASSOU - Conteúdo incorreto rejeitado");
    testesPassados++;
  } else {
    console.log("❌ FALHOU - Deveria rejeitar conteúdo incorreto", teste7);
  }
  
  // Teste 8: Resposta vazia
  totalTestes++;
  console.log("\n🎯 Teste 8: Resposta vazia");
  const teste8 = validarResposta([], exercicioTeste);
  if (!teste8.correto) {
    console.log("✅ PASSOU - Resposta vazia rejeitada");
    testesPassados++;
  } else {
    console.log("❌ FALHOU - Deveria rejeitar resposta vazia", teste8);
  }
  
  // Resultado final
  console.log("\n" + "=".repeat(50));
  console.log(`🎯 RESULTADO FINAL: ${testesPassados}/${totalTestes} testes passaram`);
  
  if (testesPassados === totalTestes) {
    console.log("🎉 TODOS OS TESTES PASSARAM! Sistema de validação funcionando perfeitamente!");
  } else {
    console.log("⚠️  Alguns testes falharam. Verifique a implementação.");
  }
  
  return {
    testesPassados,
    totalTestes,
    percentualSucesso: (testesPassados / totalTestes) * 100
  };
}

// Teste específico para exercício de variáveis
export function testarExercicioVariavel() {
  const exercicioVariavel: ExerciseData = {
    id: 3,
    pergunta: "Guarde seu nome em uma caixinha chamada 'meu_nome':",
    respostaCorreta: ["meu_nome", "=", "'Breno'"],
    alternativasAceitas: [
      ["meu_nome", "=", "'Breno'"],
      ["meu_nome", "=", '"Breno"']
    ],
    opcoes: ["meu_nome", "=", "'Breno'", "nome", "print", "(", ")", "'nome'"],
    codigoEsperado: "meu_nome = 'Breno'",
    outputEsperado: "",
    validarPorExecucao: false
  };
  
  console.log("\n🧪 Testando exercício de variáveis");
  
  // Teste com aspas simples
  const teste1 = validarResposta(["meu_nome", "=", "'Breno'"], exercicioVariavel);
  console.log("Aspas simples:", teste1.correto ? "✅ PASSOU" : "❌ FALHOU");
  
  // Teste com aspas duplas
  const teste2 = validarResposta(["meu_nome", "=", '"Breno"'], exercicioVariavel);
  console.log("Aspas duplas:", teste2.correto ? "✅ PASSOU" : "❌ FALHOU");
  
  // Teste com erro - sem sinal de igual
  const teste3 = validarResposta(["meu_nome", "'Breno'"], exercicioVariavel);
  console.log("Sem sinal =:", !teste3.correto ? "✅ PASSOU" : "❌ FALHOU");
}

// Executar todos os testes se este arquivo for importado
if (typeof window !== 'undefined') {
  // Browser environment - adicionar ao console global para facilitar teste
  (window as Record<string, unknown>).testarValidacaoCommitinho = executarTestesValidacao;
  (window as Record<string, unknown>).testarVariavelCommitinho = testarExercicioVariavel;
}