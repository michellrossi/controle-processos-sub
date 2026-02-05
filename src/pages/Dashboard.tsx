import { useState, useMemo } from 'react';
import { useProcessos } from '@/hooks/useProcessos';
import { useAuth } from '@/hooks/useAuth';
import { DashboardCards } from '@/components/DashboardCards';
import { ProcessoTable } from '@/components/ProcessoTable';
import { FilterBar } from '@/components/FilterBar';
import { Header } from '@/components/Header';
import { ProcessoForm } from '@/components/ProcessoForm';
import { StatusType, Processo } from '@/types/processo';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Search, Plus, FileText } from 'lucide-react';

export default function Dashboard() {
  const { processos, isLoading, updateProcesso, deleteProcesso, deleteMany, createProcesso, isUpdating, isCreating } = useProcessos();
  const { user, signOut } = useAuth();
  const [statusFilter, setStatusFilter] = useState<StatusType | 'Todos'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredProcessos = useMemo(() => {
    return processos.filter((processo) => {
      const matchesStatus = statusFilter === 'Todos' 
        ? true 
        : processo.status === statusFilter;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        processo.numero_demanda?.toLowerCase().includes(searchLower) ||
        processo.numero_sei?.toLowerCase().includes(searchLower) ||
        processo.endereco?.toLowerCase().includes(searchLower) ||
        processo.sql_numero?.toLowerCase().includes(searchLower);

      return matchesStatus && matchesSearch;
    });
  }, [processos, statusFilter, searchTerm]);

  const handleCreateProcesso = (data: Partial<Processo>) => {
    createProcesso(data as Omit<Processo, 'id' | 'user_id' | 'created_at' | 'updated_at'>);
    setIsCreateDialogOpen(false);
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Painel de Controle
            </h1>
            <p className="text-muted-foreground">
              Gerencie e acompanhe todos os processos e demandas.
            </p>
          </div>
          
          {/* Botão Criar Novo Processo */}
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            size="lg"
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" />
            Novo Processo
          </Button>
        </div>

        {/* Cards de Resumo - sempre mostra todos os processos */}
        <DashboardCards processos={processos} />

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

              {/* Barra de Filtros */}
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

      {/* Modal de Criação de Processo */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3 pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Novo Processo</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Preencha os dados para cadastrar um novo processo no sistema.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <ProcessoForm 
            onSubmit={handleCreateProcesso}
            onCancel={() => setIsCreateDialogOpen(false)}
            isSubmitting={isCreating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
