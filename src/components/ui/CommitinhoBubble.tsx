import React from 'react';

interface CommitinhoBubbleProps {
  text: string;
}

const CommitinhoBubble: React.FC<CommitinhoBubbleProps> = ({ text }) => {
  return (
    <div className="flex items-start space-x-3 mb-6">
      <div className="flex-shrink-0">
        <img 
          src="/lovable-uploads/ee82c2e5-f68a-417d-9f9d-0394381c468f.png" 
          alt="Commitinho"
          className="w-12 h-12 commitinho-mascot"
        />
      </div>
      <div className="flex-1">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 relative">
          <div className="absolute -left-2 top-3 w-4 h-4 bg-white/10 border-l border-b border-white/20 rotate-45 backdrop-blur-sm"></div>
          <p className="text-commitinho-text text-sm font-medium">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommitinhoBubble;