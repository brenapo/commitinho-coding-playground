import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, ArrowLeft, CheckCircle, Play, Code } from 'lucide-react';
import { LessonData } from '@/types/progress';
import { useProgress } from '@/hooks/useProgress';
import { getLessonById } from '@/data/curriculum';
import { lesson1Data } from '@/data/lessons/lesson-1';
import { lesson2Data } from '@/data/lessons/lesson-2';

interface ActivityData {
  id: string;
  type: string;
  title: string;
  prompt: string;
  starter: string;
  solutions: string[];
  choices: string[];
  successTemplate?: string;
  explain: string;
  commit_label: string;
  next?: string;
  xp: number;
}

interface LessonContent {
  id: string;
  title: string;
  intro: {
    image: string;
    title: string;
    text: string;
    cta: {
      label: string;
      goto: string;
    };
  };
  activities: ActivityData[];
}

const Licao = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  
  const { 
    progress, 
    isLoading, 
    completeLessonProgress
  } = useProgress();
  
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [hasExecuted, setHasExecuted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

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
    
    // Reset all activity state when lesson changes
    setSelectedChoice('');
    setHasExecuted(false);
    setIsCorrect(false);
    setShowSuccessModal(false);
    setSuccessMessage('');
    
    // Load lesson content from imported data
    const loadLessonContent = () => {
      try {
        console.log(`🔍 Loading lesson content for: ${lessonId}`);
        
        let content: LessonContent;
        
        // Map lessonId to imported data
        if (lessonId === '1-1-1') {
          content = lesson1Data as LessonContent;
        } else if (lessonId === 'lesson-2') {
          content = lesson2Data as LessonContent;
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

  if (isLoading || !progress || !lesson) {
    return (
      <div className="min-h-screen bg-commitinho-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderSuccess = (template: string, userAnswer: string) => {
    const clean = userAnswer.replace(/^"|"$/g, "");
    return template.replace(/\{\{\s*answer\s*\}\}/g, clean);
  };

  const handleChoiceSelect = (choice: string) => {
    if (!hasExecuted) {
      setSelectedChoice(choice);
    }
  };

  const handleExecute = () => {
    if (!selectedChoice || !lessonContent) return;

    const activity = lessonContent.activities[0];
    if (!activity) return;

    const correct = activity.solutions.includes(selectedChoice);
    setIsCorrect(correct);
    setHasExecuted(true);
    
    if (correct) {
      const message = activity.successTemplate 
        ? renderSuccess(activity.successTemplate, selectedChoice)
        : `Correto! ${selectedChoice}`;
      setSuccessMessage(message);
      setShowSuccessModal(true);
    }
  };

  const handleLessonComplete = () => {
    console.log('🔥 handleLessonComplete called');
    console.log('📚 lesson:', lesson);
    console.log('📖 lessonContent:', lessonContent);
    
    if (!lesson || !lessonContent) {
      console.log('❌ Missing lesson or lessonContent');
      return;
    }
    
    const activity = lessonContent.activities[0];
    console.log('🎯 activity:', activity);
    console.log('➡️ activity.next:', activity?.next);
    
    completeLessonProgress(lesson, 100);
    setShowSuccessModal(false);
    
    if (activity?.next) {
      console.log(`🚀 Navigating to: /licao/${activity.next}`);
      navigate(`/licao/${activity.next}`);
    } else {
      console.log('🏠 Navigating to: /aventura');
      navigate('/aventura');
    }
  };

  const getDisplayCode = () => {
    if (!lessonContent) return '';
    const activity = lessonContent.activities[0];
    if (!activity) return '';
    
    if (selectedChoice) {
      return activity.starter.replace('____', selectedChoice);
    }
    return activity.starter;
  };

  if (!lessonContent) {
    return null;
  }

  const activity = lessonContent.activities[0];
  if (!activity) {
    return <div>Atividade não encontrada</div>;
  }

  const currentStars = progress?.stars[lesson?.id || ''] || 0;

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
                {lesson?.concept || 'Conceito'}
              </Badge>
              <h1 className="text-xl font-bold text-commitinho-text">
                {lesson?.title || lessonContent.title}
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

      {/* Single Screen Content */}
      <section className="px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Commitinho Header Explanation */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
              <img 
                src="/lovable-uploads/ee82c2e5-f68a-417d-9f9d-0394381c468f.png" 
                alt="Commitinho"
                className="w-20 h-20 commitinho-mascot flex-shrink-0"
              />
              <div className="bg-white text-gray-800 p-4 rounded-2xl shadow-lg border border-gray-200 flex-1 relative">
                <div className="absolute w-0 h-0 border-r-[15px] border-t-[10px] border-b-[10px] border-r-white border-t-transparent border-b-transparent -left-4 top-4"></div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {lessonContent.intro.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {lessonContent.intro.text}
                </p>
              </div>
            </div>
          </div>

          {/* Activity Card */}
          <Card className="bg-commitinho-surface border-commitinho-surface-2">
            <CardHeader>
              <CardTitle className="text-commitinho-text flex items-center">
                <Code className="mr-2 h-5 w-5" />
                {activity.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-commitinho-text-soft" dangerouslySetInnerHTML={{ __html: activity.prompt }} />

              {/* Code Editor */}
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-lg border-2 border-gray-700">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-gray-400 text-sm ml-2">Python Terminal</span>
                </div>
                <pre className="block whitespace-pre-wrap"><code>{getDisplayCode()}</code></pre>
                {hasExecuted && isCorrect && (
                  <div className="mt-2 text-white">
                    <span className="text-gray-400">{'> '}</span>
                    {selectedChoice}
                  </div>
                )}
              </div>

              {/* Choices */}
              <div className="space-y-3">
                <h4 className="text-commitinho-text font-medium">
                  Escolha o que vai dentro das aspas:
                </h4>
                {activity.choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleChoiceSelect(choice)}
                    variant={selectedChoice === choice ? "default" : "outline"}
                    className={`w-full justify-start text-left h-auto p-4 ${
                      selectedChoice === choice 
                        ? "bg-primary text-primary-foreground" 
                        : "border-commitinho-surface-2 text-commitinho-text hover:bg-commitinho-surface-2"
                    }`}
                    disabled={hasExecuted}
                  >
                    "{choice}"
                  </Button>
                ))}
              </div>

              {/* Execute Button */}
              {!hasExecuted && (
                <div className="text-center">
                  <Button
                    onClick={handleExecute}
                    disabled={!selectedChoice}
                    size="lg"
                    className="bg-gradient-arcade text-white font-semibold shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Executar
                  </Button>
                </div>
              )}

              {/* Wrong Answer Feedback */}
              {hasExecuted && !isCorrect && (
                <Card className="bg-red-500/10 border-red-500">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">❌</div>
                    <h3 className="text-lg font-bold text-red-600 mb-2">
                      Ops! Tente novamente
                    </h3>
                    <p className="text-commitinho-text-soft mb-4">
                      Essa não é a resposta correta. Tente escolher outra opção!
                    </p>
                    <Button
                      onClick={() => {
                        setSelectedChoice('');
                        setHasExecuted(false);
                        setIsCorrect(false);
                      }}
                      variant="outline"
                      className="border-commitinho-surface-2 text-commitinho-text hover:bg-commitinho-surface-2"
                    >
                      Tentar Novamente
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-xl font-bold text-commitinho-success" dangerouslySetInnerHTML={{ __html: successMessage }} />
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="bg-commitinho-surface p-4 rounded-lg">
              <div className="text-commitinho-text-soft text-sm" dangerouslySetInnerHTML={{ __html: activity.explain }} />
            </div>
            
            <div className="bg-commitinho-warning/10 p-3 rounded-lg">
              <div className="flex items-center justify-center gap-3">
                <span className="text-commitinho-text font-medium">XP Ganho:</span>
                <Badge className="bg-commitinho-warning text-commitinho-warning-foreground">
                  +{activity.xp} XP
                </Badge>
              </div>
            </div>

            <Button
              onClick={handleLessonComplete}
              size="lg"
              className="w-full bg-gradient-arcade text-white font-semibold shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              {activity.commit_label}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Licao;