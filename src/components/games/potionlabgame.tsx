import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { FlaskConical } from "lucide-react";

/** ---------- Tipos e domínio ---------- */
type Ingredient = "MORANGO" | "MIRTILO" | "FOLHA";
type Action = "MEXER" | "AQUECER";
type Color = "ROSA" | "LARANJA" | "SEM_COR";

type Level = {
  id: string;
  start: Ingredient[];   // ingredientes já no caldeirão ao começar
  targetColor: Color;    // cor esperada no final
  hint?: string;
};

const ING_EMOJI: Record<Ingredient, string> = {
  MORANGO: "🍓",
  MIRTILO: "🫐",
  FOLHA: "🌿",
};

const ACTION_LABEL: Record<Action, string> = {
  MEXER: "Mexer",
  AQUECER: "Aquecer",
};

const COLOR_NAME: Record<Color, string> = {
  ROSA: "Rosa",
  LARANJA: "Laranja",
  SEM_COR: "Sem cor",
};

/** ---------- Nível 1 (Se/Então básico) ----------
 * Regra correta para vencer N1:
 *  - Se tiver MORANGO → MEXER (fica ROSA)
 *  - Senão           → AQUECER (fica LARANJA)
 */
const LEVELS: Record<string, Level> = {
  "1": {
    id: "1",
    start: ["MORANGO"],
    targetColor: "ROSA",
    hint:
      "Dica: Tem 🍓 morango? **Mexer**. Se não, **Aquecer**."
  },
};

/** Calcula a “cor” resultante com base nos ingredientes e ação escolhida. */
function resolveColor(ings: Ingredient[], action: Action): Color {
  const hasMorango = ings.includes("MORANGO");
  if (action === "MEXER" && hasMorango) return "ROSA";
  if (action === "AQUECER" && !hasMorango) return "LARANJA";
  return "SEM_COR";
}

/** ------- Helpers para o “terminal” ------- */
function toLowerWord(i: Ingredient): string {
  return i.toLowerCase(); // "MORANGO" -> "morango"
}
function actionToPython(a: Action | null): string {
  if (!a) return "___";
  return a === "MEXER" ? "mexer()" : "aquecer()";
}
function makePythonCode(condIng: Ingredient, thenAction: Action | null, elseAction: Action | null) {
  return [
    "# Programa",
    `if ingrediente == "${toLowerWord(condIng)}":`,
    `    ${actionToPython(thenAction)}`,
    `else:`,
    `    ${actionToPython(elseAction)}`,
  ].join("\n");
}

