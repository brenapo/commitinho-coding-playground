export const lessonData = {
  id: "basic-10",
  title: "Checkpoint 1 (revisão)",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Checkpoint 1",
    text: "Três desafios rapidinhos: 1 fala, 3 ecos, e 2 linhas de cartaz!",
    cta: { label: "Iniciar Atividade", goto: "checkpoint_1" }
  },
  activities: [
    {
      id: "checkpoint_1",
      type: "code_write",
      title: "Checkpoint 1 (revisão)",
      helper: { text: "Três desafios rapidinhos: 1 fala, 3 ecos, e 2 linhas de cartaz!" },
      explain: "Complete os três desafios para mostrar que domina o <code>print</code>!",
      prompt: "Digite seu código nas linhas abaixo:",
      example: {
        code: "print(\"Teste!\")",
        runLabel: "▶ Rodar exemplo",
        observation: "Exemplo: pode repetir um exemplo curto que não resolva nenhuma subtarefa."
      },
      expectedOutput: [],
      successTemplate: "Você dominou o print! 🏆",
      successExplain: "Texto entre aspas vira fala. A ordem das linhas vira história.",
      runLabel: "Executar código",
      xp: 20
    }
  ],
  next: null
};