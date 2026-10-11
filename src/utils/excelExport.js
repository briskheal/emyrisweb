/**
 * Professional Styled Excel (.xls) Exporter
 * Produces an Excel file with solid blue header patch, white bold font,
 * and clean borders for all cells.
 */
export const exportVisitorsToExcel = (visitors, conferenceFilter = '') => {
  const headers = [
    'Conference',
    'State',
    'City',
    'Name',
    'Email',
    'Phone',
    'Hospital Attached',
    'Address',
    'Date'
  ];

  let rowsHtml = '';
  visitors.forEach((v, idx) => {
    const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    rowsHtml += `
      <tr>
        <td style="border: 1px solid #cbd5e1; padding: 10px 12px; background-color: ${rowBg}; font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b;">${v.conferenceName || 'N/A'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px 12px; background-color: ${rowBg}; font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b;">${v.state || 'N/A'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px 12px; background-color: ${rowBg}; font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b;">${v.city || 'N/A'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px 12px; background-color: ${rowBg}; font-family: Calibri, Arial, sans-serif; font-size: 11pt; font-weight: bold; color: #0f172a;">${v.name || ''}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px 12px; background-color: ${rowBg}; font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #2563eb;">${v.email || ''}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px 12px; background-color: ${rowBg}; font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #0f172a; mso-number-format:'\\@';">${v.phone || ''}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px 12px; background-color: ${rowBg}; font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #334155;">${v.hospitalAttached || ''}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px 12px; background-color: ${rowBg}; font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #475569;">${v.address || ''}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px 12px; background-color: ${rowBg}; font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #64748b; text-align: center;">${new Date(v.createdAt).toLocaleDateString()}</td>
      </tr>
    `;
  });

  const excelHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Conference Visitors</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; width: 100%; }
        th {
          background-color: #1e3a8a !important;
          color: #ffffff !important;
          font-family: Calibri, Arial, sans-serif;
          font-size: 11pt;
          font-weight: bold;
          text-align: left;
          padding: 12px;
          border: 1px solid #000000;
        }
        td {
          border: 1px solid #cbd5e1;
          padding: 10px 12px;
          font-family: Calibri, Arial, sans-serif;
          font-size: 11pt;
        }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
            ${headers.map(h => `<th style="background-color: #1e3a8a !important; color: #ffffff !important; font-family: Calibri, Arial, sans-serif; font-size: 11pt; font-weight: bold; padding: 12px; border: 1px solid #000000; text-align: left;">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanConf = conferenceFilter ? `_${conferenceFilter.replace(/[^a-zA-Z0-9_-]/g, '_')}` : '';
  a.download = `Conference_Visitors${cleanConf}.xls`;
  a.click();
  window.URL.revokeObjectURL(url);
};
