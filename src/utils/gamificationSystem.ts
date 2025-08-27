// Sistema de Gamificação Completo do Commitinho

export interface UserProgress {
  xp: number;
  level: number;
  levelName: string;
  emoji: string;
  streakDays: number;
  exercisesCompleted: number;
  achievements: string[];
  dailyXP: number;
  lastLoginDate: string;
  perfectStreak: number;
  hintsUsed: number;
  codesExecuted: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  xp: number;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

export interface Level {
  level: number;
  name: string;
  xpRequired: number;
  emoji: string;
  benefits: string[];
}

// Sistema de níveis
export const LEVELS: Level[] = [
  { 
    level: 1, 
    name: "Novato Curioso", 
    xpRequired: 0, 
    emoji: "🐣",
    benefits: ["Acesso ao Módulo 1", "Dicas básicas"]
  },
  { 
    level: 2, 
    name: "Explorador", 
    xpRequired: 200, 
    emoji: "🔍",
    benefits: ["Avatar colorido", "Dicas extras", "Crachá Explorador"]
  },
  { 
    level: 3, 
    name: "Programador Iniciante", 
    xpRequired: 500, 
    emoji: "💻",
    benefits: ["Acesso ao Módulo 2", "Tema personalizado", "Execução de código"]
  },
  { 
    level: 4, 
    name: "Codificador Esperto", 
    xpRequired: 1000, 
    emoji: "🤓",
    benefits: ["Dicas avançadas", "Estatísticas detalhadas", "Modo turbo"]
  },
  { 
    level: 5, 
    name: "Mestre Python Jr.", 
    xpRequired: 2000, 
    emoji: "🐍",
    benefits: ["Acesso ao Módulo 3", "Certificado virtual", "Código secreto"]
  },
  { 
    level: 6, 
    name: "Gênio da Programação", 
    xpRequired: 4000, 
    emoji: "🧙‍♂️",
    benefits: ["Todos os módulos", "Avatar especial", "Hall da Fama"]
  }
];

// Sistema de conquistas
export const ACHIEVEMENTS: { [key: string]: Omit<Achievement, 'unlocked' | 'progress'> } = {
  first_print: {
    id: "first_print",
    name: "Primeira Linha!",
    description: "Completou seu primeiro print()",
    emoji: "🎉",
    xp: 100
  },
  no_hints_5: {
    id: "no_hints_5",
    name: "Autodidata",
    description: "Resolveu 5 exercícios sem usar dicas",
    emoji: "🧠",
    xp: 150,
    target: 5
  },
  perfect_streak_10: {
    id: "perfect_streak_10",
    name: "Sequência Perfeita",
    description: "Acertou 10 exercícios seguidos",
    emoji: "⭐",
    xp: 200,
    target: 10
  },
  quick_learner: {
    id: "quick_learner",
    name: "Explorador Rápido",
    description: "Completou um módulo em menos de 30 minutos",
    emoji: "⚡",
    xp: 300
  },
  code_ninja: {
    id: "code_ninja",
    name: "Código Ninja",
    description: "Executou 20 códigos com sucesso",
    emoji: "🥷",
    xp: 250,
    target: 20
  },
  week_streak: {
    id: "week_streak",
    name: "Persistente",
    description: "Manteve sequência de 7 dias",
    emoji: "🔥",
    xp: 400,
    target: 7
  }
};

// Pontuações por ação
export const XP_REWARDS = {
  EXERCISE_CORRECT: 50,
  EXERCISE_WITH_HINT: 30,
  EXERCISE_NO_HINT: 70,
  CODE_EXECUTED: 25,
  PERFECT_FIRST_TRY: 20,
  STREAK_3_DAYS: 100,
  STREAK_7_DAYS: 200,
  MODULE_COMPLETE: 300,
  ACHIEVEMENT_UNLOCK: 0 // XP comes from achievement itself
};

export class GamificationSystem {
  private static instance: GamificationSystem;
  private userData: UserProgress;

  private constructor() {
    this.userData = this.loadUserProgress();
  }

  static getInstance(): GamificationSystem {
    if (!GamificationSystem.instance) {
      GamificationSystem.instance = new GamificationSystem();
    }
    return GamificationSystem.instance;
  }

  private loadUserProgress(): UserProgress {
    const stored = localStorage.getItem('commitinho_gamification');
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      xp: 0,
      level: 1,
      levelName: "Novato Curioso",
      emoji: "🐣",
      streakDays: 0,
      exercisesCompleted: 0,
      achievements: [],
      dailyXP: 0,
      lastLoginDate: new Date().toDateString(),
      perfectStreak: 0,
      hintsUsed: 0,
      codesExecuted: 0
    };
  }

  private saveUserProgress(): void {
    localStorage.setItem('commitinho_gamification', JSON.stringify(this.userData));
  }

  // Adicionar XP e verificar level up
  addXP(amount: number, reason?: string): { levelUp: boolean; newLevel?: Level } {
    const oldLevel = this.userData.level;
    this.userData.xp += amount;
    this.userData.dailyXP += amount;
    
    const newLevel = this.calculateLevel();
    const levelUp = newLevel.level > oldLevel;
    
    if (levelUp) {
      this.userData.level = newLevel.level;
      this.userData.levelName = newLevel.name;
      this.userData.emoji = newLevel.emoji;
    }
    
    this.saveUserProgress();
    
    return {
      levelUp,
      newLevel: levelUp ? newLevel : undefined
    };
  }

  // Calcular nível atual baseado no XP
  private calculateLevel(): Level {
    let currentLevel = LEVELS[0];
    
    for (const level of LEVELS) {
      if (this.userData.xp >= level.xpRequired) {
        currentLevel = level;
      } else {
        break;
      }
    }
    
    return currentLevel;
  }

