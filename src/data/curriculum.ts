import { WorldData, LessonData } from '@/types/progress';

// Lesson data for the curriculum
export const lessons: Record<string, LessonData> = {
  '1-1-1': {
    id: '1-1-1',
    world: 1,
    skill: 1,
    lesson: 1,
    title: 'Primeiros Passos',
    description: 'Aprenda a dar comandos simples para o Commitinho se mover.',
    concept: 'Sequência',
    xp_reward: 10,
    required_accuracy: 60
  },
  'lesson-2': {
    id: 'lesson-2',
    world: 1,
    skill: 1,
    lesson: 2,
    title: 'Guardando palavras em uma caixinha (variáveis)',
    description: 'Aprenda a guardar valores em variáveis e recuperá-los.',
    concept: 'Variáveis',
    xp_reward: 15,
    required_accuracy: 60
  },
  '1-1-2': {
    id: '1-1-2',
    world: 1,
    skill: 1,
    lesson: 2,
    title: 'Caminho Direto',
    description: 'Combine vários movimentos para criar um caminho mais longo.',
    concept: 'Sequência',
    xp_reward: 15,
    required_accuracy: 65
  },
  '1-1-3': {
    id: '1-1-3',
    world: 1,
    skill: 1,
    lesson: 3,
    title: 'Labirinto Básico',
    description: 'Navegue pelo primeiro labirinto usando sequências de comandos.',
    concept: 'Sequência',
    xp_reward: 20,
    required_accuracy: 70
  },
  '1-2-1': {
    id: '1-2-1',
    world: 1,
    skill: 2,
    lesson: 1,
    title: 'Repetir 3 Vezes',
    description: 'Descubra como repetir comandos para economizar tempo.',
    concept: 'Repetição',
    xp_reward: 15,
    required_accuracy: 60
  },
  '1-2-2': {
    id: '1-2-2',
    world: 1,
    skill: 2,
    lesson: 2,
    title: 'Quadrado Perfeito',
    description: 'Use repetição para desenhar formas geométricas.',
    concept: 'Repetição',
    xp_reward: 20,
    required_accuracy: 65
  },
  '1-2-3': {
    id: '1-2-3',
    world: 1,
    skill: 2,
    lesson: 3,
    title: 'Padrões Infinitos',
    description: 'Crie padrões complexos combinando sequência e repetição.',
    concept: 'Repetição',
    xp_reward: 25,
    required_accuracy: 70
  },
  '1-3-1': {
    id: '1-3-1',
    world: 1,
    skill: 3,
    lesson: 1,
    title: 'Se Tem Parede...',
    description: 'Aprenda a tomar decisões baseadas no que o Commitinho vê.',
    concept: 'Condições',
    xp_reward: 20,
    required_accuracy: 60
  },
  '1-3-2': {
    id: '1-3-2',
    world: 1,
    skill: 3,
    lesson: 2,
    title: 'Desviar ou Parar',
    description: 'Use condições para evitar obstáculos no caminho.',
    concept: 'Condições',
    xp_reward: 25,
    required_accuracy: 65
  },
  '1-3-3': {
    id: '1-3-3',
    world: 1,
    skill: 3,
    lesson: 3,
    title: 'Múltiplas Escolhas',
    description: 'Combine condições múltiplas para resolver problemas complexos.',
    concept: 'Condições',
    xp_reward: 30,
    required_accuracy: 70
  }
};

// World and skill structure
export const curriculum: WorldData[] = [
  {
    id: 1,
    title: 'Mundo dos Fundamentos',
    description: 'Aprenda os conceitos básicos de programação com o Commitinho!',
    unlocked: true,
    skills: [
      {
        id: '1-1',
        world: 1,
        skill: 1,
        title: 'Sequência',
        concept: 'Comandos em ordem',
        lessons: [lessons['1-1-1'], lessons['1-1-2'], lessons['1-1-3']],
        unlocked: true,
        completed: false,
        totalStars: 0,
        maxStars: 9
      },
      {
        id: '1-2',
        world: 1,
        skill: 2,
        title: 'Repetição',
        concept: 'Loops e ciclos',
        lessons: [lessons['1-2-1'], lessons['1-2-2'], lessons['1-2-3']],
        unlocked: false,
        completed: false,
        totalStars: 0,
        maxStars: 9
      },
      {
        id: '1-3',
        world: 1,
        skill: 3,
        title: 'Condições',
        concept: 'Se... então...',
        lessons: [lessons['1-3-1'], lessons['1-3-2'], lessons['1-3-3']],
        unlocked: false,
        completed: false,
        totalStars: 0,
        maxStars: 9
      }
    ]
  }
];

// Helper functions to work with curriculum data
export const getLessonById = (lessonId: string): LessonData | undefined => {
  return lessons[lessonId];
};

export const getSkillLessons = (world: number, skill: number): LessonData[] => {
  return Object.values(lessons).filter(
    lesson => lesson.world === world && lesson.skill === skill
  ).sort((a, b) => a.lesson - b.lesson);
};

export const getWorldSkills = (worldId: number): WorldData | undefined => {
  return curriculum.find(world => world.id === worldId);
};