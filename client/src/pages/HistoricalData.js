import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HistoricalData.css';

const HistoricalData = () => {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    fetchPaths();
    fetchInspections(1);
  }, []);

  const fetchPaths = async () => {
    try {
      const response = await axios.get('/api/paths');
      setPaths(response.data);
    } catch (err) {
      console.error('Failed to load paths:', err);
    }
  };

  const fetchInspections = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/inspections?page=${page}&limit=10`);
      setInspections(response.data.data);
      setTotalPages(response.data.pagination.pages);
      setCurrentPage(page);
      setLoading(false);
    } catch (err) {
      setError('Failed to load inspection data');
      setLoading(false);
    }
  };

  const handleExportPDF = async (inspectionId) => {
    try {
      const response = await axios.get(`/api/inspections/${inspectionId}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inspection-${inspectionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
    } catch (err) {
      setError('Failed to generate PDF');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await axios.get('/api/inspections/export/csv');
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inspections.csv');
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
    } catch (err) {
      setError('Failed to export CSV');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="historical-container">
      <div className="history-card">
        <div className="history-header">
          <div>
            <h2>Historical Inspection Data</h2>
            <p className="history-subtitle">View past inspections and temperature readings</p>
          </div>
          <button className="btn btn-export" onClick={handleExportCSV}>📥 Export All (CSV)</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {inspections.length === 0 ? (
          <div className="empty-state">
            <p>📊 No inspection data yet</p>
            <p className="empty-subtitle">Start by creating a weekly inspection</p>
          </div>
        ) : (
          <>
            <div className="inspections-list">
              {inspections.map(inspection => (
                <div key={inspection.id} className="inspection-item">
                  <div className="inspection-summary">
                    <div className="inspection-meta">
                      <h3>Inspection #{inspection.id}</h3>
                      <p className="inspection-date">📅 {new Date(inspection.date).toLocaleString()}</p>
                      {inspection.notes && (
                        <p className="inspection-notes"><strong>Notes:</strong> {inspection.notes}</p>
                      )}
                    </div>
                    <div className="inspection-actions">
                      <button className="btn btn-view" onClick={() => setSelectedInspection(inspection)}>View Details</button>
                      <button className="btn btn-pdf" onClick={() => handleExportPDF(inspection.id)}>PDF</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-pagination"
                  onClick={() => fetchInspections(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                <span className="page-info">Page {currentPage} of {totalPages}</span>
                <button
                  className="btn btn-pagination"
                  onClick={() => fetchInspections(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedInspection && (
        <div className="modal-overlay" onClick={() => setSelectedInspection(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Inspection Details</h3>
              <button className="btn-close" onClick={() => setSelectedInspection(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Inspection Information</h4>
                <p><strong>ID:</strong> {selectedInspection.id}</p>
                <p><strong>Date:</strong> {new Date(selectedInspection.date).toLocaleString()}</p>
              </div>
              {selectedInspection.notes && (
                <div className="detail-section">
                  <h4>Notes</h4>
                  <p>{selectedInspection.notes}</p>
                </div>
              )}
              <div className="detail-section">
                <h4>Temperature Readings</h4>
                <div className="readings-table">
                  <div className="table-header">
                    <div className="table-cell">Path</div>
                    <div className="table-cell">Temperature (°C)</div>
                  </div>
                  {selectedInspection.readings.map((reading, index) => (
                    <div key={index} className="table-row">
                      <div className="table-cell"><strong>Path-{index + 1}</strong></div>
                      <div className="table-cell">{reading}°C</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-pdf" onClick={() => handleExportPDF(selectedInspection.id)}>Download PDF</button>
              <button className="btn" style={{backgroundColor: '#999'}} onClick={() => setSelectedInspection(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalData;
