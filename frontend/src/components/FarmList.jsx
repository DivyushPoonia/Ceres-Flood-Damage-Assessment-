import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllFarms } from "../db/indexedDb";
import { getAllFarmsAPI } from "../services/apiService";

export default function FarmList({ refreshTrigger, isAdmin }) {
  const [farms, setFarms] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const PAGE_SIZE = 5;

  useEffect(() => {
    load();
  }, [refreshTrigger, isAdmin]);

  const load = async () => {
    try {
      if (isAdmin) {
        const data = await getAllFarmsAPI();
        setFarms(data.map((f) => ({ ...f, status: "synced" })));
        return;
      }

      if (navigator.onLine) {
        const data = await getAllFarmsAPI();
        setFarms(data.map((f) => ({ ...f, status: "synced" })));
        return;
      }
    } catch (err) {
      console.warn("API failed, fallback to local:", err);
    }

    const local = await getAllFarms();
    setFarms(local);
  };

  const filtered = farms.filter((f) => {
    const matchesSearch = (f.address || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = filter === "All" || f.condition === filter;

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = {
    total: farms.length,
    good: farms.filter((f) => f.condition === "Good").length,
    moderate: farms.filter((f) => f.condition === "Moderate").length,
    bad: farms.filter((f) => f.condition === "Bad").length,
  };

  return (
    <div>
      <div style={styles.statsContainer}>
        <Card title="Total" value={stats.total} color="#2563eb" />
        <Card title="Good" value={stats.good} color="#16a34a" />
        <Card title="Moderate" value={stats.moderate} color="#f59e0b" />
        <Card title="Bad" value={stats.bad} color="#dc2626" />
      </div>

      <div style={styles.controls}>
        <input
          placeholder="Search by address..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={styles.input}
        />

        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          style={styles.select}
        >
          <option>All</option>
          <option>Good</option>
          <option>Moderate</option>
          <option>Bad</option>
        </select>
      </div>

      {paginated.map((f) => (
        <div
          key={f.id}
          style={styles.card}
          onClick={() => navigate(`/farm/${f.id}`, { state: f })}
        >
          <h4 style={styles.address}>{f.address}</h4>

          <div style={styles.row}>
            <span style={getStatusStyle(f.condition)}>{f.condition}</span>

            <span style={styles.count}>🐔 {f.chickenCount}</span>
          </div>

          {!isAdmin && (
            <p
              style={{
                color: f.status === "pending" ? "#f59e0b" : "#16a34a",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {f.status === "pending" ? "⏳ Pending" : "✅ Synced"}
            </p>
          )}
        </div>
      ))}

      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            style={{
              ...styles.pageBtn,
              ...(page === 1 ? styles.disabledBtn : {}),
            }}
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ◀ Prev
          </button>

          <span style={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>

          <button
            style={{
              ...styles.pageBtn,
              ...(page === totalPages ? styles.disabledBtn : {}),
            }}
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}

const getStatusStyle = (condition) => {
  const base = {
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    border: "2px solid",
  };

  switch (condition) {
    case "Good":
      return {
        ...base,
        color: "#16a34a",
        borderColor: "#16a34a",
        background: "#ecfdf5",
      };
    case "Moderate":
      return {
        ...base,
        color: "#f59e0b",
        borderColor: "#f59e0b",
        background: "#fffbeb",
      };
    case "Bad":
      return {
        ...base,
        color: "#dc2626",
        borderColor: "#dc2626",
        background: "#fef2f2",
      };
    default:
      return base;
  }
};

function Card({ title, value, color }) {
  return (
    <div style={{ ...styles.cardBox, borderTop: `4px solid ${color}` }}>
      <p style={styles.cardTitle}>{title}</p>
      <h3 style={{ margin: 0 }}>{value}</h3>
    </div>
  );
}

const styles = {
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 10,
    marginBottom: 16,
  },
  cardBox: {
    background: "#fff",
    padding: 12,
    borderRadius: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  cardTitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  controls: {
    display: "flex",
    gap: 10,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  select: {
    padding: 8,
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  card: {
    background: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    cursor: "pointer",
    height: 120,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  address: {
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.3,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  count: {
    fontSize: 14,
  },

  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },

  pageBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },

  disabledBtn: {
    background: "#9ca3af",
    cursor: "not-allowed",
    boxShadow: "none",
  },

  pageInfo: {
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
  },
};
