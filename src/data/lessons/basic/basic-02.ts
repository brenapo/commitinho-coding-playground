export const lessonData = {
  id: "basic-02",
  title: "Frutas falantes",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Frutas falantes",
    text: "Escolha uma fruta e faça o computador falar!",
    cta: { label: "Iniciar Atividade", goto: "frutas_falantes" }
  },
  activities: [
    {
      id: "frutas_falantes",
      type: "code_write",
      title: "Frutas falantes",
      helper: { text: "Escolha uma fruta e faça o computador falar!" },
      explain: "Use o <code>print</code> para fazer uma fruta se apresentar.",
      prompt: "Digite seu código nas linhas abaixo:",
      example: {
        code: "print(\"Uva!\")",
        runLabel: "▶ Rodar exemplo",
        observation: "Exemplo: apenas para inspirar. Agora escolha sua fruta!"
      },
      expectedOutput: [],
      successTemplate: "Sua fruta falou! 🍎",
      successExplain: "Strings viram fala.",
      runLabel: "Executar código",
      xp: 10
    }
  ],
  next: "basic-03"
};