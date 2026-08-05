import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-foreground/60 ${className}`}
    >
      <Link
        to="/"
        className="flex items-center gap-1.5 hover:text-gold transition-colors text-foreground/70"
      >
        <Home className="h-3 w-3 text-gold/75" />
        <span>Accueil</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center gap-2">
            <ChevronRight className="h-3 w-3 text-gold/40 shrink-0" />
            {isLast || !item.href ? (
              <span className="text-gold font-medium truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-gold transition-colors text-foreground/70 truncate max-w-[150px] sm:max-w-none"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
