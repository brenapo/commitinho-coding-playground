export const lessonData = {
  id: "basic-06",
  title: "Show de emojis",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Show de emojis",
    text: "Emojis também são texto! Escolha e execute.",
    cta: { label: "Iniciar Atividade", goto: "show_emojis" }
  },
  activities: [
    {
      id: "show_emojis",
      type: "code_write",
      title: "Show de emojis",
      helper: { text: "Emojis também são texto! Escolha e execute." },
      explain: "Use o <code>print</code> para mostrar emojis na tela.",
      prompt: "Digite seu código nas linhas abaixo:",
      example: {
        code: "print(\"🎉\")",
        runLabel: "▶ Rodar exemplo",
        observation: "Exemplo: apenas para inspirar. Agora escolha seu emoji!"
      },
      expectedOutput: [],
      successTemplate: "Que emoji maneiro! 🌟",
      successExplain: "Tudo entre aspas aparece.",
      runLabel: "Executar código",
      xp: 10
    }
  ],
  next: "basic-07"
};