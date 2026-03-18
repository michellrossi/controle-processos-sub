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
} from 'recharts';

interface ChartsProps {
  processos: Processo[];
}

const STATUS_COLORS: Record<StatusType, string> = {
  'Ação necessária': 'hsl(0 84% 60%)',
  'Demanda concluída': 'hsl(142 76% 36%)',
  'Demanda devolvida': 'hsl(271 81% 56%)',
  'Demanda agrupada': 'hsl(217 91% 60%)',
  'Auto emitido': 'hsl(25 95% 53%)',
  'A.R. devolvido': 'hsl(340 82% 52%)',
  'A.R. entregue': 'hsl(168 76% 42%)',
};

const POSTURA_COLOR = 'hsl(217 91% 45%)';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-muted-foreground">{payload[0].value} processos</p>
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
  })).sort((a, b) => b.value - a.value);

  const posturaData = POSTURAS.map((postura) => ({
    name: postura,
    value: processos.filter((p) => p.postura === postura).length,
  })).sort((a, b) => b.value - a.value);

  if (processos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Adicione processos para visualizar os gráficos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Bar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Processos por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusData}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  width={130}
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.5)' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={22}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Postura Bar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Processos por Postura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={posturaData}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  width={130}
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.5)' }} />
                <Bar dataKey="value" fill={POSTURA_COLOR} radius={[0, 6, 6, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
