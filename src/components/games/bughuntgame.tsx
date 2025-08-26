import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RefreshCw, Play, Pause, Bug } from "lucide-react";

/**
 * Commitinho: Caça aos Bugs — Side Scroller (protótipo simples)
 * Controles:
 * - ← → mover  ·  ↑/Espaço pular (quando rodando)
 * - Espaço: começa/retoma; na tela de game over: reinicia e já começa
 * - P: pausar/retomar
 * - R: reiniciar
 */

type Enemy = { id: number; x: number; y: number; w: number; h: number; alive: boolean };
type GameState = "ready" | "running" | "win" | "gameover";

const WIDTH = 960;
const HEIGHT = 360;
const GROUND_Y = HEIGHT - 64;
const GRAVITY = 0.9;
const MOVE_SPEED = 3.0;
const JUMP_VELOCITY = -14;

// 🔵 tamanho consistente do player
const PLAYER_W = 80;
const PLAYER_H = 90;

export default function BugHuntArcade() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reqRef = useRef<number | null>(null);

  // Player
  const player = useRef({
    x: 64,
    y: GROUND_Y - PLAYER_H,
    w: PLAYER_W,
    h: PLAYER_H,
    vx: 0,
    vy: 0,
    onGround: true,
    facing: 1 as 1 | -1,
  });
  const prevY = useRef(player.current.y);

  // Inimigos
  const [enemies, setEnemies] = useState<Enemy[]>([
    { id: 1, x: 380, y: GROUND_Y - 40, w: 50, h: 40, alive: true },
    { id: 2, x: 620, y: GROUND_Y - 40, w: 50, h: 40, alive: true },
    { id: 3, x: 800, y: GROUND_Y - 40, w: 50, h: 40, alive: true },
  ]);

  // Sprite do Commitinho
  const commitinhoImg = useRef<HTMLImageElement | null>(null);
  const [imgReady, setImgReady] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = "/assets/bughuntgame/commitinho.png";
    img.onload = () => setImgReady(true);
    commitinhoImg.current = img;
  }, []);

  const keys = useRef<Record<string, boolean>>({});
  const [state, setState] = useState<GameState>("ready");
  const stateRef = useRef<GameState>("ready");
  useEffect(() => { stateRef.current = state; }, [state]);

  function reset() {
    player.current = {
      x: 64,
      y: GROUND_Y - PLAYER_H,
      w: PLAYER_W,
      h: PLAYER_H,
      vx: 0,
      vy: 0,
      onGround: true,
      facing: 1,
    };
    prevY.current = player.current.y;
    setEnemies([
      { id: 1, x: 380, y: GROUND_Y - 40, w: 50, h: 40, alive: true },
      { id: 2, x: 620, y: GROUND_Y - 40, w: 50, h: 40, alive: true },
      { id: 3, x: 800, y: GROUND_Y - 40, w: 50, h: 40, alive: true },
    ]);
    setState("ready");
  }

  function start() {
    if (stateRef.current === "running") return;
    setState("running");
    const el = document.activeElement as HTMLElement | null;
    el?.blur?.();
    canvasRef.current?.focus?.();
  }

  // Reinício rápido (usado no pop-up e no espaço em game over)
  function quickRestart() {
    reset();
    // garante que o start rode após o reset
    setTimeout(() => start(), 0);
  }

  // Input (bloqueia default; Espaço começa/retoma; R reinicia; P pausa/retoma; Espaço em game over = quickRestart)
  useEffect(() => {
    const handled = new Set([" ", "ArrowUp", "ArrowLeft", "ArrowRight", "r", "R", "p", "P"]);
    const down = (e: KeyboardEvent) => {
      if (handled.has(e.key)) e.preventDefault();

      // atalhos globais
      if (e.key === "r" || e.key === "R") { reset(); return; }

      if (e.key === "p" || e.key === "P") {
        if (stateRef.current === "running") setState("ready"); // pausar
        else if (stateRef.current === "ready") start();        // retomar
        return;
      }

      if (e.key === " ") {
        if (stateRef.current === "gameover") { quickRestart(); return; } // Espaço reinicia no game over
        if (stateRef.current !== "running") { start(); return; }         // Espaço começa/retoma
        // se estiver rodando, Espaço funciona como pulo (abaixo)
      }

      keys.current[e.key] = true;
      if ((e.key === " " || e.key === "ArrowUp") && player.current.onGround && stateRef.current === "running") {
        player.current.vy = JUMP_VELOCITY;
        player.current.onGround = false;
      }
    };
    const up = (e: KeyboardEvent) => {
      if (handled.has(e.key)) e.preventDefault();
      keys.current[e.key] = false;
    };
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up, { passive: false });
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      // physics step
      prevY.current = player.current.y;

      // horizontal
      player.current.vx = 0;
      if (keys.current["ArrowLeft"]) { player.current.vx = -MOVE_SPEED; player.current.facing = -1; }
      if (keys.current["ArrowRight"]) { player.current.vx = MOVE_SPEED; player.current.facing = 1; }

      player.current.x += player.current.vx;
      player.current.x = Math.max(0, Math.min(WIDTH - player.current.w, player.current.x));

      // gravity
      player.current.vy += GRAVITY;
      player.current.y += player.current.vy;

      // ground collide
      if (player.current.y + player.current.h >= GROUND_Y) {
        player.current.y = GROUND_Y - player.current.h;
        player.current.vy = 0;
        player.current.onGround = true;
      }

      // collisions with enemies
      setEnemies((prev) => {
        let changed = false;
        const next = prev.map((en) => {
          if (!en.alive) return en;
          const hit = rectsOverlap(player.current, en);
          if (!hit) return en;
          const wasAbove = prevY.current + player.current.h <= en.y + 4 && player.current.vy > 0;
          if (wasAbove) {
            changed = true;
            player.current.vy = JUMP_VELOCITY * 0.7; // pequeno quique
            return { ...en, alive: false };
          } else {
            setState("gameover");
          }
          return en;
        });
        return changed ? next : prev;
      });

      // win check
      if (state === "running" && enemies.every((e) => !e.alive)) {
        setState("win");
      }

      // render
      draw(ctx, player.current, enemies, state, commitinhoImg.current, imgReady);
      if (state === "running") reqRef.current = requestAnimationFrame(loop);
    };

    if (state === "running") reqRef.current = requestAnimationFrame(loop);
    return () => { if (reqRef.current) cancelAnimationFrame(reqRef.current); };
  }, [state, enemies, imgReady]);

  return (
    <div className="min-h-screen bg-commitinho-bg px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="text-commitinho-text" />
            <h1 className="text-2xl font-bold text-commitinho-text">Caça aos Bugs • Side-Scroller</h1>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-rose-500/80 text-white">Arcade</Badge>
            <Badge className="bg-emerald-600/80 text-white">Protótipo</Badge>
          </div>
        </div>

        <Card className="bg-commitinho-surface border-commitinho-surface-2 relative">
          <CardHeader>
            <CardTitle className="text-commitinho-text">
              Elimine todos os bugs! (← → mover, ↑/Espaço pular · <b>Espaço</b> começa/retoma · <b>R</b> reinicia · <b>P</b> pausa/retoma)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="w-full overflow-x-auto">
              <canvas
                ref={canvasRef}
                tabIndex={0}
                width={WIDTH}
                height={HEIGHT}
                className="rounded-xl border border-white/10 bg-[#0b1220] w-full"
                onPointerDown={() => {
                  if (stateRef.current === "gameover") quickRestart();
                }}
              />
            </div>

            <div className="flex gap-2">
              {state !== "running" ? (
                <Button
                  onClick={start}
                  onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
                  className="bg-gradient-arcade text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Executar (Espaço)
                </Button>
              ) : (
                <Button
                  onClick={() => setState("ready")}
                  onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
                  variant="secondary"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar (P)
                </Button>
              )}
              <Button
                variant="outline"
                onClick={reset}
                onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
                className="border-white/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Resetar (R)
              </Button>
              <div className="ml-auto text-commitinho-text-soft text-sm">
                Bugs restantes: {enemies.filter(e => e.alive).length}
              </div>
            </div>

            {/* mensagens informativas */}
            {state === "ready" && (
              <div className="text-commitinho-text-soft text-sm">
                Dica: <b>Espaço</b> começa/retoma · <b>P</b> pausa · <b>R</b> reinicia.
              </div>
            )}
            {state === "win" && <div className="text-emerald-400 text-sm">🎉 Código limpo! Todos os bugs foram corrigidos.</div>}
          </CardContent>

          {/* Pop-up de Game Over */}
          <Dialog open={state === "gameover"}>
            <DialogContent
              className="max-w-sm bg-commitinho-surface-1 border-commitinho-surface-2 text-center"
              onClick={quickRestart} // toque/clique reinicia
            >
              <DialogHeader>
                <DialogTitle className="text-center">
                  <div className="text-5xl mb-2">💥</div>
                  Commitinho foi atingido!
                </DialogTitle>
              </DialogHeader>
              <div className="text-commitinho-text-soft">
                Pressione <b>Espaço</b> para reiniciar<br />ou <b>toque/click</b> aqui.
              </div>
              <div className="pt-3">
                <Button className="bg-gradient-arcade text-white" onClick={quickRestart}>
                  Jogar de novo
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </div>
  );
}

function rectsOverlap(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function draw(
  ctx: CanvasRenderingContext2D,
  player: { x: number; y: number; w: number; h: number; facing: 1 | -1 },
  enemies: Enemy[],
  state: GameState,
  img: HTMLImageElement | null,
  imgReady: boolean
) {
  // clear
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // background gradient
  const g = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  g.addColorStop(0, "#0b1220");
  g.addColorStop(1, "#0e1628");
  ctx.fillStyle = g; ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ground
  ctx.fillStyle = "#1f2a44";
  ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);
  for (let i = 0; i < WIDTH; i += 32) {
    ctx.fillStyle = i % 64 === 0 ? "#2a3553" : "#24304d";
    ctx.fillRect(i, GROUND_Y, 32, 6);
  }

  // enemies
  enemies.forEach((e) => {
    if (!e.alive) return;
    ctx.fillStyle = "#e11d48";
    roundRect(ctx, e.x, e.y, e.w, e.h, 6);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.fillRect(e.x + 14, e.y + 10, 4, 4);
    ctx.fillRect(e.x + e.w - 18, e.y + 10, 4, 4);
    ctx.strokeStyle = "#e11d48"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(e.x + 12, e.y); ctx.lineTo(e.x + 4, e.y - 6); ctx.moveTo(e.x + e.w - 12, e.y); ctx.lineTo(e.x + e.w - 4, e.y - 6); ctx.stroke();
  });

  // sombra do player
  ctx.globalAlpha = 0.25; ctx.fillStyle = "#000";
  ctx.beginPath(); ctx.ellipse(player.x + player.w / 2, player.y + player.h, player.w * 0.5, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // player (imagem ou fallback)
  if (img && imgReady) {
    ctx.save();
    if (player.facing === -1) {
      // flip horizontal
      ctx.translate(player.x + player.w, player.y);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0, player.w, player.h);
    } else {
      ctx.drawImage(img, player.x, player.y, player.w, player.h);
    }
    ctx.restore();
  } else {
    // fallback: retângulo azul
    ctx.fillStyle = "#60a5fa";
    roundRect(ctx, player.x, player.y, player.w, player.h, 8);
    ctx.fill();
  }

  // overlays de estado (somente infos leves; o pop-up real está via Dialog)
  if (state === "ready") {
    ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#cbd5e1"; ctx.font = "600 20px ui-monospace, SFMono-Regular, Menlo, monospace"; ctx.textAlign = "center";
    ctx.fillText("Espaço começa/retoma · P pausa · R reinicia", WIDTH / 2, HEIGHT / 2);
  } else if (state === "win") {
    ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#e5e7eb"; ctx.font = "bold 28px ui-monospace, SFMono-Regular, Menlo, monospace"; ctx.textAlign = "center";
    ctx.fillText("Código limpo!", WIDTH / 2, HEIGHT / 2);
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
