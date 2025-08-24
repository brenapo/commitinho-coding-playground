import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket } from 'lucide-react';

export type SuccessModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;        // ex: "Uhuu! Você fez o computador dizer: Olá!"
  xp: number;           // ex: 10
  explanation: string;  // texto didático curto
  onNext: () => void;   // navega para a próxima lição/atividade
};

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onOpenChange,
  title,
  xp,
  explanation,
  onNext
}) => {
  // Focus no botão quando abrir
  useEffect(() => {
    if (open) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Optional confetti effect
      // triggerConfetti(); // Uncomment if confetti lib is available
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleNext = () => {
    onOpenChange(false);
    onNext();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="bg-white/5 backdrop-blur-sm border-green-500/40 rounded-2xl shadow-lg max-w-md mx-4 p-0 overflow-hidden"
        aria-describedby="success-description"
      >
        <div className="bg-gradient-to-br from-green-500/10 to-commitinho-success/10 p-6">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <img 
                src="/lovable-uploads/ee82c2e5-f68a-417d-9f9d-0394381c468f.png"
                alt="Commitinho celebrando"
                className="w-16 h-16 commitinho-mascot animate-bounce-in"
              />
              <div className="text-4xl">🎉</div>
            </div>
            
            <DialogTitle className="text-center">
              <div className="text-2xl font-bold text-commitinho-success mb-3">
                {title}
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* XP Badge */}
          <div className="flex justify-center mb-4">
            <Badge className="bg-commitinho-warning text-commitinho-warning-foreground px-4 py-2 text-lg font-semibold">
              +{xp} XP
            </Badge>
          </div>

          {/* Explanation */}
          <div 
            id="success-description"
            className="bg-white/10 rounded-lg p-4 mb-6 border border-white/20"
          >
            <p className="text-commitinho-text text-sm leading-relaxed text-center">
              {explanation}
            </p>
          </div>

          {/* Next Button */}
          <div className="text-center">
            <Button
              onClick={handleNext}
              size="lg"
              className="bg-gradient-arcade text-white font-semibold shadow-glow-primary hover:shadow-glow-secondary transition-all duration-300 px-6 py-3"
              autoFocus
            >
              <Rocket className="mr-2 h-5 w-5" />
              🚀 Próxima missão
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;