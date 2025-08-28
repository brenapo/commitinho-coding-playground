// Teste do sistema de validação com diferentes nomes de usuários
import { validarExercicioModulo1 } from './exerciseValidation';

// Simular localStorage para diferentes usuários
function criarSimuladorLocalStorage(nome: string) {
  return {
    getItem: (key: string) => key === 'nomeUsuario' ? nome : null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
  };
}

function testarComNome(nome: string) {
  console.log(`\n=== TESTANDO COM O NOME: ${nome.toUpperCase()} ===`);
  
  // Simular localStorage para este nome
  (global as any).window = {
    localStorage: criarSimuladorLocalStorage(nome)
  };
  (global as any).localStorage = criarSimuladorLocalStorage(nome);
  
  // Exercício 1: print('Olá, [NOME]!')
  const teste1 = validarExercicioModulo1(1, ['print', '(', `'Olá, ${nome}!'`, ')']);
  console.log(`Exercício 1 - print('Olá, ${nome}!'): ${teste1.correto ? '✅' : '❌'} ${teste1.correto ? 'PASSOU' : teste1.erro?.mensagem}`);
  
  // Exercício 2: print('Como você está, [NOME]?')
  const teste2 = validarExercicioModulo1(2, ['print', '(', `'Como você está, ${nome}?'`, ')']);
  console.log(`Exercício 2 - print('Como você está, ${nome}?'): ${teste2.correto ? '✅' : '❌'} ${teste2.correto ? 'PASSOU' : teste2.erro?.mensagem}`);
  
  // Exercício 3: meu_nome = '[NOME]'
  const teste3 = validarExercicioModulo1(3, ['meu_nome', '=', `'${nome}'`]);
  console.log(`Exercício 3 - meu_nome = '${nome}': ${teste3.correto ? '✅' : '❌'} ${teste3.correto ? 'PASSOU' : teste3.erro?.mensagem}`);
  
  // Exercício 4: print(meu_nome) - não depende diretamente do nome
  const teste4 = validarExercicioModulo1(4, ['print', '(', 'meu_nome', ')']);
  console.log(`Exercício 4 - print(meu_nome): ${teste4.correto ? '✅' : '❌'} ${teste4.correto ? 'PASSOU' : teste4.erro?.mensagem}`);
  
  // Exercício 5: cor = input('[NOME], qual sua cor favorita?')
  const teste5 = validarExercicioModulo1(5, ['cor', '=', 'input', '(', `'${nome}, qual sua cor favorita?'`, ')']);
  console.log(`Exercício 5 - cor = input('${nome}, qual sua cor favorita?'): ${teste5.correto ? '✅' : '❌'} ${teste5.correto ? 'PASSOU' : teste5.erro?.mensagem}`);
  
  const todosPassed = teste1.correto && teste2.correto && teste3.correto && teste4.correto && teste5.correto;
  console.log(`RESULTADO PARA ${nome}: ${todosPassed ? '🎉 TODOS PASSARAM!' : '⚠️ ALGUNS FALHARAM'}`);
  
  return todosPassed;
}

console.log("=== TESTE DE MÚLTIPLOS NOMES ===");
console.log("Testando se o sistema funciona para qualquer nome...");

// Testar com diferentes nomes
const nomes = ['Maria', 'João', 'Ana', 'Carlos', 'Fernanda', 'José', 'Carla', 'Pedro'];
const resultados: { nome: string; passou: boolean }[] = [];

nomes.forEach(nome => {
  const resultado = testarComNome(nome);
  resultados.push({ nome, passou: resultado });
});

// Relatório final
console.log("\n=== RELATÓRIO FINAL ===");
let todosFuncionaram = true;

resultados.forEach(resultado => {
  if (resultado.passou) {
    console.log(`✅ ${resultado.nome}: Sistema funcionou perfeitamente!`);
  } else {
    console.log(`❌ ${resultado.nome}: Sistema falhou!`);
    todosFuncionaram = false;
  }
});

if (todosFuncionaram) {
  console.log("\n🎉 SISTEMA UNIVERSAL CONFIRMADO!");
  console.log("✅ O sistema de validação funciona com qualquer nome");
  console.log("✅ A personalização dinâmica está funcionando corretamente");
  console.log("✅ Todos os exercícios se adaptam automaticamente ao nome do usuário");
} else {
  console.log("\n⚠️ PROBLEMAS DETECTADOS!");
  console.log("❌ O sistema não está funcionando universalmente");
}