// Sistema de personalização do Commitinho

interface UserData {
  name: string;
  age: number;
  currentModule: number;
  currentExercise: number;
  completedExercises: number;
  streakDays: number;
  points: number;
  level: string;
  xp: number;
  achievements: string[];
}

export const PersonalizationService = {
  // Salvar dados do usuário
  saveUserData: (userData: Partial<UserData>) => {
    const currentData = PersonalizationService.getUserData();
    const updatedData = { ...currentData, ...userData };
    
    Object.keys(updatedData).forEach(key => {
      localStorage.setItem(`commitinho_${key}`, String(updatedData[key as keyof UserData]));
    });
  },

  // Recuperar dados do usuário
  getUserData: (): UserData => {
    return {
      name: localStorage.getItem('commitinho_name') || '',
      age: parseInt(localStorage.getItem('commitinho_age') || '0'),
      currentModule: parseInt(localStorage.getItem('commitinho_currentModule') || '1'),
      currentExercise: parseInt(localStorage.getItem('commitinho_currentExercise') || '1'),
      completedExercises: parseInt(localStorage.getItem('commitinho_completedExercises') || '0'),
      streakDays: parseInt(localStorage.getItem('commitinho_streakDays') || '0'),
      points: parseInt(localStorage.getItem('commitinho_points') || '0'),
      level: localStorage.getItem('commitinho_level') || 'Novato',
      xp: parseInt(localStorage.getItem('commitinho_xp') || '0'),
      achievements: JSON.parse(localStorage.getItem('commitinho_achievements') || '[]')
    };
  },

  // Personalizar texto substituindo [NOME] pelo nome do usuário
  personalizeText: (text: string): string => {
    const userData = PersonalizationService.getUserData();
    const name = userData.name || 'amiguinho';
    return text.replace(/\[NOME\]/g, name);
  },

  // Verificar se usuário completou apresentação
  hasCompletedIntroduction: (): boolean => {
    const userData = PersonalizationService.getUserData();
    return userData.name.length >= 2;
  },

  // Resetar progresso do usuário
  resetProgress: () => {
    const keysToRemove = [
      'commitinho_name',
      'commitinho_age', 
      'commitinho_currentModule',
      'commitinho_currentExercise',
      'commitinho_completedExercises',
      'commitinho_streakDays',
      'commitinho_points',
      'commitinho_level',
      'commitinho_xp',
      'commitinho_achievements'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  },

  // Calcular nível baseado nos pontos
  calculateLevel: (points: number): string => {
    if (points < 50) return 'Novato';
    if (points < 150) return 'Explorador';
    if (points < 300) return 'Aventureiro';
    if (points < 500) return 'Expert Python';
    return 'Mestre Programador';
  },

  // Aplicar personalização em elementos DOM
  applyPersonalizationToDOM: () => {
    const elements = document.querySelectorAll('.personalizar, [data-personalizar]');
    elements.forEach(element => {
      const htmlElement = element as HTMLElement;
      if (htmlElement.innerHTML) {
        htmlElement.innerHTML = PersonalizationService.personalizeText(htmlElement.innerHTML);
      }
      if (htmlElement.textContent) {
        htmlElement.textContent = PersonalizationService.personalizeText(htmlElement.textContent);
      }
    });
  }
};

// Hook React para personalização
export const usePersonalization = () => {
  const userData = PersonalizationService.getUserData();
  
  const personalizeText = (text: string) => PersonalizationService.personalizeText(text);
  
  const saveUserData = (data: Partial<UserData>) => PersonalizationService.saveUserData(data);
  
  const hasCompletedIntro = PersonalizationService.hasCompletedIntroduction();
  
  return {
    userData,
    personalizeText,
    saveUserData,
    hasCompletedIntro,
    resetProgress: PersonalizationService.resetProgress
  };
};