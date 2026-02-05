import { Processo, STATUS_LIST, StatusType } from '@/types/processo';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, AlertCircle, Archive, Send, Mail, Layers } from 'lucide-react';

interface DashboardCardsProps {
  processos: Processo[];
}

// Configuração de cores e ícones moderna (Estilo App)
const CARD_CONFIG: Record<StatusType, { icon: React.ReactNode; color: string; bg: string; iconColor: string }> = {
  'Ação necessária': { 
    icon: <AlertCircle className="h-8 w-8" />, 
    color: 'border-red-100', 
    bg: 'bg-red-500', 
    iconColor: 'text-white' 
  },
  'Demanda concluída': { 
    icon: <CheckCircle className="h-8 w-8" />, 
    color: 'border-emerald-100', 
    bg: 'bg-emerald-500', 
    iconColor: 'text-white' 
  },
  'Demanda devolvida': { 
    icon: <Archive className="h-8 w-8" />, 
    color: 'border-purple-100', 
    bg: 'bg-purple-500', 
    iconColor: 'text-white' 
  },
  'Demanda agrupada': { 
    icon: <Layers className="h-8 w-8" />, 
    color: 'border-blue-100', 
    bg: 'bg-blue-500', 
    iconColor: 'text-white' 
  },
  'Auto emitido': { 
    icon: <Send className="h-8 w-8" />, 
    color: 'border-orange-100', 
    bg: 'bg-orange-500', 
    iconColor: 'text-white' 
  },
  'A.R. devolvido': { 
    icon: <Mail className="h-8 w-8" />, 
    color: 'border-rose-100', 
    bg: 'bg-rose-500', 
    iconColor: 'text-white' 
  },
  'A.R. entregue': { 
    icon: <Mail className="h-8 w-8" />, 
    color: 'border-teal-100', 
    bg: 'bg-teal-500', 
    iconColor: 'text-white' 
  },
};

export function DashboardCards({ processos }: DashboardCardsProps) {
  const total = processos.length;
  
  const countByStatus = STATUS_LIST.reduce((acc, status) => {
    acc[status] = processos.filter(p => p.status === status).length;
    return acc;
  }, {} as Record<StatusType, number>);

  return (
    <div className="space-y-8">
      {/* Total Card - Destaque */}
      <div className="flex justify-center">
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center p-0">
            <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 mb-3">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">{total}</h2>
            <p className="text-sm font-medium text-muted-foreground">Total de Processos</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid de Status - Estilo App */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {STATUS_LIST.filter(status => status !== 'Demanda devolvida').map((status) => {
          const config = CARD_CONFIG[status];
          return (
            <Card 
              key={status} 
              className="group border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-card hover:-translate-y-1 overflow-hidden"
            >
              <CardContent className="p-4 flex flex-col items-center text-center h-full justify-between gap-3">
                
                {/* Ícone com fundo colorido arredondado */}
                <div className={`p-3 rounded-2xl ${config.bg} shadow-md`}>
                   <div className={config.iconColor}>
                     {config.icon}
                   </div>
                </div>

                <div className="space-y-1">
                  <span className="text-2xl font-bold block text-foreground">
                    {countByStatus[status]}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground line-clamp-2 px-1">
                    {status}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}