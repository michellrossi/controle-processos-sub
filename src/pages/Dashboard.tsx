import { useState, useMemo } from 'react';
import { useProcessos } from '@/hooks/useProcessos';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { DashboardCards } from '@/components/DashboardCards';
import { ProcessoTable } from '@/components/ProcessoTable';
import { ProcessoForm } from '@/components/ProcessoForm';
import { FilterBar } from '@/components/FilterBar';
import { Charts } from '@/components/Charts';
import { ImportExport } from '@/components/ImportExport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, LayoutDashboard, Table, BarChart3, Loader2 } from 'lucide-react';
import { StatusType, PosturaType } from '@/types/processo';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const {
    processos,
    isLoading,
    createProcesso,
    updateProcesso,
    deleteProcesso,
    importProcessos,
  } = useProcessos();

  const [showNewProcesso, setShowNewProcesso] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusType | null>(null);
  const [posturaFilter, setPosturaFilter] = useState<PosturaType | null>(null);

  // Filter processos
  const filteredProcessos = useMemo(() => {
    return processos.filter((processo) => {
      // Status filter
      if (statusFilter && processo.status !== statusFilter) return false;
      
      // Postura filter
      if (posturaFilter && processo.postura !== posturaFilter) return false;
      
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const searchableFields = [
          processo.numero_demanda,
          processo.numero_sei,
          processo.postura,
          processo.sql_numero,
          processo.endereco,
          processo.status,
          processo.observacoes,
        ].filter(Boolean);
        
        return searchableFields.some((field) => 
          field?.toLowerCase().includes(search)
        );
      }
      
      return true;
    });
  }, [processos, searchTerm, statusFilter, posturaFilter]);

  const handleCreateProcesso = (data: any) => {
    createProcesso.mutate(data, {
      onSuccess: () => setShowNewProcesso(false),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando processos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userEmail={user?.email} onSignOut={signOut} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Dashboard Cards */}
        <DashboardCards processos={processos} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="table" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <TabsList>
              <TabsTrigger value="table" className="gap-2">
                <Table className="h-4 w-4" />
                Tabela
              </TabsTrigger>
              <TabsTrigger value="charts" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Análise
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <ImportExport
                processos={filteredProcessos}
                onImport={(data) => importProcessos.mutate(data)}
                isImporting={importProcessos.isPending}
              />
              <Dialog open={showNewProcesso} onOpenChange={setShowNewProcesso}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Processo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Novo Processo</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do novo processo administrativo.
                    </DialogDescription>
                  </DialogHeader>
                  <ProcessoForm
                    onSubmit={handleCreateProcesso}
                    onCancel={() => setShowNewProcesso(false)}
                    isSubmitting={createProcesso.isPending}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="table" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Filtros e Busca</CardTitle>
              </CardHeader>
              <CardContent>
                <FilterBar
                  onSearchChange={setSearchTerm}
                  onStatusFilter={setStatusFilter}
                  onPosturaFilter={setPosturaFilter}
                  activeStatus={statusFilter}
                  activePostura={posturaFilter}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    Processos ({filteredProcessos.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ProcessoTable
                  processos={filteredProcessos}
                  onUpdate={(data) => updateProcesso.mutate(data)}
                  onDelete={(id) => deleteProcesso.mutate(id)}
                  isUpdating={updateProcesso.isPending}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts">
            <Charts processos={processos} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
