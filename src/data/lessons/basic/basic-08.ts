export const lessonData = {
  id: "basic-08",
  title: "Placa de aviso",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Placa de aviso",
    text: "Uma fala direta, tipo 'Cuidado!' ou 'Bem-vindos!'",
    cta: { label: "Iniciar Atividade", goto: "placa_aviso" }
  },
  activities: [
    {
      id: "placa_aviso",
      type: "code_write",
      title: "Placa de aviso",
      helper: { text: "Uma fala direta, tipo 'Cuidado!' ou 'Bem-vindos!'" },
      explain: "Use o <code>print</code> para criar uma mensagem de aviso clara.",
      prompt: "Digite seu código nas linhas abaixo:",
      example: {
        code: "print(\"Cuidado!\")",
        runLabel: "▶ Rodar exemplo",
        observation: "Exemplo: apenas para inspirar. Agora crie seu aviso!"
      },
      expectedOutput: [],
      successTemplate: "Ótimo aviso! 🚨",
      successExplain: "Mensagem direta e clara.",
      runLabel: "Executar código",
      xp: 10
    }
  ],
  next: "basic-09"
};