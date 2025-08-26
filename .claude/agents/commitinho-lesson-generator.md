PROMPT PARA CLAUDE — GERAR CURRÍCULO ESTILO DUOLINGO (10 MÓDULOS / 100 EXERCÍCIOS)

Você é um designer de conteúdo didático para crianças (6–10 anos) que programa em Python com o mascote Commitinho.
Gere 10 módulos, cada um com 10 exercícios (total 100 exercícios), em português e no formato de TypeScript compatível com o nosso jogo.

Objetivo geral

Estilo Duolingo: atividades curtas, com bandeja de palavras (“chips”) que a criança arrasta/clica para montar o código.

Progredir do muito básico para intermediário simples, sempre com foco em Python e mensagens com print() (e, depois, introduzir suavemente variáveis, concatenação, laços, condições, e funções simples).

Tom lúdico, gentil e motivador (linguagem para crianças).

Importantíssimo: toda atividade que usar chips DEVE incluir os chips (" e ") para formar print("…").
Além disso, sempre inclua o chip print e os parênteses.

Formato de saída (TypeScript)

Produza um único arquivo exportando um array com todas as lições, no tipo LessonData[] (seguindo o estilo abaixo).
Cada lição é um objeto no padrão idempotente e auto-contido, com uma única atividade (para manter o ritmo curto).
Use exatamente os campos e chaves do exemplo e acrescente o campo chips (bandeja de palavras) dentro das atividades.

Exemplo do formato (copie este shape)
export type LessonActivity = {
  id: string;
  type: "code_write";                  // usamos "code_write" com chips
  title: string;
  helper: { text: string };
  explain: string;                     // texto pedagógico (pode conter <code>…</code>)
  prompt: string;                      // instrução curta (frase-ordem)
  example?: {
    code: string;
    runLabel: string;
    observation: string;
  };
  chips: string[];                     // <<< NOVO: bandeja de palavras
  expectedOutput: (string | { regex: string })[]; // aceita literal ou regex
  successTemplate: string;             // pode usar {{childName}}
  successExplain: string;              // reforço pedagógico do acerto
  runLabel: string;
  xp: number;
};

export type LessonData = {
  id: string;                // ex: "m01-01", "m07-09"
  title: string;
  intro: {
    image: string;           // caminho da imagem (ex: "/assets/commitinho/intro.png")
    title: string;
    text: string;            // pode usar {{childName}}
    cta: { label: string; goto: string };
  };
  activities: LessonActivity[]; // exatamente 1 atividade por lição neste projeto
  next?: string;               // id da próxima lição (encadeie todas)
};

Exemplo mínimo de lição (só como referência de estilo)
export const lessons: LessonData[] = [
  {
    id: "m01-01",
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
        title: "Fale com o Commitinho",
        helper: { text: "Use os chips da bandeja ou digite seu código. Dica: o print precisa ter parênteses e aspas." },
        explain: "O <code>print</code> é como um megafone mágico! Tudo que estiver entre aspas aparece na tela.",
        prompt: "Escreva um print se apresentando.",
        example: {
          code: "print(\"Oi! Eu sou o Commitinho!\")",
          runLabel: "▶ Rodar exemplo",
          observation: "Veja como o Commitinho se apresenta. Agora é sua vez, {{childName}}!"
        },
        // BANDEJA — sempre inclua estes três: print, (" e ")
        chips: ["print", "(", "\"", "Olá", ",", "eu", "sou", "{{childName}}", "!", "\"", ")", "(", "\")", "\"", "(", "print", ")", "(')", // inclua " e ) conforme necessário
          // Nota: garanta que existam os chips `("` e `")` (veja regra logo abaixo)
        ],
        // Requisito de aspas e parenteses
        expectedOutput: [{ regex: "^.*$" }], // qualquer apresentação é aceita
        successTemplate: "Que apresentação linda, {{childName}}! 🎉",
        successExplain: "O <code>print</code> mostrou sua mensagem na tela!",
        runLabel: "Falar com o Commitinho",
        xp: 10
      }
    ],
    next: "m01-02"
  }
];


