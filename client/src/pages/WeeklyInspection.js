import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeeklyInspection.css';

const WeeklyInspection = () => {
  const [paths, setPaths] = useState([]);
  const [readings, setReadings] = useState({});
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    try {
      const response = await axios.get('/api/paths');
      setPaths(response.data);
      
      // Initialize readings object
      const initialReadings = {};
      response.data.forEach(path => {
        initialReadings[path.id] = '';
      });
      setReadings(initialReadings);
      setLoading(false);
    } catch (err) {
      setError('Failed to load paths');
      setLoading(false);
    }
  };

  const handleReadingChange = (pathId, value) => {
    setReadings(prev => ({
      ...prev,
      [pathId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate all readings are entered
    const allFilled = paths.every(path => readings[path.id] !== '');
    if (!allFilled) {
      setError('Please enter temperature readings for all paths');
      return;
    }

    try {
      const inspectionData = {
        readings: paths.map(path => parseFloat(readings[path.id])),
        notes
      };

      await axios.post('/api/inspections', inspectionData);
      setSuccess(true);
      setNotes('');
      
      // Reset readings
      const resetReadings = {};
      paths.forEach(path => {
        resetReadings[path.id] = '';
      });
      setReadings(resetReadings);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save inspection data');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="inspection-container">
      <div className="inspection-card">
        <h2>Weekly FEGT Inspection</h2>
        <p className="subtitle">Enter temperature readings for all 21 paths</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">✓ Inspection data saved successfully!</div>}

        <form onSubmit={handleSubmit}>
          <div className="paths-grid">
            {paths.map(path => (
              <div key={path.id} className="path-card">
                <label htmlFor={`path-${path.id}`}>
                  <span className="path-label">{path.name}</span>
                  <span className="path-desc">Tx: {path.tx}, Rx: {path.rx}</span>
                </label>
                <input
                  id={`path-${path.id}`}
                  type="number"
                  step="0.1"
                  placeholder="°C"
                  value={readings[path.id]}
                  onChange={(e) => handleReadingChange(path.id, e.target.value)}
                  className="path-input"
                />
              </div>
            ))}
          </div>

          <div className="notes-section">
            <label htmlFor="notes">
              <span>Notes (Optional)</span>
            </label>
            <textarea
              id="notes"
              rows="4"
              placeholder="Add any observations or issues during inspection..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="notes-input"
            />
          </div>

          <button type="submit" className="btn btn-primary">Save Inspection</button>
        </form>
      </div>
    </div>
  );
};

export default WeeklyInspection;
