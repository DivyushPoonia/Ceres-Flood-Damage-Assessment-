export default function Header({ isAdmin, toggleAdmin }) {
  return (
    <div style={styles.header}>
      <h3 style={{ margin: 0 }}>Ceres Flood Damage Assessment</h3>

      <div style={styles.right}>
        <span style={styles.role}>{isAdmin ? "🧑‍💼 Admin" : "👷 Field"}</span>

        <button onClick={toggleAdmin} style={styles.toggle}>
          Switch
        </button>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  role: {
    fontSize: 14,
    fontWeight: 600,
  },
  toggle: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "none",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
  },
};
