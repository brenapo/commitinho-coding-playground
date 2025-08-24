export const lessonData = {
  id: "basic-04",
  title: "Eco 3x",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Fazendo eco",
    text: "Vamos fazer eco três vezes seguidas!",
    cta: { label: "Iniciar Atividade", goto: "echo_three" }
  },
  activities: [
    {
      id: "echo_three",
      type: "code_write",
      title: "Eco, eco, eco!",
      helper: { text: "Três prints com a palavra 'eco'. Vai ecoar muito! 📢" },
      explain: "<p>Escreva três <code>print(\"eco\")</code> seguidos:</p>",
      prompt: "Faça o eco acontecer 3 vezes:",
      expectedOutput: ["eco", "eco", "eco"],
      successTemplate: "Eco perfeito! Três vezes certinho! 🔊",
      successExplain: "Repetindo print, você repete a mensagem. Um print por linha = um eco por vez!",
      runLabel: "Executar",
      xp: 12
    }
  ],
  next: "basic-05"
};