  // Verificar e desbloquear conquistas
  checkAchievements(action: string, data?: any): Achievement[] {
    const unlockedAchievements: Achievement[] = [];
    
    switch (action) {
      case 'first_print':
        if (!this.userData.achievements.includes('first_print')) {
          unlockedAchievements.push(this.unlockAchievement('first_print'));
        }
        break;
        
      case 'exercise_completed':
        this.userData.exercisesCompleted++;
        
        // Check no hints achievement
        if (!data?.usedHint && !this.userData.achievements.includes('no_hints_5')) {
          const noHintCount = this.getAchievementProgress('no_hints_5') + 1;
          if (noHintCount >= 5) {
            unlockedAchievements.push(this.unlockAchievement('no_hints_5'));
          } else {
            this.setAchievementProgress('no_hints_5', noHintCount);
          }
        }
        break;
        
      case 'code_executed':
        this.userData.codesExecuted++;
        if (this.userData.codesExecuted >= 20 && !this.userData.achievements.includes('code_ninja')) {
          unlockedAchievements.push(this.unlockAchievement('code_ninja'));
        }
        break;
        
      case 'streak_updated':
        if (this.userData.streakDays >= 7 && !this.userData.achievements.includes('week_streak')) {
          unlockedAchievements.push(this.unlockAchievement('week_streak'));
        }
        break;
    }
    
    this.saveUserProgress();
    return unlockedAchievements;
  }

  private unlockAchievement(achievementId: string): Achievement {
    const achievement = ACHIEVEMENTS[achievementId];
    this.userData.achievements.push(achievementId);
    this.addXP(achievement.xp, `Achievement: ${achievement.name}`);
    
    return {
      ...achievement,
      unlocked: true
    };
  }

  private getAchievementProgress(achievementId: string): number {
    return parseInt(localStorage.getItem(`achievement_${achievementId}`) || '0');
  }

  private setAchievementProgress(achievementId: string, progress: number): void {
    localStorage.setItem(`achievement_${achievementId}`, progress.toString());
  }

  // Atualizar streak diário
  updateDailyStreak(): boolean {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (this.userData.lastLoginDate === today) {
      return false; // Already updated today
    }
    
    if (this.userData.lastLoginDate === yesterdayStr) {
      // Continue streak
      this.userData.streakDays++;
    } else {
      // Streak broken, reset
      this.userData.streakDays = 1;
    }
    
    this.userData.lastLoginDate = today;
    this.userData.dailyXP = 0; // Reset daily XP
    
    // Check for streak achievements
    this.checkAchievements('streak_updated');
    
    this.saveUserProgress();
    return true;
  }

  // Calcular XP de exercício com bônus
  calculateExerciseXP(data: {
    usedHint: boolean;
    firstTry: boolean;
    executedCode: boolean;
    timeSpent: number;
  }): number {
    let xp = data.usedHint ? XP_REWARDS.EXERCISE_WITH_HINT : XP_REWARDS.EXERCISE_NO_HINT;
    
    if (data.firstTry) {
      xp += XP_REWARDS.PERFECT_FIRST_TRY;
    }
    
    if (data.executedCode) {
      xp += XP_REWARDS.CODE_EXECUTED;
    }
    
    // Time bonus for quick completion
    if (data.timeSpent < 60) { // Less than 1 minute
      xp += 10;
    }
    
    // Streak multiplier
    if (this.userData.streakDays >= 3) {
      xp = Math.floor(xp * 1.1); // 10% bonus
    }
    
    return xp;
  }

  // Getters para UI
  getUserProgress(): UserProgress {
    return { ...this.userData };
  }

  getNextLevel(): Level | null {
    const currentLevelIndex = LEVELS.findIndex(l => l.level === this.userData.level);
    return currentLevelIndex < LEVELS.length - 1 ? LEVELS[currentLevelIndex + 1] : null;
  }

  getProgressToNextLevel(): { current: number; required: number; percentage: number } {
    const nextLevel = this.getNextLevel();
    if (!nextLevel) {
      return { current: this.userData.xp, required: this.userData.xp, percentage: 100 };
    }
    
    const currentLevel = LEVELS.find(l => l.level === this.userData.level)!;
    const current = this.userData.xp - currentLevel.xpRequired;
    const required = nextLevel.xpRequired - currentLevel.xpRequired;
    const percentage = Math.floor((current / required) * 100);
    
    return { current: current, required: required, percentage };
  }

  getUnlockedAchievements(): Achievement[] {
    return this.userData.achievements.map(id => ({
      ...ACHIEVEMENTS[id],
      unlocked: true
    }));
  }

  getAvailableAchievements(): Achievement[] {
    return Object.values(ACHIEVEMENTS).map(achievement => ({
      ...achievement,
      unlocked: this.userData.achievements.includes(achievement.id),
      progress: this.getAchievementProgress(achievement.id)
    }));
  }
}

// Hook para usar o sistema de gamificação
export const useGamification = () => {
  const system = GamificationSystem.getInstance();
  
  return {
    addXP: (amount: number, reason?: string) => system.addXP(amount, reason),
    checkAchievements: (action: string, data?: any) => system.checkAchievements(action, data),
    updateDailyStreak: () => system.updateDailyStreak(),
    calculateExerciseXP: (data: any) => system.calculateExerciseXP(data),
    getUserProgress: () => system.getUserProgress(),
    getNextLevel: () => system.getNextLevel(),
    getProgressToNextLevel: () => system.getProgressToNextLevel(),
    getUnlockedAchievements: () => system.getUnlockedAchievements(),
    getAvailableAchievements: () => system.getAvailableAchievements()
  };
};