import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
const ROBOT_IMG = "/assets/robocorreio/robot.png";
const FACE_DEG: Record<Dir, number> = { E: 0, N: -90, W: 180, S: 90 };


/** ------ Tipos ------ */
type Dir = "N" | "E" | "S" | "W";
type Cmd = "FRENTE" | "ESQ" | "DIR" | "PEGAR" | "ENTREGAR";
type Cell = { x: number; y: number };
type Level = {
  id: string;
  width: number;
  height: number;
  start: { x: number; y: number; dir: Dir };
  letter: Cell;
  mailbox: Cell;
  walls?: Cell[];
  maxSteps: number;
  allowRepeat: boolean;
};

/** ------ Nível 1 (Sequência) ------ */
const LEVELS: Record<string, Level> = {
  "1": {
    id: "1",
    width: 5,
    height: 5,
    start: { x: 0, y: 4, dir: "E" },
    letter: { x: 2, y: 4 },
    mailbox: { x: 4, y: 4 },
    walls: [],
    maxSteps: 10,
    allowRepeat: true, // repetição “expande” passos ao adicionar
  },
};

function rotate(dir: Dir, side: "L" | "R"): Dir {
  const order: Dir[] = ["N", "E", "S", "W"];
  const i = order.indexOf(dir);
  return side === "L" ? order[(i + 3) % 4] : order[(i + 1) % 4];
}
function stepForward(x: number, y: number, dir: Dir): Cell {
  if (dir === "N") return { x, y: y - 1 };
  if (dir === "S") return { x, y: y + 1 };
  if (dir === "E") return { x: x + 1, y };
  return { x: x - 1, y };
}
const same = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y;

/** UI pill botão */
function CmdButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-2 rounded-xl border-commitinho-surface-2 text-commitinho-text hover:bg-commitinho-surface-2 text-sm"
    >
      {label}
    </Button>
  );
}

