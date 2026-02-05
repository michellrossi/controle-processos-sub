import { Button } from '@/components/ui/button';
import { STATUS_LIST, StatusType } from '@/types/processo';
import { CheckCircle, AlertCircle, Archive, Send, Mail, Layers, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  currentFilter: StatusType | 'Todos';
  onFilterChange: (status: StatusType | 'Todos') => void;
  counts?: Record<string, number>; // Opcional: se quiser mostrar contadores nos botões
}

// Configuração de cores e ícones (Consistente com DashboardCards)
const FILTER_CONFIG: Record<StatusType, { icon: React.ReactNode; color: string; activeClass: string; hoverClass: string }> = {
  'Ação necessária': { 
    icon: <AlertCircle className="h-4 w-4" />, 
    color: 'text-red-600',
    activeClass: 'bg-red-500 text-white hover:bg-red-600 border-red-500',
    hoverClass: 'hover:bg-red-50 text-red-600 border-red-200'
  },
  'Demanda concluída': { 
    icon: <CheckCircle className="h-4 w-4" />, 
    color: 'text-emerald-600',
    activeClass: 'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500',
    hoverClass: 'hover:bg-emerald-50 text-emerald-600 border-emerald-200'
  },
  'Demanda devolvida': { 
    icon: <Archive className="h-4 w-4" />, 
    color: 'text-purple-600',
    activeClass: 'bg-purple-500 text-white hover:bg-purple-600 border-purple-500',
    hoverClass: 'hover:bg-purple-50 text-purple-600 border-purple-200'
  },
  'Demanda agrupada': { 
    icon: <Layers className="h-4 w-4" />, 
    color: 'text-blue-600',
    activeClass: 'bg-blue-500 text-white hover:bg-blue-600 border-blue-500',
    hoverClass: 'hover:bg-blue-50 text-blue-600 border-blue-200'
  },
  'Auto emitido': { 
    icon: <Send className="h-4 w-4" />, 
    color: 'text-orange-600',
    activeClass: 'bg-orange-500 text-white hover:bg-orange-600 border-orange-500',
    hoverClass: 'hover:bg-orange-50 text-orange-600 border-orange-200'
  },
  'A.R. devolvido': { 
    icon: <Mail className="h-4 w-4" />, 
    color: 'text-rose-600',
    activeClass: 'bg-rose-500 text-white hover:bg-rose-600 border-rose-500',
    hoverClass: 'hover:bg-rose-50 text-rose-600 border-rose-200'
  },
  'A.R. entregue': { 
    icon: <Mail className="h-4 w-4" />, 
    color: 'text-teal-600',
    activeClass: 'bg-teal-500 text-white hover:bg-teal-600 border-teal-500',
    hoverClass: 'hover:bg-teal-50 text-teal-600 border-teal-200'
  },
};

export function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="w-full py-4">
      {/* Container flexível e centralizado */}
      <div className="flex flex-wrap justify-center items-center gap-2">
        
        {/* Botão "Todos" */}
        <Button
          variant={currentFilter === 'Todos' ? 'default' : 'outline'}
          onClick={() => onFilterChange('Todos')}
          className={cn(
            "gap-2 transition-all duration-200 rounded-full",
            currentFilter === 'Todos' 
              ? "bg-primary text-primary-foreground shadow-md scale-105" 
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          <Filter className="h-4 w-4" />
          Todos
        </Button>

        <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

        {/* Botões de Status */}
        {STATUS_LIST.filter(status => status !== 'Demanda devolvida').map((status) => {
          const config = FILTER_CONFIG[status];
          const isActive = currentFilter === status;

          return (
            <Button
              key={status}
              variant="outline"
              onClick={() => onFilterChange(status)}
              className={cn(
                "gap-2 transition-all duration-200 rounded-full border",
                isActive 
                  ? cn(config.activeClass, "shadow-md scale-105 border-transparent") 
                  : cn(config.hoverClass, "bg-white dark:bg-card"),
              )}
            >
              <span className={isActive ? "text-white" : config.color}>
                {config.icon}
              </span>
              {status}
            </Button>
          );
        })}
      </div>
    </div>
  );
}