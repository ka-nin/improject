"use client"

import { useEffect, useState } from "react"
import "./ProjectsPrograms.css"
import { useNavigate } from "react-router-dom"

const ProjectsPrograms = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])

  // Filter states
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [dateFromFilter, setDateFromFilter] = useState("2025-01-01")
  const [dateToFilter, setDateToFilter] = useState("2025-12-31")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:3001/projects")
        const data = await res.json()

        console.log("🔍 Fetched projects:", data)
        setProjects(data)
        setFilteredProjects(data) // Initially show all projects
      } catch (error) {
        console.error("❌ Failed to fetch projects:", error)
      }
    }
    fetchProjects()
  }, [])

  // Filter projects whenever filters change
  useEffect(() => {
    filterProjects()
  }, [projects, statusFilter, typeFilter, dateFromFilter, dateToFilter])

  const filterProjects = () => {
    let filtered = projects

    // Filter by status
    if (statusFilter && statusFilter !== "All Statuses") {
      filtered = filtered.filter((project) => project.status?.toLowerCase() === statusFilter.toLowerCase())
    }

    // Filter by type
    if (typeFilter && typeFilter !== "All Types") {
      filtered = filtered.filter((project) => {
        const projectType = project.Table || project.type || project.projectType
        return projectType?.toLowerCase() === typeFilter.toLowerCase()
      })
    }

    // Filter by date range
    if (dateFromFilter) {
      filtered = filtered.filter((project) => !project.startDate || project.startDate >= dateFromFilter)
    }

    if (dateToFilter) {
      filtered = filtered.filter((project) => !project.startDate || project.startDate <= dateToFilter)
    }

    setFilteredProjects(filtered)
  }

  const handleAlert = (message) => {
    alert(message)
  }

  const getTypeBadgeClass = (type) => {
    if (!type) return "type-unknown"

    const typeMap = {
      Infrastructure: "type-infrastructure",
      Environment: "type-environment",
      "Health Programs": "type-health",
      "Health Program": "type-health",
      Education: "type-education",
      "Social Services": "type-social",
    }

    return typeMap[type] || `type-${type.toLowerCase().replace(/\s+/g, "-")}`
  }

  const clearFilters = () => {
    setStatusFilter("")
    setTypeFilter("")
    setDateFromFilter("2025-01-01")
    setDateToFilter("2025-12-31")
  }

  return (
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

      <div className="nav-tabs">
        <button className="nav-tab" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
        <button className="nav-tab" onClick={() => navigate("/projects")}>
          Projects
        </button>
        <button className="nav-tab" onClick={() => navigate("/program")}>
          Programs
        </button>
        <button className="nav-tab" onClick={() => navigate("/reports")}>
          Reports
        </button>
      </div>

      <div className="main-content">
        <main className="projects-section">
          <div className="section-header">
            <h2 className="section-title">🏗️ Projects & Programs</h2>
            <button className="add-btn" onClick={() => navigate("/newProject")}>
              + New Project
            </button>
          </div>

          <div className="filters">
            {/* Status Filter */}
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="filter-group">
              <label className="filter-label">Type</label>
              <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="">All Types</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Environment">Environment</option>
                <option value="Health Programs">Health Programs</option>
                <option value="Education">Education</option>
                <option value="Social Services">Social Services</option>
              </select>
            </div>

            {/* Date From Filter */}
            <div className="filter-group">
              <label className="filter-label">Date From</label>
              <input
                type="date"
                className="filter-input"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
              />
            </div>

            {/* Date To Filter */}
            <div className="filter-group">
              <label className="filter-label">Date To</label>
              <input
                type="date"
                className="filter-input"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
              />
            </div>

            {/* Clear Filters Button */}
            <div className="filter-group">
              <button
                className="filter-clear-btn"
                onClick={clearFilters}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div
            style={{
              padding: "10px",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
              marginBottom: "10px",
              fontSize: "14px",
            }}
          >
            Showing {filteredProjects.length} of {projects.length} projects
            {statusFilter && ` | Status: ${statusFilter}`}
            {typeFilter && ` | Type: ${typeFilter}`}
            {(dateFromFilter !== "2025-01-01" || dateToFilter !== "2025-12-31") &&
              ` | Date: ${dateFromFilter} to ${dateToFilter}`}
          </div>

          <table className="projects-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Location</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                    No projects match your filters. Try adjusting your search criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => (
                  <tr key={proj.projectid}>
                    <td>
                      <strong>PRJ-{proj.projectid.toString().padStart(4, "0")}</strong>
                    </td>
                    <td>{proj.name}</td>
                    <td>
                      <span className={`type-badge ${getTypeBadgeClass(proj.Table || proj.type || proj.projectType)}`}>
                        {proj.Table || proj.type || proj.projectType || "No Type"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${proj.status?.toLowerCase() || "unknown"}`}>
                        {proj.status || "Unknown"}
                      </span>
                    </td>
                    <td>{proj.startDate}</td>
                    <td>{proj.completionDate}</td>
                    <td>{proj.location}</td>
                    <td>{proj.description}</td>
                    <td>
                      <button
                        className="action-btn btn-update"
                        onClick={() => navigate(`/editProject/${proj.projectid}`)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </main>

        <aside className="sidebar">
          <div className="quick-actions">
            <h3 className="section-title">⚡ Quick Actions</h3>
            <button className="quick-action-btn primary" onClick={() => navigate("/newProject")}>
              🏗️ Create New Project
            </button>
            <button className="quick-action-btn secondary" onClick={() => handleAlert("Create New Program")}>
              📋 Create New Program
            </button>
            <button className="quick-action-btn warning" onClick={() => handleAlert("Assign Materials")}>
              📦 Assign Materials
            </button>
            <button className="quick-action-btn info" onClick={() => handleAlert("Generate Report")}>
              📊 Generate Report
            </button>
          </div>

          <div className="summary-card">
            <h3 className="section-title">📈 Today's Summary</h3>
            {[
              ["Total Projects", projects.length.toString()],
              ["Filtered Results", filteredProjects.length.toString()],
              ["Active Projects", projects.filter((p) => p.status?.toLowerCase() === "active").length.toString()],
              ["Completed", projects.filter((p) => p.status?.toLowerCase() === "completed").length.toString()],
              ["Planning", projects.filter((p) => p.status?.toLowerCase() === "planning").length.toString()],
            ].map(([label, value, className = ""]) => (
              <div className="summary-item" key={label}>
                <span className="summary-label">{label}</span>
                <span className={`summary-value ${className}`}>{value}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ProjectsPrograms
