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
  const { 
    progress, 
    isLoading, 
    completeLessonProgress, 
    getNextLessonId,
    markLessonIntroCompleted,
    isLessonIntroCompleted
  } = useProgress();
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
    if (!lessonId || !progress) return;

    // Check if intro is completed for this lesson
    const introCompleted = isLessonIntroCompleted(lessonId);
    
    if (introCompleted) {
      // Intro already done - go directly to Praticar (game)
      console.log('Intro completed, going to practice mode...');
      // TODO: Navigate to practice/game mode
    } else {
      // First time - open Aprender (cards + micro-quiz)  
      console.log('First time, opening learn mode...');
      // Mark intro as completed
      markLessonIntroCompleted(lessonId);
      // TODO: Navigate to learn mode (intro cards + quiz)
    }
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
        <div className="max-w-2xl mx-auto w-full">
          {/* Commitinho Introduction - Centered Single Card */}
          <Card className="bg-commitinho-surface border-commitinho-surface-2">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Commitinho Image */}
                <div className="flex justify-center">
                  <img 
                    src="/lovable-uploads/ee82c2e5-f68a-417d-9f9d-0394381c468f.png" 
                    alt="Commitinho - Mascote da programação"
                    className="w-32 h-32 commitinho-mascot animate-float"
                  />
                </div>

                {/* Speech Bubble */}
                <div className="relative bg-white text-gray-800 p-6 rounded-2xl shadow-lg max-w-md mx-auto border border-gray-200">
                  {/* Speech bubble tail */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[15px] border-l-transparent border-r-transparent border-b-white"></div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      Oi, eu sou o Commitinho! 👋
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Meu nome vem da palavra <strong>commit</strong>, que é como os programadores salvam o que aprenderam.
                      Eu vou ser seu amiguinho e te ajudar nessa aventura pelo mundo da programação! 🚀
                    </p>
                  </div>
                </div>

                {/* Primary Action Button */}
                <Button 
                  onClick={handleStartLesson}
                  size="lg"
                  className="bg-gradient-arcade text-white font-semibold shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300"
                  role="button"
                  aria-label="Iniciar atividade da lição"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Iniciar Atividade
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Licao;