/**
 * Template Engine - Sistema de substituição de tokens personalizados
 * Substitui tokens como {{childName}} pelos valores reais
 */

// Função para obter o nome da criança
export const getChildName = (): string => {
  const savedName = localStorage.getItem('commitinho.display_name');
  return savedName && savedName.length >= 2 ? savedName : 'Aventureiro';
};

// Mapa de tokens disponíveis
const getTokenValues = (): Record<string, string> => ({
  childName: getChildName(),
  // Futuramente podemos adicionar mais tokens aqui:
  // userName: getChildName(),
  // level: getCurrentLevel(),
  // xp: getTotalXP(),
});

/**
 * Substitui todos os tokens {{token}} em uma string
 * @param text Texto com tokens para substituir
 * @returns Texto com tokens substituídos
 */
export const replaceTokens = (text: string): string => {
  if (!text) return text;
  
  const tokens = getTokenValues();
  
  // Substitui todos os tokens {{tokenName}} pelos valores correspondentes
  return text.replace(/\{\{(\w+)\}\}/g, (match, tokenName) => {
    const value = tokens[tokenName];
    return value !== undefined ? value : match; // Se token não existir, mantém original
  });
};

/**
 * Processa um objeto recursivamente substituindo tokens em todas as strings
 * @param obj Objeto para processar
 * @returns Objeto com tokens substituídos
 */
export const processObjectTokens = <T>(obj: T): T => {
  if (typeof obj === 'string') {
    return replaceTokens(obj) as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => processObjectTokens(item)) as T;
  }
  
  if (obj && typeof obj === 'object') {
    const processed = {} as T;
    for (const [key, value] of Object.entries(obj)) {
      (processed as any)[key] = processObjectTokens(value);
    }
    return processed;
  }
  
  return obj;
};