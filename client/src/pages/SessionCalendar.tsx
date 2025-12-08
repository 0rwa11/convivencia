import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Plus, Trash2, Edit2 } from 'lucide-react';
import { useEnhancedNotification } from '@/contexts/EnhancedNotificationContext';

interface Session {
  id: string;
  date: string;
  time: string;
  facilitator: string;
  group: string;
  location: string;
  notes: string;
}

export default function SessionCalendar() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    facilitator: '',
    group: '',
    location: '',
    notes: '',
  });
  const { showNotification } = useEnhancedNotification();

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('convivencia_sessions');
    if (saved) {
      setSessions(JSON.parse(saved));
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('convivencia_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time || !formData.facilitator || !formData.group) {
      showNotification('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    if (editingId) {
      setSessions(sessions.map(s => s.id === editingId ? { ...formData, id: editingId } : s));
      showNotification('Sesión actualizada correctamente', 'success');
      setEditingId(null);
    } else {
      const newSession: Session = {
        ...formData,
        id: `${Date.now()}`,
      };
      setSessions([...sessions, newSession]);
      showNotification('Sesión programada correctamente', 'success');
    }

    setFormData({
      date: '',
      time: '',
      facilitator: '',
      group: '',
      location: '',
      notes: '',
    });
    setShowForm(false);
  };

  const handleEdit = (session: Session) => {
    setFormData({
      date: session.date,
      time: session.time,
      facilitator: session.facilitator,
      group: session.group,
      location: session.location,
      notes: session.notes,
    });
    setEditingId(session.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    showNotification('Sesión eliminada', 'info');
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const upcomingSessions = sortedSessions.filter(s => {
    const sessionDate = new Date(`${s.date}T${s.time}`);
    return sessionDate >= new Date();
  });

  const pastSessions = sortedSessions.filter(s => {
    const sessionDate = new Date(`${s.date}T${s.time}`);
    return sessionDate < new Date();
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Calendario de Sesiones</h1>
          </div>
          <p className="text-muted-foreground">Planifica y gestiona las sesiones del programa</p>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                date: '',
                time: '',
                facilitator: '',
                group: '',
                location: '',
                notes: '',
              });
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancelar' : 'Nueva Sesión'}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="p-6 mb-8 bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {editingId ? 'Editar Sesión' : 'Nueva Sesión'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Fecha *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Hora *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Facilitador *</label>
                  <input
                    type="text"
                    value={formData.facilitator}
                    onChange={(e) => setFormData({ ...formData, facilitator: e.target.value })}
                    placeholder="Nombre del facilitador"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Grupo *</label>
                  <input
                    type="text"
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    placeholder="Nombre del grupo"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Ubicación</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ubicación de la sesión"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notas adicionales"
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full">
                {editingId ? 'Actualizar' : 'Programar'} Sesión
              </Button>
            </form>
          </Card>
        )}

        {/* Upcoming Sessions */}
        {upcomingSessions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Próximas Sesiones</h2>
            <div className="grid gap-4">
              {upcomingSessions.map((session) => (
                <Card key={session.id} className="p-4 bg-card hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-primary">
                          {new Date(`${session.date}T${session.time}`).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="text-foreground font-medium">{session.time}</span>
                      </div>
                      <p className="text-sm text-foreground"><strong>Grupo:</strong> {session.group}</p>
                      <p className="text-sm text-foreground"><strong>Facilitador:</strong> {session.facilitator}</p>
                      {session.location && (
                        <p className="text-sm text-foreground"><strong>Ubicación:</strong> {session.location}</p>
                      )}
                      {session.notes && (
                        <p className="text-sm text-muted-foreground mt-2"><strong>Notas:</strong> {session.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(session)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(session.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Past Sessions */}
        {pastSessions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Sesiones Pasadas</h2>
            <div className="grid gap-4">
              {pastSessions.map((session) => (
                <Card key={session.id} className="p-4 bg-card opacity-75">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-muted-foreground">
                          {new Date(`${session.date}T${session.time}`).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="text-muted-foreground font-medium">{session.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground"><strong>Grupo:</strong> {session.group}</p>
                      <p className="text-sm text-muted-foreground"><strong>Facilitador:</strong> {session.facilitator}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(session.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {sessions.length === 0 && (
          <Card className="p-12 text-center bg-card">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No hay sesiones programadas</p>
            <Button onClick={() => setShowForm(true)}>Programar Primera Sesión</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
