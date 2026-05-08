import { Button } from '@/components/ui/button';
import { STATUS_LIST, POSTURAS, StatusType, PosturaType } from '@/types/processo';
import { Filter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  currentStatus: StatusType | 'Todos';
  onStatusChange: (status: StatusType | 'Todos') => void;
  currentPostura: PosturaType | 'Todas';
  onPosturaChange: (postura: PosturaType | 'Todas') => void;
}

export function FilterBar({ 
  currentStatus, 
  onStatusChange, 
  currentPostura, 
  onPosturaChange 
}: FilterBarProps) {
  
  const hasActiveFilters = currentStatus !== 'Todos' || currentPostura !== 'Todas';

  const clearFilters = () => {
    onStatusChange('Todos');
    onPosturaChange('Todas');
  };

  return (
    <div className="flex flex-wrap items-center gap-3 fade-slide-in">
      {/* Filtro de Status */}

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Status:</span>
        <Select value={currentStatus} onValueChange={(val) => onStatusChange(val as any)}>
          <SelectTrigger className="h-9 w-[180px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg text-sm">
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os Status</SelectItem>
            {STATUS_LIST.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de Postura */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Postura:</span>
        <Select value={currentPostura} onValueChange={(val) => onPosturaChange(val as any)}>
          <SelectTrigger className="h-9 w-[180px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg text-sm">
            <SelectValue placeholder="Filtrar por Postura" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas as Posturas</SelectItem>
            {POSTURAS.map((postura) => (
              <SelectItem key={postura} value={postura}>{postura}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Botão Limpar */}
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters}
          className="h-9 px-3 text-slate-500 hover:text-rose-500 gap-2"
        >
          <X className="h-4 w-4" />
          Limpar
        </Button>
      )}
    </div>
  );
}