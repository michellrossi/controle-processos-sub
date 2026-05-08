import { useState, useMemo } from 'react';
import { useProcessos } from '@/hooks/useProcessos';
import { useAuth } from '@/hooks/useAuth';
import { DashboardCards } from '@/components/DashboardCards';
import { ProcessoTable } from '@/components/ProcessoTable';
import { FilterBar } from '@/components/FilterBar';
import { Header } from '@/components/Header';
import { ProcessoForm } from '@/components/ProcessoForm';
import { ImportExport } from '@/components/ImportExport';
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
import { Charts } from '@/components/Charts';
import { Search, Plus, FileText, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const { processos, isLoading, updateProcesso, deleteProcesso, deleteMany, createProcesso, importProcessos, isUpdating, isCreating } = useProcessos();
  const { user, signOut } = useAuth();
  const [statusFilter, setStatusFilter] = useState<StatusType | 'Todos'>('Todos');
  const [posturaFilter, setPosturaFilter] = useState<PosturaType | 'Todas'>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredProcessos = useMemo(() => {
    return processos.filter((processo) => {
      const matchesStatus = statusFilter === 'Todos' 
        ? true 
        : processo.status === statusFilter;
      
      const matchesPostura = posturaFilter === 'Todas'
        ? true
        : processo.postura === posturaFilter;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        processo.numero_demanda?.toLowerCase().includes(searchLower) ||
        processo.numero_sei?.toLowerCase().includes(searchLower) ||
        processo.endereco?.toLowerCase().includes(searchLower) ||
        processo.sql_numero?.toLowerCase().includes(searchLower);

      return matchesStatus && matchesPostura && matchesSearch;
    });
  }, [processos, statusFilter, posturaFilter, searchTerm]);

  const handleCreateProcesso = (data: Partial<Processo>) => {
    createProcesso(data as Omit<Processo, 'id' | 'user_id' | 'created_at' | 'updated_at'>);
    setIsCreateDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500">
      <Header userEmail={user?.email} onSignOut={signOut} />
      
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 fade-slide-in">
        
        {/* Top Section: Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
              <div className="h-1 w-8 bg-primary rounded-full" />
              Visão Geral
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Painel de Controle
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-md text-balance">
              Monitore o progresso dos processos e gerencie demandas com eficiência.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <ImportExport
              processos={processos}
              onImport={importProcessos}
            />
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="btn-gradient px-6 h-11 rounded-xl"
            >
              <Plus className="mr-2 h-5 w-5" />
              Novo Processo
            </Button>
          </div>
        </div>

        {/* Resumo e Gráficos */}
        <div className="space-y-8">
          <DashboardCards processos={processos} />
          <Charts processos={processos} />
        </div>

        {/* List Section */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                Processos Ativos
              </h2>
            </div>
            
            {/* Filtros em uma linha */}
            <div className="glass-panel p-4 rounded-2xl">
              <FilterBar 
                currentStatus={statusFilter} 
                onStatusChange={setStatusFilter}
                currentPostura={posturaFilter}
                onPosturaChange={setPosturaFilter}
              />
            </div>

            {/* Busca em outra linha */}
            <div className="relative group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Buscar processos por demanda, SEI, endereço ou SQL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-primary/20 transition-all text-base"
              />
            </div>
          </div>

          <div className="premium-card rounded-2xl overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">

            <ProcessoTable 
              processos={filteredProcessos}
              onUpdate={updateProcesso}
              onDelete={deleteProcesso}
              onDeleteMany={deleteMany}
              isUpdating={isUpdating}
            />
          </div>
        </div>
      </main>

      {/* Modal de Criação */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-none shadow-2xl p-0">
          <div className="p-8">
            <DialogHeader className="mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <FileText className="h-7 w-7" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">Cadastrar Processo</DialogTitle>
                  <DialogDescription className="text-slate-500 mt-1">
                    Preencha os campos abaixo para adicionar à base de dados.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <ProcessoForm 
              onSubmit={handleCreateProcesso}
              onCancel={() => setIsCreateDialogOpen(false)}
              isSubmitting={isCreating}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

