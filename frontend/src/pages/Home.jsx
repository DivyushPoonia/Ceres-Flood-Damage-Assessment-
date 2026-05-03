import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FarmList from "../components/FarmList";
import Header from "../components/Header";
import useAdmin from "../hooks/useAdmin";
import { syncFarms } from "../services/syncService";
import { getPendingFarms } from "../db/indexedDb";

export default function Home() {
  const navigate = useNavigate();
  const { isAdmin, toggleAdmin } = useAdmin();

  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const checkPending = async () => {
    const data = await getPendingFarms();
    setPendingCount(data.length);
  };

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    await syncFarms();
    await checkPending();
    setSyncing(false);
  };

  useEffect(() => {
    checkPending();

    let cooldown = false;

    const handleOnline = async () => {
      if (cooldown) return;

      cooldown = true;

      await syncFarms();
      await checkPending();

      setTimeout(() => {
        cooldown = false;
      }, 2000);
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <div style={styles.page}>
      <Header isAdmin={isAdmin} toggleAdmin={toggleAdmin} />

      {!isAdmin && (
        <>
          <div style={styles.center}>
            <button style={styles.addBtn} onClick={() => navigate("/add")}>
              ➕ Add Farm
            </button>
          </div>

          {pendingCount > 0 && (
            <button style={styles.sync} onClick={handleSync} disabled={syncing}>
              {syncing ? "Syncing..." : `🔄 Sync ${pendingCount} Pending`}
            </button>
          )}
        </>
      )}

      {isAdmin && (
        <>
          <FarmList refreshTrigger={0} isAdmin={true} />
        </>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: 16,
    maxWidth: 500,
    margin: "auto",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    marginTop: 40,
  },
  addBtn: {
    padding: "14px 20px",
    fontSize: 16,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 12,
  },
  sync: {
    width: "100%",
    padding: 12,
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    marginTop: 20,
  },
};
