import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Sobre el Programa
          </h1>
          <p className="text-lg text-muted-foreground">
            Conoce la justificación, objetivos y estructura del Programa de Convivencia Intercultural
          </p>
        </div>

        {/* Justification */}
        <Card className="p-8 mb-8 border-0 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-4">Justificación</h2>
          <p className="text-foreground leading-relaxed mb-4">
            El centro de día atiende a adultos migrantes y solicitantes de asilo (20-35 años) con trayectorias de vida difíciles. Aunque comparten experiencias similares, las diferencias culturales, lingüísticas y de origen pueden generar tensiones en la convivencia diaria.
          </p>
          <p className="text-foreground leading-relaxed">
            Este programa busca mejorar la coexistencia dentro del centro a través de actividades que promuevan el entendimiento mutuo, reduzcan estereotipos y celebren las fortalezas de cada persona. El enfoque es 100% participativo, oral y respetuoso, reconociendo la dignidad y resilencia de los participantes.
          </p>
        </Card>

        {/* Objectives */}
        <Card className="p-8 mb-8 border-0 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-6">Objetivos Generales</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Crear terreno común</h3>
                <p className="text-muted-foreground">Identificar experiencias, valores y aspiraciones compartidas entre participantes de diferentes orígenes</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Reducir estereotipos</h3>
                <p className="text-muted-foreground">Cuestionar prejuicios mediante reflexión colectiva y diálogo respetuoso</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Valorar diferencias</h3>
                <p className="text-muted-foreground">Reconocer que las diferencias culturales enriquecen la comunidad</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Celebrar contribuciones</h3>
                <p className="text-muted-foreground">Reconocer el valor y las fortalezas que cada persona aporta al centro</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Structure */}
        <Card className="p-8 border-0 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-6">Estructura del Programa</h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Duración y Grupos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Duración Total</p>
                <p className="text-2xl font-bold text-primary">3 Semanas</p>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Grupos</p>
                <p className="text-2xl font-bold text-primary">3 Grupos</p>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total de Sesiones</p>
                <p className="text-2xl font-bold text-primary">9 Sesiones</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Metodología</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground"><strong>100% Participativa:</strong> Todos son actores, no espectadores</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground"><strong>Oral y Kinestésica:</strong> Diseñada para no-alfabetizados</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground"><strong>Respetuosa:</strong> Reconoce la dignidad y fortaleza de los participantes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground"><strong>Trilingüe:</strong> Materiales en español, francés y árabe</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground"><strong>Gamificada:</strong> Pasaporte y certificado para motivar participación</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
