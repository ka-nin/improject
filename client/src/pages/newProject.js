"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Calendar, Type, FileText } from "lucide-react"
import "./newProject.css"

export default function NewProjectForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    Type: "",
    name: "",
    startDate: "",
    completionDate: "",
    status: "",
    description: "",
    location: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const projectTypes = ["Infrastructure", "Health Programs", "Education", "Social Services", "Environment"]

  // Status options for dropdown
  const statusOptions = [
    { value: "", label: "Select status" },
    { value: "Planning", label: "Planning" },
    { value: "Active", label: "Active" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "On Hold", label: "On Hold" },
    { value: "Cancelled", label: "Cancelled" },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Project name is required"
    if (!formData.Type) newErrors.Type = "Project type is required"
    if (!formData.status) newErrors.status = "Project status is required"
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.completionDate) newErrors.completionDate = "End date is required"
    if (
      formData.startDate &&
      formData.completionDate &&
      new Date(formData.startDate) >= new Date(formData.completionDate)
    ) {
      newErrors.completionDate = "End date must be after start date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:3001/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Type: formData.Type,
          name: formData.name,
          startDate: formData.startDate,
          completionDate: formData.completionDate,
          status: formData.status,
          description: formData.description,
          location: formData.location,
        }),
      })

      if (!response.ok) throw new Error("Failed to create project")

      alert("✅ Project created successfully!")
      navigate("/dashboard")
    } catch (error) {
      console.error("❌ Error creating project:", error)
      alert("Error creating project. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToDashboard = () => navigate("/dashboard")

  return (
    <div className="new-project-form">
      <div className="new-project-container">
        <div className="form-wrapper">
          <div className="header-section">
            <button onClick={handleBackToDashboard} className="back-button">
              <ArrowLeft className="back-button-icon" /> Back to Dashboard
            </button>
            <div className="header-card">
              <div className="header-content">
                <div className="header-icon">
                  <Plus />
                </div>
                <div>
                  <h1 className="header-title">Create New Project</h1>
                  <p className="header-subtitle">Fill in the details to start your new project</p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-card">
            <div className="form-content">
              <div className="form-group">
                <label className="form-label">
                  <FileText /> Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                  className={`form-input ${errors.name ? "error" : ""}`}
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Type /> Project Type
                </label>
                <select
                  name="Type"
                  value={formData.Type}
                  onChange={handleInputChange}
                  className={`form-select ${errors.Type ? "error" : ""}`}
                >
                  <option value="">Select project type</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.Type && <p className="error-message">{errors.Type}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`form-select ${errors.status ? "error" : ""}`}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.status && <p className="error-message">{errors.status}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  className="form-textarea"
                />
              </div>

              <div className="date-grid">
                <div className="form-group">
                  <label className="form-label">
                    <Calendar /> Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`form-input ${errors.startDate ? "error" : ""}`}
                  />
                  {errors.startDate && <p className="error-message">{errors.startDate}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Calendar /> End Date
                  </label>
                  <input
                    type="date"
                    name="completionDate"
                    value={formData.completionDate}
                    onChange={handleInputChange}
                    className={`form-input ${errors.completionDate ? "error" : ""}`}
                  />
                  {errors.completionDate && <p className="error-message">{errors.completionDate}</p>}
                </div>
              </div>

              <div className="button-group">
                <button type="button" onClick={handleBackToDashboard} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div> Creating...
                    </>
                  ) : (
                    <>
                      <Plus /> Create Project
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
