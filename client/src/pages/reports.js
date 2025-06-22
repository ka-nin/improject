// Reports.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './reports.css';

const Reports = () => {
  const navigate = useNavigate();

  useEffect(() => {
    updateStatistics();
    populateSummaryTable();
  }, []);

  const updateStatistics = () => {
    document.getElementById('totalProjects').textContent = 5;
    document.getElementById('totalPrograms').textContent = 3;
    document.getElementById('activeActivities').textContent = 6;
    document.getElementById('completedActivities').textContent = 2;
  };

  const populateSummaryTable = () => {
    const tbody = document.getElementById('summaryTableBody');
    const data = [
      {
        id: 'PRJ-2025-001',
        type: 'Project',
        name: 'Road Improvement Project',
        status: 'Active',
        startDate: '2025-03-15',
        endDate: '2025-08-30',
        progress: 75,
      },
      {
        id: 'PRG-2025-001',
        type: 'Program',
        name: 'Community Health Program',
        status: 'Active',
        startDate: '2025-01-10',
        endDate: '2025-12-31',
        progress: 90,
      },
    ];

    tbody.innerHTML = data
      .map(
        (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.type}</td>
          <td>${item.name}</td>
          <td>${item.status}</td>
          <td>${item.startDate}</td>
          <td>${item.endDate}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 60px; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden;">
                <div style="width: ${item.progress}%; height: 100%; background: #28a745;"></div>
              </div>
              <span style="font-size: 12px; color: #666;">${item.progress}%</span>
            </div>
          </td>
        </tr>
      `
      )
      .join('');
  };

  return (
    <div className="reports-page">
      <div className="header">
        <div>
          <h1>Projects & Programs Management</h1>
          <div className="header-info">Barangay 176 Bala Cons - Community Development System</div>
        </div>
        <div className="header-info">📅 June 19, 2025 | 👤 Supervisor</div>
      </div>

      <div className="nav-tabs">
        <button className="nav-tab" onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button className="nav-tab" onClick={() => navigate('/projects')}>Projects</button>
        <button className="nav-tab" onClick={() => navigate('/program')}>Programs</button>
        <button className="nav-tab active">Reports</button>
      </div>

      <div className="content-container">
        <div className="section-header">
          <h2 className="section-title">📊 Reports & Analytics</h2>
        </div>

        <div className="report-filters">
          <div className="filter-group">
            <label className="filter-label">Report Type</label>
            <select className="filter-select">
              <option value="all">All Activities</option>
              <option value="projects">Projects Only</option>
              <option value="programs">Programs Only</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Date From</label>
            <input type="date" className="filter-input" defaultValue="2025-01-01" />
          </div>
          <div className="filter-group">
            <label className="filter-label">Date To</label>
            <input type="date" className="filter-input" defaultValue="2025-12-31" />
          </div>
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select className="filter-select">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <button className="generate-btn" onClick={() => alert('Generating report...')}>Generate Report</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number" id="totalProjects">0</div>
            <div className="stat-label">Total Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" id="totalPrograms">0</div>
            <div className="stat-label">Total Programs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" id="activeActivities">0</div>
            <div className="stat-label">Active Activities</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" id="completedActivities">0</div>
            <div className="stat-label">Completed Activities</div>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Projects by Type Distribution</h3>
          <div className="chart-placeholder">📊 Chart will be generated here</div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Activities Timeline</h3>
          <div className="chart-placeholder">📈 Timeline chart will be generated here</div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Current Activities Summary</h3>
          <table className="summary-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Name</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody id="summaryTableBody"></tbody>
          </table>

          <div className="export-options">
            <button className="export-btn" onClick={() => alert('Export CSV')}>📄 Export CSV</button>
            <button className="export-btn" onClick={() => alert('Export PDF')}>📑 Export PDF</button>
            <button className="export-btn" onClick={() => window.print()}>🖨️ Print</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;