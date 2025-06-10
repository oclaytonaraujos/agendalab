
import { Settings, Bell, Shield, Palette, Database, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Configuracoes = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    agendamentos: true,
    materiais: false,
    relatorios: true,
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    autoSave: true,
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success("Configuração de notificação atualizada!");
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    toast.success("Preferência atualizada!");
  };

  const handleExportData = () => {
    toast.success("Dados exportados com sucesso!");
  };

  const handleDeleteAccount = () => {
    toast.error("Função disponível apenas para administradores");
  };

  return (
    <div className="space-y-6">
      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações por Email</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações importantes por email
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(value) => handleNotificationChange('email', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações Push</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações no navegador
              </p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(value) => handleNotificationChange('push', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Agendamentos</Label>
              <p className="text-sm text-muted-foreground">
                Notificar sobre novos agendamentos e alterações
              </p>
            </div>
            <Switch
              checked={notifications.agendamentos}
              onCheckedChange={(value) => handleNotificationChange('agendamentos', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Materiais</Label>
              <p className="text-sm text-muted-foreground">
                Notificar sobre estoque baixo e novos materiais
              </p>
            </div>
            <Switch
              checked={notifications.materiais}
              onCheckedChange={(value) => handleNotificationChange('materiais', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Relatórios</Label>
              <p className="text-sm text-muted-foreground">
                Notificar quando relatórios estiverem prontos
              </p>
            </div>
            <Switch
              checked={notifications.relatorios}
              onCheckedChange={(value) => handleNotificationChange('relatorios', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferências */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-green-600" />
            Preferências
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <select
                id="theme"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={preferences.theme}
                onChange={(e) => handlePreferenceChange('theme', e.target.value)}
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <select
                id="language"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Fuso Horário</Label>
            <select
              id="timezone"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
            >
              <option value="America/Sao_Paulo">America/São Paulo (UTC-3)</option>
              <option value="America/New_York">America/New York (UTC-5)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
            </select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Salvamento Automático</Label>
              <p className="text-sm text-muted-foreground">
                Salvar alterações automaticamente
              </p>
            </div>
            <Switch
              checked={preferences.autoSave}
              onCheckedChange={(value) => handlePreferenceChange('autoSave', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Alterar Senha</Label>
              <p className="text-sm text-muted-foreground">
                Última alteração: 15 dias atrás
              </p>
            </div>
            <Button variant="outline">
              Alterar Senha
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Sessões Ativas</Label>
              <p className="text-sm text-muted-foreground">
                Gerencie suas sessões ativas
              </p>
            </div>
            <Button variant="outline">
              Ver Sessões
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Autenticação em Duas Etapas</Label>
              <p className="text-sm text-muted-foreground">
                Adicione uma camada extra de segurança
              </p>
            </div>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              Não Configurado
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Dados e Privacidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" />
            Dados e Privacidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Exportar Dados</Label>
              <p className="text-sm text-muted-foreground">
                Baixe uma cópia dos seus dados
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Política de Privacidade</Label>
              <p className="text-sm text-muted-foreground">
                Última atualização: 01/01/2024
              </p>
            </div>
            <Button variant="outline">
              Visualizar
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-red-600">Excluir Conta</Label>
              <p className="text-sm text-muted-foreground">
                Esta ação não pode ser desfeita
              </p>
            </div>
            <Button 
              variant="outline" 
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracoes;
