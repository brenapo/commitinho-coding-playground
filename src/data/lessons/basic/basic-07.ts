export const lessonData = {
  id: "basic-07",
  title: "Cartaz do Commitinho FC",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Cartaz do Commitinho FC",
    text: "Monte um cartaz animado para o time do Commitinho!",
    cta: { label: "Iniciar Atividade", goto: "cartaz_divertido" }
  },
  activities: [
    {
      id: "cartaz_divertido",
      type: "code_write",
      title: "Cartaz do Commitinho FC",
      helper: { text: "Monte um cartaz criativo para o time!" },
      explain: "Use <code>print</code> para criar um cartaz do Commitinho FC.",
      prompt: "Digite seu código nas linhas abaixo:",
      example: {
        code: "print(\"⚽ Vamos Commitinho! ⚽\")",
        runLabel: "▶ Rodar exemplo",
        observation: "Exemplo: um cartaz simples. Agora faça o seu!"
      },
      expectedOutput: [],
      successTemplate: "Que cartaz animado! ⚽",
      successExplain: "O Commitinho FC está pronto para o jogo!",
      runLabel: "Executar código",
      xp: 14
    }
  ],
  next: "basic-08"
};