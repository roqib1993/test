import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PathConfiguration.css';

const PathConfiguration = () => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ tx: '', rx: '' });

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    try {
      const response = await axios.get('/api/paths');
      setPaths(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load path configurations');
      setLoading(false);
    }
  };

  const handleEditClick = (path) => {
    setEditingId(path.id);
    setEditValues({ tx: path.tx, rx: path.rx });
  };

  const handleInputChange = (field, value) => {
    setEditValues(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  };

  const handleSave = async (pathId) => {
    try {
      setError(null);
      setSuccess(null);

      const response = await axios.put(`/api/paths/${pathId}`, editValues);
      
      setPaths(paths.map(p => p.id === pathId ? response.data : p));
      setEditingId(null);
      setSuccess(`Path-${pathId} updated successfully`);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update path configuration');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({ tx: '', rx: '' });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="config-container">
      <div className="config-card">
        <h2>FEGT Path Configuration</h2>
        <p className="config-subtitle">Manage Tx and Rx sensor assignments for each path</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">✓ {success}</div>}

        <div className="paths-list">
          {paths.map(path => (
            <div key={path.id} className="path-item">
              <div className="path-name">
                <h3>{path.name}</h3>
              </div>
              {editingId === path.id ? (
                <div className="path-edit">
                  <div className="edit-group">
                    <label>Tx Sensor</label>
                    <input
                      type="number"
                      className="edit-input"
                      value={editValues.tx}
                      onChange={(e) => handleInputChange('tx', e.target.value)}
                    />
                  </div>
                  <div className="edit-group">
                    <label>Rx Sensor</label>
                    <input
                      type="number"
                      className="edit-input"
                      value={editValues.rx}
                      onChange={(e) => handleInputChange('rx', e.target.value)}
                    />
                  </div>
                  <div className="edit-actions">
                    <button className="btn btn-save" onClick={() => handleSave(path.id)}>Save</button>
                    <button className="btn btn-cancel" onClick={handleCancel}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="path-info">
                  <div className="sensor-display">
                    <div className="sensor-item">
                      <span className="sensor-label">Tx Sensor</span>
                      <span className="sensor-value">{path.tx}</span>
                    </div>
                    <div className="sensor-item">
                      <span className="sensor-label">Rx Sensor</span>
                      <span className="sensor-value">{path.rx}</span>
                    </div>
                  </div>
                  <button className="btn btn-edit" onClick={() => handleEditClick(path)}>Edit</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="config-info">
          <h4>ℹ️ Configuration Information</h4>
          <p>Each FEGT path is assigned specific Tx (Transmitter) and Rx (Receiver) sensors. You can modify these assignments as needed. The changes will be applied immediately to new inspections.</p>
        </div>
      </div>
    </div>
  );
};

export default PathConfiguration;
