"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./createResidents.css"

const CreateResident = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    age: "",
    contact: "",
    ispwd: false,
    issenior: false,
    civilstatus: "Single",
    dateOfBirth: "",
    gender: "",
    occupation: "",
    emergencyContact: "",
    isActive: true,
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }

    // Auto-calculate age from date of birth
    if (name === "dateOfBirth" && value) {
      const today = new Date()
      const birthDate = new Date(value)
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        setFormData((prev) => ({ ...prev, age: (age - 1).toString() }))
      } else {
        setFormData((prev) => ({ ...prev, age: age.toString() }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.age || formData.age < 0 || formData.age > 150) {
      newErrors.age = "Valid age is required (0-150)"
    }
    if (formData.contact && !/^\d{10,12}$/.test(formData.contact.replace(/\D/g, ""))) {
      newErrors.contact = "Contact must be 10-12 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      console.log("🔍 Submitting resident data:", formData)

      const response = await fetch("http://localhost:3001/residentlog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          age: Number.parseInt(formData.age),
        }),
      })

      const responseData = await response.json()
      console.log("🔍 Response:", responseData)

      if (response.ok) {
        alert("Resident created successfully!")
        navigate("/residents")
      } else {
        throw new Error(responseData.error || "Failed to create resident")
      }
    } catch (error) {
      console.error("❌ Error creating resident:", error)
      alert("Error creating resident: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/residents")
  }

  return (
    <div className="create-resident-container">
      <div className="create-resident-header">
        <h1 className="page-title">CREATE NEW RESIDENT</h1>
        <p className="page-subtitle">Add a new resident to the barangay system</p>
      </div>

      <form onSubmit={handleSubmit} className="create-resident-form">
        <div className="form-grid">
          {/* Name */}
          <div className="form-group full-width">
            <label className="form-label">FULL NAME *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? "error" : ""}`}
              placeholder="Enter full name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Address */}
          <div className="form-group full-width">
            <label className="form-label">ADDRESS *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`form-textarea ${errors.address ? "error" : ""}`}
              placeholder="Enter complete address"
              rows="3"
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label className="form-label">DATE OF BIRTH</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Age */}
          <div className="form-group">
            <label className="form-label">AGE *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`form-input ${errors.age ? "error" : ""}`}
              placeholder="Age"
              min="0"
              max="150"
            />
            {errors.age && <span className="error-message">{errors.age}</span>}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="form-label">GENDER</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Civil Status */}
          <div className="form-group">
            <label className="form-label">CIVIL STATUS</label>
            <select name="civilstatus" value={formData.civilstatus} onChange={handleChange} className="form-select">
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
            </select>
          </div>

          {/* Contact */}
          <div className="form-group">
            <label className="form-label">CONTACT NUMBER</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className={`form-input ${errors.contact ? "error" : ""}`}
              placeholder="09XXXXXXXXX"
            />
            {errors.contact && <span className="error-message">{errors.contact}</span>}
          </div>

          {/* Emergency Contact */}
          <div className="form-group">
            <label className="form-label">EMERGENCY CONTACT</label>
            <input
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="form-input"
              placeholder="Emergency contact number"
            />
          </div>

          {/* Occupation */}
          <div className="form-group full-width">
            <label className="form-label">OCCUPATION</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter occupation"
            />
          </div>

          {/* Special Status Checkboxes */}
          <div className="form-group full-width">
            <label className="form-label">SPECIAL STATUS</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" name="ispwd" checked={formData.ispwd} onChange={handleChange} />
                <span className="checkbox-text">Person with Disability (PWD)</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="issenior" checked={formData.issenior} onChange={handleChange} />
                <span className="checkbox-text">Senior Citizen</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                <span className="checkbox-text">Active Resident</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn-cancel" disabled={loading}>
            CANCEL
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "CREATING..." : "CREATE RESIDENT"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateResident
