import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle } from "lucide-react";

export default function Evaluation() {
  const evaluationPhases = [
    {
      phase: "Evaluación Inicial (Antes)",
      timing: "Sesión 1 - Primeros 15 minutos",
      purpose: "Establecer línea base de actitudes y comportamientos",
      indicators: [
        "Nivel de confianza inicial en el grupo",
        "Presencia de prejuicios y estereotipos",
        "Disposición a la participación",
        "Nivel de comodidad con la diversidad",
      ],
      method: "Observación directa, preguntas abiertas, escala de actitud",
    },
    {
      phase: "Evaluación Continua (Durante)",
      timing: "Después de cada dinámica",
      purpose: "Monitorear progreso y ajustar dinámicas",
      indicators: [
        "Nivel de participación en actividades",
        "Calidad del diálogo y respeto mutuo",
        "Cambios en actitudes hacia la diversidad",
        "Conexión y cohesión del grupo",
      ],
      method: "Observación de comportamiento, notas de facilitador, feedback informal",
    },
    {
      phase: "Evaluación Final (Después)",
      timing: "Sesión 3 - Últimos 30 minutos",
      purpose: "Medir cambios y impacto del programa",
      indicators: [
        "Cambio en actitudes hacia la diversidad",
        "Reducción de estereotipos",
        "Aumento en sentido de comunidad",
        "Intención de comportamientos inclusivos",
      ],
      method: "Escala de actitud, grupo focal, reflexión colectiva",
    },
  ];

  const successIndicators = [
    {
      category: "Participación",
      indicators: [
        "Aumento en número de personas que participan activamente",
        "Participación equilibrada entre hombres y mujeres",
        "Personas que inicialmente eran tímidas ahora se expresan",
      ],
    },
    {
      category: "Diálogo y Respeto",
      indicators: [
        "Conversaciones respetuosas entre personas de diferentes orígenes",
        "Escucha activa sin interrupciones",
        "Validación de perspectivas diferentes",
      ],
    },
    {
      category: "Cambio de Actitudes",
      indicators: [
        "Reducción en comentarios estereotipados",
        "Mayor curiosidad sobre otras culturas",
        "Reconocimiento de similitudes entre grupos",
      ],
    },
    {
      category: "Sentido de Comunidad",
      indicators: [
        "Aumento en interacciones positivas fuera de las sesiones",
        "Apoyo mutuo entre participantes",
        "Sentido de pertenencia al grupo",
      ],
    },
    {
      category: "Comportamiento",
      indicators: [
        "Inclusión de personas de otros orígenes en actividades",
        "Defensa de personas que enfrentan discriminación",
        "Iniciativa para resolver conflictos de forma respetuosa",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Fichas de Evaluación</h1>
          <p className="text-lg text-muted-foreground">
            Herramientas para medir el impacto del programa
          </p>
        </div>

        {/* Download Button */}
        <div className="mb-8">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/pdfs/Fichas_Evaluacion_Revisadas.md';
              link.download = '';
              link.click();
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Fichas Completas
          </Button>
        </div>

        {/* Evaluation Phases */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Fases de Evaluación</h2>
          <div className="space-y-6">
            {evaluationPhases.map((phase, idx) => (
              <Card key={idx} className="p-8 border-0 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-2">{phase.phase}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{phase.timing}</p>
                  <p className="text-foreground font-medium">{phase.purpose}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Indicadores</h4>
                    <ul className="space-y-2">
                      {phase.indicators.map((indicator, indIdx) => (
                        <li key={indIdx} className="flex gap-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                          <span className="text-muted-foreground text-sm">{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Método</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{phase.method}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Indicators */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Indicadores de Éxito</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {successIndicators.map((section, idx) => (
              <Card key={idx} className="p-6 border-0 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">{section.category}</h3>
                <ul className="space-y-3">
                  {section.indicators.map((indicator, indIdx) => (
                    <li key={indIdx} className="flex gap-3">
                      <span className="text-primary font-bold flex-shrink-0">•</span>
                      <span className="text-muted-foreground text-sm">{indicator}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Evaluation Tips */}
        <Card className="p-8 border-0 shadow-sm mt-12 bg-primary/5">
          <h2 className="text-2xl font-bold text-foreground mb-6">Consejos para Evaluar</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Observación Continua</h3>
                <p className="text-muted-foreground">Toma notas durante y después de cada sesión sobre comportamientos y actitudes observadas.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Feedback Informal</h3>
                <p className="text-muted-foreground">Pregunta a participantes cómo se sienten, qué aprendieron, qué cambió en sus perspectivas.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Comparación Antes-Después</h3>
                <p className="text-muted-foreground">Compara actitudes y comportamientos iniciales con los finales para medir cambio.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Celebra Cambios Pequeños</h3>
                <p className="text-muted-foreground">Los cambios en actitudes no siempre son dramáticos. Reconoce y celebra pequeños pasos.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">5</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Seguimiento Post-Programa</h3>
                <p className="text-muted-foreground">Si es posible, haz seguimiento después del programa para ver si los cambios se mantienen.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
