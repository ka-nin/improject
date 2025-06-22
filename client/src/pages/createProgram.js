"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./createProgram.css"

const CreateProgram = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning", // Match your backend default
    datestart: "", // Match your backend field name
    completiondate: "", // Match your backend field name
    location: "",
    programtype: "education", // Match your backend field name
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

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
      console.log("🔍 Sending program data:", formData)

      const response = await fetch("http://localhost:3001/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const responseData = await response.json()
      console.log("🔍 Response:", responseData)

      if (response.ok) {
        alert("Program created successfully!")
        console.log("✅ Program created:", responseData)

        // Reset form
        setFormData({
          name: "",
          description: "",
          status: "Planning",
          datestart: "",
          completiondate: "",
          location: "",
          programtype: "education",
        })

        // Navigate back to programs list or dashboard
        navigate("/dashboard")
      } else {
        throw new Error(responseData.details || responseData.error || "Failed to create program")
      }
    } catch (error) {
      console.error("❌ Error creating program:", error)
      alert("Error creating program: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/dashboard")
  }

  return (
    <div className="create-program-container">
      <div className="create-program-header">
        <h1 className="page-title">CREATE NEW PROGRAM</h1>
        <p className="page-subtitle">Fill in the details to create a new program</p>
      </div>

      <form onSubmit={handleSubmit} className="create-program-form">
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
          <button type="button" onClick={handleCancel} className="btn-cancel" disabled={loading}>
            CANCEL
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "CREATING..." : "CREATE PROGRAM"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateProgram
