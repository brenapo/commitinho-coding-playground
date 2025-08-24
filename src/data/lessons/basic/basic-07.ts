export const lessonData = {
  id: "basic-07",
  title: "Mensagem secreta",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Segredo revelado",
    text: "Hora de revelar o segredo especial!",
    cta: { label: "Iniciar Atividade", goto: "secret_message" }
  },
  activities: [
    {
      id: "secret_message",
      type: "code_write",
      title: "Segredo revelado!",
      helper: { text: "Digite exatamente: Segredo revelado! 🤫" },
      explain: "<p>Revele o segredo escrevendo <code>print(\"Segredo revelado!\")</code>:</p>",
      prompt: "Revele o segredo:",
      expectedOutput: ["Segredo revelado!"],
      successTemplate: "O segredo foi revelado! Muito bem! 🔓",
      successExplain: "O print mostra exatamente o que você escrever entre aspas. Capriche na mensagem!",
      runLabel: "Executar",
      xp: 12
    }
  ],
  next: "basic-08"
};