import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function FarmDetails() {
  const { state: farm } = useLocation();
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (activeIndex === null) return;

      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex]);

  const next = () => {
    setActiveIndex((prev) => (prev === farm.photos.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setActiveIndex((prev) => (prev === 0 ? farm.photos.length - 1 : prev - 1));
  };

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "-";
    }
  };

  const openInMaps = () => {
    if (!farm.latitude || !farm.longitude) return;

    const url = `https://www.google.com/maps?q=${farm.latitude},${farm.longitude}`;
    window.open(url, "_blank");
  };

  if (!farm) {
    return <p style={{ padding: 20 }}>No farm data found</p>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← Back
      </button>

      <h2 style={styles.title}>{farm.address}</h2>

      <div style={styles.infoBox}>
        <p>
          <strong>Condition:</strong> {farm.condition}
        </p>
        <p>
          <strong>Chicken Count:</strong> 🐔 {farm.chickenCount}
        </p>
        <p>
          <strong>Latitude:</strong> {farm.latitude || "-"}
        </p>
        <p>
          <strong>Longitude:</strong> {farm.longitude || "-"}
        </p>
        <p>
          <strong>Recorded On:</strong> {formatDate(farm.createdAt)}
        </p>

        <button
          onClick={openInMaps}
          disabled={!farm.latitude || !farm.longitude}
          style={{
            ...styles.mapBtn,
            opacity: farm.latitude && farm.longitude ? 1 : 0.5,
            cursor: farm.latitude && farm.longitude ? "pointer" : "not-allowed",
          }}
        >
          📍 View on Google Maps
        </button>
      </div>

      <h3 style={{ marginTop: 20 }}>Photos</h3>

      {farm.photos && farm.photos.length > 0 ? (
        <>
          <div style={styles.gallery}>
            {farm.photos.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="farm"
                style={styles.image}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>

          {activeIndex !== null && (
            <div style={styles.modal}>
              <button style={styles.close} onClick={() => setActiveIndex(null)}>
                ✕
              </button>

              <button style={styles.navLeft} onClick={prev}>
                ◀
              </button>

              <img
                src={farm.photos[activeIndex]}
                alt="preview"
                style={styles.fullImage}
              />

              <button style={styles.navRight} onClick={next}>
                ▶
              </button>
            </div>
          )}
        </>
      ) : (
        <p style={{ color: "#6b7280" }}>No images available</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: "40px auto",
    padding: 20,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  backBtn: {
    marginBottom: 10,
    background: "#e5e7eb",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
  title: {
    marginBottom: 10,
    lineHeight: 1.3,
  },
  infoBox: {
    background: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    lineHeight: 1.6,
  },

  mapBtn: {
    marginTop: 10,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: 8,
    fontWeight: 500,
    transition: "0.2s",
  },

  gallery: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: 10,
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 120,
    objectFit: "cover",
    borderRadius: 10,
    cursor: "pointer",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  fullImage: {
    maxWidth: "90%",
    maxHeight: "80%",
    borderRadius: 10,
  },
  close: {
    position: "absolute",
    top: 20,
    right: 20,
    fontSize: 24,
    background: "transparent",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  navLeft: {
    position: "absolute",
    left: 20,
    fontSize: 30,
    background: "transparent",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  navRight: {
    position: "absolute",
    right: 20,
    fontSize: 30,
    background: "transparent",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
