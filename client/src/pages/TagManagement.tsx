import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tag as TagIcon, Plus, Trash2, Edit2 } from 'lucide-react';
import { useTagging } from '@/contexts/TaggingContext';
import { useEnhancedNotification } from '@/contexts/EnhancedNotificationContext';

const COLORS = [
  { value: '#EF4444', label: 'Rojo' },
  { value: '#F97316', label: 'Naranja' },
  { value: '#EAB308', label: 'Amarillo' },
  { value: '#22C55E', label: 'Verde' },
  { value: '#06B6D4', label: 'Cyan' },
  { value: '#3B82F6', label: 'Azul' },
  { value: '#8B5CF6', label: 'Púrpura' },
  { value: '#EC4899', label: 'Rosa' },
];

export default function TagManagement() {
  const { tags, addTag, deleteTag, updateTag } = useTagging();
  const { showNotification } = useEnhancedNotification();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showNotification('El nombre de la etiqueta es requerido', 'error');
      return;
    }

    if (editingId) {
      updateTag(editingId, formData.name, formData.color, formData.description);
      showNotification('Etiqueta actualizada correctamente', 'success');
      setEditingId(null);
    } else {
      addTag(formData.name, formData.color, formData.description);
      showNotification('Etiqueta creada correctamente', 'success');
    }

    setFormData({
      name: '',
      color: '#3B82F6',
      description: '',
    });
    setShowForm(false);
  };

  const handleEdit = (tag: any) => {
    setFormData({
      name: tag.name,
      color: tag.color,
      description: tag.description || '',
    });
    setEditingId(tag.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteTag(id);
    showNotification('Etiqueta eliminada', 'info');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TagIcon className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Gestión de Etiquetas</h1>
          </div>
          <p className="text-muted-foreground">Crea y organiza etiquetas para categorizar evaluaciones</p>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                name: '',
                color: '#3B82F6',
                description: '',
              });
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancelar' : 'Nueva Etiqueta'}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="p-6 mb-8 bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {editingId ? 'Editar Etiqueta' : 'Nueva Etiqueta'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre de la etiqueta"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.color === color.value
                          ? 'border-foreground scale-110'
                          : 'border-border hover:border-foreground'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción opcional"
                  rows={2}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button type="submit" className="w-full">
                {editingId ? 'Actualizar' : 'Crear'} Etiqueta
              </Button>
            </form>
          </Card>
        )}

        {/* Tags Grid */}
        <div className="grid gap-4">
          {tags.length === 0 ? (
            <Card className="p-12 text-center bg-card">
              <TagIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No hay etiquetas creadas</p>
              <Button onClick={() => setShowForm(true)}>Crear Primera Etiqueta</Button>
            </Card>
          ) : (
            tags.map((tag) => (
              <Card key={tag.id} className="p-4 bg-card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: tag.color }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{tag.name}</h3>
                      {tag.description && (
                        <p className="text-sm text-muted-foreground mt-1">{tag.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">ID: {tag.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(tag)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(tag.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
