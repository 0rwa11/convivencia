import { Link, useLocation } from "wouter";
import { Menu, X, Moon, Sun, BarChart3, BookOpen, Wrench, LogOut, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

import { useEvaluation } from "@/contexts/EvaluationContext";
import { generateEvaluationPDF } from "@/lib/pdfReportGenerator";

interface NavSection {
  title: string;
  icon: React.ReactNode;
  items: { label: string; href: string }[];
}

export default function Navigation() {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const { records } = useEvaluation();

  const handleLogout = () => {
    alert('Logout functionality is disabled in static mode.');
  };

  const handleExportPDF = () => {
    generateEvaluationPDF(records);
  };

  const navSections: NavSection[] = [
    {
      title: "📚 Programa",
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        { label: "Inicio", href: "/" },
        { label: "Sobre el Programa", href: "/programa" },
        { label: "Las 3 Sesiones", href: "/sesiones" },
        { label: "Dinámicas", href: "/dinamicas" },
        { label: "Materiales", href: "/materiales" },
        { label: "Guía del Facilitador", href: "/guia" },
      ],
    },
    {
      title: "📊 Trabajo",
      icon: <BarChart3 className="w-5 h-5" />,
      items: [
        { label: "Evaluación", href: "/evaluacion" },
        { label: "Registro de Evaluaciones", href: "/registro-evaluaciones" },
        { label: "Análisis Comparativo", href: "/analisis-comparativo" },
        { label: "Dashboard de Grupos", href: "/dashboard-grupos" },
      ],
    },
    {
      title: "⚙️ Herramientas",
      icon: <Wrench className="w-5 h-5" />,
      items: [
        { label: "Calendario", href: "/calendario" },
        { label: "Búsqueda Avanzada", href: "/busqueda-avanzada" },
        { label: "Resumen Ejecutivo", href: "/resumen-ejecutivo" },
      ],
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="hidden sm:inline">Convivencia</span>
          </a>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1">
          {navSections.map((section) => (
            <div key={section.title} className="relative group">
              <button className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2">
                {section.icon}
                <span className="hidden xl:inline">{section.title.split(" ")[1]}</span>
              </button>
              {/* Dropdown */}
              <div className="absolute left-0 mt-0 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                {section.items.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                      {item.label}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExportPDF}
            className="text-foreground hover:bg-secondary hidden sm:flex"
            title="Exportar a PDF"
          >
            <Download className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-foreground hover:bg-secondary"
            title={theme === "light" ? "Modo oscuro" : "Modo claro"}
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>



          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-foreground hover:bg-secondary"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <div className="container py-4 space-y-4 max-h-96 overflow-y-auto">
            {navSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </h3>
                <div className="space-y-1 pl-4">
                  {section.items.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <a
                        className="block px-3 py-2 text-sm text-foreground hover:bg-secondary rounded transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
