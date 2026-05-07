import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WeeklyInspection from './pages/WeeklyInspection';
import HistoricalData from './pages/HistoricalData';
import PathConfiguration from './pages/PathConfiguration';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo">
              <span className="logo-icon">📊</span>
              FEGT Inspection System
            </div>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Weekly Inspection</Link>
              </li>
              <li className="nav-item">
                <Link to="/historical" className="nav-link">Historical Data</Link>
              </li>
              <li className="nav-item">
                <Link to="/config" className="nav-link">Path Configuration</Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<WeeklyInspection />} />
            <Route path="/historical" element={<HistoricalData />} />
            <Route path="/config" element={<PathConfiguration />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2026 FEGT Inspection System. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
