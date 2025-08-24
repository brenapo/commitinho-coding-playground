export const lessonData = {
  id: "basic-02",
  title: "Frutas falantes",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Escolha sua fruta favorita",
    text: "Faça o computador falar o nome de uma fruta deliciosa!",
    cta: { label: "Iniciar Atividade", goto: "fruit_speak" }
  },
  activities: [
    {
      id: "fruit_speak",
      type: "code_fill",
      title: "Frutas falantes!",
      helper: { text: "Qualquer fruta pode falar no nosso computador! 🍎" },
      explain: "<p>Escolha uma fruta e faça ela se apresentar:</p>",
      prompt: "Qual fruta vai falar hoje?",
      starter: "print(\"____\")",
      choices: ["Maçã!", "Banana!", "Laranja!"],
      solutions: ["Maçã!", "Banana!", "Laranja!"],
      successTemplate: "A {{answer}} falou! Que legal! 🍌",
      successExplain: "Texto entre aspas é chamado de string. Com print, a string vira fala do computador.",
      runLabel: "Executar",
      xp: 10
    }
  ],
  next: "basic-03"
};