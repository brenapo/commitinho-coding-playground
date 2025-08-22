import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Play, Lock, RotateCcw, Trophy } from 'lucide-react';
import { UserProgress, SkillNode } from '@/types/progress';
import { useProgress } from '@/hooks/useProgress';
import { curriculum } from '@/data/curriculum';

const Aventura = () => {
  const navigate = useNavigate();
  const { 
    progress, 
    isLoading, 
    getNextLessonId, 
    isSkillUnlockedForUser, 
    getSkillStarsForUser 
  } = useProgress();

  if (isLoading || !progress) {
    return (
      <div className="min-h-screen bg-commitinho-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

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

    // Find the next incomplete lesson in this skill
    const nextLesson = skill.lessons.find(lesson => {
      const lessonStars = progress.stars[lesson.id] || 0;
      return lessonStars === 0; // Not completed yet
    });

    if (nextLesson) {
      navigate(`/licao/${nextLesson.id}`);
    } else {
      // All lessons completed, go to first lesson for review
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
    
    // Check if any lesson has been started
    const hasProgress = skill.lessons.some(lesson => (progress.stars[lesson.id] || 0) > 0);
    return hasProgress ? 'in-progress' : 'available';
  };

  return (
    <div className="min-h-screen bg-commitinho-bg">
      {/* Header */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-commitinho-text mb-2">
                {currentWorld.title}
              </h1>
              <p className="text-commitinho-text-soft">{currentWorld.description}</p>
            </div>
            
            {/* Stats */}
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
            </div>
          </div>

          {/* Mobile stats */}
          <div className="sm:hidden grid grid-cols-3 gap-4 mb-8">
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
        </div>
      </section>

      {/* Skills Tree */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
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

          {/* Continue/Practice button */}
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
              Continuar Aventura
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Aventura;