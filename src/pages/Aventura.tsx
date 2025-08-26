import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Play, Lock, Trophy, Check, RotateCcw } from 'lucide-react';
import { UserProgress, SkillNode } from '@/types/progress';
import { useSupabaseProgress } from '@/hooks/useSupabaseProgress';
import { curriculum, basicAdventureWorld, basicAdventureLessons } from '@/data/curriculum';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CURRICULUM_MODULES, ModuleData } from '@/types/modules';
import { useSecureStorage } from '@/hooks/useSecureStorage';
import { useCapacitor } from '@/hooks/useCapacitor';

const Aventura = () => {
  const navigate = useNavigate();
  const { getValue } = useSecureStorage();
  const { hapticSuccess } = useCapacitor();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [childName, setChildName] = useState('Aventureiro');
  const { 
    progress, 
    isLoading, 
    getNextLessonId, 
    isSkillUnlockedForUser, 
    getSkillStarsForUser,
    resetUserProgress
  } = useSupabaseProgress();

  // Load child name
  useEffect(() => {
    const loadChildName = async () => {
      try {
        const name = await getValue('commitinho.display_name');
        if (name) {
          setChildName(name);
        }
      } catch (error) {
        // Fallback to localStorage
        const fallbackName = localStorage.getItem('commitinho.display_name');
        if (fallbackName) {
          setChildName(fallbackName);
        }
      }
    };

    loadChildName();
  }, [getValue]);

  // Basic Adventure helpers - MOVE BEFORE CONDITIONAL RETURN
  useEffect(() => {
    if (!progress) return;
    const lastCompletedIndex = basicAdventureLessons.findLastIndex(lesson => 
      (progress.stars[lesson.id] || 0) > 0
    );
    // If no lessons completed, start with lesson 0 (basic-01)
    // If some completed, next lesson is lastCompletedIndex + 1
    const nextIndex = lastCompletedIndex + 1;
    setCurrentLessonIndex(Math.min(nextIndex, basicAdventureLessons.length - 1));
  }, [progress]);

  if (isLoading || !progress) {
    return (
      <div className="min-h-screen bg-commitinho-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleBasicLessonClick = (lessonIndex: number) => {
    const lesson = basicAdventureLessons[lessonIndex];
    const isCompleted = (progress.stars[lesson.id] || 0) > 0;
    const isCurrent = lessonIndex === currentLessonIndex;
    const isFirstLesson = lessonIndex === 0;
    
    if (isCompleted || isCurrent || isFirstLesson) {
      navigate(`/licao/${lesson.id}`);
    }
  };

  const getBasicLessonStatus = (lessonIndex: number) => {
    if (!progress) return 'locked';
    
    const lesson = basicAdventureLessons[lessonIndex];
    const stars = progress.stars[lesson.id] || 0;
    
    if (stars > 0) return 'completed';
    if (lessonIndex === 0) return 'current'; // First lesson always available
    if (lessonIndex === currentLessonIndex) return 'current';
    if (lessonIndex < currentLessonIndex) return 'available';
    return 'locked';
  };

  const getTotalBasicStars = () => {
    if (!progress) return 0;
    return basicAdventureLessons.reduce((total, lesson) => 
      total + (progress.stars[lesson.id] || 0), 0
    );
  };

  const getCompletedBasicLessons = () => {
    if (!progress) return 0;
    return basicAdventureLessons.filter(lesson => (progress.stars[lesson.id] || 0) > 0).length;
  };

  const getBasicOverallProgress = () => {
    return (getCompletedBasicLessons() / basicAdventureLessons.length) * 100;
  };

  // Module helper functions
  const getModuleProgress = (module: ModuleData) => {
    if (!progress) return 0;
    
    if (module.id === 'basic-adventure') {
      return getBasicOverallProgress();
    }
    
    // For other modules, calculate based on completed lessons
    const completedLessons = module.lessons.filter(lessonId => 
      (progress.stars[lessonId] || 0) > 0
    ).length;
    
    return (completedLessons / module.lessons.length) * 100;
  };

  const getModuleStars = (module: ModuleData) => {
    if (!progress) return 0;
    
    if (module.id === 'basic-adventure') {
      return getTotalBasicStars();
    }
    
    return module.lessons.reduce((total, lessonId) => 
      total + (progress.stars[lessonId] || 0), 0
    );
  };

  const isModuleUnlocked = (module: ModuleData) => {
    if (!progress || module.unlocked) return true;
    
    // Module is unlocked if user has required XP
    return progress.xp >= (module.requiredXP || 0);
  };

  const isModuleCompleted = (module: ModuleData) => {
    if (!progress) return false;
    
    if (module.id === 'basic-adventure') {
      return getCompletedBasicLessons() === basicAdventureLessons.length;
    }
    
    return module.lessons.every(lessonId => (progress.stars[lessonId] || 0) > 0);
  };

  const getFirstIncompleteLesson = (module: ModuleData) => {
    if (module.id === 'basic-adventure') {
      const incompleteIndex = basicAdventureLessons.findIndex(lesson => 
        (progress?.stars[lesson.id] || 0) === 0
      );
      return incompleteIndex >= 0 ? basicAdventureLessons[incompleteIndex].id : basicAdventureLessons[0].id;
    }
    
    const incompleteLesson = module.lessons.find(lessonId => 
      (progress?.stars[lessonId] || 0) === 0
    );
    return incompleteLesson || module.lessons[0];
  };

  const handleModuleClick = (module: ModuleData) => {
    if (!isModuleUnlocked(module)) {
      return; // Module is locked
    }

    hapticSuccess();
    
    const firstLesson = getFirstIncompleteLesson(module);
    navigate(`/licao/${firstLesson}`);
  };

  // Original skills logic
  const currentWorld = curriculum.find(w => w.id === progress.world);
  if (!currentWorld) {
    return (
      <div className="min-h-screen bg-commitinho-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-commitinho-text mb-4">Mundo não encontrado</h2>
          <Button onClick={() => navigate('/')}>Voltar ao Início</Button>
        </div>
      </div>
    );
  }

  const handleSkillClick = (skill: SkillNode) => {
    if (!isSkillUnlockedForUser(skill.world, skill.skill)) {
      return;
    }

    const nextLesson = skill.lessons.find(lesson => {
      const lessonStars = progress.stars[lesson.id] || 0;
      return lessonStars === 0;
    });

    if (nextLesson) {
      navigate(`/licao/${nextLesson.id}`);
    } else {
      navigate(`/licao/${skill.lessons[0].id}`);
    }
  };

  const getSkillProgress = (skill: SkillNode) => {
    const totalStars = getSkillStarsForUser(skill.world, skill.skill);
    const maxStars = skill.maxStars;
    return (totalStars / maxStars) * 100;
  };

  const isSkillCompleted = (skill: SkillNode) => {
    return skill.lessons.every(lesson => (progress.stars[lesson.id] || 0) > 0);
  };

  const getSkillStatus = (skill: SkillNode) => {
    const unlocked = isSkillUnlockedForUser(skill.world, skill.skill);
    const completed = isSkillCompleted(skill);
    
    if (!unlocked) return 'locked';
    if (completed) return 'completed';
    
    const hasProgress = skill.lessons.some(lesson => (progress.stars[lesson.id] || 0) > 0);
    return hasProgress ? 'in-progress' : 'available';
  };

  const handleResetAdventure = () => {
    // Clear localStorage name and reset progress
    localStorage.removeItem('commitinho.display_name');
    resetUserProgress();
    setShowResetDialog(false);
    // Redirect to welcome page
    navigate('/aventura/boas-vindas');
  };

  return (
    <div className="min-h-screen bg-commitinho-bg">
      {/* Header */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-commitinho-text mb-2">
                Aventura Commitinho
              </h1>
              <p className="text-commitinho-text-soft">Aprenda programação passo a passo!</p>
            </div>
            
            {/* Stats and Reset Button */}
            <div className="hidden sm:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-commitinho-warning">{progress.xp}</div>
                <div className="text-sm text-commitinho-text-soft">XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{progress.streak}</div>
                <div className="text-sm text-commitinho-text-soft">Dias</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {Object.values(progress.stars).reduce((sum, stars) => sum + stars, 0)}
                </div>
                <div className="text-sm text-commitinho-text-soft">Estrelas</div>
              </div>
              
              {/* Reset Button */}
              <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white font-medium"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reiniciar Aventura
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-commitinho-surface border-commitinho-surface-2 mx-4 max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-commitinho-text text-lg sm:text-xl flex items-center">
                      <RotateCcw className="mr-2 h-5 w-5 text-red-500" />
                      Reiniciar toda a Aventura?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-commitinho-text-soft text-sm sm:text-base">
                      Esta ação irá apagar <strong>todo o seu progresso atual</strong>, incluindo:
                      <br />• Todas as estrelas conquistadas
                      <br />• Todo o XP acumulado
                      <br />• Dias de sequência (streak)
                      <br />• Nome da criança
                      <br /><br />
                      Você voltará para a tela de apresentação do Commitinho onde precisará inserir o nome novamente.
                      <br /><br />
                      <span className="text-red-400 font-medium">Esta ação não pode ser desfeita!</span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="w-full sm:w-auto bg-commitinho-surface-2 text-commitinho-text border-commitinho-surface-2 hover:bg-commitinho-surface">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleResetAdventure}
                      className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 font-medium"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Sim, Reiniciar Aventura
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Mobile stats */}
          <div className="sm:hidden space-y-4 mb-8">
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-commitinho-surface border-commitinho-surface-2 text-center">
                <CardContent className="p-4">
                  <div className="text-xl font-bold text-commitinho-warning">{progress.xp}</div>
                  <div className="text-xs text-commitinho-text-soft">XP</div>
                </CardContent>
              </Card>
              <Card className="bg-commitinho-surface border-commitinho-surface-2 text-center">
                <CardContent className="p-4">
                  <div className="text-xl font-bold text-primary">{progress.streak}</div>
                  <div className="text-xs text-commitinho-text-soft">Dias</div>
                </CardContent>
              </Card>
              <Card className="bg-commitinho-surface border-commitinho-surface-2 text-center">
                <CardContent className="p-4">
                  <div className="text-xl font-bold text-secondary">
                    {Object.values(progress.stars).reduce((sum, stars) => sum + stars, 0)}
                  </div>
                  <div className="text-xs text-commitinho-text-soft">Estrelas</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Mobile Reset Button */}
            <div className="text-center">
              <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white font-medium w-full sm:w-auto"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reiniciar Aventura
                  </Button>
                </AlertDialogTrigger>
              </AlertDialog>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Basic Adventure Section */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-gradient-to-r from-commitinho-warning/10 to-commitinho-success/10 border-commitinho-warning/30 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-commitinho-text mb-2 flex items-center">
                    🚀 {basicAdventureWorld.title}
                  </CardTitle>
                  <p className="text-commitinho-text-soft">{basicAdventureWorld.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-commitinho-warning">{getTotalBasicStars()}</div>
                  <div className="text-xs text-commitinho-text-soft">Estrelas</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-commitinho-text-soft">Progresso: {getCompletedBasicLessons()}/10 lições</span>
                  <span className="text-commitinho-text-soft">{Math.round(getBasicOverallProgress())}%</span>
                </div>
                <Progress value={getBasicOverallProgress()} className="h-3" />
              </div>

              {/* Lessons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                {basicAdventureLessons.map((lesson, index) => {
                  const status = getBasicLessonStatus(index);
                  const stars = progress.stars[lesson.id] || 0;

                  return (
                    <Card
                      key={lesson.id}
                      className={`
                        transition-all duration-300 cursor-pointer relative overflow-hidden
                        ${status === 'locked' 
                          ? 'bg-commitinho-surface/50 border-commitinho-surface-2/50 opacity-60' 
                          : 'bg-commitinho-surface border-commitinho-surface-2 hover:shadow-glow-primary'
                        }
                        ${status === 'completed' ? 'ring-2 ring-commitinho-success' : ''}
                        ${status === 'current' ? 'ring-2 ring-commitinho-warning animate-pulse' : ''}
                      `}
                      onClick={() => handleBasicLessonClick(index)}
                    >
                      <CardContent className="p-3 text-center">
                        <div className={`
                          w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center text-sm
                          ${status === 'completed' ? 'bg-commitinho-success text-white' :
                            status === 'current' ? 'bg-commitinho-warning text-white' :
                            status === 'available' ? 'bg-primary text-white' :
                            'bg-commitinho-surface-2 text-commitinho-text-soft'
                          }
                        `}>
                          {status === 'locked' ? (
                            <Lock className="h-4 w-4" />
                          ) : status === 'completed' ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        
                        <div className="text-xs text-commitinho-text font-medium mb-1">
                          Lição {index + 1}
                        </div>
                        
                        {/* Stars */}
                        <div className="flex justify-center space-x-1">
                          {[1, 2, 3].map((starNum) => (
                            <Star 
                              key={starNum}
                              className={`h-3 w-3 ${
                                starNum <= stars 
                                  ? 'fill-commitinho-warning text-commitinho-warning' 
                                  : 'text-commitinho-surface-2'
                              }`}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-gradient-arcade text-white font-semibold shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300 mr-4"
                  onClick={() => {
                    // Always start with first lesson if no progress, otherwise continue with next
                    const lessonIndex = getCompletedBasicLessons() === 0 ? 0 : currentLessonIndex;
                    const nextLesson = basicAdventureLessons[lessonIndex];
                    if (nextLesson) {
                      navigate(`/licao/${nextLesson.id}`);
                    }
                  }}
                >
                  <Play className="mr-2 h-5 w-5" />
                  {getCompletedBasicLessons() === 0 ? 'Começar Aventura Básica' : 'Continuar'}
                </Button>

                {/* Completion celebration */}
                {getCompletedBasicLessons() === basicAdventureLessons.length && (
                  <Badge className="bg-commitinho-success text-white px-4 py-2">
                    🎉 Aventura Básica Completa! +{basicAdventureWorld.rewardXp} XP
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* New Curriculum Modules */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-commitinho-text mb-2">
              Aventura do {childName} 🚀
            </h2>
            <p className="text-commitinho-text-soft">
              Explore cada módulo e desbloqueie novos conceitos de programação!
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {CURRICULUM_MODULES.map((module, index) => {
              const moduleProgress = getModuleProgress(module);
              const moduleStars = getModuleStars(module);
              const isUnlocked = isModuleUnlocked(module);
              const isCompleted = isModuleCompleted(module);

              return (
                <Card
                  key={module.id}
                  className={`
                    relative overflow-hidden transition-all duration-300 cursor-pointer
                    ${!isUnlocked 
                      ? 'bg-commitinho-surface/50 border-commitinho-surface-2/50 opacity-60' 
                      : 'bg-commitinho-surface border-commitinho-surface-2 hover:shadow-glow-primary'
                    }
                    ${isCompleted ? 'ring-2 ring-commitinho-success' : ''}
                  `}
                  onClick={() => handleModuleClick(module)}
                  role="button"
                  tabIndex={!isUnlocked ? -1 : 0}
                  aria-disabled={!isUnlocked}
                  aria-label={`${module.title}: ${module.description}. ${
                    !isUnlocked ? `Necessário ${module.requiredXP} XP` :
                    isCompleted ? 'Completo' : 'Em progresso'
                  }`}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-5`} />
                  
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">{module.icon}</div>
                      
                      {/* Lock/Stars/Complete indicator */}
                      <div className="flex items-center space-x-2">
                        {!isUnlocked ? (
                          <div className="flex flex-col items-center">
                            <Lock className="h-4 w-4 text-commitinho-text-soft" />
                            <span className="text-xs text-commitinho-text-soft">
                              {module.requiredXP} XP
                            </span>
                          </div>
                        ) : isCompleted ? (
                          <div className="flex flex-col items-center">
                            <Trophy className="h-5 w-5 text-commitinho-success" />
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-commitinho-warning text-commitinho-warning" />
                              <span className="text-xs font-medium text-commitinho-text">
                                {moduleStars}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Play className="h-4 w-4 text-primary" />
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-commitinho-warning text-commitinho-warning" />
                              <span className="text-xs font-medium text-commitinho-text">
                                {moduleStars}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <CardTitle className="text-commitinho-text text-lg">
                      {module.title}
                    </CardTitle>
                    <p className="text-sm text-commitinho-text-soft">
                      {module.description}
                    </p>
                  </CardHeader>

                  <CardContent className="relative pt-0">
                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-commitinho-text-soft">Progresso</span>
                        <span className="text-commitinho-text-soft">
                          {Math.round(moduleProgress)}%
                        </span>
                      </div>
                      <Progress 
                        value={moduleProgress} 
                        className="h-2"
                      />
                    </div>

                    {/* Lesson indicators */}
                    <div className="mt-4 grid grid-cols-5 gap-1">
                      {module.lessons.map((lessonId, lessonIndex) => {
                        const lessonStars = (progress?.stars[lessonId] || 0);
                        return (
                          <div 
                            key={lessonId}
                            className={`
                              h-2 rounded-full
                              ${lessonStars === 0 
                                ? 'bg-commitinho-surface-2' 
                                : lessonStars === 1
                                ? 'bg-commitinho-warning'
                                : lessonStars === 2
                                ? 'bg-primary'
                                : 'bg-commitinho-success'
                              }
                            `}
                            title={`Lição ${lessonIndex + 1}: ${lessonStars} estrelas`}
                          />
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Original Skills Tree */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-commitinho-text mb-2">{currentWorld.title}</h2>
            <p className="text-commitinho-text-soft">{currentWorld.description}</p>
          </div>

          <div className="space-y-8">
            {currentWorld.skills.map((skill, index) => {
              const status = getSkillStatus(skill);
              const skillProgress = getSkillProgress(skill);
              const totalStars = getSkillStarsForUser(skill.world, skill.skill);

              return (
                <div key={skill.id} className="relative">
                  {/* Connection line to next skill */}
                  {index < currentWorld.skills.length - 1 && (
                    <div className="absolute left-1/2 bottom-0 w-0.5 h-8 bg-commitinho-surface-2 transform translate-y-full -translate-x-0.5 z-0"></div>
                  )}

                  <Card 
                    className={`
                      relative z-10 transition-all duration-300 cursor-pointer
                      ${status === 'locked' 
                        ? 'bg-commitinho-surface/50 border-commitinho-surface-2/50 opacity-60' 
                        : 'bg-commitinho-surface border-commitinho-surface-2 hover:shadow-glow-primary'
                      }
                      ${status === 'completed' ? 'ring-2 ring-commitinho-success' : ''}
                      ${status === 'in-progress' ? 'ring-2 ring-commitinho-warning' : ''}
                    `}
                    onClick={() => handleSkillClick(skill)}
                    role="button"
                    tabIndex={status === 'locked' ? -1 : 0}
                    aria-disabled={status === 'locked'}
                    aria-label={`${skill.title}: ${skill.concept}. ${
                      status === 'locked' ? 'Bloqueado' :
                      status === 'completed' ? 'Completo' :
                      status === 'in-progress' ? 'Em progresso' : 'Disponível'
                    }. ${totalStars} de ${skill.maxStars} estrelas.`}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && status !== 'locked') {
                        e.preventDefault();
                        handleSkillClick(skill);
                      }
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Skill icon */}
                          <div className={`
                            w-16 h-16 rounded-full flex items-center justify-center text-2xl
                            ${status === 'locked' 
                              ? 'bg-commitinho-surface-2 text-commitinho-text-soft' 
                              : status === 'completed'
                              ? 'bg-commitinho-success text-commitinho-success-foreground'
                              : status === 'in-progress'
                              ? 'bg-gradient-arcade text-white'
                              : 'bg-primary text-primary-foreground'
                            }
                          `}>
                            {status === 'locked' ? (
                              <Lock className="h-6 w-6" />
                            ) : status === 'completed' ? (
                              <Trophy className="h-6 w-6" />
                            ) : (
                              <Play className="h-6 w-6" />
                            )}
                          </div>

                          <div>
                            <CardTitle className="text-commitinho-text text-xl mb-1">
                              {skill.title}
                            </CardTitle>
                            <p className="text-sm text-commitinho-text-soft mb-2">
                              {skill.concept}
                            </p>
                            
                            {/* Stars display */}
                            <div className="flex items-center space-x-1" role="img" aria-label={`${totalStars} de ${skill.maxStars} estrelas conquistadas`}>
                              {[1, 2, 3].map((starNum) => (
                                <Star 
                                  key={starNum}
                                  className={`h-4 w-4 ${
                                    starNum <= totalStars 
                                      ? 'fill-commitinho-warning text-commitinho-warning' 
                                      : 'text-commitinho-surface-2'
                                  }`}
                                  aria-hidden="true"
                                />
                              ))}
                              <span className="text-xs text-commitinho-text-soft ml-2" aria-hidden="true">
                                {totalStars}/{skill.maxStars}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className="text-right">
                          {status === 'completed' && (
                            <Badge className="bg-commitinho-success text-commitinho-success-foreground">
                              Completo!
                            </Badge>
                          )}
                          {status === 'in-progress' && (
                            <Badge className="bg-commitinho-warning text-commitinho-warning-foreground">
                              Em Progresso
                            </Badge>
                          )}
                          {status === 'available' && (
                            <Badge className="bg-primary text-primary-foreground">
                              Disponível
                            </Badge>
                          )}
                          {status === 'locked' && (
                            <Badge className="bg-commitinho-surface-2 text-commitinho-text-soft">
                              Bloqueado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-commitinho-text-soft">Progresso</span>
                          <span className="text-commitinho-text-soft">{Math.round(skillProgress)}%</span>
                        </div>
                        <Progress 
                          value={skillProgress} 
                          className="h-2"
                        />
                      </div>

                      {/* Lessons preview */}
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {skill.lessons.map((lesson) => {
                          const lessonStars = progress.stars[lesson.id] || 0;
                          return (
                            <div 
                              key={lesson.id}
                              className={`
                                h-2 rounded-full
                                ${lessonStars === 0 
                                  ? 'bg-commitinho-surface-2' 
                                  : lessonStars === 1
                                  ? 'bg-commitinho-warning'
                                  : lessonStars === 2
                                  ? 'bg-primary'
                                  : 'bg-commitinho-success'
                                }
                              `}
                            />
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Continue/Practice button for original curriculum */}
          <div className="mt-12 text-center">
            <Button 
              size="lg"
              className="bg-gradient-arcade text-white font-semibold shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300"
              onClick={() => {
                const nextLessonId = getNextLessonId();
                if (nextLessonId) {
                  navigate(`/licao/${nextLessonId}`);
                }
              }}
            >
              <Play className="mr-2 h-5 w-5" />
              Continuar Currículo Avançado
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Aventura;