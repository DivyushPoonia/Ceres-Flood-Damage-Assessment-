import { useState, useEffect } from "react";

export default function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("isAdmin");
    if (stored) setIsAdmin(stored === "true");
  }, []);

  const toggleAdmin = () => {
    const newValue = !isAdmin;
    setIsAdmin(newValue);
    localStorage.setItem("isAdmin", newValue);
  };

  return { isAdmin, toggleAdmin };
}
