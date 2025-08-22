import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, ArrowLeft, ArrowRight, CheckCircle, Play, RotateCcw } from 'lucide-react';
import { LessonData } from '@/types/progress';
import { useProgress } from '@/hooks/useProgress';
import { getLessonById } from '@/data/curriculum';

const Licao = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { progress, isLoading, completeLessonProgress, getNextLessonId } = useProgress();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    if (!lessonId) {
      navigate('/aventura');
      return;
    }

    const lessonData = getLessonById(lessonId);

    if (!lessonData) {
      navigate('/aventura');
      return;
    }

    setLesson(lessonData);
    
    // Check if lesson is already completed when progress loads
    if (progress && lessonId) {
      const lessonStars = progress.stars[lessonId] || 0;
      setIsCompleted(lessonStars > 0);
    }
  }, [lessonId, navigate, progress]);

  if (isLoading || !progress || !lesson) {
    return (
      <div className="min-h-screen bg-commitinho-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleStartLesson = () => {
    // New game will be implemented here
    console.log('Starting new game for lesson:', lessonId);
  };

  const currentStars = progress.stars[lesson.id] || 0;

  return (
    <div className="min-h-screen bg-commitinho-bg">
      {/* Header */}
      <section className="px-4 py-6 border-b border-commitinho-surface-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/aventura')}
              className="text-commitinho-text-soft hover:text-commitinho-text"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <div className="text-center">
              <Badge className="bg-primary text-primary-foreground mb-2">
                {lesson.concept}
              </Badge>
              <h1 className="text-xl font-bold text-commitinho-text">
                {lesson.title}
              </h1>
            </div>

            <div className="flex items-center space-x-2" role="img" aria-label={`${currentStars} de 3 estrelas`}>
              {[1, 2, 3].map((starNum) => (
                <Star 
                  key={starNum}
                  className={`h-5 w-5 ${
                    starNum <= currentStars
                      ? 'fill-commitinho-warning text-commitinho-warning' 
                      : 'text-commitinho-surface-2'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lesson Content */}
      <section className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Instructions */}
            <Card className="bg-commitinho-surface border-commitinho-surface-2">
              <CardHeader>
                <CardTitle className="text-commitinho-text flex items-center">
                  <Play className="mr-2 h-5 w-5" />
                  Instruções
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-commitinho-text-soft">
                  {lesson.description}
                </p>
                
                {/* Lesson objectives */}
                <div className="bg-commitinho-surface-2 p-4 rounded-lg" id="lesson-instructions">
                  <h4 className="font-medium text-commitinho-text mb-2">Objetivo:</h4>
                  <ul className="text-sm text-commitinho-text-soft space-y-1">
                    <li>• Pratique o conceito de <strong>{lesson.concept}</strong></li>
                    <li>• Complete a atividade com pelo menos 60% de precisão</li>
                    <li>• Ganhe entre 1-3 estrelas baseado no seu desempenho</li>
                  </ul>
                </div>

                {/* XP Reward */}
                <div className="flex items-center justify-between bg-commitinho-warning/10 p-3 rounded-lg">
                  <span className="text-commitinho-text font-medium">Recompensa XP:</span>
                  <Badge className="bg-commitinho-warning text-commitinho-warning-foreground">
                    +{lesson.xp_reward} XP
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Game Area */}
            <div>
              <Card className="bg-commitinho-surface border-commitinho-surface-2">
                <CardHeader>
                  <CardTitle className="text-commitinho-text">Área do Jogo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-arcade rounded-full flex items-center justify-center">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-commitinho-text mb-2">
                      Pronto para começar?
                    </h3>
                    <p className="text-commitinho-text-soft mb-6">
                      Clique no botão abaixo para iniciar a atividade.
                    </p>
                    <Button 
                      onClick={handleStartLesson}
                      className="bg-gradient-arcade text-white font-semibold shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300"
                      aria-describedby="lesson-instructions"
                    >
                      Iniciar Atividade
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Licao;