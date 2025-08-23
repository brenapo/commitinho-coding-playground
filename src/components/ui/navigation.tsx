import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-commitinho-surface border-b border-commitinho-surface-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo horizontal */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/assets/commitinho-logo.png" 
              alt="Commitinho"
              className="h-16 sm:h-20 w-auto"
            />
          </Link>
          
          {/* Menu de navegação */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              to="/"
              className={cn(
                "px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                location.pathname === "/" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-commitinho-text hover:bg-commitinho-surface-2"
              )}
            >
              Início
            </Link>
            <Link
              to="/jogos"
              className={cn(
                "px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                location.pathname === "/jogos" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-commitinho-text hover:bg-commitinho-surface-2"
              )}
            >
              Jogos
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;