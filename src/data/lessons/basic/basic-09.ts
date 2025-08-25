export const lessonData = {
  id: "basic-09",
  title: "Cartão de visita (2 linhas)",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Cartão de visita",
    text: "Duas falas: seu nome e algo que você gosta.",
    cta: { label: "Iniciar Atividade", goto: "cartao_visita" }
  },
  activities: [
    {
      id: "cartao_visita",
      type: "code_write",
      title: "Cartão de visita",
      helper: { text: "Duas falas: seu nome e algo que você gosta." },
      explain: "Use dois <code>print</code> para criar sua apresentação pessoal.",
      prompt: "Digite seu código nas linhas abaixo:",
      example: {
        code: "print(\"Oi!\")",
        runLabel: "▶ Rodar exemplo",
        observation: "Exemplo: apenas para inspirar. Agora faça sua apresentação com 2 linhas!"
      },
      expectedOutput: [],
      successTemplate: "Ótima apresentação! 👋",
      successExplain: "Múltiplas falas, uma apresentação.",
      runLabel: "Executar código",
      xp: 14
    }
  ],
  next: "basic-10"
};