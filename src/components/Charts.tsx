import { Processo, STATUS_LIST, POSTURAS, StatusType } from '@/types/processo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

interface ChartsProps {
  processos: Processo[];
}

const STATUS_COLORS: Record<StatusType, string> = {
  'Ação necessária': '#ef4444',
  'Demanda concluída': '#10b981',
  'Demanda devolvida': '#8b5cf6',
  'Demanda agrupada': '#3b82f6',
  'Auto emitido': '#f59e0b',
  'A.R. devolvido': '#ec4899',
  'A.R. entregue': '#14b8a6',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel px-4 py-2 rounded-xl shadow-2xl border-white/20 text-sm animate-in">
        <p className="font-bold text-foreground mb-1">{label || payload[0].name}</p>
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: payload[0].payload.color || payload[0].fill }}
          />
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">{payload[0].value}</span> processos
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function Charts({ processos }: ChartsProps) {
  const statusData = STATUS_LIST.map((status) => ({
    name: status,
    value: processos.filter((p) => p.status === status).length,
    color: STATUS_COLORS[status],
  })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  const posturaData = POSTURAS.map((postura) => ({
    name: postura,
    value: processos.filter((p) => p.postura === postura).length,
  })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  if (processos.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-transparent">
        <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <div className="p-4 rounded-full bg-muted/50 mb-4">
            <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="font-medium text-lg">Sem dados para exibir</p>
          <p className="text-sm">Adicione processos para visualizar as estatísticas.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Status Distribution */}
      <Card className="premium-card overflow-hidden">
        <CardHeader className="border-b bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold tracking-tight">Distribuição por Status</CardTitle>
            <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">Geral</span>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusData}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                barSize={12}
              >
                <defs>
                  {statusData.map((entry, index) => (
                    <linearGradient key={`grad-${index}`} id={`colorStatus-${index}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                      <stop offset="100%" stopColor={entry.color} stopOpacity={1}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis
                  type="number"
                  hide
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12, fontWeight: 500, fill: 'hsl(var(--foreground))' }}
                  width={150}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ fill: 'hsl(var(--muted)/0.3)', radius: 4 }} 
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#colorStatus-${index})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Postura Distribution */}
      <Card className="premium-card overflow-hidden">
        <CardHeader className="border-b bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold tracking-tight">Distribuição por Postura</CardTitle>
            <span className="text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-full uppercase tracking-wider">Atividade</span>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={posturaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {posturaData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`hsl(var(--primary), ${1 - (index * 0.15)})`} 
                      className="stroke-background hover:opacity-80 transition-opacity"
                      strokeWidth={4}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
              {posturaData.slice(0, 4).map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: `hsl(var(--primary), ${1 - (index * 0.15)})` }} />
                  <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[100px]">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

