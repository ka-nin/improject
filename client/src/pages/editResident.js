"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./editResident.css"

const EditResident = () => {
  const { residentId } = useParams()
  const navigate = useNavigate()
  const [resident, setResident] = useState({
    name: "",
    address: "",
    age: "",
    contact: "",
    ispwd: false,
    issenior: false,
    isActive: true,
    civilstatus: "",
    dateOfBirth: "",
    gender: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Civil status options for dropdown
  const civilStatusOptions = [
    { value: "", label: "Select civil status" },
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" },
    { value: "Separated", label: "Separated" },
  ]

  // Gender options for dropdown
  const genderOptions = [
    { value: "", label: "Select gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ]

  useEffect(() => {
    console.log("🔍 Starting fetch for residentId:", residentId)

    if (!residentId || residentId === "undefined") {
      setError("Invalid resident ID")
      setLoading(false)
      return
    }

    const fetchResident = async () => {
      try {
        // FIXED: Using /residentlog endpoint to match your backend
        const apiUrl = `http://localhost:3001/residentlog/${residentId}`
        console.log("🔍 API URL:", apiUrl)

        const res = await fetch(apiUrl)
        console.log("🔍 Response status:", res.status)

        if (!res.ok) {
          const errorText = await res.text()
          console.error("❌ API Error Response:", errorText)
          throw new Error(`HTTP ${res.status}: ${errorText}`)
        }

        const data = await res.json()
        console.log("🔍 API Response Data:", data)

        if (!data) {
          throw new Error("No data received from API")
        }

        // Map database fields to frontend state
        setResident({
          name: data.name || "",
          address: data.address || "",
          age: data.age?.toString() || "",
          contact: data.contact || "",
          ispwd: data.ispwd || false,
          issenior: data.issenior || false,
          isActive: data.isActive !== undefined ? data.isActive : true,
          civilstatus: data.civilstatus || "",
          dateOfBirth: data.dateOfBirth || "",
          gender: data.gender || "",
        })

        console.log("✅ Resident data loaded successfully")
        setLoading(false)
      } catch (err) {
        console.error("❌ Fetch Error Details:", err)
        setError(`Failed to load resident: ${err.message}`)
        setLoading(false)
      }
    }

    fetchResident()
  }, [residentId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    console.log(`🔍 Field changed: ${name} = ${type === "checkbox" ? checked : value}`)
    setResident((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Prepare resident data for submission
      const residentData = {
        ...resident,
        age: resident.age ? Number.parseInt(resident.age) : null,
      }

      console.log("🔍 Submitting resident data:", residentData)

      // FIXED: Using /residentlog endpoint to match your backend
      const res = await fetch(`http://localhost:3001/residentlog/${residentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(residentData),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to update resident: ${errorText}`)
      }

      const updatedResident = await res.json()
      console.log("✅ Resident updated:", updatedResident)

      alert("✅ Resident updated successfully!")
      navigate("/residents")
    } catch (err) {
      console.error("❌ Error updating resident:", err)
      alert(`❌ Update failed: ${err.message}`)
    }
  }

  if (error) {
    return (
      <div className="edit-page">
        <div className="error" style={{ padding: "20px", background: "#ffebee", border: "1px solid #f44336" }}>
          <h2>Error Loading Resident</h2>
          <p>
            <strong>Error:</strong> {error}
          </p>
          <p>
            <strong>Resident ID:</strong> {residentId}
          </p>
          <button onClick={() => navigate("/residents")}>Back to Residents</button>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="edit-page">
        <div className="loading" style={{ padding: "20px", textAlign: "center" }}>
          <h2>Loading resident...</h2>
          <p>Resident ID: {residentId}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="edit-page">
      <h2>Edit Resident (ID: {residentId})</h2>

      <form className="edit-form" onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input type="text" name="name" value={resident.name} onChange={handleChange} required maxLength="255" />
        </label>

        <label>
          Address:
          <input type="text" name="address" value={resident.address} onChange={handleChange} maxLength="255" />
        </label>

        <label>
          Age:
          <input type="number" name="age" value={resident.age} onChange={handleChange} min="0" max="150" />
        </label>

        <label>
          Contact Number:
          <input
            type="tel"
            name="contact"
            value={resident.contact}
            onChange={handleChange}
            minLength="10"
            maxLength="12"
            placeholder="e.g., 09123456789"
          />
        </label>

        <label>
          Date of Birth:
          <input type="date" name="dateOfBirth" value={resident.dateOfBirth} onChange={handleChange} />
        </label>

        <label>
          Gender:
          <select name="gender" value={resident.gender} onChange={handleChange}>
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Civil Status:
          <select name="civilstatus" value={resident.civilstatus} onChange={handleChange}>
            {civilStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input type="checkbox" name="ispwd" checked={resident.ispwd} onChange={handleChange} />
            Person with Disability (PWD)
          </label>

          <label className="checkbox-label">
            <input type="checkbox" name="issenior" checked={resident.issenior} onChange={handleChange} />
            Senior Citizen
          </label>

          <label className="checkbox-label">
            <input type="checkbox" name="isActive" checked={resident.isActive} onChange={handleChange} />
            Active Status
          </label>
        </div>

        <div className="button-group">
          <button type="submit" className="btn-update">
            Save Changes
          </button>
          <button type="button" className="btn-cancel" onClick={() => navigate("/residents")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditResident
