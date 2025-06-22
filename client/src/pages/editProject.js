  "use client"

  import { useEffect, useState } from "react"
  import { useParams, useNavigate } from "react-router-dom"
  import "./editProject.css"

  const EditProject = () => {
    const { projectId } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState({
      Type: "", // Frontend field name
      name: "",
      startDate: "",
      completionDate: "",
      status: "",
      description: "",
      location: "",
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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

    useEffect(() => {
      console.log("🔍 Starting fetch for projectId:", projectId)

      if (!projectId || projectId === "undefined") {
        setError("Invalid project ID")
        setLoading(false)
        return
      }

      const fetchProject = async () => {
        try {
          const apiUrl = `http://localhost:3001/projects/${projectId}`
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

          // Map database "Table" column to frontend "Type" field
          setProject({
            Type: data.Table || data.Type || "", // Map "Table" from DB to "Type" in frontend
            name: data.name || "",
            startDate: data.startDate || "",
            completionDate: data.completionDate || "",
            status: data.status || "",
            description: data.description || "",
            location: data.location || "",
          })

          console.log("✅ Project data loaded successfully")
          setLoading(false)
        } catch (err) {
          console.error("❌ Fetch Error Details:", err)
          setError(`Failed to load project: ${err.message}`)
          setLoading(false)
        }
      }

      fetchProject()
    }, [projectId])

    const handleChange = (e) => {
      const { name, value } = e.target
      console.log(`🔍 Field changed: ${name} = ${value}`)
      setProject((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        // Map frontend "Type" to database "Table" column
        const projectData = {
          ...project,
          Table: project.Type, // Map frontend "Type" to database "Table"
          // Remove the Type field since we're using Table for the database
          Type: undefined,
        }

        console.log("🔍 Submitting project data:", projectData)

        const res = await fetch(`http://localhost:3001/projects/${projectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        })

        if (!res.ok) throw new Error("Failed to update project")
        alert("✅ Project updated successfully!")
        navigate("/projects")
      } catch (err) {
        console.error("❌ Error updating project:", err)
        alert("❌ Update failed")
      }
    }

    if (error) {
      return (
        <div className="edit-page">
          <div className="error" style={{ padding: "20px", background: "#ffebee", border: "1px solid #f44336" }}>
            <h2>Error Loading Project</h2>
            <p>
              <strong>Error:</strong> {error}
            </p>
            <p>
              <strong>Project ID:</strong> {projectId}
            </p>
            <button onClick={() => navigate("/projects")}>Back to Projects</button>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      )
    }

    if (loading) {
      return (
        <div className="edit-page">
          <div className="loading" style={{ padding: "20px", textAlign: "center" }}>
            <h2>Loading project...</h2>
            <p>Project ID: {projectId}</p>
          </div>
        </div>
      )
    }

    return (
      <div className="edit-page">
        <h2>Edit Project (ID: {projectId})</h2>

        <form className="edit-form" onSubmit={handleSubmit}>
          <label>
            Project Type:
            <select name="Type" value={project.Type} onChange={handleChange} required>
              <option value="">Select project type</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Health Programs">Health Programs</option>
              <option value="Education">Education</option>
              <option value="Social Services">Social Services</option>
              <option value="Environment">Environment</option>
            </select>
          </label>

          <label>
            Name:
            <input type="text" name="name" value={project.name} onChange={handleChange} required />
          </label>

          <label>
            Location:
            <input type="text" name="location" value={project.location} onChange={handleChange} />
          </label>

          <label>
            Status:
            <select name="status" value={project.status} onChange={handleChange} required>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Description:
            <textarea name="description" value={project.description} onChange={handleChange} rows="3" />
          </label>

          <label>
            Start Date:
            <input type="date" name="startDate" value={project.startDate} onChange={handleChange} required />
          </label>

          <label>
            Completion Date:
            <input type="date" name="completionDate" value={project.completionDate} onChange={handleChange} required />
          </label>

          <div className="button-group">
            <button type="submit" className="btn-update">
              Save Changes
            </button>
            <button type="button" className="btn-cancel" onClick={() => navigate("/projects")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  export default EditProject
