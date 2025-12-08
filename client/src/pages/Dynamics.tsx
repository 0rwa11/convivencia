import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dynamics() {
  const dynamics = [
    {
      id: 1,
      name: "Círculo del Ritmo y la Palabra",
      week: 1,
      duration: "30-40 min",
      objectives: [
        "Crear un ambiente de confianza y seguridad",
        "Permitir que cada persona se presente de forma creativa",
        "Establecer un sentido de comunidad desde el inicio",
      ],
      materials: [
        "Espacio amplio sin muebles",
        "Instrumentos de percusión (tambores, panderetas)",
        "Música opcional",
      ],
      structure: [
        "Formamos un círculo de pie",
        "Facilitador presenta el objetivo",
        "Cada persona dice su nombre y hace un movimiento",
        "El grupo repite el nombre y el movimiento",
        "Al final, todos hacemos una secuencia con todos los movimientos",
      ],
      successIndicators: [
        "Participación activa de todos",
        "Risas y ambiente relajado",
        "Conexión visual entre participantes",
      ],
    },
    {
      id: 2,
      name: "Termómetro del Estereotipo",
      week: 1,
      duration: "45-60 min",
      objectives: [
        "Identificar estereotipos comunes",
        "Reflexionar críticamente sobre prejuicios",
        "Crear espacio para cuestionar creencias automáticas",
      ],
      materials: [
        "3 carteles grandes: Acuerdo / No Seguro / Desacuerdo",
        "Lista de 30-40 afirmaciones sobre estereotipos",
        "Espacio con 3 zonas claramente marcadas",
      ],
      structure: [
        "Se explica el objetivo: reflexionar sobre estereotipos sin juzgar",
        "Se leen afirmaciones provocadoras",
        "Cada persona se posiciona en una zona según su acuerdo",
        "Se invita a personas a explicar su posición",
        "Facilitador guía reflexión sobre prejuicios",
      ],
      successIndicators: [
        "Participación en el movimiento físico",
        "Diálogo respetuoso entre diferentes posiciones",
        "Reflexión crítica sobre los propios prejuicios",
      ],
    },
    {
      id: 3,
      name: "Semáforo Cultural",
      week: 2,
      duration: "40-50 min",
      objectives: [
        "Entender que lo normal varía según la cultura",
        "Reducir juicios sobre comportamientos diferentes",
        "Valorar la diversidad de normas culturales",
      ],
      materials: [
        "3 carteles grandes: Verde / Amarillo / Rojo",
        "Lista de 15-20 comportamientos culturales",
        "Espacio con 3 zonas",
      ],
      structure: [
        "Se explica que lo normal varía según la cultura",
        "Se leen comportamientos",
        "Cada persona se posiciona según su cultura",
        "Se discute cómo el mismo comportamiento puede ser normal en una cultura y raro en otra",
      ],
      successIndicators: [
        "Comprensión de la relatividad cultural",
        "Respeto por diferentes normas",
        "Reducción de juicios automáticos",
      ],
    },
    {
      id: 4,
      name: "Maleta Común",
      week: 2,
      duration: "45-60 min",
      objectives: [
        "Identificar estereotipos negativos comunes",
        "Reconocer cualidades positivas compartidas",
        "Celebrar la humanidad común",
      ],
      materials: [
        "Tarjetas o papeles con estereotipos y cualidades",
        "Una maleta o caja como símbolo",
        "Espacio central",
      ],
      structure: [
        "Se presenta una maleta que representa lo que compartimos",
        "Se leen estereotipos negativos",
        "Se leen cualidades positivas",
        "El grupo decide qué va en la maleta",
      ],
      successIndicators: [
        "Rechazo colectivo de estereotipos negativos",
        "Identificación con cualidades positivas",
        "Sentido de pertenencia a un grupo",
      ],
    },
    {
      id: 5,
      name: "Mercado Cultural",
      week: 3,
      duration: "60-90 min",
      objectives: [
        "Intercambiar historias y tradiciones",
        "Celebrar la diversidad cultural",
        "Crear conexiones personales más profundas",
      ],
      materials: [
        "Espacio amplio para puestos de mercado",
        "Objetos, fotos o símbolos de diferentes culturas",
        "Papel y marcadores para registrar historias",
      ],
      structure: [
        "Se divide el grupo en pequeños grupos por región",
        "Cada grupo prepara un puesto con historias y tradiciones",
        "Los demás visitan los puestos",
        "Se comparten historias de resiliencia y valores",
      ],
      successIndicators: [
        "Entusiasmo y participación activa",
        "Preguntas genuinas entre grupos",
        "Reconocimiento de la riqueza cultural",
      ],
    },
    {
      id: 6,
      name: "Árbol de la Contribución",
      week: 3,
      duration: "45-60 min",
      objectives: [
        "Reconocer las fortalezas de cada persona",
        "Celebrar las contribuciones al centro",
        "Fortalecer el sentido de comunidad",
      ],
      materials: [
        "Un árbol dibujado en papel grande",
        "Hojas de papel para escribir contribuciones",
        "Marcadores de colores",
      ],
      structure: [
        "Se presenta un árbol como símbolo de crecimiento",
        "Cada persona identifica una fortaleza propia",
        "Se escribe en una hoja y se adhiere al árbol",
        "Se reflexiona sobre cómo el árbol crece gracias a todos",
      ],
      successIndicators: [
        "Identificación de fortalezas propias",
        "Reconocimiento de contribuciones de otros",
        "Sentido de orgullo colectivo",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Dinámicas Detalladas</h1>
          <p className="text-lg text-muted-foreground">
            Descripción completa de cada una de las 6 dinámicas del programa
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="1" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
            {dynamics.map((d) => (
              <TabsTrigger key={d.id} value={d.id.toString()}>
                D{d.id}
              </TabsTrigger>
            ))}
          </TabsList>

          {dynamics.map((dynamic) => (
            <TabsContent key={dynamic.id} value={dynamic.id.toString()}>
              <Card className="p-8 border-0 shadow-sm">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">{dynamic.name}</h2>
                      <p className="text-muted-foreground mt-2">Semana {dynamic.week} • {dynamic.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Objectives */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Objetivos</h3>
                  <ul className="space-y-2">
                    {dynamic.objectives.map((obj, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-primary font-bold flex-shrink-0">•</span>
                        <span className="text-foreground">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Materials */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Materiales Necesarios</h3>
                  <ul className="space-y-2">
                    {dynamic.materials.map((mat, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-primary font-bold flex-shrink-0">•</span>
                        <span className="text-foreground">{mat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Structure */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Estructura Paso a Paso</h3>
                  <ol className="space-y-3">
                    {dynamic.structure.map((step, idx) => (
                      <li key={idx} className="flex gap-4">
                        <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-foreground pt-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Success Indicators */}
                <div className="bg-primary/5 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Indicadores de Éxito</h3>
                  <ul className="space-y-2">
                    {dynamic.successIndicators.map((indicator, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-primary font-bold flex-shrink-0">✓</span>
                        <span className="text-foreground">{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
