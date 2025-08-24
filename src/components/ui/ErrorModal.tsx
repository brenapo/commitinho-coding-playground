import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ErrorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  onTryAgain: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  open,
  onOpenChange,
  title,
  message,
  onTryAgain
}) => {
  const handleTryAgain = () => {
    onOpenChange(false);
    onTryAgain();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-commitinho-surface border-red-500/20">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl">❌</div>
          <DialogTitle className="text-xl font-bold text-red-400 mb-4">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          <p className="text-commitinho-text-soft leading-relaxed">
            {message}
          </p>
          
          <Button
            onClick={handleTryAgain}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold"
          >
            Tentar Novamente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorModal;