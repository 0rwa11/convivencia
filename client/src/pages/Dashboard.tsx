import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Calendar, FileText, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'wouter';
import { useEvaluation } from '@/contexts/EvaluationContext';
import BackupRestore from '@/components/BackupRestore';

interface DashboardStats {
  totalEvaluations: number;
  totalSessions: number;
  totalGroups: number;
  averageParticipation: number;
  upcomingSessions: number;
  lastUpdate: string;
}

export default function Dashboard() {
  const { records } = useEvaluation();
  const [stats, setStats] = useState<DashboardStats>({
    totalEvaluations: 0,
    totalSessions: 0,
    totalGroups: 0,
    averageParticipation: 0,
    upcomingSessions: 0,
    lastUpdate: new Date().toLocaleDateString('es-ES'),
  });

  useEffect(() => {
    // Calculate statistics
    const evaluations = records || [];
    const uniqueGroups = new Set(evaluations.map((e: any) => e.group)).size;
    const upcomingSessions = evaluations.filter((e: any) => {
      const sessionDate = new Date(`${e.date}T${e.time || '00:00'}`);
      return sessionDate >= new Date();
    }).length;

    const avgParticipation = evaluations.length > 0
      ? Math.round(
          evaluations.reduce((sum: number, e: any) => sum + (parseInt(e.participationDuring) || 0), 0) /
            evaluations.length
        )
      : 0;

    setStats({
      totalEvaluations: evaluations.length,
      totalSessions: evaluations.length,
      totalGroups: uniqueGroups,
      averageParticipation: avgParticipation,
      upcomingSessions,
      lastUpdate: new Date().toLocaleDateString('es-ES'),
    });
  }, [records]);

  const quickAccessItems = [
    {
      title: 'Registro de Evaluaciones',
      description: 'Ingresa nuevas evaluaciones',
      icon: <FileText className="w-6 h-6" />,
      href: '/registro-evaluaciones',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Análisis Comparativo',
      description: 'Ver antes y después',
      icon: <TrendingUp className="w-6 h-6" />,
      href: '/analisis-comparativo',
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Calendario',
      description: 'Planificar sesiones',
      icon: <Calendar className="w-6 h-6" />,
      href: '/calendario',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Dashboard de Grupos',
      description: 'Ver desempeño por grupo',
      icon: <Users className="w-6 h-6" />,
      href: '/dashboard-grupos',
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-8">
        <div className="container">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-primary-foreground/90">Bienvenido al Centro de Día - Programa de Convivencia Intercultural</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de Evaluaciones</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalEvaluations}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Grupos Activos</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalGroups}</p>
              </div>
              <Users className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Participación Promedio</p>
                <p className="text-3xl font-bold text-foreground">{stats.averageParticipation}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Próximas Sesiones</p>
                <p className="text-3xl font-bold text-foreground">{stats.upcomingSessions}</p>
              </div>
              <Clock className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>
        </div>

        {/* Quick Access */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Acceso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickAccessItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className="block">
                  <Card className="p-6 bg-card hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-4`}>
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        </div>

        {/* Backup Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">💾 Respaldo y Sincronización</h2>
          <BackupRestore />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-card lg:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">Resumen del Programa</h3>
            <div className="space-y-3 text-sm text-foreground">
              <p>
                <strong>Objetivo:</strong> Reducir estereotipos y prejuicios entre participantes de diferentes nacionalidades.
              </p>
              <p>
                <strong>Duración:</strong> 3 sesiones de trabajo intensivo con dinámicas interactivas.
              </p>
              <p>
                <strong>Metodología:</strong> Basada en evidencia científica sobre reducción de prejuicios intergrupo.
              </p>
              <p>
                <strong>Última actualización:</strong> {stats.lastUpdate}
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <h3 className="text-lg font-semibold text-foreground mb-4">Próximos Pasos</h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Registra evaluaciones de sesiones</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Analiza resultados comparativos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>Genera reportes ejecutivos</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
