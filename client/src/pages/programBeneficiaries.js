"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./programBeneficiaries.css"

export default function ProgramBeneficiaries() {
  const { programId } = useParams()
  const navigate = useNavigate()
  const [program, setProgram] = useState(null)
  const [beneficiaries, setBeneficiaries] = useState([])
  const [allResidents, setAllResidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddSection, setShowAddSection] = useState(false)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (programId) {
      fetchProgramDetails()
      fetchBeneficiaries()
      fetchAllResidents()
    }
  }, [programId])

  const fetchProgramDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/programs/${programId}`)
      if (!response.ok) throw new Error("Failed to fetch program details")

      const data = await response.json()
      setProgram(data)
    } catch (err) {
      console.error("❌ Error fetching program:", err)
      alert("Failed to load program details")
    }
  }

  const fetchBeneficiaries = async () => {
    try {
      const response = await fetch(`http://localhost:3001/beneficiaries/program/${programId}`)
      if (!response.ok) throw new Error("Failed to fetch beneficiaries")

      const data = await response.json()
      setBeneficiaries(data)
    } catch (err) {
      console.error("❌ Error fetching beneficiaries:", err)
      alert("Failed to load beneficiaries")
    }
  }

  const fetchAllResidents = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:3001/residentlog")
      if (!response.ok) throw new Error("Failed to fetch residents")

      const data = await response.json()
      setAllResidents(data.filter((r) => r.isActive))
    } catch (err) {
      console.error("❌ Error fetching residents:", err)
      alert("Failed to load residents")
    } finally {
      setLoading(false)
    }
  }

  const handleAddBeneficiary = async (resident) => {
    if (!window.confirm(`Add ${resident.name} as a beneficiary to ${program?.name}?`)) {
      return
    }

    try {
      setAdding(true)
      const response = await fetch(`http://localhost:3001/beneficiaries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programid: Number(programId),
          residentid: resident.residentid,
          date: new Date().toISOString().split("T")[0],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add beneficiary")
      }

      const newBeneficiary = await response.json()

      setBeneficiaries((prev) => [
        {
          ...newBeneficiary,
          resident: resident,
        },
        ...prev,
      ])

      alert("✅ Beneficiary added successfully!")
      setShowAddSection(false)
      setSearchTerm("")
    } catch (err) {
      console.error("❌ Failed to add beneficiary:", err)
      alert(`❌ Failed to add beneficiary: ${err.message}`)
    } finally {
      setAdding(false)
    }
  }

  const handleRemoveBeneficiary = async (benefitId, residentName) => {
    if (!window.confirm(`Remove ${residentName} from this program?`)) {
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/beneficiaries/${benefitId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to remove beneficiary")

      setBeneficiaries((prev) => prev.filter((b) => b.benefitid !== benefitId))
      alert("✅ Beneficiary removed successfully")
    } catch (err) {
      console.error("❌ Failed to remove beneficiary:", err)
      alert("❌ Failed to remove beneficiary")
    }
  }

  // Filter residents for adding (exclude existing beneficiaries)
  const existingBeneficiaryIds = beneficiaries.map((b) => b.residentid)
  const availableResidents = allResidents.filter((resident) => {
    const isNotBeneficiary = !existingBeneficiaryIds.includes(resident.residentid)
    const matchesSearch = searchTerm
      ? resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.residentid.toString().includes(searchTerm) ||
        (resident.address && resident.address.toLowerCase().includes(searchTerm.toLowerCase()))
      : true

    return isNotBeneficiary && matchesSearch
  })

  if (loading && !program) {
    return (
      <div className="page-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading program beneficiaries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="header">
        <div>
          <h1>Program Beneficiaries</h1>
          <div className="header-info">
            {program?.name} - {program?.programtype}
          </div>
        </div>
        <button onClick={() => navigate("/program")} className="back-btn">
          ← Back to Programs
        </button>
      </div>

      <div className="content-container">
        {/* Program Info Section */}
        <div className="program-info-section">
          <div className="program-details">
            <h2>{program?.name}</h2>
            <div className="program-meta">
              <span className={`status-badge status-${program?.status?.toLowerCase()}`}>{program?.status}</span>
              <span className="program-type">{program?.programtype}</span>
              <span className="program-dates">
                {program?.datestart} - {program?.completiondate || "Ongoing"}
              </span>
            </div>
            {program?.description && <p className="program-description">{program.description}</p>}
            {program?.location && <p className="program-location">📍 {program.location}</p>}
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{beneficiaries.length}</div>
            <div className="stat-label">Total Beneficiaries</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{beneficiaries.filter((b) => b.resident.issenior).length}</div>
            <div className="stat-label">Senior Citizens</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{beneficiaries.filter((b) => b.resident.ispwd).length}</div>
            <div className="stat-label">PWD</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {beneficiaries.filter((b) => !b.resident.issenior && !b.resident.ispwd).length}
            </div>
            <div className="stat-label">Regular</div>
          </div>
        </div>

        {/* Action Section */}
        <div className="action-section">
          <button
            className="add-beneficiary-btn"
            onClick={() => setShowAddSection(!showAddSection)}
            disabled={program?.status === "Completed"}
          >
            {showAddSection ? "Cancel Adding" : "+ Add Beneficiary"}
          </button>
        </div>

        {/* Add Beneficiary Section */}
        {showAddSection && (
          <div className="add-section">
            <h3>Add New Beneficiary</h3>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search residents by name, ID, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="search-info">
                {loading ? "Loading..." : `${availableResidents.length} residents available`}
              </div>
            </div>

            <div className="residents-grid">
              {availableResidents.length === 0 ? (
                <div className="no-results">
                  {searchTerm
                    ? `No residents found matching "${searchTerm}"`
                    : "All active residents are already beneficiaries"}
                </div>
              ) : (
                availableResidents.slice(0, 8).map((resident) => (
                  <div key={resident.residentid} className="resident-card">
                    <div className="resident-header">
                      <div className="resident-id">RES-{resident.residentid.toString().padStart(4, "0")}</div>
                      <div className="resident-name">{resident.name}</div>
                    </div>
                    <div className="resident-details">
                      <div>Age: {resident.age || "N/A"}</div>
                      <div>Address: {resident.address || "Not specified"}</div>
                      <div>Contact: {resident.contact || "Not provided"}</div>
                    </div>
                    <div className="resident-badges">
                      {resident.issenior && <span className="badge senior">Senior</span>}
                      {resident.ispwd && <span className="badge pwd">PWD</span>}
                      {resident.gender && <span className="badge gender">{resident.gender}</span>}
                    </div>
                    <button
                      className="add-resident-btn"
                      onClick={() => handleAddBeneficiary(resident)}
                      disabled={adding}
                    >
                      {adding ? "Adding..." : "Add as Beneficiary"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Beneficiaries List */}
        <div className="beneficiaries-section">
          <h3>Current Beneficiaries ({beneficiaries.length})</h3>
          {beneficiaries.length === 0 ? (
            <div className="no-beneficiaries">
              <h4>No Beneficiaries Yet</h4>
              <p>This program doesn't have any beneficiaries assigned yet.</p>
              <button className="add-beneficiary-btn" onClick={() => setShowAddSection(true)}>
                Add First Beneficiary
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="beneficiaries-table">
                <thead>
                  <tr>
                    <th>Resident ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Address</th>
                    <th>Contact</th>
                    <th>Special Status</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {beneficiaries.map((beneficiary) => (
                    <tr key={beneficiary.benefitid}>
                      <td>
                        <strong>RES-{beneficiary.resident.residentid.toString().padStart(4, "0")}</strong>
                      </td>
                      <td>
                        <div className="resident-info">
                          <div className="name">{beneficiary.resident.name}</div>
                          {beneficiary.resident.gender && <div className="gender">{beneficiary.resident.gender}</div>}
                        </div>
                      </td>
                      <td>{beneficiary.resident.age || "N/A"}</td>
                      <td>{beneficiary.resident.address || "Not specified"}</td>
                      <td>{beneficiary.resident.contact || "Not provided"}</td>
                      <td>
                        <div className="status-badges">
                          {beneficiary.resident.issenior && <span className="badge senior">Senior</span>}
                          {beneficiary.resident.ispwd && <span className="badge pwd">PWD</span>}
                          {!beneficiary.resident.issenior && !beneficiary.resident.ispwd && (
                            <span className="badge regular">Regular</span>
                          )}
                        </div>
                      </td>
                      <td>{new Date(beneficiary.date).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveBeneficiary(beneficiary.benefitid, beneficiary.resident.name)}
                          disabled={program?.status === "Completed"}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
