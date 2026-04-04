const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div style={styles.container}>

      {/* Left Section */}
      <div style={styles.left}>
        <h1 style={styles.brand}>Digital Guidance</h1>

        <h2 style={styles.heading}>
          Discover Your <br />
          Perfect Career Path
        </h2>

        <p style={styles.description}>
          Personalized career guidance platform for Indian students.
          Explore careers, colleges and exams — all in one place.
        </p>
      </div>

      {/* Right Section */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.welcome}>Welcome 👋</h2>

          <p style={styles.subtext}>
            Continue with Google to access your career dashboard.
          </p>

          <button style={styles.googleButton} onClick={handleGoogleLogin}>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              style={{ height: 20 }}
            />
            Continue with Google
          </button>

          <p style={styles.helperText}>
            New here? Just continue with Google to create your account.
          </p>
        </div>
      </div>

    </div>
  );
};

const styles: any = {
  container: {
    minHeight: "100vh",
    display: "flex",
    fontFamily: "Inter, sans-serif"
  },

  left: {
    flex: 1,
    background: "linear-gradient(135deg, #0f766e, #2563eb)",
    color: "white",
    padding: "80px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },

  brand: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "40px"
  },

  heading: {
    fontSize: "42px",
    fontWeight: "bold",
    marginBottom: "20px",
    lineHeight: 1.2
  },

  description: {
    fontSize: "18px",
    opacity: 0.9
  },

  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9"
  },

  card: {
    backgroundColor: "white",
    padding: "50px",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    width: "420px",
    textAlign: "center"
  },

  welcome: {
    fontSize: "26px",
    fontWeight: "600",
    marginBottom: "10px"
  },

  subtext: {
    color: "#6b7280",
    marginBottom: "30px"
  },

  googleButton: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px"
  },

  helperText: {
    marginTop: "20px",
    fontSize: "13px",
    color: "#6b7280"
  }
};

export default Login;
