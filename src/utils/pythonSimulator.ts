// Simulador Python para Crianças - Commitinho

interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
}

interface SimulationContext {
  variables: { [key: string]: any };
  userName: string;
}

export class PythonSimulator {
  private context: SimulationContext;

  constructor(userName: string = 'amiguinho') {
    this.context = {
      variables: {},
      userName: userName
    };
  }

  // Executar código Python simulado
  execute(code: string): ExecutionResult {
    try {
      // Limpar contexto para nova execução
      this.context.variables = {};
      
      // Processar múltiplas linhas
      const lines = code.split('\n').filter(line => line.trim().length > 0);
      let output = '';
      
      for (const line of lines) {
        const result = this.executeLine(line.trim());
        if (!result.success) {
          return result;
        }
        if (result.output) {
          output += result.output + '\n';
        }
      }
      
      return {
        success: true,
        output: output.trim()
      };
      
    } catch (error) {
      return {
        success: false,
        output: '',
        error: 'Ops! Algo não está certo no seu código 🤔'
      };
    }
  }

  private executeLine(line: string): ExecutionResult {
    // Substituir placeholder [NOME] pelo nome do usuário
    line = line.replace(/\[NOME\]/g, this.context.userName);
    
    // Remover espaços extras
    line = line.trim();
    
    // Verificar se é uma instrução print()
    if (line.startsWith('print(') && line.endsWith(')')) {
      return this.executeprint(line);
    }
    
    // Verificar se é uma atribuição de variável
    if (line.includes(' = ')) {
      return this.executeAssignment(line);
    }
    
    // Verificar se é uma instrução input()
    if (line.includes('input(')) {
      return this.executeInput(line);
    }
    
    return {
      success: false,
      output: '',
      error: 'Hmm... não consegui entender essa linha de código 🧩'
    };
  }

  private executeprint(line: string): ExecutionResult {
    try {
      // Extrair conteúdo do print()
      const match = line.match(/print\((.*)\)/);
      if (!match) {
        return {
          success: false,
          output: '',
          error: 'Parece que falta alguma coisa no print() 📝'
        };
      }
      
      let content = match[1].trim();
      
      // Se está entre aspas, é uma string literal
      if ((content.startsWith("'") && content.endsWith("'")) || 
          (content.startsWith('"') && content.endsWith('"'))) {
        const stringContent = content.slice(1, -1);
        return {
          success: true,
          output: stringContent
        };
      }
      
      // Se é uma variável
      if (this.context.variables.hasOwnProperty(content)) {
        return {
          success: true,
          output: this.context.variables[content]
        };
      }
      
      // Expressões mais complexas (para exercícios avançados)
      if (content.includes('+')) {
        return this.evaluateExpression(content);
      }
      
      return {
        success: false,
        output: '',
        error: `Não consegui encontrar a variável "${content}" 🔍`
      };
      
    } catch (error) {
      return {
        success: false,
        output: '',
        error: 'Algo não está certo no print() 🤔'
      };
    }
  }

  private executeAssignment(line: string): ExecutionResult {
    try {
      const parts = line.split(' = ');
      if (parts.length !== 2) {
        return {
          success: false,
          output: '',
          error: 'Formato da variável não está certo 📦'
        };
      }
      
      const variableName = parts[0].trim();
      let value = parts[1].trim();
      
      // Verificar se o nome da variável é válido
      if (!this.isValidVariableName(variableName)) {
        return {
          success: false,
          output: '',
          error: 'Nome da variável não pode ter espaços ou símbolos especiais 📛'
        };
      }
      
      // Se é uma string
      if ((value.startsWith("'") && value.endsWith("'")) || 
          (value.startsWith('"') && value.endsWith('"'))) {
        this.context.variables[variableName] = value.slice(1, -1);
        return { success: true, output: '' };
      }
      
      // Se é um número
      if (!isNaN(Number(value))) {
        this.context.variables[variableName] = Number(value);
        return { success: true, output: '' };
      }
      
      // Se é uma chamada de input()
      if (value.includes('input(')) {
        const inputResult = this.executeInput(value);
        if (inputResult.success) {
          this.context.variables[variableName] = inputResult.output;
          return { success: true, output: '' };
        }
        return inputResult;
      }
      
      return {
        success: false,
        output: '',
        error: 'Não consegui entender o valor da variável 🤷‍♂️'
      };
      
    } catch (error) {
      return {
        success: false,
        output: '',
        error: 'Algo não está certo na criação da variável 📦'
      };
    }
  }

