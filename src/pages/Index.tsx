import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Trophy, MessageCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-commitinho-bg">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo do Hero */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-commitinho-text">Aprenda programação </span>
                <span className="gradient-text">brincando!</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-commitinho-muted mb-8 max-w-lg">
                Mini-jogos divertidos para explorar lógica e criatividade.
                Descubra o mundo da programação de um jeito super legal!
              </p>
              
              <div className="text-sm text-commitinho-warning mb-8 font-medium">
                "Commitinho, seu amiguinho &lt;3"
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  disabled
                  className="bg-gradient-arcade text-white font-semibold shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300"
                >
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Começar Aventura
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Ver Demo
                </Button>
              </div>
            </div>
            
            {/* Mascote Hero */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src="/lovable-uploads/ee82c2e5-f68a-417d-9f9d-0394381c468f.png" 
                  alt="Commitinho - Mascote da programação"
                  className="w-80 h-80 commitinho-mascot animate-float drop-shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-arcade opacity-20 rounded-full blur-3xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards "O que vem por aí" */}
      <section className="px-4 py-16 bg-commitinho-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-commitinho-text">
            O que vem por aí
          </h2>
          <p className="text-center text-commitinho-muted mb-12 max-w-2xl mx-auto">
            Estamos preparando experiências incríveis para tornar seu aprendizado ainda mais divertido!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Mini-jogos */}
            <Card className="bg-commitinho-surface-2 border-commitinho-surface-2 hover:shadow-glow-primary transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-arcade rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pixel-glow">
                  <Gamepad2 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-commitinho-text">Mini-jogos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-commitinho-muted text-center">
                  Jogos interativos que ensinam conceitos de programação como sequência, repetição e condições de forma divertida.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 2: Conquistas */}
            <Card className="bg-commitinho-surface-2 border-commitinho-surface-2 hover:shadow-glow-secondary transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pixel-glow">
                  <Trophy className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-commitinho-text">Conquistas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-commitinho-muted text-center">
                  Colete estrelas e adesivos conforme completa os desafios. Cada vitória é uma nova descoberta!
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 3: Dicas do Commitinho */}
            <Card className="bg-commitinho-surface-2 border-commitinho-surface-2 hover:shadow-glow-warning transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-commitinho-success rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pixel-glow">
                  <MessageCircle className="h-8 w-8 text-commitinho-success-foreground" />
                </div>
                <CardTitle className="text-commitinho-text">Dicas do Commitinho</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-commitinho-muted text-center">
                  Seu amiguinho digital sempre pronto para te ajudar com dicas e encorajamento durante a jornada.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
