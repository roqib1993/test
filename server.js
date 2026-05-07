const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data storage (in-memory for now)
let inspections = [];
let pathConfigs = [
  { id: 1, name: 'Path-1', tx: 6, rx: 1, description: 'Tx: 6, Rx: 1' },
  { id: 2, name: 'Path-2', tx: 7, rx: 3, description: 'Tx: 7, Rx: 3' },
  { id: 3, name: 'Path-3', tx: 8, rx: 5, description: 'Tx: 8, Rx: 5' },
  { id: 4, name: 'Path-4', tx: 5, rx: 2, description: 'Tx: 5, Rx: 2' },
  { id: 5, name: 'Path-5', tx: 9, rx: 4, description: 'Tx: 9, Rx: 4' },
  { id: 6, name: 'Path-6', tx: 10, rx: 6, description: 'Tx: 10, Rx: 6' },
  { id: 7, name: 'Path-7', tx: 11, rx: 7, description: 'Tx: 11, Rx: 7' },
  { id: 8, name: 'Path-8', tx: 12, rx: 8, description: 'Tx: 12, Rx: 8' },
  { id: 9, name: 'Path-9', tx: 13, rx: 9, description: 'Tx: 13, Rx: 9' },
  { id: 10, name: 'Path-10', tx: 14, rx: 10, description: 'Tx: 14, Rx: 10' },
  { id: 11, name: 'Path-11', tx: 15, rx: 11, description: 'Tx: 15, Rx: 11' },
  { id: 12, name: 'Path-12', tx: 16, rx: 12, description: 'Tx: 16, Rx: 12' },
  { id: 13, name: 'Path-13', tx: 17, rx: 13, description: 'Tx: 17, Rx: 13' },
  { id: 14, name: 'Path-14', tx: 18, rx: 14, description: 'Tx: 18, Rx: 14' },
  { id: 15, name: 'Path-15', tx: 19, rx: 15, description: 'Tx: 19, Rx: 15' },
  { id: 16, name: 'Path-16', tx: 20, rx: 16, description: 'Tx: 20, Rx: 16' },
  { id: 17, name: 'Path-17', tx: 21, rx: 17, description: 'Tx: 21, Rx: 17' },
  { id: 18, name: 'Path-18', tx: 22, rx: 18, description: 'Tx: 22, Rx: 18' },
  { id: 19, name: 'Path-19', tx: 23, rx: 19, description: 'Tx: 23, Rx: 19' },
  { id: 20, name: 'Path-20', tx: 24, rx: 20, description: 'Tx: 24, Rx: 20' },
  { id: 21, name: 'Path-21', tx: 25, rx: 21, description: 'Tx: 25, Rx: 21' }
];

// API Routes

// Get all path configurations
app.get('/api/paths', (req, res) => {
  res.json(pathConfigs);
});

// Update a path configuration
app.put('/api/paths/:id', (req, res) => {
  const { id } = req.params;
  const { tx, rx } = req.body;
  
  const path = pathConfigs.find(p => p.id === parseInt(id));
  if (!path) {
    return res.status(404).json({ error: 'Path not found' });
  }
  
  path.tx = tx;
  path.rx = rx;
  path.description = `Tx: ${tx}, Rx: ${rx}`;
  
  res.json(path);
});

// Create new inspection
app.post('/api/inspections', (req, res) => {
  const { readings, notes } = req.body;
  
  const inspection = {
    id: Date.now(),
    date: new Date().toISOString(),
    readings,
    notes,
    createdAt: new Date()
  };
  
  inspections.push(inspection);
  res.json(inspection);
});

// Get all inspections with pagination
app.get('/api/inspections', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const paginatedInspections = inspections.reverse().slice(skip, skip + limit);
  const total = inspections.length;
  
  res.json({
    data: paginatedInspections,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  });
});

// Get single inspection
app.get('/api/inspections/:id', (req, res) => {
  const { id } = req.params;
  const inspection = inspections.find(i => i.id === parseInt(id));
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  
  res.json(inspection);
});

// Export inspection to PDF
app.get('/api/inspections/:id/pdf', (req, res) => {
  const { id } = req.params;
  const inspection = inspections.find(i => i.id === parseInt(id));
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument();
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="inspection-${id}.pdf"`);
  
  doc.pipe(res);
  
  doc.fontSize(20).text('FEGT Weekly Inspection Report', { align: 'center' });
  doc.fontSize(12).text(`Inspection ID: ${inspection.id}`, { align: 'center' });
  doc.fontSize(12).text(`Date: ${new Date(inspection.date).toLocaleString()}`, { align: 'center' });
  
  doc.moveDown();
  
  if (inspection.notes) {
    doc.fontSize(12).text('Notes:', { underline: true });
    doc.fontSize(10).text(inspection.notes);
    doc.moveDown();
  }
  
  doc.fontSize(12).text('Temperature Readings:', { underline: true });
  doc.moveDown(0.5);
  
  doc.fontSize(9);
  inspection.readings.forEach((reading, index) => {
    const pathNum = index + 1;
    doc.text(`Path-${pathNum}: ${reading}°C`);
  });
  
  doc.end();
});

// Export all inspections to CSV
app.get('/api/inspections/export/csv', (req, res) => {
  let csv = 'Inspection ID,Date,Notes,Path 1,Path 2,Path 3,Path 4,Path 5,Path 6,Path 7,Path 8,Path 9,Path 10,Path 11,Path 12,Path 13,Path 14,Path 15,Path 16,Path 17,Path 18,Path 19,Path 20,Path 21\n';
  
  inspections.forEach(inspection => {
    const date = new Date(inspection.date).toLocaleString();
    const notes = inspection.notes ? `"${inspection.notes}"` : '';
    const readings = inspection.readings.join(',');
    csv += `${inspection.id},${date},${notes},${readings}\n`;
  });
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="inspections.csv"');
  res.send(csv);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
