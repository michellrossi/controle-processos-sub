import { useState, useMemo } from 'react';
import { useProcessos } from '@/hooks/useProcessos';
import { useAuth } from '@/hooks/useAuth';
import { DashboardCards } from '@/components/DashboardCards';
import { ProcessoTable } from '@/components/ProcessoTable';
import { FilterBar } from '@/components/FilterBar';
import { Header } from '@/components/Header';
import { StatusType } from '@/types/processo';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Dashboard() {
  const { processos, isLoading, updateProcesso, deleteProcesso, deleteMany, isUpdating } = useProcessos();
  const { user, signOut } = useAuth();
  // Estado agora tipado para aceitar StatusType ou a string literal 'Todos'
  const [statusFilter, setStatusFilter] = useState<StatusType | 'Todos'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de filtragem atualizada
  const filteredProcessos = useMemo(() => {
    return processos.filter((processo) => {
      // 1. Filtro de Status
      const matchesStatus = statusFilter === 'Todos' 
        ? true 
        : processo.status === statusFilter;

      // 2. Filtro de Busca (Texto)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        processo.numero_demanda?.toLowerCase().includes(searchLower) ||
        processo.numero_sei?.toLowerCase().includes(searchLower) ||
        processo.endereco?.toLowerCase().includes(searchLower) ||
        processo.sql_numero?.toLowerCase().includes(searchLower);

      return matchesStatus && matchesSearch;
    });
  }, [processos, statusFilter, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-background space-y-8 pb-10">
      <Header userEmail={user?.email} onSignOut={signOut} />
      
      <main className="container mx-auto px-4 pt-4 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Painel de Controle
          </h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todos os processos e demandas.
          </p>
        </div>

        {/* Cards de Resumo */}
        <DashboardCards processos={filteredProcessos} />

        {/* Área de Filtros e Busca */}
        <div className="space-y-4">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4 space-y-4">
              
              {/* Barra de Busca */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por demanda, SEI, SQL ou endereço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white dark:bg-card border-gray-200"
                />
              </div>

              {/* Barra de Filtros (Conectada Corretamente) */}
              <FilterBar 
                currentFilter={statusFilter} 
                onFilterChange={setStatusFilter} 
              />
            </CardContent>
          </Card>

          {/* Tabela de Resultados */}
          <ProcessoTable 
            processos={filteredProcessos}
            onUpdate={updateProcesso}
            onDelete={deleteProcesso}
            onDeleteMany={deleteMany}
            isUpdating={isUpdating}
          />
        </div>
      </main>
    </div>
  );
}