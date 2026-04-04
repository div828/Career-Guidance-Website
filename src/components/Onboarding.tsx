import { useState } from "react";

interface Props {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: Props) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: "",
    education_level: "",
    current_stage: "",
    stream: "",
    interests: "",
    target_exam: "",
    dream_career: ""
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Onboarding error:", err);
        alert("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      onComplete(); // refresh user

    } catch (error) {
      console.error("Submit error:", error);
      alert("Server error. Check backend.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: `${step * 33}%` }} />
        </div>

        <h2 style={styles.heading}>
          Let’s personalize your journey 🚀
        </h2>

        <p style={styles.sub}>Step {step} of 3</p>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <select name="role" onChange={handleChange} style={styles.input}>
              <option value="">I am a...</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>

            <select name="education_level" onChange={handleChange} style={styles.input}>
              <option value="">Education Level</option>
              <option value="school">School Student</option>
              <option value="college">College Student</option>
              <option value="graduate">Graduate</option>
            </select>

            <button
              style={styles.button}
              onClick={() => setStep(2)}
              disabled={!formData.role || !formData.education_level}
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <select
              name="current_stage"
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Current Class / Year</option>
              <option>Class 9</option>
              <option>Class 10</option>
              <option>Class 11</option>
              <option>Class 12</option>
              <option>B.Tech 1st Year</option>
              <option>B.Tech 2nd Year</option>
              <option>B.Tech 3rd Year</option>
              <option>B.Tech 4th Year</option>
              <option>Other</option>
            </select>

            <select name="stream" onChange={handleChange} style={styles.input}>
              <option value="">Stream / Major</option>
              <option>Science</option>
              <option>Commerce</option>
              <option>Arts</option>
              <option>PCM</option>
              <option>PCB</option>
              <option>Computer Science</option>
              <option>Mechanical</option>
              <option>Electrical</option>
              <option>Other</option>
            </select>

            <button
              style={styles.button}
              onClick={() => setStep(3)}
              disabled={!formData.current_stage}
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <select name="interests" onChange={handleChange} style={styles.input}>
              <option value="">Primary Interest Area</option>
              <option>Engineering</option>
              <option>Medical</option>
              <option>Design</option>
              <option>Commerce</option>
              <option>Arts</option>
              <option>Law</option>
              <option>Business</option>
              <option>Undecided</option>
            </select>

            <select name="target_exam" onChange={handleChange} style={styles.input}>
              <option value="">Target Exam</option>
              <option>JEE</option>
              <option>NEET</option>
              <option>CUET</option>
              <option>CAT</option>
              <option>UPSC</option>
              <option>None</option>
            </select>

            <select name="dream_career" onChange={handleChange} style={styles.input}>
              <option value="">Dream Career</option>
              <option>Software Engineer</option>
              <option>Doctor</option>
              <option>Data Scientist</option>
              <option>Chartered Accountant</option>
              <option>Designer</option>
              <option>Entrepreneur</option>
              <option>Not Sure Yet</option>
            </select>

            <button
              style={styles.button}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Finish Setup"}
            </button>
          </>
        )}

      </div>
    </div>
  );
};

const styles: any = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg,#e0f2fe,#f1f5f9)"
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    width: "480px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  heading: {
    fontSize: "22px",
    fontWeight: "600"
  },
  sub: {
    color: "#64748b"
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0"
  },
  button: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg,#0f766e,#2563eb)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer"
  },
  progressContainer: {
    height: "6px",
    background: "#e2e8f0",
    borderRadius: "10px",
    overflow: "hidden"
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(135deg,#0f766e,#2563eb)",
    transition: "0.3s"
  }
};

export default Onboarding;