  private executeInput(line: string): ExecutionResult {
    try {
      // Para simulação, vamos retornar uma resposta genérica
      const match = line.match(/input\((.*)\)/);
      if (!match) {
        return {
          success: false,
          output: '',
          error: 'Parece que falta alguma coisa no input() 🎯'
        };
      }
      
      let prompt = match[1].trim();
      
      // Se tem prompt entre aspas
      if ((prompt.startsWith("'") && prompt.endsWith("'")) || 
          (prompt.startsWith('"') && prompt.endsWith('"'))) {
        prompt = prompt.slice(1, -1);
      }
      
      // Para simulação, retornamos uma resposta baseada no prompt
      const simulatedResponse = this.generateSimulatedInput(prompt);
      
      return {
        success: true,
        output: simulatedResponse
      };
      
    } catch (error) {
      return {
        success: false,
        output: '',
        error: 'Algo não está certo no input() 🎯'
      };
    }
  }

  private generateSimulatedInput(prompt: string): string {
    // Gerar resposta simulada baseada no prompt
    if (prompt.toLowerCase().includes('cor')) {
      return 'azul';
    }
    if (prompt.toLowerCase().includes('idade')) {
      return '10';
    }
    if (prompt.toLowerCase().includes('nome')) {
      return this.context.userName;
    }
    if (prompt.toLowerCase().includes('animal')) {
      return 'gato';
    }
    if (prompt.toLowerCase().includes('comida')) {
      return 'pizza';
    }
    
    return 'minha resposta';
  }

  private evaluateExpression(expression: string): ExecutionResult {
    try {
      // Avaliar expressões simples (apenas strings por segurança)
      const parts = expression.split('+').map(part => part.trim());
      let result = '';
      
      for (const part of parts) {
        if ((part.startsWith("'") && part.endsWith("'")) || 
            (part.startsWith('"') && part.endsWith('"'))) {
          result += part.slice(1, -1);
        } else if (this.context.variables.hasOwnProperty(part)) {
          result += this.context.variables[part];
        } else {
          return {
            success: false,
            output: '',
            error: `Não consegui encontrar "${part}" 🔍`
          };
        }
      }
      
      return {
        success: true,
        output: result
      };
      
    } catch (error) {
      return {
        success: false,
        output: '',
        error: 'Expressão muito complexa para mim 🤯'
      };
    }
  }

  private isValidVariableName(name: string): boolean {
    // Verificar se é um nome válido de variável Python
    const validPattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    return validPattern.test(name) && !this.isPythonKeyword(name);
  }

  private isPythonKeyword(word: string): boolean {
    const keywords = ['print', 'input', 'if', 'else', 'for', 'while', 'def', 'class', 'import', 'from', 'return'];
    return keywords.includes(word.toLowerCase());
  }

  // Método para validar código antes da execução
  validateCode(code: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const lines = code.split('\n').filter(line => line.trim().length > 0);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Verificar parênteses balanceados
      if (line.includes('(')) {
        const openCount = (line.match(/\(/g) || []).length;
        const closeCount = (line.match(/\)/g) || []).length;
        if (openCount !== closeCount) {
          errors.push(`Linha ${i + 1}: Parênteses não estão balanceados 🤔`);
        }
      }
      
      // Verificar se print() tem conteúdo
      if (line.startsWith('print(') && line === 'print()') {
        errors.push(`Linha ${i + 1}: print() está vazio! Coloque alguma coisa dentro 📝`);
      }
      
      // Verificar aspas
      const singleQuotes = (line.match(/'/g) || []).length;
      const doubleQuotes = (line.match(/"/g) || []).length;
      if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
        errors.push(`Linha ${i + 1}: Aspas não estão fechadas corretamente ✏️`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
}

// Hook para usar o simulador
export const usePythonSimulator = (userName: string) => {
  const simulator = new PythonSimulator(userName);
  
  return {
    execute: (code: string) => simulator.execute(code),
    validate: (code: string) => simulator.validateCode(code)
  };
};