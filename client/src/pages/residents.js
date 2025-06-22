"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./residents.css"

export default function Residents() {
  const navigate = useNavigate()
  const [residents, setResidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [ageFilter, setAgeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [civilStatusFilter, setCivilStatusFilter] = useState("")

  // Fetch residents from backend
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:3001/residentlog")

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("🔍 Fetched residents:", data)
        setResidents(data)
        setError(null)
      } catch (err) {
        console.error("❌ Error fetching residents:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchResidents()
  }, [])

  // Filter residents
  const filteredResidents = residents.filter((resident) => {
    const matchesSearch =
      resident.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.address?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAge =
      !ageFilter ||
      (ageFilter === "senior" && resident.issenior) ||
      (ageFilter === "adult" && resident.age >= 18 && !resident.issenior) ||
      (ageFilter === "minor" && resident.age < 18)

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "pwd" && resident.ispwd) ||
      (statusFilter === "senior" && resident.issenior) ||
      (statusFilter === "active" && resident.isActive) ||
      (statusFilter === "inactive" && !resident.isActive)

    const matchesCivilStatus = !civilStatusFilter || resident.civilstatus === civilStatusFilter

    return matchesSearch && matchesAge && matchesStatus && matchesCivilStatus
  })

  // Handle actions
  const handleView = (resident) => {
    alert(`
Resident Details:
Name: ${resident.name}
Age: ${resident.age}
Address: ${resident.address}
Contact: ${resident.contact}
Civil Status: ${resident.civilstatus}
PWD: ${resident.ispwd ? "Yes" : "No"}
Senior: ${resident.issenior ? "Yes" : "No"}
Gender: ${resident.gender || "Not specified"}
Occupation: ${resident.occupation || "Not specified"}
    `)
  }

  const handleEdit = (resident) => {
    navigate(`/editResident/${resident.residentid}`)
  }

  const handleDelete = async (resident) => {
    if (!window.confirm(`Are you sure you want to delete ${resident.name}?`)) {
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/residentlog/${resident.residentid}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete resident")
      }

      setResidents((prev) => prev.filter((r) => r.residentid !== resident.residentid))
      alert("✅ Resident deleted successfully")
    } catch (err) {
      console.error("❌ Failed to delete resident:", err)
      alert("❌ Failed to delete resident")
    }
  }

  const handleViewBenefits = (resident) => {
    navigate(`/residents/${resident.residentid}/benefits`)
  }

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading residents...</p>
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
          <h1>Residents Management</h1>
          <div className="header-info">Barangay 176 Bala Cons - Community Residents System</div>
        </div>
        <div className="header-info">📅 {new Date().toDateString()} | 👤 Barangay Official</div>
      </div>

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
        <button className="nav-tab active" onClick={() => navigate("/residents")}>
          Residents
        </button>
        <button className="nav-tab" onClick={() => navigate("/reports")}>
          Reports
        </button>
      </div>

      <div className="content-container">
        <div className="section-header">
          <h2 className="section-title">👥 Residents Management</h2>
          <button className="add-btn" onClick={() => navigate("/createResident")}>
            + New Resident
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Age Group</label>
            <select className="filter-select" value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
              <option value="">All Ages</option>
              <option value="minor">Minor (Under 18)</option>
              <option value="adult">Adult (18-59)</option>
              <option value="senior">Senior (60+)</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pwd">PWD</option>
              <option value="senior">Senior Citizen</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Civil Status</label>
            <select
              className="filter-select"
              value={civilStatusFilter}
              onChange={(e) => setCivilStatusFilter(e.target.value)}
            >
              <option value="">All Civil Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
            </select>
          </div>
        </div>

        <div className="results-summary">
          Showing {filteredResidents.length} of {residents.length} residents
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-number">{residents.length}</div>
            <div className="stat-label">Total Residents</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{residents.filter((r) => r.issenior).length}</div>
            <div className="stat-label">Senior Citizens</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{residents.filter((r) => r.ispwd).length}</div>
            <div className="stat-label">PWD</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{residents.filter((r) => r.isActive).length}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>

        <table className="residents-table">
          <thead>
            <tr>
              <th>Resident ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Civil Status</th>
              <th>Special Status</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                  {residents.length === 0
                    ? "No residents found. Add your first resident!"
                    : "No residents match your filters."}
                </td>
              </tr>
            ) : (
              filteredResidents.map((resident) => (
                <tr key={resident.residentid}>
                  <td>
                    <strong>RES-{resident.residentid.toString().padStart(4, "0")}</strong>
                  </td>
                  <td>
                    <div className="resident-info">
                      <div className="resident-name">{resident.name}</div>
                      {resident.gender && <div className="resident-gender">{resident.gender}</div>}
                    </div>
                  </td>
                  <td>{resident.age || "N/A"}</td>
                  <td>{resident.address || "Not specified"}</td>
                  <td>{resident.contact || "Not provided"}</td>
                  <td>
                    <span className={`civil-status-badge civil-${(resident.civilstatus || "").toLowerCase()}`}>
                      {resident.civilstatus || "Unknown"}
                    </span>
                  </td>
                  <td>
                    <div className="special-status">
                      {resident.issenior && <span className="status-badge senior">Senior</span>}
                      {resident.ispwd && <span className="status-badge pwd">PWD</span>}
                      {!resident.issenior && !resident.ispwd && <span className="status-badge regular">Regular</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${resident.isActive ? "active" : "inactive"}`}>
                      {resident.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn btn-view" onClick={() => handleView(resident)}>
                        View
                      </button>
                      <button className="action-btn btn-edit" onClick={() => handleEdit(resident)}>
                        Edit
                      </button>
                      <button className="action-btn btn-benefits" onClick={() => handleViewBenefits(resident)}>
                        Benefits
                      </button>
                      <button className="action-btn btn-delete" onClick={() => handleDelete(resident)}>
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
