import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BookOpen } from "lucide-react";

export default function Materials() {
  const materialCategories = [
    {
      title: "Documentos Estratégicos",
      description: "Programa, dinámicas y guía del facilitador",
      items: [
        {
          name: "Programa Completo",
          file: "Programa_Convivencia_Revisado_Final.md",
          description: "Justificación, objetivos y estructura de 3 semanas",
        },
        {
          name: "Dinámicas Detalladas",
          file: "Dinamicas_Detalladas_Revisadas.md",
          description: "Descripción completa de las 6 dinámicas",
        },
        {
          name: "Guía del Facilitador",
          file: "Guia_Facilitador.md",
          description: "Instrucciones paso a paso para implementar",
        },
      ],
    },
    {
      title: "Listas para Leer en Voz Alta",
      description: "Afirmaciones y comportamientos trilingües",
      items: [
        {
          name: "Sesión 1 - Termómetro",
          file: "S1_Termometro_Afirmaciones.pdf",
          description: "30 afirmaciones para la dinámica del Termómetro",
        },
        {
          name: "Sesión 2 - Semáforo y Maleta",
          file: "S2_Semaforo_Maleta_Afirmaciones.pdf",
          description: "Comportamientos y cualidades para ambas dinámicas",
        },
      ],
    },
    {
      title: "Dinámicas Completas - Versión Suave",
      description: "Versiones adaptadas y sensibles",
      items: [
        {
          name: "Maleta Común (Suave)",
          file: "D3_Maleta_Comun_Lista.pdf",
          description: "40 estereotipos + 40 cualidades positivas",
        },
        {
          name: "Termómetro (Suave)",
          file: "D4_Termometro_Estereotipo_Lista.pdf",
          description: "40 afirmaciones sobre culturas y migración",
        },
        {
          name: "Resiliencia (Suave)",
          file: "D5_Linea_Resiliencia_Lista.pdf",
          description: "40 afirmaciones positivas sobre logros",
        },
        {
          name: "Semáforo Cultural (Suave)",
          file: "D8_Semaforo_Cultural_Lista.pdf",
          description: "40 comportamientos y normas de convivencia",
        },
      ],
    },
    {
      title: "Dinámicas Completas - Versión Provocadora",
      description: "Versiones más desafiantes y reflexivas",
      items: [
        {
          name: "Maleta Común (Provocadora)",
          file: "D3_Maleta_Comun_Lista_v2.pdf",
          description: "Versión más desafiante de la dinámica",
        },
        {
          name: "Termómetro (Provocadora)",
          file: "D4_Termometro_Estereotipo_Lista_v2.pdf",
          description: "Afirmaciones más provocadoras y reflexivas",
        },
        {
          name: "Resiliencia (Provocadora)",
          file: "D5_Linea_Resiliencia_Lista_v2.pdf",
          description: "Versión más desafiante",
        },
        {
          name: "Semáforo Cultural (Provocadora)",
          file: "D8_Semaforo_Cultural_Lista_v2.pdf",
          description: "Comportamientos más provocadores",
        },
      ],
    },
    {
      title: "Carteles para la Sala",
      description: "Materiales visuales para colgar en la pared",
      items: [
        {
          name: "Carteles Sesiones 1 y 2",
          file: "Carteles_Grandes_Sesiones.pdf",
          description: "6 carteles A4 trilingües (Acuerdo/No Seguro/Desacuerdo y Normal/Depende/Poco Común)",
        },
      ],
    },
    {
      title: "Pasaporte y Certificado",
      description: "Gamificación y reconocimiento",
      items: [
        {
          name: "Pasaporte Final",
          file: "Pasaporte_Final_6Dinamicas.pdf",
          description: "Pasaporte con 6 círculos para sellar",
        },
        {
          name: "Portada del Pasaporte",
          file: "Pasaporte_Portada.pdf",
          description: "Portada inspiradora con mapa y frases",
        },
        {
          name: "Certificado",
          file: "Certificado_Convivencia.pdf",
          description: "Certificado elegante para entrega final",
        },
      ],
    },
    {
      title: "Fichas de Evaluación",
      description: "Herramientas de medición de impacto",
      items: [
        {
          name: "Evaluación Completa",
          file: "Fichas_Evaluacion_Revisadas.md",
          description: "Evaluación antes, durante y después del programa",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Materiales Descargables</h1>
          <p className="text-lg text-muted-foreground">
            Todos los recursos necesarios para implementar el programa
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {materialCategories.map((category, catIdx) => (
            <div key={catIdx}>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-foreground mb-1">{category.title}</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {category.items.map((item, itemIdx) => (
                  <Card
                    key={itemIdx}
                    className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.file.endsWith(".pdf") ? (
                          <FileText className="w-6 h-6 text-primary" />
                        ) : (
                          <BookOpen className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = `/pdfs/${item.file}`;
                            link.download = '';
                            link.click();
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <Card className="p-8 border-0 shadow-sm bg-primary/5 mt-12">
          <h2 className="text-xl font-bold text-foreground mb-4">Resumen de Materiales</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Documentos Estratégicos</p>
              <p className="text-2xl font-bold text-primary">3</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">PDFs Descargables</p>
              <p className="text-2xl font-bold text-primary">20+</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Idiomas</p>
              <p className="text-2xl font-bold text-primary">3</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Versiones</p>
              <p className="text-2xl font-bold text-primary">2</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
