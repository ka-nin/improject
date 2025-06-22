"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./editProgram.css"

const EditProgram = () => {
  const { programId } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning",
    datestart: "",
    completiondate: "",
    location: "",
    programtype: "education",
  })

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchProgram()
  }, [programId])

  const fetchProgram = async () => {
    try {
      console.log("🔍 Fetching program with ID:", programId)

      const response = await fetch(`http://localhost:3001/programs/${programId}`)
      const responseData = await response.json()

      console.log("🔍 Fetched program data:", responseData)

      if (response.ok) {
        setFormData({
          name: responseData.name || "",
          description: responseData.description || "",
          status: responseData.status || "Planning",
          datestart: responseData.datestart || "",
          completiondate: responseData.completiondate || "",
          location: responseData.location || "",
          programtype: responseData.programtype || "education",
        })
      } else {
        throw new Error(responseData.details || responseData.error || "Program not found")
      }
    } catch (error) {
      console.error("❌ Error fetching program:", error)
      alert("Error fetching program: " + error.message)
      navigate("/dashboard")
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Program name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.datestart) newErrors.datestart = "Start date is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      console.log("🔍 Updating program with data:", formData)

      const response = await fetch(`http://localhost:3001/programs/${programId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const responseData = await response.json()
      console.log("🔍 Update response:", responseData)

      if (response.ok) {
        alert("Program updated successfully!")
        navigate("/dashboard")
      } else {
        throw new Error(responseData.details || responseData.error || "Failed to update program")
      }
    } catch (error) {
      console.error("❌ Error updating program:", error)
      alert("Error updating program: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/dashboard")
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this program? This action cannot be undone.")) {
      setLoading(true)
      try {
        console.log("🔍 Deleting program with ID:", programId)

        const response = await fetch(`http://localhost:3001/programs/${programId}`, {
          method: "DELETE",
        })

        const responseData = await response.json()
        console.log("🔍 Delete response:", responseData)

        if (response.ok) {
          alert("Program deleted successfully!")
          navigate("/dashboard")
        } else {
          throw new Error(responseData.details || responseData.error || "Failed to delete program")
        }
      } catch (error) {
        console.error("❌ Error deleting program:", error)
        alert("Error deleting program: " + error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  if (fetchLoading) {
    return (
      <div className="edit-program-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">LOADING PROGRAM...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="edit-program-container">
      <div className="edit-program-header">
        <h1 className="page-title">EDIT PROGRAM</h1>
        <p className="page-subtitle">Update program details below</p>
      </div>

      <form onSubmit={handleSubmit} className="edit-program-form">
        <div className="form-grid">
          {/* Program Name */}
          <div className="form-group full-width">
            <label className="form-label">PROGRAM NAME *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? "error" : ""}`}
              placeholder="Enter program name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label className="form-label">DESCRIPTION *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`form-textarea ${errors.description ? "error" : ""}`}
              placeholder="Enter program description"
              rows="4"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          {/* Program Type */}
          <div className="form-group">
            <label className="form-label">PROGRAM TYPE</label>
            <select name="programtype" value={formData.programtype} onChange={handleChange} className="form-select">
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="social">Social Services</option>
              <option value="economic">Economic Development</option>
            </select>
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="form-label">STATUS</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-select">
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label className="form-label">START DATE *</label>
            <input
              type="date"
              name="datestart"
              value={formData.datestart}
              onChange={handleChange}
              className={`form-input ${errors.datestart ? "error" : ""}`}
            />
            {errors.datestart && <span className="error-message">{errors.datestart}</span>}
          </div>

          {/* End Date */}
          <div className="form-group">
            <label className="form-label">COMPLETION DATE</label>
            <input
              type="date"
              name="completiondate"
              value={formData.completiondate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Location */}
          <div className="form-group full-width">
            <label className="form-label">LOCATION</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter location"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleDelete} className="btn-delete" disabled={loading}>
            DELETE
          </button>
          <div className="action-group">
            <button type="button" onClick={handleCancel} className="btn-cancel" disabled={loading}>
              CANCEL
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "UPDATING..." : "UPDATE PROGRAM"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditProgram
