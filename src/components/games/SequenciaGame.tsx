import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, RotateCcw, CheckCircle } from 'lucide-react';

interface SequenciaGameProps {
  onComplete: (accuracy: number) => void;
  lessonId: string;
}

type Direction = 'up' | 'down' | 'left' | 'right';
type GameState = 'instructions' | 'playing' | 'checking' | 'completed';

interface Position {
  x: number;
  y: number;
}

const SequenciaGame: React.FC<SequenciaGameProps> = ({ onComplete, lessonId }) => {
  const [gameState, setGameState] = useState<GameState>('instructions');
  const [playerCommands, setPlayerCommands] = useState<Direction[]>([]);
  const [commitinhoPosition, setCommitinhoPosition] = useState<Position>({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState<Position>({ x: 2, y: 1 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Grid 3x3 for the lesson
  const gridSize = 3;

  // Different levels for lesson 1-1-1, 1-1-2, 1-1-3
  const getLessonConfig = () => {
    switch (lessonId) {
      case '1-1-1': // Primeiros Passos
        return {
          target: { x: 2, y: 0 },
          solution: ['right', 'right'] as Direction[],
          description: 'Mova o Commitinho para a direita até alcançar a estrela!'
        };
      case '1-1-2': // Caminho Direto  
        return {
          target: { x: 2, y: 2 },
          solution: ['right', 'right', 'down', 'down'] as Direction[],
          description: 'Faça o Commitinho ir até o canto inferior direito!'
        };
      case '1-1-3': // Labirinto Básico
        return {
          target: { x: 2, y: 1 },
          solution: ['right', 'down', 'right'] as Direction[],
          description: 'Navegue pelo labirinto para chegar à estrela!'
        };
      default:
        return {
          target: { x: 2, y: 0 },
          solution: ['right', 'right'] as Direction[],
          description: 'Mova o Commitinho para a direita até alcançar a estrela!'
        };
    }
  };

  const lessonConfig = getLessonConfig();

  useEffect(() => {
    setTargetPosition(lessonConfig.target);
  }, [lessonId]);

  const addCommand = (direction: Direction) => {
    if (gameState === 'playing' && playerCommands.length < 10) {
      setPlayerCommands([...playerCommands, direction]);
    }
  };

  const removeLastCommand = () => {
    if (gameState === 'playing') {
      setPlayerCommands(playerCommands.slice(0, -1));
    }
  };

  const clearCommands = () => {
    if (gameState === 'playing') {
      setPlayerCommands([]);
    }
  };

  const executeCommands = async () => {
    if (playerCommands.length === 0) return;

    setGameState('checking');
    setIsAnimating(true);
    
    let currentPos = { x: 0, y: 0 };
    setCommitinhoPosition(currentPos);

    // Animate each command
    for (let i = 0; i < playerCommands.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const command = playerCommands[i];
      const newPos = { ...currentPos };

      switch (command) {
        case 'up':
          newPos.y = Math.max(0, newPos.y - 1);
          break;
        case 'down':
          newPos.y = Math.min(gridSize - 1, newPos.y + 1);
          break;
        case 'left':
          newPos.x = Math.max(0, newPos.x - 1);
          break;
        case 'right':
          newPos.x = Math.min(gridSize - 1, newPos.x + 1);
          break;
      }

      currentPos = newPos;
      setCommitinhoPosition(currentPos);
    }

    // Check if reached target
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const reached = currentPos.x === targetPosition.x && currentPos.y === targetPosition.y;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (reached) {
      // Calculate accuracy based on efficiency
      const optimalMoves = lessonConfig.solution.length;
      const playerMoves = playerCommands.length;
      const efficiency = Math.max(0, (optimalMoves / playerMoves) * 100);
      const accuracy = Math.min(100, efficiency + (3 - newAttempts) * 10); // Bonus for fewer attempts
      
      setGameState('completed');
      setIsAnimating(false);
      
      // Call completion callback after a brief celebration
      setTimeout(() => {
        onComplete(Math.max(60, Math.round(accuracy))); // Minimum 60% for completion
      }, 1500);
    } else {
      // Reset for another try
      setTimeout(() => {
        setCommitinhoPosition({ x: 0, y: 0 });
        setPlayerCommands([]);
        setGameState('playing');
        setIsAnimating(false);
      }, 1000);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setCommitinhoPosition({ x: 0, y: 0 });
    setPlayerCommands([]);
    setAttempts(0);
  };

  const getDirectionIcon = (direction: Direction) => {
    switch (direction) {
      case 'up': return <ArrowUp className="h-4 w-4" />;
      case 'down': return <ArrowDown className="h-4 w-4" />;
      case 'left': return <ArrowLeft className="h-4 w-4" />;
      case 'right': return <ArrowRight className="h-4 w-4" />;
    }
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isCommitinho = commitinhoPosition.x === x && commitinhoPosition.y === y;
        const isTarget = targetPosition.x === x && targetPosition.y === y;
        const isStart = x === 0 && y === 0;

        cells.push(
          <div
            key={`${x}-${y}`}
            className={`
              w-16 h-16 border-2 border-commitinho-surface-2 rounded-lg
              flex items-center justify-center text-2xl
              transition-all duration-300
              ${isStart ? 'bg-commitinho-success/20' : 'bg-commitinho-surface'}
              ${isTarget ? 'bg-commitinho-warning/20' : ''}
            `}
          >
            {isCommitinho && (
              <img 
                src="/lovable-uploads/ee82c2e5-f68a-417d-9f9d-0394381c468f.png" 
                alt="Commitinho"
                className="w-12 h-12 commitinho-mascot animate-bounce-in"
              />
            )}
            {isTarget && !isCommitinho && (
              <div className="text-2xl">⭐</div>
            )}
            {isStart && !isCommitinho && (
              <div className="text-sm text-commitinho-success">📍</div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  if (gameState === 'instructions') {
    return (
      <div className="space-y-6">
        <Card className="bg-commitinho-surface border-commitinho-surface-2">
          <CardHeader>
            <CardTitle className="text-commitinho-text flex items-center">
              <img 
                src="/lovable-uploads/ee82c2e5-f68a-417d-9f9d-0394381c468f.png" 
                alt="Commitinho - Mascote da programação"
                className="w-16 h-16 commitinho-mascot animate-float mr-4"
              />
              <div>
                <div className="text-xl mb-1">Oi, eu sou o Commitinho!</div>
                <div className="text-sm text-commitinho-text-soft font-normal">
                  Seu amiguinho para aprender programação! 🎮
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-commitinho-text-soft">
              {lessonConfig.description}
            </p>
            
            <div className="bg-commitinho-surface-2 p-4 rounded-lg">
              <h4 className="font-medium text-commitinho-text mb-3">Como jogar:</h4>
              <ul className="text-sm text-commitinho-text-soft space-y-2">
                <li>• Use as setas para criar uma sequência de comandos</li>
                <li>• 🤖 = Commitinho (você!)</li>
                <li>• ⭐ = Objetivo</li>
                <li>• 📍 = Posição inicial</li>
                <li>• Clique "Executar" para ver o Commitinho seguir seus comandos!</li>
              </ul>
            </div>

            <Button 
              onClick={startGame}
              className="w-full bg-gradient-arcade text-white font-semibold"
            >
              <Play className="mr-2 h-4 w-4" />
              Vamos começar!
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className="space-y-6">
        <Card className="bg-commitinho-success/10 border-commitinho-success">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-commitinho-text mb-2">
              Parabéns!
            </h3>
            <p className="text-commitinho-text-soft mb-4">
              Você ajudou o Commitinho a chegar ao objetivo!
            </p>
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-commitinho-success animate-bounce-in" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Grid */}
      <Card className="bg-commitinho-surface border-commitinho-surface-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-commitinho-text">
              Mova o Commitinho
            </CardTitle>
            <Badge className="bg-commitinho-warning text-commitinho-warning-foreground">
              Tentativa {attempts + 1}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 mb-6 max-w-xs mx-auto">
            {renderGrid()}
          </div>
          
          <p className="text-center text-commitinho-text-soft text-sm mb-4">
            {lessonConfig.description}
          </p>
        </CardContent>
      </Card>

      {/* Command Panel */}
      <Card className="bg-commitinho-surface border-commitinho-surface-2">
        <CardHeader>
          <CardTitle className="text-commitinho-text">Comandos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Direction Buttons */}
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            <div></div>
            <Button
              onClick={() => addCommand('up')}
              disabled={gameState !== 'playing'}
              className="bg-primary text-primary-foreground h-12"
            >
              <ArrowUp className="h-6 w-6" />
            </Button>
            <div></div>
            
            <Button
              onClick={() => addCommand('left')}
              disabled={gameState !== 'playing'}
              className="bg-primary text-primary-foreground h-12"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div></div>
            <Button
              onClick={() => addCommand('right')}
              disabled={gameState !== 'playing'}
              className="bg-primary text-primary-foreground h-12"
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
            
            <div></div>
            <Button
              onClick={() => addCommand('down')}
              disabled={gameState !== 'playing'}
              className="bg-primary text-primary-foreground h-12"
            >
              <ArrowDown className="h-6 w-6" />
            </Button>
            <div></div>
          </div>

          {/* Command Sequence Display */}
          <div className="bg-commitinho-surface-2 p-4 rounded-lg">
            <h4 className="font-medium text-commitinho-text mb-2">Sequência de comandos:</h4>
            <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
              {playerCommands.length === 0 ? (
                <span className="text-commitinho-text-soft text-sm">
                  Adicione comandos usando as setas acima
                </span>
              ) : (
                playerCommands.map((cmd, index) => (
                  <Badge 
                    key={index}
                    className="bg-primary text-primary-foreground"
                  >
                    {getDirectionIcon(cmd)}
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={executeCommands}
              disabled={playerCommands.length === 0 || gameState !== 'playing'}
              className="flex-1 bg-gradient-arcade text-white font-semibold"
            >
              <Play className="mr-2 h-4 w-4" />
              Executar
            </Button>
            
            <Button
              onClick={removeLastCommand}
              disabled={playerCommands.length === 0 || gameState !== 'playing'}
              variant="outline"
              className="border-commitinho-surface-2"
            >
              ↶
            </Button>
            
            <Button
              onClick={clearCommands}
              disabled={playerCommands.length === 0 || gameState !== 'playing'}
              variant="outline"
              className="border-commitinho-surface-2"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {gameState === 'checking' && (
            <div className="text-center">
              <p className="text-commitinho-text-soft">
                🤖 Commitinho está seguindo seus comandos...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SequenciaGame;