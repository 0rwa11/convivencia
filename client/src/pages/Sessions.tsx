import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Users, Heart, Zap } from "lucide-react";

export default function Sessions() {
  const sessions = [
    {
      week: 1,
      title: "Conocernos sin Juicios",
      icon: Users,
      color: "bg-blue-50 border-blue-200",
      description: "Rompemos el hielo y creamos un espacio seguro para conocernos",
      dynamics: [
        {
          name: "Círculo del Ritmo y la Palabra",
          description: "Actividad de presentación participativa usando ritmo y movimiento",
        },
        {
          name: "Termómetro del Estereotipo",
          description: "Reflexionamos sobre prejuicios comunes mediante afirmaciones provocadoras",
        },
      ],
      objectives: [
        "Crear un ambiente de confianza y seguridad",
        "Romper el hielo entre participantes",
        "Introducir el concepto de estereotipos",
      ],
    },
    {
      week: 2,
      title: "Entender Nuestras Diferencias",
      icon: Heart,
      color: "bg-green-50 border-green-200",
      description: "Exploramos y valoramos las diferencias culturales que nos enriquecen",
      dynamics: [
        {
          name: "Semáforo Cultural",
          description: "Identificamos comportamientos normales, que dependen del contexto y poco comunes",
        },
        {
          name: "Maleta Común",
          description: "Descubrimos estereotipos negativos y cualidades positivas compartidas",
        },
      ],
      objectives: [
        "Explorar diferencias culturales sin juzgar",
        "Entender que lo 'normal' varía según la cultura",
        "Identificar cualidades positivas en todas las culturas",
      ],
    },
    {
      week: 3,
      title: "Construir Juntos",
      icon: Zap,
      color: "bg-orange-50 border-orange-200",
      description: "Creamos un producto colectivo que celebra nuestra diversidad",
      dynamics: [
        {
          name: "Mercado Cultural",
          description: "Intercambiamos historias, tradiciones y saberes de nuestras culturas",
        },
        {
          name: "Árbol de la Contribución",
          description: "Reconocemos las fortalezas y contribuciones de cada persona al centro",
        },
      ],
      objectives: [
        "Crear un producto colectivo que celebre la diversidad",
        "Reconocer las contribuciones de cada persona",
        "Fortalecer el sentido de comunidad",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Las 3 Sesiones</h1>
          <p className="text-lg text-muted-foreground">
            Estructura semanal del programa con dinámicas específicas para cada semana
          </p>
        </div>

        {/* Sessions Grid */}
        <div className="space-y-8">
          {sessions.map((session) => {
            const Icon = session.icon;
            return (
              <Card
                key={session.week}
                className={`p-8 border-2 border-l-4 ${session.color}`}
              >
                <div className="flex gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary mb-1">SEMANA {session.week}</p>
                    <h2 className="text-2xl font-bold text-foreground">{session.title}</h2>
                  </div>
                </div>

                <p className="text-foreground mb-6 leading-relaxed">{session.description}</p>

                {/* Objectives */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                    Objetivos
                  </h3>
                  <ul className="space-y-2">
                    {session.objectives.map((obj, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-primary font-bold flex-shrink-0">•</span>
                        <span className="text-foreground">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dynamics */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                    Dinámicas
                  </h3>
                  <div className="space-y-3">
                    {session.dynamics.map((dynamic, idx) => (
                      <div key={idx} className="bg-white/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-foreground mb-1">{dynamic.name}</h4>
                        <p className="text-sm text-muted-foreground">{dynamic.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-3">
                  <Link href="/dinamicas">
                    <Button variant="default" size="sm">
                      Ver Dinámicas Detalladas
                    </Button>
                  </Link>
                  <Link href="/materiales">
                    <Button variant="outline" size="sm">
                      Descargar Materiales
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Timeline Info */}
        <Card className="p-8 mt-12 border-0 shadow-sm bg-primary/5">
          <h2 className="text-xl font-bold text-foreground mb-4">Estructura Temporal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Duración por Sesión</p>
              <p className="text-2xl font-bold text-primary">2-3 horas</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Frecuencia</p>
              <p className="text-2xl font-bold text-primary">1 vez por semana</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Tamaño de Grupo</p>
              <p className="text-2xl font-bold text-primary">15-20 personas</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
