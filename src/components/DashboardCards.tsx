import { Processo, STATUS_LIST, StatusType, POSTURAS } from '@/types/processo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, AlertCircle, Clock, Archive, Eye, AlertTriangle } from 'lucide-react';

interface DashboardCardsProps {
  processos: Processo[];
}

const STATUS_ICONS: Record<StatusType, React.ReactNode> = {
  'Em análise': <Clock className="h-5 w-5" />,
  'Vistoriado': <Eye className="h-5 w-5" />,
  'Notificado': <AlertTriangle className="h-5 w-5" />,
  'Regularizado': <CheckCircle className="h-5 w-5" />,
  'Irregular': <AlertCircle className="h-5 w-5" />,
  'Arquivado': <Archive className="h-5 w-5" />,
};

const STATUS_BG_COLORS: Record<StatusType, string> = {
  'Em análise': 'bg-status-analise/10 text-status-analise border-status-analise/20',
  'Vistoriado': 'bg-status-vistoriado/10 text-status-vistoriado border-status-vistoriado/20',
  'Notificado': 'bg-status-notificado/10 text-status-notificado border-status-notificado/20',
  'Regularizado': 'bg-status-regularizado/10 text-status-regularizado border-status-regularizado/20',
  'Irregular': 'bg-status-irregular/10 text-status-irregular border-status-irregular/20',
  'Arquivado': 'bg-status-arquivado/10 text-status-arquivado border-status-arquivado/20',
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