/** ------ Página do jogo ------ */
export default function RoboCorreioGame() {
  const navigate = useNavigate();
  const { levelId = "1" } = useParams();
  const level = LEVELS[levelId] ?? LEVELS["1"];

  const [program, setProgram] = useState<Cmd[]>([]);
  const [repeatCount, setRepeatCount] = useState<number>(1);
  const [playing, setPlaying] = useState(false);
  const [showWin, setShowWin] = useState(false);

  // estado de simulação
  const [pos, setPos] = useState<Cell>(level.start);
  const [dir, setDir] = useState<Dir>(level.start.dir);
  const [hasLetter, setHasLetter] = useState(false);
  const [delivered, setDelivered] = useState(false);

  // reset quando troca de nível
  useEffect(() => {
    resetSim();
  }, [levelId]);

  function resetSim() {
    setProgram([]);
    setRepeatCount(1);
    setPlaying(false);
    setShowWin(false);
    setPos({ x: level.start.x, y: level.start.y });
    setDir(level.start.dir);
    setHasLetter(false);
    setDelivered(false);
  }

  /** adicionar comandos (com repetição expandida) */
  function addCmd(cmd: Cmd) {
    const toAdd = Array(Math.max(1, repeatCount)).fill(cmd);
    setProgram((p) =>
      (p.length + toAdd.length <= level.maxSteps ? [...p, ...toAdd] : p)
    );
  }
  function removeLast() {
    setProgram((p) => p.slice(0, -1));
  }

  /** rodar passo-a-passo */
  const timer = useRef<number | null>(null);
  function run() {
    if (playing || program.length === 0) return;
    // reseta sim para rodar do começo
    setPos({ x: level.start.x, y: level.start.y });
    setDir(level.start.dir);
    setHasLetter(false);
    setDelivered(false);

    setPlaying(true);
    let i = 0;

    const tick = () => {
      const cmd = program[i];
      if (!cmd) {
        setPlaying(false);
        if (deliveredRef.current) {
          setShowWin(true);
        }
        return;
      }
      doStep(cmd);
      i++;
      timer.current = window.setTimeout(tick, 550);
    };

    timer.current = window.setTimeout(tick, 300);
  }
  function stop() {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setPlaying(false);
  }

  const posRef = useRef(pos);
  const dirRef = useRef(dir);
  const hasLetterRef = useRef(hasLetter);
  const deliveredRef = useRef(delivered);
  useEffect(() => {
    posRef.current = pos;
    dirRef.current = dir;
    hasLetterRef.current = hasLetter;
    deliveredRef.current = delivered;
  }, [pos, dir, hasLetter, delivered]);

  function doStep(cmd: Cmd) {
    const { x, y } = posRef.current;
    const d = dirRef.current;

    if (cmd === "ESQ") setDir(rotate(d, "L"));
    if (cmd === "DIR") setDir(rotate(d, "R"));
    if (cmd === "FRENTE") {
      const n = stepForward(x, y, d);
      // bloqueios: fora do tabuleiro ou parede
      const out =
        n.x < 0 || n.y < 0 || n.x >= level.width || n.y >= level.height;
      const hitWall = (level.walls ?? []).some((w) => same(w, n));
      if (!out && !hitWall) setPos(n);
    }
    if (cmd === "PEGAR") {
      if (same(posRef.current, level.letter)) setHasLetter(true);
    }
    if (cmd === "ENTREGAR") {
      if (hasLetterRef.current && same(posRef.current, level.mailbox)) {
        setDelivered(true);
      }
    }
  }

  /** célula → conteúdo visual */
  const grid = useMemo(() => {
    const cells = [];
    for (let yy = 0; yy < level.height; yy++) {
      for (let xx = 0; xx < level.width; xx++) {
        const here = { x: xx, y: yy };
        const isWall = (level.walls ?? []).some((w) => same(w, here));
        const isLetter = same(here, level.letter) && !hasLetter;
        const isMailbox = same(here, level.mailbox);
        const isRobot = same(here, pos);

        cells.push(
  <div
    key={`${xx}-${yy}`}
    className={`relative border border-white/10 rounded-md flex items-center justify-center ${
      isWall ? "bg-white/10" : "bg-white/5"
    }`}
    style={{ aspectRatio: "1 / 1", minHeight: 56 }}   // 👈 garante que o quadrado apareça
  >
    {isLetter && <span className="text-lg">✉️</span>}
    {isMailbox && <span className="text-lg">📮</span>}
    {isRobot && (
  <img
    src={ROBOT_IMG}
    alt="Robô"
    title={dir}
    className="select-none pointer-events-none"
    style={{
      width: "70%",          // se quiser maior/menor, ajuste aqui
      transform: `rotate(${FACE_DEG[dir]}deg)`,
      transformOrigin: "50% 50%",
      imageRendering: "auto", // deixe nítido
    }}
  />
)}

  </div>
);

      }
    }
    return cells;
  }, [level, pos, hasLetter]);

  return (
    <div className="min-h-screen bg-commitinho-bg px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-commitinho-text">
              Robo-Correio do Commitinho
            </h1>
            <p className="text-commitinho-text-soft">
              Programe o robô para pegar ✉️ e entregar em 📮
            </p>
          </div>
          <Badge className="bg-primary text-primary-foreground">Sequência</Badge>
        </div>

        <Card className="bg-commitinho-surface border-commitinho-surface-2">
          <CardHeader>
            <CardTitle className="text-commitinho-text">
              Nível {level.id} • Plano de comandos
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-[1fr_320px] gap-6">
            {/* Board */}
            <div>
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${level.width}, minmax(0, 1fr))`,
                }}
              >
                {grid}
              </div>
            </div>

            {/* Programmer */}
            <div className="space-y-4">
              <div className="rounded-xl p-3 border border-commitinho-surface-2 bg-commitinho-surface-1">
                <div className="text-sm mb-2 text-commitinho-text-soft">
                  Paleta de comandos
                </div>
                <div className="flex flex-wrap gap-2">
                  <CmdButton label="↑ Frente" onClick={() => addCmd("FRENTE")} disabled={playing}/>
                  <CmdButton label="↺ Virar Esq." onClick={() => addCmd("ESQ")} disabled={playing}/>
                  <CmdButton label="↻ Virar Dir." onClick={() => addCmd("DIR")} disabled={playing}/>
                  <CmdButton label="📬 Pegar" onClick={() => addCmd("PEGAR")} disabled={playing}/>
                  <CmdButton label="📦 Entregar" onClick={() => addCmd("ENTREGAR")} disabled={playing}/>
                </div>

                {level.allowRepeat && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-commitinho-text-soft">Repetir próximo comando:</span>
                    <input
                      type="number"
                      min={1}
                      max={9}
                      value={repeatCount}
                      onChange={(e)=>setRepeatCount(Math.max(1, Math.min(9, Number(e.target.value))))}
                      className="w-16 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-commitinho-text"
                    />
                    <span className="text-sm text-commitinho-text-soft">vezes</span>
                  </div>
                )}
              </div>

              <div className="rounded-xl p-3 border border-commitinho-surface-2 bg-commitinho-surface-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-commitinho-text-soft">
                    Programa ({program.length}/{level.maxSteps})
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="h-8 px-3" onClick={removeLast} disabled={playing || program.length===0}>
                      <Trash2 className="h-4 w-4 mr-1"/> Remover último
                    </Button>
                    <Button variant="outline" className="h-8 px-3" onClick={resetSim} disabled={playing}>
                      <RotateCcw className="h-4 w-4 mr-1"/> Limpar
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {program.map((c, i) => (
                    <Badge key={i} className="bg-white/10 text-commitinho-text border border-white/10">
                      {c === "FRENTE" ? "↑ Frente" :
                       c === "ESQ" ? "↺ Esq." :
                       c === "DIR" ? "↻ Dir." :
                       c === "PEGAR" ? "📬 Pegar" : "📦 Entregar"}
                    </Badge>
                  ))}
                  {program.length === 0 && (
                    <span className="text-sm text-commitinho-text-soft">
                      Dica: clique nos botões acima para montar a sequência.
                    </span>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  {!playing ? (
                    <Button onClick={run} disabled={program.length===0} className="bg-gradient-arcade text-white">
                      <Play className="h-4 w-4 mr-2" /> Executar
                    </Button>
                  ) : (
                    <Button variant="secondary" onClick={stop}>Parar</Button>
                  )}
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
              Entrega concluída!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-center">
            <p className="text-commitinho-text-soft">
              O robô pegou a carta e entregou na caixa de correio. Muito bem!
            </p>
            <Button
              className="bg-gradient-arcade text-white"
              onClick={() => {
                setShowWin(false);
                navigate("/aventura"); // ou para o próximo nível quando existir
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
