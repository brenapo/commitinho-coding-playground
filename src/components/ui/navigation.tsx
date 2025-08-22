import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-commitinho-surface border-b border-commitinho-surface-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo com mascote */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/ee82c2e5-f68a-417d-9f9d-0394381c468f.png" 
              alt="Commitinho"
              className="w-10 h-10 commitinho-mascot"
            />
            <div>
              <span className="text-xl font-bold text-commitinho-text">Commitinho</span>
              <p className="text-xs text-commitinho-muted -mt-1">seu amiguinho &lt;3</p>
            </div>
          </Link>
          
          {/* Menu de navegação */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
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
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
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