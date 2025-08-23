import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gamepad2, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Jogos = () => {
  const jogos = [
    {
      id: 1,
      nome: "Robo-Correio do Commitinho",
      descricao: "Programe o robô para entregar cartas pela cidade usando comandos simples.",
      thumbnail: "🤖",
      habilidades: ["Sequência", "Repetir"],
      destaque: true
    },
    {
      id: 2,
      nome: "Laboratório de Pocoes",
      descricao: "Misture ingredientes seguindo receitas condicionais para criar poções mágicas.",
      thumbnail: "🧪",
      habilidades: ["Se/Então", "Sequência"]
    },
    {
      id: 3,
      nome: "Caça aos Bugs",
      descricao: "Encontre e corrija erros nos códigos dos outros robôs da galáxia.",
      thumbnail: "🐛",
      habilidades: ["Depurar", "Se/Então"]
    },
    {
      id: 4,
      nome: "Fábrica de Pixels",
      descricao: "Crie padrões coloridos usando loops e funções para pintar arte digital.",
      thumbnail: "🎨",
      habilidades: ["Repetir", "Função"]
    },
    {
      id: 5,
      nome: "Missão Espacial",
      descricao: "Navegue pela galáxia programando a rota da sua nave espacial.",
      thumbnail: "🚀",
      habilidades: ["Função", "Sequência"]
    },
    {
      id: 6,
      nome: "DJ do Futuro",
      descricao: "Componha músicas eletrônicas usando programação e loops musicais.",
      thumbnail: "🎵",
      habilidades: ["Repetir", "Se/Então"]
    }
  ];

  const coresHabilidades = {
    "Sequência": "bg-primary text-primary-foreground",
    "Repetir": "bg-secondary text-secondary-foreground", 
    "Se/Então": "bg-commitinho-success text-commitinho-success-foreground",
    "Depurar": "bg-destructive text-destructive-foreground",
    "Função": "bg-commitinho-warning text-commitinho-warning-foreground"
  };

  return (
    <div className="min-h-screen bg-commitinho-bg">
      {/* Header da página */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <span className="gradient-text">Catálogo de Jogos</span>
          </h1>
          <p className="text-base sm:text-lg text-commitinho-text-soft mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Aventuras divertidas para aprender programação! Cada jogo ensina conceitos importantes de forma interativa.
          </p>
          
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/ee82c2e5-f68a-417d-9f9d-0394381c468f.png" 
              alt="Commitinho animado"
              className="w-20 h-20 sm:w-24 sm:h-24 commitinho-mascot animate-bounce-in"
            />
          </div>
        </div>
      </section>

      {/* Grid de jogos */}
      <section className="px-4 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jogos.map((jogo) => (
              <Card 
                key={jogo.id}
                className={`
                  bg-commitinho-surface border-commitinho-surface-2 
                  hover:shadow-glow-primary transition-all duration-300 group
                  ${jogo.destaque ? 'ring-2 ring-commitinho-warning' : ''}
                `}
              >
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl sm:text-4xl mb-2 group-hover:animate-bounce-in">
                      {jogo.thumbnail}
                    </div>
                    {jogo.destaque && (
                      <Badge className="bg-commitinho-warning text-commitinho-warning-foreground text-xs">
                        Destaque
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-commitinho-text text-base sm:text-lg">
                    {jogo.nome}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                  <CardDescription className="text-commitinho-text-soft text-sm sm:text-base">
                    {jogo.descricao}
                  </CardDescription>
                  
                  {/* Habilidades */}
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-commitinho-text mb-2">
                      Habilidades:
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {jogo.habilidades.map((habilidade) => (
                        <Badge 
                          key={habilidade}
                          className={`text-xs ${coresHabilidades[habilidade as keyof typeof coresHabilidades]}`}
                        >
                          {habilidade}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Botão de ação */}
                  {jogo.id === 1 ? (
                    <Button asChild className="w-full bg-gradient-arcade text-white text-sm sm:text-base py-2 sm:py-3">
                      <Link to="/jogo/robocorreio/1">
                        <Gamepad2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Jogar
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      disabled 
                      className="w-full bg-commitinho-surface-2 text-commitinho-text-soft cursor-not-allowed hover:bg-commitinho-surface-2 text-sm sm:text-base py-2 sm:py-3"
                    >
                      <Lock className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Em Breve
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Seção de informações adicionais */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="bg-commitinho-surface rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-commitinho-text mb-3 sm:mb-4">
                🚀 Mais jogos em desenvolvimento!
              </h3>
              <p className="text-commitinho-text-soft mb-4 sm:mb-6 text-sm sm:text-base">
                Nossa equipe está trabalhando duro para criar mais aventuras divertidas. 
                Cada jogo é projetado para ensinar conceitos de programação de forma gradual e divertida.
              </p>
              
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 text-sm">
                <div className="bg-commitinho-surface-2 p-3 sm:p-4 rounded-lg">
                  <p className="font-medium text-commitinho-text mb-1">⏱️ Sessões curtas</p>
                  <p className="text-commitinho-text-soft text-xs sm:text-sm">3-5 minutos por partida</p>
                </div>
                <div className="bg-commitinho-surface-2 p-3 sm:p-4 rounded-lg">
                  <p className="font-medium text-commitinho-text mb-1">🎯 Aprendizado gradual</p>
                  <p className="text-commitinho-text-soft text-xs sm:text-sm">Um conceito por vez</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Jogos;
