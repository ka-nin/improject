import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectsPrograms.css';

const ProjectsPrograms = () => {
  const navigate = useNavigate(); // ✅ Needed to use the navigate function

  return (
    <div className="dashboard-wrapper">
      <div className="container">
        <header className="header">
          <div className="header-left">
            <h1>Projects & Programs Management</h1>
            <p>Barangay 176 Bala Cons - Community Development System</p>
          </div>
          <div className="header-right">
            <span>📅 June 19, 2025</span>
            <div className="user-badge">👤 Supervisor</div>
          </div>
        </header>

        <nav className="nav-tabs">
          <button className="nav-tab active">Dashboard</button>
          <button className="nav-tab">Projects</button>
          <button className="nav-tab" onClick={() => navigate('/program')}>Programs</button>
          <button className="nav-tab">Reports</button>
        </nav>

        <div className="main-content">
          <main className="projects-section">
            <div className="section-header">
              <h2 className="section-title">🏗️ Projects & Programs</h2>
              <button className="add-btn" onClick={() => alert("Add New Project/Program")}>+ New Project</button>
            </div>

            <div className="filters">
              <div className="filter-group">
                <label className="filter-label">Status</label>
                <select className="filter-select">
                  <option>All Statuses</option>
                  <option>Planning</option>
                  <option>Active</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                </select>
              </div>
            </div>

            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Budget</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>PRJ-2025-001</strong></td>
                  <td>Road Improvement Project</td>
                  <td>Infrastructure</td>
                  <td><span className="status-badge priority-high">High</span></td>
                  <td><span className="status-badge status-active">Active</span></td>
                  <td>2025-03-15</td>
                  <td>2025-08-30</td>
                  <td>₱850,000</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="progress-bar" style={{ width: '60px' }}>
                        <div className="progress-fill" style={{ width: '75%' }}></div>
                      </div>
                      <span>75%</span>
                    </div>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => alert("Update Project")}>Update</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </main>

          <aside className="sidebar">
            <div className="quick-actions">
              <h3 className="section-title">⚡ Quick Actions</h3>
              <button className="quick-action-btn primary" onClick={() => alert("Create New Project")}>🏗️ Create New Project</button>
              <button className="quick-action-btn secondary" onClick={() => alert("Create New Program")}>📋 Create New Program</button>
              <button className="quick-action-btn warning" onClick={() => alert("Assign Materials")}>📦 Assign Materials</button>
              <button className="quick-action-btn info" onClick={() => alert("Generate Report")}>📊 Generate Report</button>
            </div>

            <div className="summary-card">
              <h3 className="section-title">📈 Today's Summary</h3>
              <div className="summary-item">
                <span className="summary-label">Active Projects</span>
                <span className="summary-value">4</span>
              </div>
              {/* Add more summary items if needed */}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPrograms;
