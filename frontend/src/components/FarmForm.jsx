import { useState, useRef } from "react";
import { saveFarm } from "../db/indexedDb";
import { createFarmAPI } from "../services/apiService";
import { uploadImage } from "../services/uploadService";
import { Farm } from "../models/FarmModel";

export default function FarmForm({ onSave }) {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    latitude: "",
    longitude: "",
    address: "",
    condition: "Good",
    chickenCount: "",
    photos: [],
  });

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const getLocation = () => {
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        let address = "";

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          );
          const data = await res.json();
          address = data?.display_name || "";
        } catch (err) {
          console.warn("Address fetch failed:", err);
          alert("Couldn't fetch address. Please enter manually.");
        }

        setForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lon,
          address: address || prev.address,
        }));

        setLocating(false);
      },
      () => {
        alert("Location permission denied");
        setLocating(false);
      },
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = [];
    let invalidCount = 0;

    files.forEach((file) => {
      if (file.type.startsWith("image/")) validFiles.push(file);
      else invalidCount++;
    });

    if (invalidCount > 0) {
      alert(`${invalidCount} invalid file(s) ignored`);
    }

    if (form.photos.length + validFiles.length > 10) {
      alert("Max 10 images allowed");
      return;
    }

    const readers = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({
            file,
            preview: reader.result,
          });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((images) => {
      setForm((prev) => ({
        ...prev,
        photos: [...prev.photos, ...images],
      }));
    });
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (
      (!form.address && (!form.latitude || !form.longitude)) ||
      !form.chickenCount
    ) {
      alert("Provide either address or location + chicken count");
      return;
    }

    setLoading(true);

    const farm = new Farm({
      ...form,
      photos: form.photos.map((p) => p.preview),
    });

    try {
      if (navigator.onLine) {
        const urls = [];
        let failedCount = 0;

        for (let img of form.photos) {
          try {
            const url = await uploadImage(img.file);
            console.log("Uploaded URL:", url);
            urls.push(url);
          } catch (err) {
            console.warn("Skipping failed image:", err);
            failedCount++;
          }
        }

        if (failedCount > 0) {
          alert(`${failedCount} image(s) failed to upload`);
        }

        if (urls.length === 0 && form.photos.length > 0) {
          alert("All image uploads failed. Saving offline instead.");
          throw new Error("All images failed");
        }

        await createFarmAPI({
          ...farm,
          photos: urls,
        });

        alert("Saved to server");
      } else {
        throw new Error("Offline");
      }
    } catch (err) {
      console.warn("Saving offline due to:", err);
      farm.status = "pending";
      await saveFarm(farm);
      alert("Saved offline");
    } finally {
      setLoading(false);

      setForm({
        latitude: "",
        longitude: "",
        address: "",
        condition: "Good",
        chickenCount: "",
        photos: [],
      });

      if (fileInputRef.current) fileInputRef.current.value = "";
      if (onSave) onSave();
    }
  };

  const isValid =
    (form.address || (form.latitude && form.longitude)) && form.chickenCount;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🐔 Farm Assessment</h2>

      <button onClick={getLocation} style={styles.gpsBtn}>
        {locating ? "Fetching location..." : "📍 Get Location"}
      </button>

      <input
        style={styles.input}
        placeholder="Latitude"
        value={form.latitude}
        onChange={(e) => setForm({ ...form, latitude: e.target.value })}
      />

      <input
        style={styles.input}
        placeholder="Longitude"
        value={form.longitude}
        onChange={(e) => setForm({ ...form, longitude: e.target.value })}
      />

      <input
        style={styles.input}
        placeholder="Address (auto or type manually)"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <input
        style={styles.input}
        type="number"
        placeholder="Chicken Count"
        value={form.chickenCount}
        onChange={(e) => setForm({ ...form, chickenCount: e.target.value })}
      />

      <select
        style={styles.input}
        value={form.condition}
        onChange={(e) => setForm({ ...form, condition: e.target.value })}
      >
        <option>Good</option>
        <option>Moderate</option>
        <option>Bad</option>
      </select>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleImageChange}
      />

      <p style={styles.count}>📷 {form.photos.length} / 10 images</p>

      <div style={styles.preview}>
        {form.photos.map((img, i) => (
          <div key={i} style={styles.box}>
            <img src={img.preview} style={styles.img} />
            <button onClick={() => removeImage(i)} style={styles.del}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        disabled={!isValid || loading}
        style={isValid ? styles.save : styles.disabled}
        onClick={handleSubmit}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 420,
    margin: "40px auto",
    padding: 20,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  title: { textAlign: "center", marginBottom: 12 },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  gpsBtn: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
  },
  preview: { display: "flex", gap: 10, flexWrap: "wrap" },
  box: { position: "relative" },
  img: {
    width: 80,
    height: 80,
    borderRadius: 8,
    objectFit: "cover",
  },
  del: {
    position: "absolute",
    top: -5,
    right: -5,
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
  },
  save: {
    width: "100%",
    padding: 12,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
  },
  disabled: {
    width: "100%",
    padding: 12,
    background: "#aaa",
    color: "#fff",
    border: "none",
    borderRadius: 8,
  },
  count: { fontSize: 13, marginBottom: 8 },
};
