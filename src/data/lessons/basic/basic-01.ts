export const lessonData = {
  id: "basic-01",
  title: "Primeira fala",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Primeira fala",
    text: "Aprenda a fazer o computador falar pela primeira vez!",
    cta: { label: "Iniciar Atividade", goto: "primeira_fala" }
  },
  activities: [
    {
      id: "primeira_fala",
      type: "code_write",
      title: "Primeira fala",
      helper: { text: "Escreva uma fala e clique em Executar. Tudo que fica entre aspas aparece!" },
      explain: "Use o <code>print</code> para fazer o computador falar.",
      prompt: "Digite seu código nas linhas abaixo:",
      example: {
        code: "print(\"Oi!\")",
        runLabel: "▶ Rodar exemplo",
        observation: "Exemplo: apenas para inspirar. Agora faça sua primeira fala!"
      },
      expectedOutput: [],
      successTemplate: "Você fez o computador falar! 🎉",
      successExplain: "Tudo que fica entre aspas aparece na tela.",
      runLabel: "Executar código",
      xp: 10
    }
  ],
  next: "basic-02"
};