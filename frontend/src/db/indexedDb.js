import { openDB } from "idb";

const DB_NAME = "farm-db";
const STORE = "farms";

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    },
  });
};

export const saveFarm = async (farm) => {
  const db = await initDB();
  await db.put(STORE, farm);
};

export const getAllFarms = async () => {
  const db = await initDB();
  return await db.getAll(STORE);
};

export const getPendingFarms = async () => {
  const farms = await getAllFarms();
  return farms.filter((f) => f.status === "pending");
};

export const deleteFarm = async (id) => {
  const db = await initDB();
  await db.delete(STORE, id);
};
