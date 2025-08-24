import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star } from 'lucide-react';
import { LessonData } from '@/types/progress';
import { useSupabaseProgress } from '@/hooks/useSupabaseProgress';
import { basicAdventureLessons, getLessonById } from '@/data/curriculum';
import { lesson1Data } from '@/data/lessons/lesson-1';
import { lesson2Data } from '@/data/lessons/lesson-2';
import CodeFillActivity from '@/components/activities/CodeFillActivity';
import CodeWriteActivity from '@/components/activities/CodeWriteActivity';
import CodeFreeActivity from '@/components/activities/CodeFreeActivity';

const Licao = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  
  const { 
    progress, 
    isLoading, 
    completeLessonProgress
  } = useSupabaseProgress();
  
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [lessonContent, setLessonContent] = useState<any>(null);

  useEffect(() => {
    if (!lessonId) {
      navigate('/aventura');
      return;
    }

    // Reset lesson content first to show loading state
    setLessonContent(null);
    setLesson(null);

    // Check if it's a basic adventure lesson
    let lessonData;
    if (lessonId.startsWith('basic-')) {
      lessonData = basicAdventureLessons.find(l => l.id === lessonId);
    } else {
      lessonData = getLessonById(lessonId);
    }

    if (!lessonData) {
      navigate('/aventura');
      return;
    }

    setLesson(lessonData);
    
    // Load lesson content
    const loadLessonContent = async () => {
      try {
        console.log(`🔍 Loading lesson content for: ${lessonId}`);
        
        let content;
        
        // Check if it's a basic adventure lesson
        if (lessonId?.startsWith('basic-')) {
          try {
            const lessonModule = await import(`@/data/lessons/basic/${lessonId}.ts`);
            content = lessonModule.lessonData;
          } catch (importError) {
            console.error(`Failed to import basic lesson ${lessonId}:`, importError);
            throw new Error(`No lesson data found for: ${lessonId}`);
          }
        } else if (lessonId === '1-1-1') {
          content = lesson1Data;
        } else if (lessonId === 'lesson-2') {
          content = lesson2Data;
        } else {
          throw new Error(`No lesson data found for: ${lessonId}`);
        }
        
        console.log(`✅ Loaded lesson content:`, content.title);
        setLessonContent(content);
      } catch (error) {
        console.error('❌ Error loading lesson content:', error);
      }
    };

    loadLessonContent();
  }, [lessonId, navigate]);

  const handleActivityComplete = (xp: number) => {
    if (!lesson) return;
    
    console.log(`🎉 Activity completed! XP: ${xp}`);
    completeLessonProgress(lesson, 100);
    
    // Add a small delay to ensure state updates are processed
    setTimeout(() => {
      // Navigate to next lesson or back to adventure
      const currentIndex = basicAdventureLessons.findIndex(l => l.id === lessonId);
      if (currentIndex >= 0 && currentIndex < basicAdventureLessons.length - 1) {
        const nextLesson = basicAdventureLessons[currentIndex + 1];
        console.log(`🚀 Navigating to next lesson: ${nextLesson.id}`);
        navigate(`/licao/${nextLesson.id}`, { replace: true });
      } else if (lessonContent?.next) {
        console.log(`🚀 Navigating to specified next lesson: ${lessonContent.next}`);
        navigate(`/licao/${lessonContent.next}`, { replace: true });
      } else {
        console.log(`🏠 Navigating back to adventure`);
        navigate('/aventura', { replace: true });
      }
    }, 100);
  };

  if (isLoading || !progress || !lesson) {
    return (
      <div className="min-h-screen bg-commitinho-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lessonContent) {
    return (
      <div className="min-h-screen bg-commitinho-bg flex items-center justify-center">
        <div className="text-commitinho-text">Carregando lição...</div>
      </div>
    );
  }

  const activity = lessonContent.activities?.[0];
  if (!activity) {
    return (
      <div className="min-h-screen bg-commitinho-bg flex items-center justify-center">
        <div className="text-commitinho-text">Atividade não encontrada</div>
      </div>
    );
  }

  const currentStars = progress?.stars[lesson?.id || ''] || 0;

  const renderActivity = () => {
    const commonProps = {
      activity,
      onComplete: handleActivityComplete
    };

    switch (activity.type) {
      case 'code_fill':
        return <CodeFillActivity {...commonProps} />;
      case 'code_write':
        return <CodeWriteActivity {...commonProps} />;
      case 'code_free':
        return <CodeFreeActivity {...commonProps} />;
      default:
        return <div>Tipo de atividade não suportado: {activity.type}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-commitinho-bg">
      {/* Header */}
      <section className="px-4 py-4 sm:py-6 border-b border-commitinho-surface-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/aventura')}
              className="text-commitinho-text-soft hover:text-commitinho-text p-2 sm:px-4 sm:py-2"
            >
              <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>

            <div className="text-center flex-1 px-4">
              <Badge className="bg-primary text-primary-foreground mb-1 sm:mb-2 text-xs">
                {lesson?.concept || 'Print'}
              </Badge>
              <h1 className="text-sm sm:text-xl font-bold text-commitinho-text leading-tight">
                {lesson?.title || lessonContent.title}
              </h1>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2" role="img" aria-label={`${currentStars} de 3 estrelas`}>
              {[1, 2, 3].map((starNum) => (
                <Star 
                  key={starNum}
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
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

      {/* Lesson Intro */}
      {lessonContent.intro && (
        <section className="px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-start gap-3 sm:gap-4">
              <img 
                src="/lovable-uploads/ee82c2e5-f68a-417d-9f9d-0394381c468f.png" 
                alt="Commitinho"
                className="w-16 h-16 sm:w-20 sm:h-20 commitinho-mascot flex-shrink-0"
              />
              <div className="bg-white text-gray-800 p-3 sm:p-4 rounded-2xl shadow-lg border border-gray-200 flex-1 relative">
                <div className="absolute w-0 h-0 border-r-[12px] sm:border-r-[15px] border-t-[8px] sm:border-t-[10px] border-b-[8px] sm:border-b-[10px] border-r-white border-t-transparent border-b-transparent -left-3 sm:-left-4 top-3 sm:top-4"></div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                  {lessonContent.intro.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {lessonContent.intro.text}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Activity */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {renderActivity()}
        </div>
      </section>
    </div>
  );
};

export default Licao;