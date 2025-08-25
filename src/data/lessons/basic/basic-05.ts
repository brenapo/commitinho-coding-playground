export const lessonData = {
  id: "basic-05",
  title: "História de 1 linha",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "História de 1 linha",
    text: "Crie uma mini-história com um único print.",
    cta: { label: "Iniciar Atividade", goto: "one_line_story" }
  },
  activities: [
    {
      id: "one_line_story",
      type: "code_write",
      title: "História de 1 linha",
      helper: { text: "Monte ou digite sua frase e clique em Executar para ver sua história!" },
      explain: "Use o <code>print</code> para contar uma mini-história em uma única linha.",
      prompt: "Digite seu código nas linhas abaixo:",
      example: {
        code: "print(\"Era uma vez...\")",
        runLabel: "▶ Rodar exemplo",
        observation: "Exemplo: só um começo. Agora escreva sua própria história!"
      },
      expectedOutput: [],
      successTemplate: "Que história legal! 📚",
      successExplain: "Um print já conta uma micro-história.",
      runLabel: "Executar código",
      xp: 12
    }
  ],
  next: "basic-06"
};