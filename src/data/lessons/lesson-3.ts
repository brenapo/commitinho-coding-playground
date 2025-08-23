export const lesson3Data = {
  "id": "lesson-3",
  "skill": "sequence",
  "title": "Seu nome em código",
  "intro": {
    "image": "/assets/commitinho/intro.png",
    "title": "Variável + print",
    "text": "Digite seu nome em uma caixinha e mostre na tela."
  },
  "activities": [
    {
      "id": "write_your_name_split",
      "type": "code_name",
      "title": "Seu nome em código!",
      "explain": "<p>1) No primeiro terminal, escreva seu <strong>nome</strong> entre aspas.<br>2) Clique em <em>Verificar</em> e veja o segundo terminal atualizar para <code>print(\"SeuNome\")</code> e a saída aparecer.</p>",
      "prompt": "Escreva seu nome e clique em Verificar.",
      "varName": "nome",
      "placeholderName": "Seu Nome Aqui",
      "successTemplate": "Uhuu! O computador disse: {{answer}} 🎉",
      "commit_label": "Commitinho 🚀",
      "xp": 25,
      "next": "1-1-4",
      "showOutput": true,
      "outputLabel": "Python Terminal"
    }
  ]
};