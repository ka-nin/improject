"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./projects.css"

const Projects = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:3001/projects")
        const data = await res.json()

        console.log("🔍 Fetched projects:", data)
        data.forEach((project, index) => {
          console.log(`Project ${index + 1}:`, {
            name: project.name,
            id: project.id,
            projectid: project.projectid,
            Table: project.Table, // 🔧 UPDATED: Check "Table" column
            allKeys: Object.keys(project),
          })
        })

        setProjects(data)
        setFiltered(data)
      } catch (err) {
        console.error("❌ Error fetching projects:", err)
      }
    }
    fetchProjects()
  }, [])

  const calculateDuration = (start, end) => {
    if (!start || !end) return "Not set"
    const diff = Math.abs(new Date(end) - new Date(start))
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 30) return `${days} days`
    if (days < 365) return `${Math.round(days / 30)} month(s)`
    return `${Math.round(days / 365)} year(s)`
  }

  const handleFilter = () => {
    const type = document.getElementById("typeFilter").value
    const from = document.getElementById("dateFromFilter").value
    const to = document.getElementById("dateToFilter").value
    const search = document.getElementById("nameSearch").value.toLowerCase()
    const result = projects.filter((p) => {
      // 🔧 UPDATED: Use "Table" column for filtering
      if (type && p.Table !== type) return false
      if (from && p.startDate < from) return false
      if (to && p.startDate > to) return false
      if (search && !p.name.toLowerCase().includes(search)) return false
      return true
    })
    setFiltered(result)
  }

  const handleView = (project) => {
    alert(`Project: ${project.name}\nStart: ${project.startDate}\nEnd: ${project.completionDate}`)
  }

  const handleEdit = (project) => {
    console.log("🔍 Edit button clicked for project:", project)

    const projectId = project.projectid || project.id
    console.log("🔍 Using project ID:", projectId)

    if (projectId) {
      navigate(`/editProject/${projectId}`)
    } else {
      console.error("❌ No project ID found:", project)
      alert("❌ Cannot edit: Project ID is missing")
    }
  }

  const handleDelete = async (project) => {
    const projectId = project.projectid || project.id

    if (!projectId) {
      alert("❌ Cannot delete: Project ID is missing")
      return
    }

    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await fetch(`http://localhost:3001/projects/${projectId}`, { method: "DELETE" })
        setProjects((prev) => prev.filter((p) => (p.projectid || p.id) !== projectId))
        setFiltered((prev) => prev.filter((p) => (p.projectid || p.id) !== projectId))
        alert("✅ Project deleted successfully.")
      } catch (err) {
        console.error("❌ Failed to delete project:", err)
        alert("❌ Failed to delete project.")
      }
    }
  }

  const handleTypeClick = (type) => {
    if (type) {
      const typeFilter = document.getElementById("typeFilter")
      if (typeFilter) {
        typeFilter.value = type
        handleFilter()
      }
    }
  }

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
        <button className="nav-tab" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
        <button className="nav-tab active">Projects</button>
        <button className="nav-tab" onClick={() => navigate("/program")}>
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
          <h2 className="section-title">🏗️ Projects Management</h2>
          <button className="add-btn" onClick={() => navigate("/newProject")}>
            + New Project
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">Project Type</label>
            <select id="typeFilter" className="filter-select" onChange={handleFilter}>
              <option value="">All Types</option>
              <option>Infrastructure</option>
              <option>Health Programs</option>
              <option>Education</option>
              <option>Social Services</option>
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
            <input
              id="nameSearch"
              type="text"
              placeholder="Search..."
              className="filter-input"
              onKeyUp={handleFilter}
            />
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
              <tr key={p.projectid || p.id || i}>
                <td>
                  <strong>PRJ-{(p.projectid || p.id || i + 1).toString().padStart(4, "0")}</strong>
                </td>
                <td>
                  {/* 🔧 UPDATED: Use "Table" column from database */}
                  <span
                    className={`type-badge type-${(p.Table || "").toLowerCase().replace(/\s+/g, "-")} clickable-badge`}
                    onClick={() => handleTypeClick(p.Table)}
                    title={`Click to filter by ${p.Table}`}
                  >
                    {p.Table || "No Type"}
                  </span>
                </td>
                <td>{p.name}</td>
                <td>{p.startDate}</td>
                <td>{p.completionDate}</td>
                <td>
                  <span className="duration-badge">{calculateDuration(p.startDate, p.completionDate)}</span>
                </td>
                <td>
                  <button className="action-btn btn-update" onClick={() => handleEdit(p)}>
                    Update
                  </button>
                  <button className="action-btn btn-view" onClick={() => handleView(p)}>
                    View
                  </button>
                  <button className="action-btn btn-delete" onClick={() => handleDelete(p)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Projects
