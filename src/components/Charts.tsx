import { Processo, STATUS_LIST, POSTURAS, StatusType, PosturaType } from '@/types/processo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface ChartsProps {
  processos: Processo[];
}

const STATUS_CHART_COLORS: Record<StatusType, string> = {
  'Ação necessária': '#e74c3c',
  'Demanda concluída': '#27ae60',
  'Demanda devolvida': '#9b59b6',
  'Demanda agrupada': '#4a90d9',
  'Auto emitido': '#f39c12',
  'A.R. devolvido': '#e91e63',
  'A.R. entregue': '#26a69a',
};

export function Charts({ processos }: ChartsProps) {
  // Data for status pie chart
  const statusData = STATUS_LIST.map((status) => ({
    name: status,
    value: processos.filter((p) => p.status === status).length,
    color: STATUS_CHART_COLORS[status],
  })).filter((d) => d.value > 0);

  // Data for postura bar chart
  const posturaData = POSTURAS.map((postura) => ({
    name: postura,
    quantidade: processos.filter((p) => p.postura === postura).length,
  })).filter((d) => d.quantidade > 0);

  if (processos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Adicione processos para visualizar os gráficos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Pie Chart */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg">Processos por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Postura Bar Chart */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg">Processos por Postura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={posturaData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }}
                  width={90}
                />
                <Tooltip />
                <Bar dataKey="quantidade" fill="hsl(217 91% 45%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