export default function PotionLabGame() {
  const navigate = useNavigate();
  const { levelId = "1" } = useParams();
  const level = LEVELS[levelId] ?? LEVELS["1"];

  // bloco de programa (um IF único no N1)
  const [condIng, setCondIng] = useState<Ingredient>("MORANGO");
  const [thenAction, setThenAction] = useState<Action | null>(null);
  const [elseAction, setElseAction] = useState<Action | null>(null);

  const [playing, setPlaying] = useState(false);
  const [resultColor, setResultColor] = useState<Color | null>(null);
  const [showWin, setShowWin] = useState(false);

  function resetAll() {
    setCondIng("MORANGO");
    setThenAction(null);
    setElseAction(null);
    setPlaying(false);
    setResultColor(null);
    setShowWin(false);
  }

  function run() {
    if (playing) return;
    if (!thenAction || !elseAction) {
      toast("Complete sua regra: escolha ações para 'Então' e 'Senão'.", {
        duration: 2000,
      });
      return;
    }
    setPlaying(true);

    // aplica o IF no “caldeirão”
    const hasCond = level.start.includes(condIng);
    const chosen = hasCond ? thenAction : elseAction;
    const color = resolveColor(level.start, chosen);
    setResultColor(color);

    // feedback
    if (color === level.targetColor) {
      setTimeout(() => {
        setPlaying(false);
        setShowWin(true);
      }, 250);
    } else {
      setTimeout(() => {
        setPlaying(false);
        toast(
          `Quase! Sua poção ficou ${COLOR_NAME[color]}. A receita pede ${COLOR_NAME[level.targetColor]}.`,
          { duration: 2200 }
        );
      }, 250);
    }
  }

  const pythonCode = makePythonCode(condIng, thenAction, elseAction);

  const beaker = useMemo(() => {
    // desenha o caldeirão/frasco com “cor”
    const bg =
      resultColor === "ROSA"
        ? "bg-pink-500/60"
        : resultColor === "LARANJA"
        ? "bg-orange-500/60"
        : "bg-white/10";
    return (
      <div className="relative w-full aspect-square max-w-[360px] mx-auto">
        <div className={`absolute inset-0 rounded-3xl border border-white/10 ${bg} backdrop-blur-sm flex items-center justify-center`}>
          <div className="text-5xl select-none">
            {level.start.map((i) => ING_EMOJI[i]).join(" ")}
          </div>
        </div>
      </div>
    );
  }, [level.start, resultColor]);

  return (
    <div className="min-h-screen bg-commitinho-bg px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="text-commitinho-text" />
            <h1 className="text-2xl font-bold text-commitinho-text">Laboratório de Poções</h1>
          </div>
          <Badge className="bg-commitinho-success text-commitinho-success-foreground">Se/Então</Badge>
        </div>

        <Card className="bg-commitinho-surface border-commitinho-surface-2">
          <CardHeader>
            <CardTitle className="text-commitinho-text">
              Nível {level.id} • Monte sua regra
            </CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-[1fr_380px] gap-6">
            {/* Bancada / Caldeirão */}
            <div className="space-y-4">
              <div className="rounded-xl p-4 border border-commitinho-surface-2 bg-commitinho-surface-1">
                <div className="text-sm text-commitinho-text-soft mb-2">Caldeirão</div>

                {/* Objetivo curtinho */}
                <div className="mb-3 text-xs text-commitinho-text-soft">
                  🎯 <b>Objetivo:</b> deixar a poção <b>{COLOR_NAME[level.targetColor]}</b>.
                </div>

                {beaker}

                <div className="mt-3 text-center text-commitinho-text-soft text-sm">
                  Ingredientes:{" "}
                  {level.start.map((i) => (
                    <Badge key={i} className="mx-1 bg-white/10 text-commitinho-text border-white/10">
                      {ING_EMOJI[i]} {i.charAt(0) + i.slice(1).toLowerCase()}
                    </Badge>
                  ))}
                </div>
              </div>

              {level.hint && (
                <div className="rounded-xl p-3 border border-commitinho-surface-2 bg-commitinho-surface-1 text-sm text-commitinho-text-soft">
                  💡 {level.hint}
                </div>
              )}
            </div>

            {/* Programador – “terminal” de if/else */}
            <div className="space-y-4">
              <div className="rounded-xl p-3 border border-commitinho-surface-2 bg-commitinho-surface-1">
                <div className="text-sm text-commitinho-text-soft mb-2">Bloco Se/Então</div>

                {/* Se (If) */}
                <div className="mb-3">
                  <div className="text-xs uppercase tracking-wide text-commitinho-text-soft mb-2">Se (If)</div>
                  <div className="flex gap-2 flex-wrap">
                    {(Object.keys(ING_EMOJI) as Ingredient[]).map((ing) => (
                      <Button
                        key={ing}
                        variant={condIng === ing ? "default" : "outline"}
                        className={`h-8 px-3 ${
                          condIng === ing
                            ? "bg-primary text-primary-foreground"
                            : "border-commitinho-surface-2 text-commitinho-text"
                        }`}
                        onClick={() => setCondIng(ing)}
                        disabled={playing}
                      >
                        {ING_EMOJI[ing]} {ing.charAt(0) + ing.slice(1).toLowerCase()}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Então (Then) */}
                <div className="mb-3">
                  <div className="text-xs uppercase tracking-wide text-commitinho-text-soft mb-2">Então (Then)</div>
                  <div className="flex gap-2 flex-wrap">
                    {(["MEXER", "AQUECER"] as Action[]).map((a) => (
                      <Button
                        key={a}
                        variant={thenAction === a ? "default" : "outline"}
                        className={`h-8 px-3 ${
                          thenAction === a
                            ? "bg-primary text-primary-foreground"
                            : "border-commitinho-surface-2 text-commitinho-text"
                        }`}
                        onClick={() => setThenAction(a)}
                        disabled={playing}
                      >
                        {ACTION_LABEL[a]}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Senão (Else) */}
                <div>
                  <div className="text-xs uppercase tracking-wide text-commitinho-text-soft mb-2">Senão (Else)</div>
                  <div className="flex gap-2 flex-wrap">
                    {(["MEXER", "AQUECER"] as Action[]).map((a) => (
                      <Button
                        key={a}
                        variant={elseAction === a ? "default" : "outline"}
                        className={`h-8 px-3 ${
                          elseAction === a
                            ? "bg-primary text-primary-foreground"
                            : "border-commitinho-surface-2 text-commitinho-text"
                        }`}
                        onClick={() => setElseAction(a)}
                        disabled={playing}
                      >
                        {ACTION_LABEL[a]}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Terminal com código Python */}
                <div className="mt-4 rounded-xl border border-white/10 overflow-hidden">
                  <div className="px-3 py-2 bg-white/5 border-b border-white/10 text-xs text-commitinho-text-soft">
                    Python Terminal
                  </div>
                  <pre className="p-4 bg-[#0f172a] text-[#a6e3a1] font-mono text-sm leading-6 whitespace-pre-wrap">
{pythonCode}
                  </pre>
                  <div className="flex items-center gap-2 p-3 bg-white/5 border-t border-white/10">
                    <Button onClick={run} disabled={playing} className="bg-gradient-arcade text-white">
                      ▶ Executar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetAll}
                      disabled={playing}
                      className="border-commitinho-surface-2"
                    >
                      ↺ Limpar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigator.clipboard?.writeText(pythonCode)}
                      className="ml-auto border-white/10 text-commitinho-text"
                      title="Copiar código"
                    >
                      ⧉ Copiar código
                    </Button>
                  </div>
                </div>

                {/* Glossário curtinho */}
                <div className="mt-3 text-xs text-commitinho-text-soft grid gap-1.5">
                  <div><b>Se (If)</b>: quando isso for verdade…</div>
                  <div><b>Então (Then)</b>: faça esta ação.</div>
                  <div><b>Senão (Else)</b>: se não for verdade, faça outra ação.</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de vitória */}
      <Dialog open={showWin} onOpenChange={setShowWin}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="text-5xl mb-2">🎉</div>
              Poção perfeita!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-center">
            <p className="text-commitinho-text-soft">
              Sua regra funcionou. A poção ficou {COLOR_NAME[level.targetColor]}!
            </p>
            <Button
  className="bg-gradient-arcade text-white"
  onClick={() => {
    setShowWin(false);
    const seen = localStorage.getItem("potion_ifelse_intro_seen") === "1";
    if (!seen && (levelId === "1" || level.id === "1")) {
      // mostra a intro após o Nível 1, só uma vez
      navigate("/jogo/pocoes/intro");
    } else {
      // 👉 quando o Nível 2 existir, troque para navigate("/jogo/pocoes/2")
      navigate("/jogos");
    }
  }}
>
  Commitinho 🚀
</Button>


          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
1