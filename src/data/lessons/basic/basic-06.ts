export const lessonData = {
  id: "basic-06",
  title: "Show de emojis",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Emojis divertidos",
    text: "Escolha um emoji especial para mostrar!",
    cta: { label: "Iniciar Atividade", goto: "emoji_show" }
  },
  activities: [
    {
      id: "emoji_show",
      type: "code_fill",
      title: "Emoji especial!",
      helper: { text: "Emojis deixam tudo mais divertido! 😊" },
      explain: "<p>Escolha um emoji legal para o computador mostrar:</p>",
      prompt: "Qual emoji você quer ver?",
      starter: "print(\"____\")",
      choices: ["🚀", "😂", "🍕"],
      solutions: ["🚀", "😂", "🍕"],
      successTemplate: "{{answer}} Que emoji maneiro! 🌟",
      successExplain: "Emojis também são texto! Se estiverem entre aspas, o print mostra direitinho.",
      runLabel: "Executar",
      xp: 10
    }
  ],
  next: "basic-07"
};