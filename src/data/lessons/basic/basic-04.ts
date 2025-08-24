export const lessonData = {
  id: "basic-04",
  title: "Eco, eco, eco!",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Eco, eco, eco!",
    text: "Vamos criar um eco na caverna com três prints seguidos!",
    cta: { label: "Iniciar Atividade", goto: "triple_echo" }
  },
  activities: [
    {
      id: "triple_echo",
      type: "code_write",
      title: "Eco, eco, eco!",
      helper: { text: "Três prints com a palavra 'eco'. Clique em Executar para ouvir o eco!" },
      explain: "Escreva três <code>print(\"eco\")</code> seguidos.",
      prompt: "Escreva três print(\"eco\") seguidos:",
      example: {
        code: "print(\"Ecooo!\")",
        runLabel: "▶ Rodar exemplo",
        observation: "Exemplo: um grito na caverna. Agora faça o eco voltar 3 vezes."
      },
      expectedOutput: ["eco", "eco", "eco"],
      successTemplate: "Uhuu! Os três ecos voltaram! 🎉",
      successExplain: "Repetindo print, você repete a mensagem. Um print por linha = um eco por vez!",
      runLabel: "Executar código",
      xp: 15
    }
  ],
  next: "basic-05"
};