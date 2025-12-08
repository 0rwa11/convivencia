import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEvaluation } from '@/contexts/EvaluationContext';
import { Download, Search, X } from 'lucide-react';

export default function AdvancedSearch() {
  const { records } = useEvaluation();
  const [filters, setFilters] = useState({
    group: '',
    facilitator: '',
    dateFrom: '',
    dateTo: '',
    respectLevel: '',
    improvementMin: 0,
  });
  const [results, setResults] = useState(records);
  const [savedFilters, setSavedFilters] = useState<any[]>([]);

  const applyFilters = () => {
    let filtered = records;

    if (filters.group) {
      filtered = filtered.filter((r: any) => r.groupName.toLowerCase().includes(filters.group.toLowerCase()));
    }
    if (filters.facilitator) {
      filtered = filtered.filter((r: any) => r.facilitator.toLowerCase().includes(filters.facilitator.toLowerCase()));
    }
    if (filters.dateFrom) {
      filtered = filtered.filter((r: any) => r.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((r: any) => r.date <= filters.dateTo);
    }
    if (filters.respectLevel) {
      filtered = filtered.filter((r: any) => r.duringRespect === filters.respectLevel);
    }
    if (filters.improvementMin > 0) {
      filtered = filtered.filter((r: any) => {
        const improvement = r.beforeMixedInteractions > 0
          ? Math.round(((r.afterMixedInteractions - r.beforeMixedInteractions) / r.beforeMixedInteractions) * 100)
          : 0;
        return improvement >= filters.improvementMin;
      });
    }

    setResults(filtered);
  };

  const saveFilter = () => {
    const name = prompt('Nombre para este filtro:');
    if (name) {
      setSavedFilters([...savedFilters, { name, filters: { ...filters } }]);
    }
  };

  const loadFilter = (savedFilter: any) => {
    setFilters(savedFilter.filters);
  };

  const clearFilters = () => {
    setFilters({
      group: '',
      facilitator: '',
      dateFrom: '',
      dateTo: '',
      respectLevel: '',
      improvementMin: 0,
    });
    setResults(records);
  };

  const exportResults = () => {
    const csv = [
      ['Grupo', 'Facilitador', 'Fecha', 'Antes', 'Después', 'Mejora %', 'Respeto', 'Estereotipos'],
      ...results.map((r: any) => [
        r.groupName,
        r.facilitator,
        r.date,
        r.beforeMixedInteractions,
        r.afterMixedInteractions,
        r.beforeMixedInteractions > 0
          ? Math.round(((r.afterMixedInteractions - r.beforeMixedInteractions) / r.beforeMixedInteractions) * 100)
          : 0,
        r.duringRespect,
        r.afterStereotypes,
      ]),
    ]
      .map((row: any) => row.map((cell: any) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `busqueda_evaluaciones_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Búsqueda Avanzada</h1>
          <p className="text-lg text-muted-foreground">
            Encuentra y filtra evaluaciones con criterios específicos
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 border-0 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-foreground mb-6">Criterios de Búsqueda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Grupo</label>
              <input
                type="text"
                value={filters.group}
                onChange={(e) => setFilters({ ...filters, group: e.target.value })}
                placeholder="Ej: Grupo 1"
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Facilitador</label>
              <input
                type="text"
                value={filters.facilitator}
                onChange={(e) => setFilters({ ...filters, facilitator: e.target.value })}
                placeholder="Nombre del facilitador"
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Desde</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Hasta</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nivel de Respeto</label>
              <select
                value={filters.respectLevel}
                onChange={(e) => setFilters({ ...filters, respectLevel: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg"
              >
                <option value="">Todos</option>
                <option value="Alto">Alto</option>
                <option value="Medio">Medio</option>
                <option value="Bajo">Bajo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mejora Mínima (%)</label>
              <input
                type="number"
                value={filters.improvementMin}
                onChange={(e) => setFilters({ ...filters, improvementMin: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={applyFilters} className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Buscar
            </Button>
            <Button onClick={clearFilters} variant="outline" className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Limpiar
            </Button>
            <Button onClick={saveFilter} variant="outline">
              Guardar Filtro
            </Button>
            <Button onClick={exportResults} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>
        </Card>

        {/* Saved Filters */}
        {savedFilters.length > 0 && (
          <Card className="p-6 border-0 shadow-sm mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Filtros Guardados</h3>
            <div className="flex flex-wrap gap-2">
              {savedFilters.map((sf, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => loadFilter(sf)}
                >
                  {sf.name}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Results */}
        <Card className="p-6 border-0 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Resultados ({results.length} evaluaciones)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Grupo</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Facilitador</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Fecha</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Antes</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Después</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Mejora</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Respeto</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Estereotipos</th>
                </tr>
              </thead>
              <tbody>
                {results.map((record: any, idx: number) => (
                  <tr key={idx} className="border-b border-border hover:bg-primary/5">
                    <td className="py-3 px-4">{record.groupName}</td>
                    <td className="py-3 px-4">{record.facilitator}</td>
                    <td className="py-3 px-4">{record.date}</td>
                    <td className="py-3 px-4">{record.beforeMixedInteractions}</td>
                    <td className="py-3 px-4">{record.afterMixedInteractions}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-green-600">
                        +{record.beforeMixedInteractions > 0
                          ? Math.round(((record.afterMixedInteractions - record.beforeMixedInteractions) / record.beforeMixedInteractions) * 100)
                          : 0}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        record.duringRespect === 'Alto' ? 'bg-green-100 text-green-800' :
                        record.duringRespect === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.duringRespect}
                      </span>
                    </td>
                    <td className="py-3 px-4">{record.afterStereotypes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
