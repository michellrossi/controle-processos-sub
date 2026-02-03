import { Processo, STATUS_LIST, StatusType, POSTURAS } from '@/types/processo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, AlertCircle, Clock, Archive, Send, Mail, Layers } from 'lucide-react';

interface DashboardCardsProps {
  processos: Processo[];
}

const STATUS_ICONS: Record<StatusType, React.ReactNode> = {
  'Ação necessária': <AlertCircle className="h-5 w-5" />,
  'Demanda concluída': <CheckCircle className="h-5 w-5" />,
  'Demanda devolvida': <Archive className="h-5 w-5" />,
  'Demanda agrupada': <Layers className="h-5 w-5" />,
  'Auto emitido': <Send className="h-5 w-5" />,
  'A.R. devolvido': <Mail className="h-5 w-5" />,
  'A.R. entregue': <Mail className="h-5 w-5" />,
};

const STATUS_BG_COLORS: Record<StatusType, string> = {
  'Ação necessária': 'bg-status-acao/10 text-status-acao border-status-acao/20',
  'Demanda concluída': 'bg-status-concluida/10 text-status-concluida border-status-concluida/20',
  'Demanda devolvida': 'bg-status-devolvida/10 text-status-devolvida border-status-devolvida/20',
  'Demanda agrupada': 'bg-status-agrupada/10 text-status-agrupada border-status-agrupada/20',
  'Auto emitido': 'bg-status-auto/10 text-status-auto border-status-auto/20',
  'A.R. devolvido': 'bg-status-ar-devolvido/10 text-status-ar-devolvido border-status-ar-devolvido/20',
  'A.R. entregue': 'bg-status-ar-entregue/10 text-status-ar-entregue border-status-ar-entregue/20',
};

export function DashboardCards({ processos }: DashboardCardsProps) {
  const total = processos.length;
  
  const countByStatus = STATUS_LIST.reduce((acc, status) => {
    acc[status] = processos.filter(p => p.status === status).length;
    return acc;
  }, {} as Record<StatusType, number>);

  return (
    <div className="space-y-6">
      {/* Total Card */}
      <Card className="card-hover border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Processos
          </CardTitle>
          <FileText className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">{total}</div>
        </CardContent>
      </Card>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STATUS_LIST.map((status) => (
          <Card 
            key={status} 
            className={`card-hover border ${STATUS_BG_COLORS[status]}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium opacity-80">
                {status}
              </CardTitle>
              {STATUS_ICONS[status]}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countByStatus[status]}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
