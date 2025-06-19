import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './program.css';

const samplePrograms = [
  {
    id: 'PRG-2025-001',
    name: 'Community Health Program',
    location: 'Health Center',
    startDate: '2025-01-10',
    completionDate: '2025-12-31',
    status: 'Active',
    description: 'Comprehensive health services for community members',
  },
  {
    id: 'PRG-2025-002',
    name: 'Youth Skills Training',
    location: 'Community Center',
    startDate: '2025-02-01',
    completionDate: '2025-05-30',
    status: 'Completed',
    description: 'Skills development program for local youth',
  },
  {
    id: 'PRG-2025-003',
    name: 'Senior Citizens Support',
    location: 'Barangay Hall',
    startDate: '2025-03-01',
    completionDate: '2025-11-30',
    status: 'Active',
    description: 'Support services for elderly community members',
  },
];

export default function ProgramsManagement() {
    const navigate = useNavigate();
  const [programs, setPrograms] = useState(samplePrograms);
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredPrograms = programs.filter((program) => {
    if (statusFilter && program.status !== statusFilter) return false;
    if (locationFilter && program.location !== locationFilter) return false;
    if (dateFrom && program.startDate < dateFrom) return false;
    if (dateTo && program.startDate > dateTo) return false;
    return true;
  });

  return (
    <div className="page-wrapper">
      <div className="header">
        <div>
          <h1>Projects & Programs Management</h1>
          <div className="header-info">Barangay 176 Bala Cons - Community Development System</div>
        </div>
        <div className="header-info">
          📅 {new Date().toDateString()} | 👤 Supervisor
        </div>
      </div>

      <div className="nav-tabs">
        <button className="nav-tab" onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button className="nav-tab" onClick={() => navigate('/projects')}>Projects</button>
        <button className="nav-tab" onClick={() => navigate('/program')}>Programs</button>
        <button className="nav-tab" onClick={() => navigate('/reports')}>Reports</button>
      </div>

      <div className="content-container">
        <div className="section-header">
          <h2 className="section-title">📋 Programs Management</h2>
          <button className="add-btn">+ New Program</button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Location</label>
            <select
              className="filter-select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              <option value="Barangay Hall">Barangay Hall</option>
              <option value="Community Center">Community Center</option>
              <option value="Health Center">Health Center</option>
              <option value="School">School</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Date From</label>
            <input
              type="date"
              className="filter-input"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Date To</label>
            <input
              type="date"
              className="filter-input"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>

        <table className="programs-table">
          <thead>
            <tr>
              <th>Program ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Start Date</th>
              <th>Completion Date</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.map((program) => (
              <tr key={program.id}>
                <td>{program.id}</td>
                <td>{program.name}</td>
                <td>{program.location}</td>
                <td>{program.startDate}</td>
                <td>{program.completionDate || 'Not set'}</td>
                <td>
                  <span className={`status-badge status-${program.status.toLowerCase()}`}>
                    {program.status}
                  </span>
                </td>
                <td>{program.description}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn btn-view">View</button>
                    <button className="action-btn btn-update">Update</button>
                    <button className="action-btn btn-delete">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
