export interface ModuleData {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: string[];
  requiredXP?: number;
  rewardXP: number;
  unlocked: boolean;
}

export const CURRICULUM_MODULES: ModuleData[] = [
  {
    id: "basic-adventure",
    title: "Aventura Básica",
    description: "Primeiros passos com print()",
    icon: "🚀",
    color: "from-blue-500 to-cyan-500",
    lessons: [
      "basic-01", "basic-02", "basic-03", "basic-04", "basic-05",
      "basic-06", "basic-07", "basic-08", "basic-09", "basic-10"
    ],
    rewardXP: 50,
    unlocked: true
  },
  {
    id: "variables",
    title: "Variáveis Mágicas",
    description: "Guardar informações em caixinhas",
    icon: "📦",
    color: "from-green-500 to-emerald-500",
    lessons: [
      "var-01", "var-02", "var-03", "var-04", "var-05",
      "var-06", "var-07", "var-08", "var-09", "var-10"
    ],
    requiredXP: 100,
    rewardXP: 75,
    unlocked: false
  },
  {
    id: "sequences",
    title: "Sequências Inteligentes", 
    description: "Múltiplas instruções em ordem",
    icon: "🔄",
    color: "from-purple-500 to-pink-500",
    lessons: [
      "seq-01", "seq-02", "seq-03", "seq-04", "seq-05",
      "seq-06", "seq-07", "seq-08", "seq-09", "seq-10"
    ],
    requiredXP: 200,
    rewardXP: 100,
    unlocked: false
  },
  {
    id: "loops",
    title: "Repetições Poderosas",
    description: "Fazer a mesma coisa várias vezes",
    icon: "🔁",
    color: "from-orange-500 to-red-500",
    lessons: [
      "loop-01", "loop-02", "loop-03", "loop-04", "loop-05",
      "loop-06", "loop-07", "loop-08", "loop-09", "loop-10"
    ],
    requiredXP: 350,
    rewardXP: 125,
    unlocked: false
  },
  {
    id: "conditions",
    title: "Decisões Espertas",
    description: "Se isso, então aquilo",
    icon: "🤔",
    color: "from-amber-500 to-yellow-500",
    lessons: [
      "if-01", "if-02", "if-03", "if-04", "if-05",
      "if-06", "if-07", "if-08", "if-09", "if-10"
    ],
    requiredXP: 500,
    rewardXP: 150,
    unlocked: false
  },
  {
    id: "functions",
    title: "Funções Fantásticas",
    description: "Criar seus próprios comandos",
    icon: "⚡",
    color: "from-indigo-500 to-blue-500",
    lessons: [
      "func-01", "func-02", "func-03", "func-04", "func-05",
      "func-06", "func-07", "func-08", "func-09", "func-10"
    ],
    requiredXP: 700,
    rewardXP: 175,
    unlocked: false
  },
  {
    id: "lists",
    title: "Listas Organizadas",
    description: "Coleções de itens relacionados",
    icon: "📝",
    color: "from-teal-500 to-green-500",
    lessons: [
      "list-01", "list-02", "list-03", "list-04", "list-05",
      "list-06", "list-07", "list-08", "list-09", "list-10"
    ],
    requiredXP: 950,
    rewardXP: 200,
    unlocked: false
  },
  {
    id: "projects",
    title: "Projetos Incríveis",
    description: "Juntar tudo que aprendeu",
    icon: "🏆",
    color: "from-violet-500 to-purple-500",
    lessons: [
      "proj-01", "proj-02", "proj-03", "proj-04", "proj-05",
      "proj-06", "proj-07", "proj-08", "proj-09", "proj-10"
    ],
    requiredXP: 1200,
    rewardXP: 250,
    unlocked: false
  },
  {
    id: "advanced",
    title: "Aventuras Avançadas",
    description: "Desafios para pequenos experts",
    icon: "🎯",
    color: "from-rose-500 to-pink-500",
    lessons: [
      "adv-01", "adv-02", "adv-03", "adv-04", "adv-05",
      "adv-06", "adv-07", "adv-08", "adv-09", "adv-10"
    ],
    requiredXP: 1500,
    rewardXP: 300,
    unlocked: false
  },
  {
    id: "mastery",
    title: "Mestres do Código",
    description: "O nível final dos pequenos programadores",
    icon: "👑",
    color: "from-yellow-500 to-amber-500",
    lessons: [
      "mast-01", "mast-02", "mast-03", "mast-04", "mast-05",
      "mast-06", "mast-07", "mast-08", "mast-09", "mast-10"
    ],
    requiredXP: 2000,
    rewardXP: 500,
    unlocked: false
  }
];