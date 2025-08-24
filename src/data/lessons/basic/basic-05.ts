export const lessonData = {
  id: "basic-05",
  title: "História engraçada",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Conte uma história",
    text: "Crie uma mini história com 3 linhas!",
    cta: { label: "Iniciar Atividade", goto: "funny_story" }
  },
  activities: [
    {
      id: "funny_story",
      type: "code_free",
      title: "Mini história!",
      helper: { text: "3 prints, uma história divertida. Seja criativo! ✨" },
      explain: "<p>Exemplo:</p><pre><code>print(\"Era uma vez...\")\nprint(\"Um robô dançarino\")\nprint(\"Que adorava pizza!\")</code></pre>",
      prompt: "Conte sua história com 3 prints:",
      expectedRegex: "^(?:(?:\\s*print\\(.+\\)\\s*\\n)){3}$",
      successTemplate: "Que história legal! Você tem talento! 📚",
      successExplain: "Várias linhas de print viram uma historinha. Cada print é uma parte da história.",
      runLabel: "Executar",
      xp: 14
    }
  ],
  next: "basic-06"
};