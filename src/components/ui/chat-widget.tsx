import { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Oi! Eu sou o Commitinho! 👋",
      sender: "bot"
    },
    {
      id: 2,
      text: "Estou super animado para te ajudar a aprender programação de um jeito divertido!",
      sender: "bot"
    },
    {
      id: 3,
      text: "Em breve vou poder conversar contigo de verdade, mas por enquanto estou só praticando... 😊",
      sender: "bot"
    }
  ]);

  // Salvar estado no localStorage
  useEffect(() => {
    const saved = localStorage.getItem("commitinho-chat-open");
    if (saved) {
      setIsOpen(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("commitinho-chat-open", JSON.stringify(isOpen));
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: "user" as const
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simular resposta do bot (só echo para demonstração)
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: `Você disse: "${message}". Em breve vou conseguir te responder de verdade! 🚀`,
        sender: "bot" as const
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
    
    setMessage("");
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Fechar com Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  return (
    <>
      {/* Launcher fixo - movido para inferior direito */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={toggleChat}
          className={cn(
            "h-12 sm:h-14 px-3 sm:px-4 rounded-full shadow-lg transition-all duration-300",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "flex items-center gap-2 sm:gap-3 animate-float",
            isOpen && "scale-95"
          )}
          aria-label="Fale com o Commitinho"
        >
          <img 
            src="/lovable-uploads/ee82c2e5-f68a-417d-9f9d-0394381c468f.png" 
            alt="Commitinho"
            className="w-6 h-6 sm:w-8 sm:h-8 commitinho-mascot animate-pixel-glow"
          />
          <span className="font-medium hidden sm:block text-sm">Chat</span>
        </Button>
      </div>

      {/* Painel do chat - ajustado para aparecer acima do botão */}
      {isOpen && (
        <div className="fixed bottom-16 sm:bottom-20 right-2 sm:right-4 z-40 w-[calc(100vw-16px)] max-w-80 sm:max-w-[380px]">
          <div 
            className="bg-commitinho-surface border border-commitinho-surface-2 rounded-2xl shadow-xl animate-bounce-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-title"
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-commitinho-surface-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <img 
                  src="/lovable-uploads/ee82c2e5-f68a-417d-9f9d-0394381c468f.png" 
                  alt="Commitinho"
                  className="w-6 h-6 sm:w-8 sm:h-8 commitinho-mascot"
                />
                <h3 id="chat-title" className="font-semibold text-commitinho-text text-sm sm:text-base">
                  Fale com o Commitinho
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-commitinho-surface-2"
                aria-label="Fechar chat"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>

            {/* Mensagens */}
            <div className="max-h-60 sm:max-h-80 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-2xl text-xs sm:text-sm",
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-commitinho-surface-2 text-commitinho-text"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-commitinho-surface-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-2 sm:px-3 py-2 bg-commitinho-bg border border-commitinho-surface-2 rounded-lg text-xs sm:text-sm text-commitinho-text placeholder-commitinho-text-soft focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="px-2 sm:px-3"
                  aria-label="Enviar mensagem"
                >
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
              <p className="text-xs text-commitinho-text-soft mt-2 text-center">
                💡 Em breve com IA de verdade!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;