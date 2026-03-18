import { Processo } from '@/types/processo';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface DashboardCardsProps {
  processos: Processo[];
}

export function DashboardCards({ processos }: DashboardCardsProps) {
  const total = processos.length;
  const concluidas = processos.filter(p => p.status === 'Demanda concluída').length;
  const acoes = processos.filter(p => p.status === 'Ação necessária').length;

  const cards = [
    {
      label: 'Total de Processos',
      value: total,
      icon: <FileText className="h-5 w-5" />,
      bg: 'bg-primary',
      text: 'text-primary',
      lightBg: 'bg-primary/10',
    },
    {
      label: 'Demandas Concluídas',
      value: concluidas,
      icon: <CheckCircle className="h-5 w-5" />,
      bg: 'bg-[hsl(var(--status-concluida))]',
      text: 'text-[hsl(var(--status-concluida))]',
      lightBg: 'bg-[hsl(var(--status-concluida)/0.1)]',
    },
    {
      label: 'Ações Necessárias',
      value: acoes,
      icon: <AlertCircle className="h-5 w-5" />,
      bg: 'bg-[hsl(var(--status-acao))]',
      text: 'text-[hsl(var(--status-acao))]',
      lightBg: 'bg-[hsl(var(--status-acao)/0.1)]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.label} className="border shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${card.bg} shadow-sm`}>
              <div className="text-white">{card.icon}</div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
              <p className={`text-3xl font-bold ${card.text}`}>{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
