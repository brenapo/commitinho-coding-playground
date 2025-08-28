// Test script to validate all Module 1 exercises
import { validarExercicioModulo1, testarExercicioEspecifico, debugExercicio } from './exerciseValidation';

// Simular localStorage para testes Node.js
(global as any).window = {
  localStorage: {
    getItem: (key: string) => key === 'nomeUsuario' ? 'Breno' : null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
  }
};

// Também simular localStorage diretamente
(global as any).localStorage = {
  getItem: (key: string) => key === 'nomeUsuario' ? 'Breno' : null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
};

console.log("=== TESTE COMPLETO DO SISTEMA DE VALIDAÇÃO ===");

// Testes para cada exercício do Módulo 1
const testesConcluidos: { exercicio: number; passou: boolean; erro?: string }[] = [];

// Exercício 1: print('Olá, [NOME]!')
console.log("\n--- TESTANDO EXERCÍCIO 1 ---");
debugExercicio(1);
let resultado1a = validarExercicioModulo1(1, ['print', '(', "'Olá, Breno!'", ')']);
let resultado1b = validarExercicioModulo1(1, ['print', '(', '"Olá, Breno!"', ')']);
let resultado1c = validarExercicioModulo1(1, ['print', '(', "'Oi, Breno!'", ')']);
let resultado1Erro = validarExercicioModulo1(1, ['print', "'Olá, Breno!'", ')']); // Sem parêntese

console.log("Teste 1a (aspas simples):", resultado1a.correto ? "✅ PASSOU" : `❌ FALHOU: ${resultado1a.erro?.mensagem}`);
console.log("Teste 1b (aspas duplas):", resultado1b.correto ? "✅ PASSOU" : `❌ FALHOU: ${resultado1b.erro?.mensagem}`);
console.log("Teste 1c (variação Oi):", resultado1c.correto ? "✅ PASSOU" : `❌ FALHOU: ${resultado1c.erro?.mensagem}`);
console.log("Teste 1 erro (sem parêntese):", !resultado1Erro.correto ? "✅ ERRO DETECTADO" : "❌ DEVERIA FALHAR");

testesConcluidos.push({
  exercicio: 1,
  passou: resultado1a.correto && resultado1b.correto && resultado1c.correto && !resultado1Erro.correto
});

// Exercício 2: print('Como você está, [NOME]?')
console.log("\n--- TESTANDO EXERCÍCIO 2 ---");
debugExercicio(2);
let resultado2a = validarExercicioModulo1(2, ['print', '(', "'Como você está, Breno?'", ')']);
let resultado2b = validarExercicioModulo1(2, ['print', '(', '"Como você está, Breno?"', ')']);
let resultado2Erro = validarExercicioModulo1(2, ['print', "'Como você está, Breno?'"]); // Sem parênteses

console.log("Teste 2a (aspas simples):", resultado2a.correto ? "✅ PASSOU" : `❌ FALHOU: ${resultado2a.erro?.mensagem}`);
console.log("Teste 2b (aspas duplas):", resultado2b.correto ? "✅ PASSOU" : `❌ FALHOU: ${resultado2b.erro?.mensagem}`);
console.log("Teste 2 erro (sem parênteses):", !resultado2Erro.correto ? "✅ ERRO DETECTADO" : "❌ DEVERIA FALHAR");

testesConcluidos.push({
  exercicio: 2,
  passou: resultado2a.correto && resultado2b.correto && !resultado2Erro.correto
});

// Exercício 3: meu_nome = '[NOME]'
console.log("\n--- TESTANDO EXERCÍCIO 3 ---");
debugExercicio(3);
let resultado3a = validarExercicioModulo1(3, ['meu_nome', '=', "'Breno'"]);
let resultado3b = validarExercicioModulo1(3, ['meu_nome', '=', '"Breno"']);
let resultado3Erro = validarExercicioModulo1(3, ['nome', '=', "'Breno'"]); // Variável errada

console.log("Teste 3a (aspas simples):", resultado3a.correto ? "✅ PASSOU" : `❌ FALHOU: ${resultado3a.erro?.mensagem}`);
console.log("Teste 3b (aspas duplas):", resultado3b.correto ? "✅ PASSOU" : `❌ FALHOU: ${resultado3b.erro?.mensagem}`);
console.log("Teste 3 erro (variável errada):", !resultado3Erro.correto ? "✅ ERRO DETECTADO" : "❌ DEVERIA FALHAR");

testesConcluidos.push({
  exercicio: 3,
  passou: resultado3a.correto && resultado3b.correto && !resultado3Erro.correto
});

// Exercício 4: print(meu_nome)
console.log("\n--- TESTANDO EXERCÍCIO 4 ---");
debugExercicio(4);
let resultado4a = validarExercicioModulo1(4, ['print', '(', 'meu_nome', ')']);
let resultado4Erro = validarExercicioModulo1(4, ['print', '(', "'meu_nome'", ')']); // Com aspas incorretas

console.log("Teste 4a (correto):", resultado4a.correto ? "✅ PASSOU" : `❌ FALHOU: ${resultado4a.erro?.mensagem}`);
console.log("Teste 4 erro (com aspas):", !resultado4Erro.correto ? "✅ ERRO DETECTADO" : "❌ DEVERIA FALHAR");

testesConcluidos.push({
  exercicio: 4,
  passou: resultado4a.correto && !resultado4Erro.correto
});

// Exercício 5: cor = input('[NOME], qual sua cor favorita?')
console.log("\n--- TESTANDO EXERCÍCIO 5 ---");
debugExercicio(5);
let resultado5a = validarExercicioModulo1(5, ['cor', '=', 'input', '(', "'Breno, qual sua cor favorita?'", ')']);
let resultado5b = validarExercicioModulo1(5, ['cor', '=', 'input', '(', '"Breno, qual sua cor favorita?"', ')']);
let resultado5Erro = validarExercicioModulo1(5, ['cor', 'input', '(', "'Breno, qual sua cor favorita?'", ')']); // Sem =

console.log("Teste 5a (aspas simples):", resultado5a.correto ? "✅ PASSOU" : `❌ FALHOU: ${resultado5a.erro?.mensagem}`);
console.log("Teste 5b (aspas duplas):", resultado5b.correto ? "✅ PASSOU" : `❌ FALHOU: ${resultado5b.erro?.mensagem}`);
console.log("Teste 5 erro (sem =):", !resultado5Erro.correto ? "✅ ERRO DETECTADO" : "❌ DEVERIA FALHAR");

testesConcluidos.push({
  exercicio: 5,
  passou: resultado5a.correto && resultado5b.correto && !resultado5Erro.correto
});

// Relatório final
console.log("\n=== RELATÓRIO FINAL DOS TESTES ===");
let todosPassaram = true;

testesConcluidos.forEach(teste => {
  if (teste.passou) {
    console.log(`✅ Exercício ${teste.exercicio}: TODOS OS TESTES PASSARAM`);
  } else {
    console.log(`❌ Exercício ${teste.exercicio}: ALGUNS TESTES FALHARAM`);
    todosPassaram = false;
  }
});

if (todosPassaram) {
  console.log("\n🎉 TODOS OS EXERCÍCIOS ESTÃO FUNCIONANDO PERFEITAMENTE!");
  console.log("✅ Sistema de validação está robusto e funcionando corretamente");
  console.log("✅ Personalização de nomes está funcionando");
  console.log("✅ Detecção de erros está funcionando");
} else {
  console.log("\n⚠️ ALGUNS EXERCÍCIOS PRECISAM DE AJUSTES");
}

export { testesConcluidos };