import { useNavigate } from "react-router-dom";
import FarmForm from "../components/FarmForm";
import useAdmin from "../hooks/useAdmin";

export default function AddFarm() {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const handleSave = () => {
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <button onClick={() => navigate("/")} style={styles.back}>
        ← Back
      </button>
      <FarmForm onSave={handleSave} />
    </div>
  );
}

const styles = {
  page: {
    padding: 16,
    maxWidth: 500,
    margin: "auto",
  },
  back: {
    marginBottom: 10,
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    background: "#e5e7eb",
  },
};
