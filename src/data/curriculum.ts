import { WorldData, LessonData } from '@/types/progress';

// Basic Adventure Lessons - focused on print()
export const basicAdventureLessons: LessonData[] = [
  {
    id: 'basic-01',
    world: 0,
    skill: 1,
    lesson: 1,
    title: 'Primeira palavra',
    description: 'Complete o print escolhendo uma palavra. Qualquer uma funciona!',
    concept: 'Print básico',
    xp_reward: 10,
    required_accuracy: 60
  },
  {
    id: 'basic-02',
    world: 0,
    skill: 1,
    lesson: 2,
    title: 'Frutas falantes',
    description: 'Faça o computador falar o nome de uma fruta deliciosa!',
    concept: 'Print básico',
    xp_reward: 10,
    required_accuracy: 60
  },
  {
    id: 'basic-03',
    world: 0,
    skill: 1,
    lesson: 3,
    title: 'Dupla de frases',
    description: 'Agora vamos usar dois prints seguidos.',
    concept: 'Print múltiplo',
    xp_reward: 12,
    required_accuracy: 60
  },
  {
    id: 'basic-04',
    world: 0,
    skill: 1,
    lesson: 4,
    title: 'Eco 3x',
    description: 'Vamos fazer eco três vezes seguidas!',
    concept: 'Print múltiplo',
    xp_reward: 12,
    required_accuracy: 60
  },
  {
    id: 'basic-05',
    world: 0,
    skill: 1,
    lesson: 5,
    title: 'História engraçada',
    description: 'Crie uma mini história com 3 linhas!',
    concept: 'Print livre',
    xp_reward: 14,
    required_accuracy: 60
  },
  {
    id: 'basic-06',
    world: 0,
    skill: 1,
    lesson: 6,
    title: 'Show de emojis',
    description: 'Escolha um emoji especial para mostrar!',
    concept: 'Print básico',
    xp_reward: 10,
    required_accuracy: 60
  },
  {
    id: 'basic-07',
    world: 0,
    skill: 1,
    lesson: 7,
    title: 'Mensagem secreta',
    description: 'Hora de revelar o segredo especial!',
    concept: 'Print específico',
    xp_reward: 12,
    required_accuracy: 60
  },
  {
    id: 'basic-08',
    world: 0,
    skill: 1,
    lesson: 8,
    title: 'Aviso de robô',
    description: 'O robô precisa avisar que está acordado!',
    concept: 'Print específico',
    xp_reward: 12,
    required_accuracy: 60
  },
  {
    id: 'basic-09',
    world: 0,
    skill: 1,
    lesson: 9,
    title: 'Cartaz divertido',
    description: 'Crie um cartaz com 4 linhas bem legais!',
    concept: 'Print livre',
    xp_reward: 15,
    required_accuracy: 60
  },
  {
    id: 'basic-10',
    world: 0,
    skill: 1,
    lesson: 10,
    title: 'Grande Final: O Show do Commitinho',
    description: 'Crie um mini show com 5 linhas usando print.',
    concept: 'Print livre',
    xp_reward: 20,
    required_accuracy: 60
  }
];

// Lesson data for the curriculum
export const lessons: Record<string, LessonData> = {
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

// Basic Adventure World
export const basicAdventureWorld = {
  id: "basic-adventure",
  title: "Aventura Básica",
  description: "Fazendo o computador falar com print().",
  lessons: [
    "basic-01", "basic-02", "basic-03", "basic-04", "basic-05",
    "basic-06", "basic-07", "basic-08", "basic-09", "basic-10"
  ],
  rewardXp: 50
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
        lessons: [lessons['1-1-2'], lessons['1-1-3']],
        unlocked: true,
        completed: false,
        totalStars: 0,
        maxStars: 6
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