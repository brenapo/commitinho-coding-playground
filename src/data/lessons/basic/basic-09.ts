export const lessonData = {
  id: "basic-09",
  title: "Cartaz divertido",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Fazendo um cartaz",
    text: "Crie um cartaz com 4 linhas bem legais!",
    cta: { label: "Iniciar Atividade", goto: "fun_poster" }
  },
  activities: [
    {
      id: "fun_poster",
      type: "code_free",
      title: "Cartaz maneiro!",
      helper: { text: "4 prints criativos para fazer um cartaz legal! 📋" },
      explain: "<p>Exemplo de cartaz:</p><pre><code>print(\"=== FESTA DO COMMITINHO ===\")\nprint(\"🎉 Hoje às 15h 🎉\")\nprint(\"Tragam bananas!\")\nprint(\"=== Diversão garantida! ===\")</code></pre>",
      prompt: "Crie seu cartaz com 4 prints:",
      expectedRegex: "^(?:(?:\\s*print\\(.+\\)\\s*\\n)){4}$",
      successTemplate: "Que cartaz incrível! Todo mundo vai querer ver! 🎨",
      successExplain: "Vários prints seguidos criam um cartaz: cada linha é uma parte do cartaz.",
      runLabel: "Executar",
      xp: 15
    }
  ],
  next: "basic-10"
};