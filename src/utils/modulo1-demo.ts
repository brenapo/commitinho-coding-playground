// Demo do Sistema de Validação Dinâmica - Módulo 1
// Execute este arquivo para ver o sistema em funcionamento

import { 
  validarExercicioModulo1, 
  carregarExercicioPersonalizado,
  obterMensagemCommitinho,
  testarExerciciosPersonalizados,
  testarExercicioEspecifico,
  debugExercicio
} from './exerciseValidation';

// Simular localStorage no Node.js para testes
const mockStorage: { [key: string]: string } = {};

if (typeof window === 'undefined') {
  // @ts-ignore
  global.window = {
    localStorage: {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      }
    }
  };
  
  // @ts-ignore
  global.localStorage = global.window.localStorage;
}

function demonstrarSistema() {
  console.log('🚀 DEMO: Sistema de Validação Dinâmica - Módulo 1\n');

  // Definir o nome do usuário
  mockStorage['nomeUsuario'] = 'Sofia';
  
  console.log('👤 Usuário atual: Sofia\n');

  // Demo 1: Carregamento personalizado
  console.log('📋 DEMO 1: Carregamento de Exercício Personalizado');
  console.log('='.repeat(50));
  
  const exercicio1 = carregarExercicioPersonalizado(1);
  if (exercicio1) {
    console.log(`📝 ${exercicio1.titulo}`);
    console.log(`❓ ${exercicio1.pergunta}`);
    console.log(`🎯 Output esperado: "${exercicio1.output_esperado}"`);
    console.log(`🎲 Opções disponíveis: ${exercicio1.opcoes.join(' | ')}`);
    console.log(`💡 ${exercicio1.dica}`);
  }
  console.log();

  // Demo 2: Mensagem do Commitinho
  console.log('🤖 DEMO 2: Mensagens Personalizadas do Commitinho');
  console.log('='.repeat(50));
  
  for (let i = 1; i <= 5; i++) {
    console.log(`Exercício ${i}: ${obterMensagemCommitinho(i)}`);
  }
  console.log();

  // Demo 3: Validação com respostas corretas
  console.log('✅ DEMO 3: Validação de Respostas Corretas');
  console.log('='.repeat(50));
  
  // Exercício 1 - Print simples
  const resp1 = validarExercicioModulo1(1, ['print', '(', "'Olá, Sofia!'", ')']);
  console.log(`Exercício 1: ${resp1.correto ? '✅ CORRETO' : '❌ INCORRETO'}`);
  
  // Exercício 2 - Pergunta
  const resp2 = validarExercicioModulo1(2, ['print', '(', "'Como você está, Sofia?'", ')']);
  console.log(`Exercício 2: ${resp2.correto ? '✅ CORRETO' : '❌ INCORRETO'}`);
  
  // Exercício 3 - Variável
  const resp3 = validarExercicioModulo1(3, ['meu_nome', '=', "'Sofia'"]);
  console.log(`Exercício 3: ${resp3.correto ? '✅ CORRETO' : '❌ INCORRETO'}`);
  console.log();

  // Demo 4: Validação com erros
  console.log('❌ DEMO 4: Validação de Respostas Incorretas');
  console.log('='.repeat(50));
  
  const respErro = validarExercicioModulo1(1, ['print', "'Olá, Sofia!'", ')']);
  console.log(`Resposta incorreta: ${respErro.correto ? '✅ CORRETO' : '❌ INCORRETO'}`);
  if (respErro.erro) {
    console.log(`Erro: ${respErro.erro.mensagem}`);
    console.log(`Dica: ${respErro.erro.dica}`);
  }
  console.log();

  // Demo 5: Debug de exercício
  console.log('🔍 DEMO 5: Debug de Exercício');
  console.log('='.repeat(50));
  debugExercicio(1);
  console.log();

  // Demo 6: Teste com diferentes nomes
  console.log('👥 DEMO 6: Teste com Diferentes Nomes');
  console.log('='.repeat(50));
  
  const nomes = ['Ana', 'João', 'Maria'];
  nomes.forEach(nome => {
    mockStorage['nomeUsuario'] = nome;
    
    console.log(`\n--- Testando para ${nome} ---`);
    const exercicio = carregarExercicioPersonalizado(1);
    if (exercicio) {
      console.log(`Opções: ${exercicio.opcoes.slice(0, 4).join(' | ')}`);
      console.log(`Output esperado: "${exercicio.output_esperado}"`);
      
      const resultado = validarExercicioModulo1(1, ['print', '(', `'Olá, ${nome}!'`, ')']);
      console.log(`Validação: ${resultado.correto ? '✅ PASSOU' : '❌ FALHOU'}`);
    }
  });

  console.log('\n🎉 Demo concluída com sucesso!');
  console.log('O sistema está funcionando perfeitamente para qualquer nome!');
}

export { demonstrarSistema };

// Executar demo automaticamente
demonstrarSistema();