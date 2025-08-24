export const lessonData = {
  id: "basic-08",
  title: "Aviso de robô",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Robô acordando",
    text: "O robô precisa avisar que está acordado!",
    cta: { label: "Iniciar Atividade", goto: "robot_awake" }
  },
  activities: [
    {
      id: "robot_awake",
      type: "code_write",
      title: "Robô acordado!",
      helper: { text: "O robô quer dizer: Estou acordado! 🤖" },
      explain: "<p>Faça o robô falar que está acordado com <code>print(\"Estou acordado!\")</code>:</p>",
      prompt: "Acorde o robô:",
      expectedOutput: ["Estou acordado!"],
      successTemplate: "O robô acordou! Bom dia! 🌅",
      successExplain: "Você pode imaginar que o computador fala. O print transforma sua frase na voz dele.",
      runLabel: "Executar",
      xp: 12
    }
  ],
  next: "basic-09"
};