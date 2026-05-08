import { Processo } from '@/types/processo';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';

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
      icon: <FileText className="h-6 w-6" />,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      description: 'Acervo total no sistema'
    },
    {
      label: 'Demandas Concluídas',
      value: concluidas,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      description: 'Processos finalizados'
    },
    {
      label: 'Ações Necessárias',
      value: acoes,
      icon: <AlertCircle className="h-6 w-6" />,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      description: 'Pendentes de atenção'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.label} className="premium-card rounded-2xl border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden group">
          <CardContent className="p-0">
            <div className="p-6 flex items-start justify-between">
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-2xl ${card.bgColor} ${card.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                  <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                    {card.value}
                  </p>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">{card.description}</p>
              </div>
              
              <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 opacity-50 rounded-full blur-2xl group-hover:opacity-80 transition-opacity" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

