import axios from "axios";

const BASE_URL = "http://localhost:5037/api/upload";

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(BASE_URL, formData);

    console.log("UPLOAD RESPONSE ->:", res);

    return res.data;
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
};
