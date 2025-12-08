import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface EvaluationData {
  sessionNumber: number;
  date: string;
  groupName: string;
  facilitator: string;
  beforeGrouping: string;
  beforeIsolation: string;
  beforeTensions: string;
  beforeCommunication: string;
  beforeMixedInteractions: number;
  duringParticipation: string;
  duringRespect: string;
  duringOpenness: string;
  duringLaughter: string;
  duringMixedInteractions: string;
  afterGrouping: string;
  afterMixedInteractions: number;
  afterStereotypes: string;
  notes: string;
}

export function generateEvaluationPDF(records: EvaluationData[], groupName?: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 15;

  // Header
  doc.setFillColor(0, 128, 128); // Teal color
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Programa de Convivencia Intercultural', pageWidth / 2, 12, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Reporte de Evaluaciones', pageWidth / 2, 22, { align: 'center' });

  currentY = 40;

  // Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const title = groupName ? `Reporte: ${groupName}` : 'Reporte General de Evaluaciones';
  doc.text(title, 15, currentY);
  currentY += 10;

  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 15, currentY);
  currentY += 8;

  // Summary
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumen', 15, currentY);
  currentY += 6;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const filteredRecords = groupName ? records.filter(r => r.groupName === groupName) : records;
  doc.text(`Total de evaluaciones: ${filteredRecords.length}`, 20, currentY);
  currentY += 5;
  doc.text(`Grupos: ${new Set(filteredRecords.map(r => r.groupName)).size}`, 20, currentY);
  currentY += 5;
  doc.text(`Facilitadores: ${new Set(filteredRecords.map(r => r.facilitator)).size}`, 20, currentY);
  currentY += 10;

  // Table
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalle de Evaluaciones', 15, currentY);
  currentY += 8;

  const tableData = filteredRecords.map(r => [
    r.sessionNumber,
    r.date,
    r.groupName,
    r.facilitator,
    r.beforeMixedInteractions,
    r.duringParticipation || '-',
    r.afterMixedInteractions,
    r.afterStereotypes || '-',
  ]);

  (doc as any).autoTable({
    startY: currentY,
    head: [['Sesión', 'Fecha', 'Grupo', 'Facilitador', 'Interacciones Antes', 'Participación', 'Interacciones Después', 'Estereotipos']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 128, 128],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8,
    },
    columnStyles: {
      0: { halign: 'center' },
      1: { halign: 'center' },
      4: { halign: 'center' },
      5: { halign: 'center' },
      6: { halign: 'center' },
    },
    margin: { left: 15, right: 15 },
  });

  // Footer
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text('Centro de Día - Programa de Convivencia Intercultural', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Save
  const filename = groupName ? `reporte_${groupName}_${new Date().toISOString().split('T')[0]}.pdf` : `reporte_evaluaciones_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

export function generateGroupComparisonPDF(groupStats: any[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 15;

  // Header
  doc.setFillColor(0, 128, 128);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Análisis de Grupos', pageWidth / 2, 12, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Comparativa de Desempeño', pageWidth / 2, 22, { align: 'center' });

  currentY = 40;

  // Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Desempeño por Grupo', 15, currentY);
  currentY += 10;

  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 15, currentY);
  currentY += 10;

  // Table
  const tableData = groupStats.map(g => [
    g.name,
    g.totalEvaluations,
    g.avgParticipation || '-',
    g.avgRespect || '-',
    g.avgOpenness || '-',
    g.improvementPercentage || '-',
  ]);

  (doc as any).autoTable({
    startY: currentY,
    head: [['Grupo', 'Evaluaciones', 'Participación Promedio', 'Respeto Promedio', 'Apertura Promedio', 'Mejora %']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 128, 128],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 9,
    },
    margin: { left: 15, right: 15 },
  });

  // Save
  doc.save(`analisis_grupos_${new Date().toISOString().split('T')[0]}.pdf`);
}
