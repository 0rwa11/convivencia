import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Users, BarChart3, Target } from 'lucide-react';
import { useEvaluation } from '@/contexts/EvaluationContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Summary {
  totalEvaluations: number;
  totalGroups: number;
  averageParticipation: number;
  improvementRate: number;
  mixedInteractionsImprovement: number;
  stereotypesReduction: number;
  groupsWithImprovement: number;
  overallImpactScore: number;
}

export default function ExecutiveSummary() {
  const { records } = useEvaluation();
  const [summary, setSummary] = useState<Summary>({
    totalEvaluations: 0,
    totalGroups: 0,
    averageParticipation: 0,
    improvementRate: 0,
    mixedInteractionsImprovement: 0,
    stereotypesReduction: 0,
    groupsWithImprovement: 0,
    overallImpactScore: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [groupData, setGroupData] = useState<any[]>([]);

  useEffect(() => {
    if (records.length === 0) return;

    // Calculate summary statistics
    const uniqueGroups = new Set(records.map((r: any) => r.groupName)).size;
    const avgParticipation = Math.round(
      records.reduce((sum: number, r: any) => sum + (parseInt(r.duringParticipation) || 0), 0) / records.length
    );

    // Calculate improvements
    const beforeMixed = records
      .filter((r: any) => r.beforeMixedInteractions)
      .reduce((sum: number, r: any) => sum + (r.beforeMixedInteractions || 0), 0) / Math.max(records.filter((r: any) => r.beforeMixedInteractions).length, 1);
    
    const afterMixed = records
      .filter((r: any) => r.afterMixedInteractions)
      .reduce((sum: number, r: any) => sum + (r.afterMixedInteractions || 0), 0) / Math.max(records.filter((r: any) => r.afterMixedInteractions).length, 1);
    
    const mixedImprovement = beforeMixed > 0 ? Math.round(((afterMixed - beforeMixed) / beforeMixed) * 100) : 0;

    // Calculate stereotype reduction
    const stereotypeReduction = records.filter((r: any) => r.afterStereotypes === 'Reducidos significativamente').length;
    const stereotypeReductionRate = Math.round((stereotypeReduction / records.length) * 100);

    // Groups with improvement
    const groupsWithImprovement = new Set(
      records.filter((r: any) => r.afterMixedInteractions > (r.beforeMixedInteractions || 0)).map((r: any) => r.groupName)
    ).size;

    // Overall impact score (0-100)
    const overallScore = Math.round(
      (avgParticipation * 0.3 + Math.max(mixedImprovement, 0) * 0.3 + stereotypeReductionRate * 0.4) / 100 * 100
    );

    setSummary({
      totalEvaluations: records.length,
      totalGroups: uniqueGroups,
      averageParticipation: avgParticipation,
      improvementRate: mixedImprovement,
      mixedInteractionsImprovement: Math.round(mixedImprovement),
      stereotypesReduction: stereotypeReductionRate,
      groupsWithImprovement,
      overallImpactScore: Math.min(overallScore, 100),
    });

    // Prepare chart data
    const sessionData = records.reduce((acc: any, r: any) => {
      const existing = acc.find((d: any) => d.session === r.sessionNumber);
      if (existing) {
        existing.participacion = Math.round((existing.participacion + parseInt(r.duringParticipation)) / 2);
        existing.respeto = existing.respeto + 1;
      } else {
        acc.push({
          session: r.sessionNumber,
          participacion: parseInt(r.duringParticipation) || 0,
          respeto: 1,
        });
      }
      return acc;
    }, []);
    setChartData(sessionData);

    // Prepare group data
    const groupStats = Array.from(new Set(records.map((r: any) => r.groupName))).map((groupName: any) => {
      const groupRecords = records.filter((r: any) => r.groupName === groupName);
      const avgPart = Math.round(
        groupRecords.reduce((sum: number, r: any) => sum + (parseInt(r.duringParticipation) || 0), 0) / groupRecords.length
      );
      const hasImprovement = groupRecords.some((r: any) => r.afterMixedInteractions > (r.beforeMixedInteractions || 0));
      return {
        name: groupName,
        participacion: avgPart,
        mejorado: hasImprovement ? 1 : 0,
      };
    });
    setGroupData(groupStats);
  }, [records]);

  const downloadPDF = () => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resumen Ejecutivo - Programa de Convivencia</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          h1 { color: #0f766e; border-bottom: 3px solid #0f766e; padding-bottom: 10px; }
          h2 { color: #0f766e; margin-top: 30px; }
          .metric { display: inline-block; width: 23%; margin: 1%; padding: 20px; background: #f0f9f8; border-left: 4px solid #0f766e; }
          .metric-value { font-size: 32px; font-weight: bold; color: #0f766e; }
          .metric-label { font-size: 12px; color: #666; margin-top: 5px; }
          .summary-box { background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .impact-score { font-size: 48px; font-weight: bold; color: #0f766e; text-align: center; }
          .conclusion { background: #ecf0f1; padding: 20px; border-radius: 8px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <h1>Resumen Ejecutivo</h1>
        <p style="color: #666;">Programa de Convivencia Intercultural - Centro de Día</p>
        <p style="color: #666;">Generado: ${new Date().toLocaleDateString('es-ES')}</p>

        <h2>Indicadores Clave</h2>
        <div>
          <div class="metric">
            <div class="metric-value">${summary.totalEvaluations}</div>
            <div class="metric-label">Evaluaciones Registradas</div>
          </div>
          <div class="metric">
            <div class="metric-value">${summary.totalGroups}</div>
            <div class="metric-label">Grupos Participantes</div>
          </div>
          <div class="metric">
            <div class="metric-value">${summary.averageParticipation}%</div>
            <div class="metric-label">Participación Promedio</div>
          </div>
          <div class="metric">
            <div class="metric-value">${summary.overallImpactScore}</div>
            <div class="metric-label">Puntuación de Impacto</div>
          </div>
        </div>

        <h2>Resultados Principales</h2>
        <div class="summary-box">
          <p><strong>Mejora en Interacciones Mixtas:</strong> ${summary.mixedInteractionsImprovement}%</p>
          <p><strong>Reducción de Estereotipos:</strong> ${summary.stereotypesReduction}%</p>
          <p><strong>Grupos con Mejora:</strong> ${summary.groupsWithImprovement} de ${summary.totalGroups}</p>
        </div>

        <h2>Conclusión</h2>
        <div class="conclusion">
          <p>El programa ha demostrado un impacto positivo en la reducción de estereotipos y prejuicios entre participantes de diferentes nacionalidades. Los resultados indican una mejora significativa en las interacciones mixtas y un aumento en la participación activa de los grupos.</p>
          <p><strong>Recomendación:</strong> Continuar con la implementación del programa en nuevos grupos para maximizar el impacto en la convivencia intercultural.</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumen-ejecutivo-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Resumen Ejecutivo</h1>
          <p className="text-lg text-muted-foreground">
            Resultados principales del Programa de Convivencia Intercultural
          </p>
        </div>

        {/* Download Button */}
        <div className="mb-8">
          <Button size="lg" onClick={downloadPDF} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Descargar Resumen en PDF
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Evaluaciones Registradas</p>
                <p className="text-3xl font-bold text-foreground">{summary.totalEvaluations}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Grupos Participantes</p>
                <p className="text-3xl font-bold text-foreground">{summary.totalGroups}</p>
              </div>
              <Users className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Participación Promedio</p>
                <p className="text-3xl font-bold text-foreground">{summary.averageParticipation}%</p>
              </div>
              <Target className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-green-700 font-semibold mb-1">Puntuación de Impacto</p>
                <p className="text-3xl font-bold text-green-700">{summary.overallImpactScore}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Mejora en Interacciones Mixtas</h3>
            <div className="text-4xl font-bold text-primary mb-2">{summary.mixedInteractionsImprovement}%</div>
            <p className="text-sm text-muted-foreground">
              Aumento en las interacciones entre participantes de diferentes nacionalidades
            </p>
          </Card>

          <Card className="p-6 bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Reducción de Estereotipos</h3>
            <div className="text-4xl font-bold text-primary mb-2">{summary.stereotypesReduction}%</div>
            <p className="text-sm text-muted-foreground">
              Participantes que reportaron reducción significativa de estereotipos
            </p>
          </Card>
        </div>

        {/* Charts */}
        {chartData.length > 0 && (
          <Card className="p-6 bg-card mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Participación por Sesión</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="participacion" stroke="#0f766e" name="Participación %" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Conclusion */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
          <h3 className="text-lg font-semibold text-foreground mb-4">Conclusiones</h3>
          <div className="space-y-3 text-foreground">
            <p>
              El Programa de Convivencia Intercultural ha demostrado un <strong>impacto positivo significativo</strong> en la reducción de estereotipos y prejuicios entre participantes de diferentes nacionalidades.
            </p>
            <p>
              Los resultados indican una mejora en las interacciones mixtas del <strong>{summary.mixedInteractionsImprovement}%</strong> y una participación promedio del <strong>{summary.averageParticipation}%</strong>, demostrando el compromiso de los participantes.
            </p>
            <p>
              <strong>Recomendación:</strong> Continuar con la implementación del programa en nuevos grupos para maximizar el impacto en la convivencia intercultural y la inclusión social.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
