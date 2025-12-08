import { EvaluationRecord } from '@/contexts/EvaluationContext';

export function generatePDFReport(records: EvaluationRecord[], selectedGroup: string = 'all') {
  const filteredRecords = selectedGroup === 'all' 
    ? records 
    : records.filter(r => r.groupName === selectedGroup);

  if (filteredRecords.length === 0) {
    alert('No hay datos para generar el reporte');
    return;
  }

  // Calculate metrics
  const avgBeforeMixed = Math.round(
    filteredRecords.reduce((sum, r) => sum + r.beforeMixedInteractions, 0) / filteredRecords.length
  );

  const avgAfterMixed = Math.round(
    filteredRecords.reduce((sum, r) => sum + r.afterMixedInteractions, 0) / filteredRecords.length
  );

  const improvementPercent = avgBeforeMixed > 0
    ? Math.round(((avgAfterMixed - avgBeforeMixed) / avgBeforeMixed) * 100)
    : 0;

  // Create HTML content
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte de Evaluaciones - Programa de Convivencia Intercultural</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #0891b2;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          color: #0891b2;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .metric-card {
          border: 2px solid #0891b2;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          background: #f0f9fb;
        }
        .metric-card h3 {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 14px;
        }
        .metric-card .value {
          font-size: 32px;
          font-weight: bold;
          color: #0891b2;
        }
        .metric-card .unit {
          font-size: 12px;
          color: #999;
          margin-top: 5px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          color: #0891b2;
          border-bottom: 2px solid #0891b2;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        table th {
          background: #0891b2;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        table td {
          padding: 10px 12px;
          border-bottom: 1px solid #ddd;
        }
        table tr:nth-child(even) {
          background: #f9f9f9;
        }
        .summary-text {
          background: #f0f9fb;
          padding: 15px;
          border-left: 4px solid #0891b2;
          margin: 15px 0;
          line-height: 1.6;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #999;
          font-size: 12px;
        }
        .positive {
          color: #16a34a;
          font-weight: bold;
        }
        .negative {
          color: #ef4444;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Reporte de Evaluaciones</h1>
        <p>Programa de Convivencia Intercultural - Centro de Día</p>
        <p>Generado: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div class="metrics">
        <div class="metric-card">
          <h3>Interacciones Antes</h3>
          <div class="value">${avgBeforeMixed}</div>
          <div class="unit">promedio por grupo</div>
        </div>
        <div class="metric-card">
          <h3>Interacciones Después</h3>
          <div class="value">${avgAfterMixed}</div>
          <div class="unit">promedio por grupo</div>
        </div>
        <div class="metric-card">
          <h3>Mejora Total</h3>
          <div class="value positive">+${improvementPercent}%</div>
          <div class="unit">aumento promedio</div>
        </div>
      </div>

      <div class="section">
        <h2>Resumen Ejecutivo</h2>
        <div class="summary-text">
          <p>Se realizaron <strong>${filteredRecords.length}</strong> evaluaciones en ${selectedGroup === 'all' ? 'todos los grupos' : `el ${selectedGroup}`}.</p>
          <p>El programa mostró un aumento de <span class="positive">${improvementPercent}%</span> en las interacciones mixtas entre participantes de diferentes nacionalidades.</p>
          <p>Las interacciones pasaron de un promedio de <strong>${avgBeforeMixed}</strong> a <strong>${avgAfterMixed}</strong> por sesión, demostrando un impacto positivo en la convivencia intercultural.</p>
        </div>
      </div>

      <div class="section">
        <h2>Datos Detallados por Evaluación</h2>
        <table>
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Fecha</th>
              <th>Antes</th>
              <th>Después</th>
              <th>Mejora</th>
              <th>Respeto</th>
              <th>Estereotipos</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords.map(record => `
              <tr>
                <td>${record.groupName}</td>
                <td>${record.date}</td>
                <td>${record.beforeMixedInteractions}</td>
                <td>${record.afterMixedInteractions}</td>
                <td class="positive">+${record.beforeMixedInteractions > 0 ? Math.round(((record.afterMixedInteractions - record.beforeMixedInteractions) / record.beforeMixedInteractions) * 100) : 0}%</td>
                <td>${record.duringRespect}</td>
                <td>${record.afterStereotypes}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>Indicadores Clave</h2>
        <table>
          <thead>
            <tr>
              <th>Indicador</th>
              <th>Valor</th>
              <th>Interpretación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Participación Promedio</td>
              <td>${Math.round(filteredRecords.reduce((sum, r) => {
                const percent = parseInt(r.duringParticipation.replace('%', '').split('-')[0]) || 0;
                return sum + percent;
              }, 0) / filteredRecords.length)}%</td>
              <td>Nivel de involucramiento en dinámicas</td>
            </tr>
            <tr>
              <td>Respeto Mutuo</td>
              <td>${filteredRecords.filter(r => r.duringRespect === 'Alto').length > 0 ? 'Alto' : 'Medio'}</td>
              <td>Calidad del diálogo entre participantes</td>
            </tr>
            <tr>
              <td>Reducción de Estereotipos</td>
              <td>${filteredRecords.filter(r => r.afterStereotypes === 'Disminuyeron').length}/${filteredRecords.length}</td>
              <td>Grupos con cambio positivo en percepciones</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>Este reporte fue generado automáticamente por el sistema de evaluación del Programa de Convivencia Intercultural.</p>
        <p>Para más información, contacte al equipo del Centro de Día.</p>
      </div>
    </body>
    </html>
  `;

  // Create a blob and download
  const blob = new Blob([html], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte_evaluaciones_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}

// Alternative: Generate as PDF using print dialog
export function printReportAsPDF(records: EvaluationRecord[], selectedGroup: string = 'all') {
  const filteredRecords = selectedGroup === 'all' 
    ? records 
    : records.filter(r => r.groupName === selectedGroup);

  if (filteredRecords.length === 0) {
    alert('No hay datos para generar el reporte');
    return;
  }

  // Calculate metrics
  const avgBeforeMixed = Math.round(
    filteredRecords.reduce((sum, r) => sum + r.beforeMixedInteractions, 0) / filteredRecords.length
  );

  const avgAfterMixed = Math.round(
    filteredRecords.reduce((sum, r) => sum + r.afterMixedInteractions, 0) / filteredRecords.length
  );

  const improvementPercent = avgBeforeMixed > 0
    ? Math.round(((avgAfterMixed - avgBeforeMixed) / avgBeforeMixed) * 100)
    : 0;

  // Create HTML content
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte de Evaluaciones</title>
      <style>
        @page { margin: 20mm; }
        body {
          font-family: Arial, sans-serif;
          color: #333;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #0891b2;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          color: #0891b2;
          font-size: 24px;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }
        .metric-card {
          border: 2px solid #0891b2;
          padding: 15px;
          text-align: center;
          background: #f0f9fb;
        }
        .metric-card .value {
          font-size: 28px;
          font-weight: bold;
          color: #0891b2;
        }
        .section h2 {
          color: #0891b2;
          border-bottom: 2px solid #0891b2;
          padding-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 12px;
        }
        table th {
          background: #0891b2;
          color: white;
          padding: 8px;
          text-align: left;
        }
        table td {
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Reporte de Evaluaciones</h1>
        <p>Programa de Convivencia Intercultural - Centro de Día</p>
        <p>${new Date().toLocaleDateString('es-ES')}</p>
      </div>

      <div class="metrics">
        <div class="metric-card">
          <h3>Antes</h3>
          <div class="value">${avgBeforeMixed}</div>
        </div>
        <div class="metric-card">
          <h3>Después</h3>
          <div class="value">${avgAfterMixed}</div>
        </div>
        <div class="metric-card">
          <h3>Mejora</h3>
          <div class="value">+${improvementPercent}%</div>
        </div>
      </div>

      <div class="section">
        <h2>Datos Detallados</h2>
        <table>
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Fecha</th>
              <th>Antes</th>
              <th>Después</th>
              <th>Mejora</th>
              <th>Respeto</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords.map(record => `
              <tr>
                <td>${record.groupName}</td>
                <td>${record.date}</td>
                <td>${record.beforeMixedInteractions}</td>
                <td>${record.afterMixedInteractions}</td>
                <td>+${record.beforeMixedInteractions > 0 ? Math.round(((record.afterMixedInteractions - record.beforeMixedInteractions) / record.beforeMixedInteractions) * 100) : 0}%</td>
                <td>${record.duringRespect}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;

  // Open print dialog
  const printWindow = window.open('', '', 'height=600,width=800');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
}
