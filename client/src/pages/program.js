"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./program.css"

export default function ProgramsManagement() {
  const navigate = useNavigate()
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  // Fetch programs from backend
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:3001/programs")

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("🔍 Fetched programs:", data)
        setPrograms(data)
        setError(null)
      } catch (err) {
        console.error("❌ Error fetching programs:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  // Filter programs
  const filteredPrograms = programs.filter((program) => {
    if (statusFilter && program.status !== statusFilter) return false
    if (typeFilter && program.programtype !== typeFilter) return false
    if (locationFilter && program.location !== locationFilter) return false
    if (dateFrom && program.datestart < dateFrom) return false
    if (dateTo && program.datestart > dateTo) return false
    return true
  })

  // Handle actions
  const handleView = (program) => {
    alert(
      `Program: ${program.name}\nType: ${program.programtype}\nStatus: ${program.status}\nStart: ${program.datestart}\nEnd: ${program.completiondate}\nLocation: ${program.location}\nDescription: ${program.description}`,
    )
  }

  const handleUpdateProgram = (programId) => {
    console.log("🔍 Navigating to edit program:", programId)
    navigate(`/editProgram/${programId}`)
  }

  const handleEdit = (program) => {
    navigate(`/editProgram/${program.programid}`)
  }

  const handleDelete = async (program) => {
    if (!window.confirm("Are you sure you want to delete this program?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/programs/${program.programid}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete program")
      }

      setPrograms((prev) => prev.filter((p) => p.programid !== program.programid))
      alert("✅ Program deleted successfully")
    } catch (err) {
      console.error("❌ Failed to delete program:", err)
      alert("❌ Failed to delete program")
    }
  }

  const handleBeneficiaries = (program) => {
    navigate(`/programs/${program.programid}/beneficiaries`)
  }

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading programs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="header">
        <div>
          <h1>Programs Management</h1>
          <div className="header-info">Barangay 176 Bala Cons - Community Programs System</div>
        </div>
        <div className="header-info">📅 {new Date().toDateString()} | 👤 Program Coordinator</div>
      </div>

      <div className="nav-tabs">
        <button className="nav-tab" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
        <button className="nav-tab" onClick={() => navigate("/projects")}>
          Projects
        </button>
        <button className="nav-tab active" onClick={() => navigate("/program")}>
          Programs
        </button>
        <button className="nav-tab" onClick={() => navigate("/residents")}>
          Residents
        </button>
        <button className="nav-tab" onClick={() => navigate("/reports")}>
          Reports
        </button>
      </div>

      <div className="content-container">
        <div className="section-header">
          <h2 className="section-title">📋 Programs Management</h2>
          <button className="add-btn" onClick={() => navigate("/createProgram")}>
            + New Program
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">Program Type</label>
            <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Social Services">Social Services</option>
              <option value="Livelihood">Livelihood</option>
              <option value="Disaster Relief">Disaster Relief</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Suspended">Suspended</option>
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
              <option value="Barangay Health Center">Barangay Health Center</option>
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
            <input type="date" className="filter-input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </div>

        <div className="results-summary">
          Showing {filteredPrograms.length} of {programs.length} programs
        </div>

        <table className="programs-table">
          <thead>
            <tr>
              <th>Program ID</th>
              <th>Type</th>
              <th>Name</th>
              <th>Location</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Beneficiaries</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                  {programs.length === 0
                    ? "No programs found. Create your first program!"
                    : "No programs match your filters."}
                </td>
              </tr>
            ) : (
              filteredPrograms.map((program) => (
                <tr key={program.programid}>
                  <td>
                    <strong>PROG-{program.programid.toString().padStart(4, "0")}</strong>
                  </td>
                  <td>
                    <span
                      className={`type-badge type-${(program.programtype || "").toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {program.programtype || "General"}
                    </span>
                  </td>
                  <td>
                    <div className="program-info">
                      <div className="program-name">{program.name}</div>
                      {program.description && <div className="program-description">{program.description}</div>}
                    </div>
                  </td>
                  <td>{program.location || "Not specified"}</td>
                  <td>{program.datestart || "Not set"}</td>
                  <td>{program.completiondate || "Ongoing"}</td>
                  <td>
                    <span className={`status-badge status-${(program.status || "").toLowerCase()}`}>
                      {program.status || "Unknown"}
                    </span>
                  </td>
                  <td>
                    <button className="beneficiaries-btn" onClick={() => handleBeneficiaries(program)}>
                      👥 View
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn btn-view" onClick={() => handleView(program)}>
                        View
                      </button>
                      <button onClick={() => handleUpdateProgram(program.programid)} className="btn-update">
                        Update
                      </button>
                      <button className="action-btn btn-delete" onClick={() => handleDelete(program)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
