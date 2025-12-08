import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function FacilitatorGuide() {
  const sections = [
    {
      title: "Preparación Previa",
      items: [
        "Revisar todas las dinámicas y materiales con anticipación",
        "Preparar el espacio: muebles, carteles, materiales",
        "Imprimir listas de afirmaciones en tamaño legible",
        "Preparar música o instrumentos si es necesario",
        "Crear un ambiente acogedor y seguro",
      ],
    },
    {
      title: "Principios Fundamentales",
      items: [
        "Respeto absoluto por la dignidad de cada persona",
        "100% participativo: todos son actores, no espectadores",
        "Sin juzgar: crear espacio seguro para expresarse",
        "Reconocer fortalezas: enfoque en capacidades, no déficits",
        "Celebrar la diversidad: diferencias como riqueza",
      ],
    },
    {
      title: "Manejo de Dinámicas Difíciles",
      items: [
        "Si alguien se resiste: respeta su decisión, no fuerces participación",
        "Si hay conflicto: pausa, respira, reconoce emociones",
        "Si alguien se emociona: ofrece espacio, agua, apoyo discreto",
        "Si el grupo se dispersa: retoma el objetivo con calma",
        "Si hay silencio: es normal, espera con paciencia",
      ],
    },
    {
      title: "Adaptaciones Según el Grupo",
      items: [
        "Grupos muy tímidos: comienza con dinámicas más suaves",
        "Grupos muy activos: necesitan más movimiento y energía",
        "Grupos heterogéneos: usa versión provocadora para profundidad",
        "Grupos con trauma: sé especialmente sensible, ofrece opciones",
        "Grupos con idiomas diversos: usa lenguaje corporal y visual",
      ],
    },
    {
      title: "Evaluación Continua",
      items: [
        "Observa participación y energía del grupo",
        "Anota momentos clave y cambios de actitud",
        "Recopila feedback informal durante y después",
        "Ajusta dinámicas según lo que observas",
        "Celebra pequeños logros y cambios positivos",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Guía del Facilitador</h1>
          <p className="text-lg text-muted-foreground">
            Manual práctico para implementar el Programa de Convivencia Intercultural
          </p>
        </div>

        {/* Download Button */}
        <div className="mb-8">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/pdfs/Guia_Facilitador.md';
              link.download = '';
              link.click();
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Guía Completa (PDF)
          </Button>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <Card key={idx} className="p-8 border-0 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">{section.title}</h2>
              <ul className="space-y-4">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex gap-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span className="text-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Timeline */}
        <Card className="p-8 border-0 shadow-sm mt-8 bg-primary/5">
          <h2 className="text-2xl font-bold text-foreground mb-6">Estructura de una Sesión Típica</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-center">
                  <p className="text-2xl">15</p>
                  <p className="text-xs">min</p>
                </span>
              </div>
              <div className="pt-2">
                <h3 className="font-semibold text-foreground mb-1">Bienvenida y Encuadre</h3>
                <p className="text-muted-foreground">Presentación del objetivo, normas de convivencia, creación de ambiente seguro</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-center">
                  <p className="text-2xl">45</p>
                  <p className="text-xs">min</p>
                </span>
              </div>
              <div className="pt-2">
                <h3 className="font-semibold text-foreground mb-1">Dinámica 1</h3>
                <p className="text-muted-foreground">Actividad participativa con movimiento, reflexión y diálogo</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-center">
                  <p className="text-2xl">10</p>
                  <p className="text-xs">min</p>
                </span>
              </div>
              <div className="pt-2">
                <h3 className="font-semibold text-foreground mb-1">Descanso</h3>
                <p className="text-muted-foreground">Café, agua, conversación informal, movimiento libre</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-center">
                  <p className="text-2xl">45</p>
                  <p className="text-xs">min</p>
                </span>
              </div>
              <div className="pt-2">
                <h3 className="font-semibold text-foreground mb-1">Dinámica 2</h3>
                <p className="text-muted-foreground">Actividad participativa complementaria</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-center">
                  <p className="text-2xl">15</p>
                  <p className="text-xs">min</p>
                </span>
              </div>
              <div className="pt-2">
                <h3 className="font-semibold text-foreground mb-1">Cierre y Reflexión</h3>
                <p className="text-muted-foreground">Reflexión colectiva, pasaporte, evaluación rápida</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tips */}
        <Card className="p-8 border-0 shadow-sm mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Consejos Prácticos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Lenguaje Corporal</h3>
              <p className="text-muted-foreground">Mantén una postura abierta, sonríe, haz contacto visual. Tu energía contagia al grupo.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Escucha Activa</h3>
              <p className="text-muted-foreground">Escucha sin interrumpir, valida emociones, haz preguntas abiertas para profundizar.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Flexibilidad</h3>
              <p className="text-muted-foreground">El plan es una guía, no una ley. Adapta según la energía y necesidades del grupo.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Celebración</h3>
              <p className="text-muted-foreground">Reconoce participación, celebra pequeños logros, crea momentos de alegría.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
