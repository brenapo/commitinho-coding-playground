export const lessonData = {
  id: "basic-01",
  title: "Apresentação para o Commitinho",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Apresentação para o Commitinho",
    text: "Olá, {{childName}}! Que tal se apresentar para o Commitinho? Vamos aprender como fazer o computador falar!",
    cta: { label: "Iniciar Atividade", goto: "primeira_fala" }
  },
  activities: [
    {
      id: "primeira_fala",
      type: "code_write",
      title: "Apresentação para o Commitinho",
      helper: { text: "Use os chips da bandeja ou digite seu código. Clique em Executar para ver a mágica! 💡 Dica: o print sempre tem que abrir com (\" e fechar com \") para o computador entender." },
      explain: "O <code>print</code> é como um megafone mágico! Tudo que você colocar entre aspas vai aparecer na tela para o Commitinho ver. É assim que nos apresentamos para o computador, {{childName}}!",
      prompt: "Se apresente para o Commitinho:",
      example: {
        code: "print(\"Oi! Eu sou o Commitinho!\")",
        runLabel: "▶ Rodar exemplo",
        observation: "Veja como o Commitinho se apresenta! Agora é sua vez, {{childName}}!"
      },
      expectedOutput: [],
      successTemplate: "Que apresentação linda, {{childName}}! O Commitinho ficou muito feliz em te conhecer! 🎉",
      successExplain: "Agora o Commitinho sabe quem você é! O print mostrou sua mensagem na tela.",
      runLabel: "Falar com o Commitinho",
      xp: 10
    }
  ],
  next: "basic-02"
};