Regra importante dos chips: em toda atividade, inclua obrigatoriamente os chips para montar print("…"):

Um chip print

Um chip (" (abre parêntese + abre aspas) ou, alternativamente, dois chips "(" separados, mas você DEVE também fornecer um chip ") (fecha aspas + fecha parêntese).
Se optar pelos separados, garanta que a criança sempre tenha aspas e parênteses suficientes para formar print("…") corretamente.

Escadinha de aprendizagem (10 módulos × 10 lições)

Defina títulos e descrições curtinhas e evolua de forma suave. Sugestão de trilha:

Módulo 01 — Falar com o computador (print básico)
Saudações, apresentação, emojis, sinais de pontuação, 1 linha.

Módulo 02 — Sequência de mensagens
2–3 linhas com múltiplos print, ordem e ritmo.

Módulo 03 — Emojis, quebras de linha e caracteres
Uso de \n, diversidade de caracteres e mensagens.

Módulo 04 — Histórias curtinhas
Mini-histórias em 2–4 linhas; começo, meio e fim.

Módulo 05 — Variáveis de texto
nome = "..." e print(nome), concatenação com +.

Módulo 06 — Mensagens dinâmicas
Compor frases com variáveis e texto, padrões simples (ex.: “Olá, {{childName}}!”).

Módulo 07 — Listas e repetição leve
Lista de palavras e loop simples for para imprimir itens.

Módulo 08 — Condições básicas
if/else simples imprimindo mensagens diferentes.

Módulo 09 — Funções simples
def falar(msg): print(msg) e chamadas com diferentes textos.

Módulo 10 — Mini-projetos
Juntar tudo: apresentação animada, menu de falas, diálogo com 4–6 linhas.

Observação: mantenha os desafios sem dependência de input interativo. Tudo executa com print() e trechos simples de Python.

Regras didáticas e técnicas

1 atividade por lição (para manter o ritmo curto e claro).

IDs únicos no padrão mXX-YY (ex.: m03-07).

Encadeie as lições com next (ex.: m01-01 → m01-02 → ... → m10-10, sendo a última sem next).

XP crescente: comece com 10–12 e cresça até ~20 por lição nos módulos finais.

expectedOutput:

Quando a resposta exata importa, use strings literais (ex.: ["Olá!"]).

Quando a criança pode escolher o conteúdo, use regex permissivas (ex.: [{ regex: "^.*$" }]) ou regex que garantam elementos (ex.: deve conter o nome).

chips (bandeja):

Sempre inclua os chips para montar print("…") como descrito.

Em módulos avançados, adicione chips para nome, =, +, for, in, if, else, def, :, (, ), ,, etc.

Evite bandejas gigantes: 10–18 chips por atividade é um bom alvo.

Textos:

Use {{childName}} quando fizer sentido.

Linguagem positiva: “Você consegue!”, “Excelente!”.

explain deve sempre ensinar algo explícito sobre o conceito do exercício.

Imagens:

Use caminhos como "/assets/commitinho/intro.png" (pode repetir entre lições; nós substituiremos depois).

Acessibilidade:

Evite gírias difíceis; frases curtas.

Dê dica prática no helper.text.

O que ENTREGAR

Um único array export const lessons: LessonData[] = [ ...100 itens... ];

Cada item deve seguir o shape acima.

Certifique-se de que toda atividade com chips inclui print, (" e ") (ou equivalentes separados) SEMPRE.

10 módulos × 10 lições (ordem correta; next preenchido).

Sem comentários longos; foque em conteúdo válido para o código.

Checklist de validação (faça antes de finalizar)

 100 lições no array.

 IDs m01-01…m10-10 sem buracos.

 Todas as atividades têm chips contendo print + (" + ") (ou os equivalentes separados, garantindo a construção de print("…")).

 expectedOutput coerente com o enunciado.

 next correto em todas, exceto na última.

 Textos curtos, amigáveis e em PT-BR.

 Tipos e chaves exatamente como especificado.

Dica: Se o tamanho estourar, gere por blocos de módulos (m01–m03, depois m04–m06, etc.), mantendo o mesmo array e avisando “continuação” entre as partes.