import { useState } from "react";

interface ProfileProps {
  user: any;
}

const Profile = ({ user }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    role: user?.role || "",
    education_level: user?.education_level || "",
    current_stage: user?.current_stage || "",
    stream: user?.stream || "",
    city: user?.city || "",
    percentage: user?.percentage || "",
    interests: user?.interests || "",
    target_exam: user?.target_exam || "",
    dream_career: user?.dream_career || ""
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await fetch("http://localhost:5000/user/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert("Profile updated successfully");
      setIsEditing(false);
      window.location.reload();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.profileLeft}>
            {user?.photo ? (
              <img src={user.photo} style={styles.avatar} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {user?.name?.charAt(0)}
              </div>
            )}
            <div>
              <h2 style={styles.name}>{user?.name}</h2>
              <p style={styles.email}>{user?.email}</p>
            </div>
          </div>

          <button
            style={styles.editBtn}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Editable Section */}
        <div style={styles.section}>

          {Object.keys(formData).map((key) => (
            <div key={key} style={styles.field}>
              <label style={styles.label}>
                {key.replace("_", " ").toUpperCase()}
              </label>

              {isEditing ? (
                <input
                  name={key}
                  value={(formData as any)[key]}
                  onChange={handleChange}
                  style={styles.input}
                />
              ) : (
                <div style={styles.value}>
                  {(formData as any)[key] || "Not Added"}
                </div>
              )}
            </div>
          ))}

          {isEditing && (
            <button style={styles.saveBtn} onClick={handleSave}>
              Save Changes
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "40px",
    display: "flex",
    justifyContent: "center"
  },

  card: {
    background: "white",
    width: "700px",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  },

  profileLeft: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },

  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%"
  },

  avatarPlaceholder: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#0f766e,#2563eb)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold"
  },

  name: {
    fontSize: "22px",
    marginBottom: "5px"
  },

  email: {
    color: "#64748b"
  },

  editBtn: {
    padding: "10px 20px",
    borderRadius: "12px",
    border: "1px solid #0f766e",
    background: "white",
    color: "#0f766e",
    fontWeight: "600",
    cursor: "pointer"
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },

  field: {
    display: "flex",
    flexDirection: "column"
  },

  label: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "5px"
  },

  value: {
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "10px"
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0"
  },

  saveBtn: {
    marginTop: "20px",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg,#0f766e,#2563eb)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer"
  }
};

export default Profile;
