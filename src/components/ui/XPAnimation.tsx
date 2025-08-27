import React from 'react';
import { Star, Trophy, Zap, Heart } from 'lucide-react';

interface XPAnimationProps {
  xp: number;
  reason?: string;
  visible: boolean;
  onComplete: () => void;
}

export const XPAnimation: React.FC<XPAnimationProps> = ({ xp, reason, visible, onComplete }) => {
  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in pointer-events-none">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full shadow-lg flex items-center">
        <Star className="h-6 w-6 mr-2 animate-spin" />
        <div className="text-center">
          <div className="font-bold text-lg">+{xp} XP</div>
          {reason && <div className="text-xs opacity-90">{reason}</div>}
        </div>
      </div>
    </div>
  );
};

interface AchievementUnlockedProps {
  achievement: {
    name: string;
    description: string;
    emoji: string;
    xp: number;
  };
  visible: boolean;
  onComplete: () => void;
}

export const AchievementUnlocked: React.FC<AchievementUnlockedProps> = ({ 
  achievement, 
  visible, 
  onComplete 
}) => {
  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl animate-bounce-in">
        <div className="text-6xl mb-4 animate-bounce">{achievement.emoji}</div>
        <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
        <h3 className="text-xl font-bold text-purple-800 mb-2">Conquista Desbloqueada!</h3>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">{achievement.name}</h4>
        <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full">
          <Star className="h-4 w-4 inline mr-1" />
          +{achievement.xp} XP Bônus!
        </div>
      </div>
    </div>
  );
};

interface LevelUpModalProps {
  newLevel: {
    level: number;
    name: string;
    emoji: string;
    benefits: string[];
  };
  visible: boolean;
  onComplete: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ 
  newLevel, 
  visible, 
  onComplete 
}) => {
  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl animate-bounce-in text-white">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-4">PARABÉNS!</h2>
        
        <div className="bg-white/20 rounded-lg p-4 mb-4">
          <div className="text-4xl mb-2">{newLevel.emoji}</div>
          <div className="text-sm opacity-80 mb-1">Nível {newLevel.level}</div>
          <div className="text-lg font-bold">{newLevel.name}</div>
        </div>
        
        <div className="text-left mb-6">
          <h4 className="font-bold mb-2 text-center">🎁 Você desbloqueou:</h4>
          {newLevel.benefits.map((benefit, index) => (
            <div key={index} className="text-sm mb-1 flex items-center">
              <Zap className="h-4 w-4 mr-2 text-yellow-300" />
              {benefit}
            </div>
          ))}
        </div>
        
        <button
          onClick={onComplete}
          className="w-full bg-white text-purple-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Continuar aventura! 🚀
        </button>
      </div>
    </div>
  );
};