import { useState, useEffect } from 'react';
import { STATUS_LIST, POSTURAS, StatusType, PosturaType } from '@/types/processo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  onSearchChange: (search: string) => void;
  onStatusFilter: (status: StatusType | null) => void;
  onPosturaFilter: (postura: PosturaType | null) => void;
  activeStatus: StatusType | null;
  activePostura: PosturaType | null;
}

const STATUS_TOGGLE_COLORS: Record<StatusType, string> = {
  'Ação necessária': 'data-[active=true]:bg-status-acao data-[active=true]:text-white',
  'Demanda concluída': 'data-[active=true]:bg-status-concluida data-[active=true]:text-white',
  'Demanda devolvida': 'data-[active=true]:bg-status-devolvida data-[active=true]:text-white',
  'Demanda agrupada': 'data-[active=true]:bg-status-agrupada data-[active=true]:text-white',
  'Auto emitido': 'data-[active=true]:bg-status-auto data-[active=true]:text-white',
  'A.R. devolvido': 'data-[active=true]:bg-status-ar-devolvido data-[active=true]:text-white',
  'A.R. entregue': 'data-[active=true]:bg-status-ar-entregue data-[active=true]:text-white',
};

export function FilterBar({
  onSearchChange,
  onStatusFilter,
  onPosturaFilter,
  activeStatus,
  activePostura,
}: FilterBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearchChange]);

  const clearFilters = () => {
    setSearchTerm('');
    onSearchChange('');
    onStatusFilter(null);
    onPosturaFilter(null);
  };

  const hasFilters = searchTerm || activeStatus || activePostura;

  return (
    <div className="space-y-4">
      {/* Search and Postura Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar em todas as colunas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select
          value={activePostura ?? 'all'}
          onValueChange={(value) => onPosturaFilter(value === 'all' ? null : value as PosturaType)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por postura" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as posturas</SelectItem>
            {POSTURAS.map((postura) => (
              <SelectItem key={postura} value={postura}>
                {postura}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="outline" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      {/* Status Toggle Buttons */}
      <div className="flex flex-wrap gap-2">
        {STATUS_LIST.filter(status => status !== 'Demanda devolvida').map((status) => (
          <Button
            key={status}
            variant="outline"
            size="sm"
            data-active={activeStatus === status}
            onClick={() => onStatusFilter(activeStatus === status ? null : status)}
            className={cn(
              'transition-all',
              STATUS_TOGGLE_COLORS[status]
            )}
          >
            {status}
          </Button>
        ))}
      </div>
    </div>
  );
}
