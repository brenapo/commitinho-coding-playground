export const lessonData = {
  id: "basic-10",
  title: "Grande Final: O Show do Commitinho",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Show do Commitinho",
    text: "Crie um mini show com 5 linhas usando print.",
    cta: { label: "Iniciar Atividade", goto: "commitinho_show" }
  },
  activities: [
    {
      id: "commitinho_show",
      type: "code_free",
      title: "Palco liberado!",
      helper: { text: "Capriche! 5 linhas, cada uma com um print. 🎤" },
      explain: "<p>Exemplo:</p><pre><code>print(\"🎤 Bem-vindos!\")\nprint(\"Commitinho chegou!\")\nprint(\"Aplausos!!! 👏\")\nprint(\"Banana time! 🍌\")\nprint(\"Boa noite!\")</code></pre>",
      prompt: "Escreva seu show com 5 prints:",
      expectedRegex: "^(?:(?:\\s*print\\(.+\\)\\s*\\n)){5}$",
      successTemplate: "Brilhou! O show ficou demais! 🚀",
      successExplain: "Você juntou tudo: várias falas, ordem certa e criatividade. Programar é contar histórias!",
      runLabel: "Executar",
      xp: 20
    }
  ],
  next: null
};