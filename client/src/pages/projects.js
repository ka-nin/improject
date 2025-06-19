import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './projects.css';

const initialProjects = [
  { id: 'PRJ-2025-001', type: 'Infrastructure', name: 'Road Improvement Project', startDate: '2025-03-15', endDate: '2025-08-30' },
  { id: 'PRJ-2025-002', type: 'Health', name: 'Community Health Center Renovation', startDate: '2025-02-01', endDate: '2025-06-30' },
  { id: 'PRJ-2025-003', type: 'Education', name: 'Youth Skills Training', startDate: '2025-02-01', endDate: '2025-05-30' },
  { id: 'PRJ-2025-004', type: 'Social', name: 'Senior Citizens Support Program', startDate: '2025-01-15', endDate: '2025-12-15' },
  { id: 'PRJ-2025-005', type: 'Environment', name: 'Waste Management System', startDate: '2025-04-01', endDate: '2025-09-30' }
];

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(initialProjects);
  const [filtered, setFiltered] = useState(initialProjects);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ id: '', type: '', name: '', startDate: '', endDate: '' });

  useEffect(() => setFiltered([...projects]), [projects]);

  const generateProjectId = () => `PRJ-${new Date().getFullYear()}-${(projects.length + 1).toString().padStart(3, '0')}`;

  const calculateDuration = (start, end) => {
    if (!start || !end) return 'Not set';
    const diff = Math.abs(new Date(end) - new Date(start));
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.round(days / 30)} month(s)`;
    return `${Math.round(days / 365)} year(s)`;
  };

  const handleFilter = () => {
    const type = document.getElementById('typeFilter').value;
    const from = document.getElementById('dateFromFilter').value;
    const to = document.getElementById('dateToFilter').value;
    const search = document.getElementById('nameSearch').value.toLowerCase();
    const result = projects.filter(p => {
      if (type && p.type !== type) return false;
      if (from && p.startDate < from) return false;
      if (to && p.startDate > to) return false;
      if (search && !p.name.toLowerCase().includes(search)) return false;
      return true;
    });
    setFiltered(result);
  };

  const handleFormChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = { ...form };
    if (editingIndex >= 0) {
      const updated = [...projects];
      updated[editingIndex] = newProject;
      setProjects(updated);
    } else {
      setProjects([...projects, newProject]);
    }
    closeModal();
  };

  const openAddModal = () => {
    setForm({ id: generateProjectId(), type: '', name: '', startDate: '', endDate: '' });
    setEditingIndex(-1);
    setModalOpen(true);
  };

  const openEditModal = (index) => {
    setForm({ ...projects[index] });
    setEditingIndex(index);
    setModalOpen(true);
  };

  const viewProject = (project) => {
    alert(`Project:\n${project.name}\nStart: ${project.startDate}\nEnd: ${project.endDate}`);
  };

  const deleteProject = (index) => {
    if (window.confirm('Are you sure to delete this project?')) {
      const updated = [...projects];
      updated.splice(index, 1);
      setProjects(updated);
    }
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="projects-page">
      <div className="header">
        <div>
          <h1>Projects & Programs Management</h1>
          <div className="header-info">Barangay 176 Bala Cons - Community Development System</div>
        </div>
        <div className="header-info">📅 June 19, 2025 | 👤 Supervisor</div>
      </div>

      <div className="nav-tabs">
        <button className="nav-tab" onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button className="nav-tab active">Projects</button>
        <button className="nav-tab" onClick={() => navigate('/program')}>Programs</button>
        <button className="nav-tab" onClick={() => navigate('/reports')}>Reports</button>
      </div>

      <div className="content-container">
        <div className="section-header">
          <h2 className="section-title">🏗️ Projects Management</h2>
          <button className="add-btn" onClick={openAddModal}>+ New Project</button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">Project Type</label>
            <select id="typeFilter" className="filter-select" onChange={handleFilter}>
              <option value="">All Types</option>
              <option>Infrastructure</option>
              <option>Health</option>
              <option>Education</option>
              <option>Social</option>
              <option>Environment</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Date From</label>
            <input id="dateFromFilter" type="date" className="filter-input" onChange={handleFilter} />
          </div>
          <div className="filter-group">
            <label className="filter-label">Date To</label>
            <input id="dateToFilter" type="date" className="filter-input" onChange={handleFilter} />
          </div>
          <div className="filter-group">
            <label className="filter-label">Search Name</label>
            <input id="nameSearch" type="text" placeholder="Search..." className="filter-input" onKeyUp={handleFilter} />
          </div>
        </div>

        <table className="projects-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Name</th>
              <th>Start</th>
              <th>End</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={i}>
                <td>{p.id}</td>
                <td><span className={`type-badge type-${p.type.toLowerCase()}`}>{p.type}</span></td>
                <td>{p.name}</td>
                <td>{p.startDate}</td>
                <td>{p.endDate || 'Not set'}</td>
                <td><span className="duration-badge">{calculateDuration(p.startDate, p.endDate)}</span></td>
                <td>
                  <button className="action-btn btn-update" onClick={() => openEditModal(i)}>Update</button>
                  <button className="action-btn btn-view" onClick={() => viewProject(p)}>View</button>
                  <button className="action-btn btn-delete" onClick={() => deleteProject(i)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingIndex >= 0 ? 'Edit Project' : 'Add New Project'}</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Project ID</label>
                  <input className="form-input" id="id" value={form.id} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Project Type</label>
                  <select className="form-select" id="type" value={form.type} onChange={handleFormChange} required>
                    <option value="">Select Type</option>
                    <option>Infrastructure</option>
                    <option>Health</option>
                    <option>Education</option>
                    <option>Social</option>
                    <option>Environment</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input className="form-input" id="name" value={form.name} onChange={handleFormChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input className="form-input" id="startDate" type="date" value={form.startDate} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input className="form-input" id="endDate" type="date" value={form.endDate} onChange={handleFormChange} />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
