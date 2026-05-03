import { getPendingFarms, deleteFarm } from "../db/indexedDb";
import { createFarmAPI } from "./apiService";
import { uploadImage } from "./uploadService";

let isSyncing = false;

export const syncFarms = async () => {
  if (isSyncing) {
    console.log("Already syncing, skipping...");
    return;
  }

  isSyncing = true;

  try {
    const pending = await getPendingFarms();
    if (!pending.length) {
      console.log("No pending farms");
      return;
    }

    for (let farm of pending) {
      try {
        const uploadedUrls = [];

        for (let img of farm.photos) {
          try {
            const file = base64ToFile(img);
            const url = await uploadImage(file);
            uploadedUrls.push(url);
          } catch (err) {
            console.warn("Skipping image upload", err);
          }
        }

        await createFarmAPI({
          ...farm,
          photos: uploadedUrls,
        });

        await deleteFarm(farm.id);

        console.log(`Farm ${farm.id} synced & removed`);
      } catch (err) {
        console.error(`Farm ${farm.id} failed`, err);
      }
    }
  } finally {
    isSyncing = false;
  }
};

function base64ToFile(base64) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) u8arr[n] = bstr.charCodeAt(n);

  return new File([u8arr], "image.jpg", { type: mime });
}
