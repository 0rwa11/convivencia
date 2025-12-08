import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface TaggedEvaluation {
  evaluationId: string;
  tags: string[]; // tag IDs
}

interface TaggingContextType {
  tags: Tag[];
  addTag: (name: string, color: string, description?: string) => void;
  deleteTag: (id: string) => void;
  updateTag: (id: string, name: string, color: string, description?: string) => void;
  tagEvaluation: (evaluationId: string, tagIds: string[]) => void;
  getEvaluationTags: (evaluationId: string) => Tag[];
  getTaggedEvaluations: (tagId: string) => string[];
  removeTagFromEvaluation: (evaluationId: string, tagId: string) => void;
}

const TaggingContext = createContext<TaggingContextType | undefined>(undefined);

const DEFAULT_COLORS = [
  '#EF4444', // red
  '#F97316', // orange
  '#EAB308', // yellow
  '#22C55E', // green
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
];

export function TaggingProvider({ children }: { children: React.ReactNode }) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [taggedEvaluations, setTaggedEvaluations] = useState<TaggedEvaluation[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedTags = localStorage.getItem('convivencia_tags');
    const savedTaggedEvals = localStorage.getItem('convivencia_tagged_evaluations');
    
    if (savedTags) {
      setTags(JSON.parse(savedTags));
    } else {
      // Create default tags
      const defaultTags: Tag[] = [
        { id: '1', name: 'Grupo A', color: DEFAULT_COLORS[0], description: 'Grupo A de participantes' },
        { id: '2', name: 'Grupo B', color: DEFAULT_COLORS[1], description: 'Grupo B de participantes' },
        { id: '3', name: 'Sesión 1', color: DEFAULT_COLORS[2], description: 'Primera sesión' },
        { id: '4', name: 'Sesión 2', color: DEFAULT_COLORS[3], description: 'Segunda sesión' },
        { id: '5', name: 'Sesión 3', color: DEFAULT_COLORS[4], description: 'Tercera sesión' },
        { id: '6', name: 'Prioritario', color: DEFAULT_COLORS[5], description: 'Evaluación prioritaria' },
      ];
      setTags(defaultTags);
      localStorage.setItem('convivencia_tags', JSON.stringify(defaultTags));
    }

    if (savedTaggedEvals) {
      setTaggedEvaluations(JSON.parse(savedTaggedEvals));
    }
  }, []);

  const addTag = (name: string, color: string, description?: string) => {
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name,
      color,
      description,
    };
    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    localStorage.setItem('convivencia_tags', JSON.stringify(updatedTags));
  };

  const deleteTag = (id: string) => {
    const updatedTags = tags.filter(t => t.id !== id);
    setTags(updatedTags);
    localStorage.setItem('convivencia_tags', JSON.stringify(updatedTags));

    // Remove from evaluations
    const updatedEvals = taggedEvaluations.map(te => ({
      ...te,
      tags: te.tags.filter(tId => tId !== id),
    })).filter(te => te.tags.length > 0);
    setTaggedEvaluations(updatedEvals);
    localStorage.setItem('convivencia_tagged_evaluations', JSON.stringify(updatedEvals));
  };

  const updateTag = (id: string, name: string, color: string, description?: string) => {
    const updatedTags = tags.map(t => 
      t.id === id ? { ...t, name, color, description } : t
    );
    setTags(updatedTags);
    localStorage.setItem('convivencia_tags', JSON.stringify(updatedTags));
  };

  const tagEvaluation = (evaluationId: string, tagIds: string[]) => {
    const existing = taggedEvaluations.find(te => te.evaluationId === evaluationId);
    
    let updatedEvals: TaggedEvaluation[];
    if (existing) {
      updatedEvals = taggedEvaluations.map(te =>
        te.evaluationId === evaluationId ? { ...te, tags: tagIds } : te
      );
    } else {
      updatedEvals = [...taggedEvaluations, { evaluationId, tags: tagIds }];
    }

    setTaggedEvaluations(updatedEvals);
    localStorage.setItem('convivencia_tagged_evaluations', JSON.stringify(updatedEvals));
  };

  const getEvaluationTags = (evaluationId: string): Tag[] => {
    const tagged = taggedEvaluations.find(te => te.evaluationId === evaluationId);
    if (!tagged) return [];
    return tags.filter(t => tagged.tags.includes(t.id));
  };

  const getTaggedEvaluations = (tagId: string): string[] => {
    return taggedEvaluations
      .filter(te => te.tags.includes(tagId))
      .map(te => te.evaluationId);
  };

  const removeTagFromEvaluation = (evaluationId: string, tagId: string) => {
    const updatedEvals = taggedEvaluations.map(te =>
      te.evaluationId === evaluationId
        ? { ...te, tags: te.tags.filter(tId => tId !== tagId) }
        : te
    ).filter(te => te.tags.length > 0);

    setTaggedEvaluations(updatedEvals);
    localStorage.setItem('convivencia_tagged_evaluations', JSON.stringify(updatedEvals));
  };

  return (
    <TaggingContext.Provider
      value={{
        tags,
        addTag,
        deleteTag,
        updateTag,
        tagEvaluation,
        getEvaluationTags,
        getTaggedEvaluations,
        removeTagFromEvaluation,
      }}
    >
      {children}
    </TaggingContext.Provider>
  );
}

export function useTagging() {
  const context = useContext(TaggingContext);
  if (!context) {
    throw new Error('useTagging must be used within TaggingProvider');
  }
  return context;
}
