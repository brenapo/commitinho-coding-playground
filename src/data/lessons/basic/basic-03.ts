export const lessonData = {
  id: "basic-03",
  title: "Saudação ao Commitinho",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Saudação ao Commitinho",
    text: "Agora vamos fazer o computador dizer olá para o Commitinho.",
    cta: { label: "Iniciar Atividade", goto: "double_print" }
  },
  activities: [
    {
      id: "double_print",
      type: "code_write",
      title: "Saudação ao Commitinho",
      helper: { text: "Monte ou digite e depois clique em Executar para ver o computador falar!" },
      explain: "Use o <code>print</code> para fazer o computador falar <em>Olá, Commitinho</em>.",
      prompt: "Digite seu código nas linhas abaixo:",
      example: {
        code: "print(\"Olá, Commitinho\")",
        runLabel: "▶ Rodar exemplo"
      },
      starter: "print(\"Olá, Commitinho\")",
      expectedOutput: ["Olá, Commitinho"],
      successTemplate: "Uhuu! Você fez o computador dizer: Olá, Commitinho! 🎉",
      successExplain: "O print faz o computador falar exatamente o texto entre aspas.",
      runLabel: "Executar",
      xp: 12
    }
  ],
  next: "basic-04"
};