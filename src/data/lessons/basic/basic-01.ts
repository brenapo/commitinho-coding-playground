export const lessonData = {
  id: "basic-01",
  title: "Primeira palavra",
  intro: {
    image: "/assets/commitinho/intro.png",
    title: "Primeiros passos no Terminal",
    text: "Complete o print escolhendo uma palavra. Qualquer uma funciona!",
    cta: { label: "Iniciar Atividade", goto: "say_anything" }
  },
  activities: [
    {
      id: "say_anything",
      type: "code_fill",
      title: "Seu primeiro código!",
      helper: { text: "Dica: tudo que ficar entre aspas aparece na tela. ✨" },
      explain: "<h4 class='font-semibold text-lg mb-2'>O que é o print?</h4><p>É como pedir para o computador <strong>falar</strong>.</p>",
      prompt: "Escolha o texto para colocar entre aspas:",
      starter: "print(\"____\")",
      choices: ["Olá!", "Banana!", "Commitinho!"],
      solutions: ["Olá!", "Banana!", "Commitinho!"],
      successTemplate: "Uhuu! Você fez o computador dizer: {{answer}} 🎉",
      successExplain: "Você usou print para o computador falar. Tudo que fica entre aspas aparece na tela!",
      runLabel: "Executar",
      xp: 10
    }
  ],
  next: "basic-02"
};