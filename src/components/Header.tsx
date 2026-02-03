import { Button } from '@/components/ui/button';
import { LogOut, Shield } from 'lucide-react';

interface HeaderProps {
  userEmail?: string;
  onSignOut: () => void;
}

export function Header({ userEmail, onSignOut }: HeaderProps) {
  return (
    <header className="gradient-header text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Sistema de Controle de Processos
              </h1>
              <p className="text-sm text-white/70">
                Gestão Administrativa Municipal
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80 hidden sm:block">
              {userEmail}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="text-white hover:bg-white/10 gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
