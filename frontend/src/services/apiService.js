import axios from "axios";

const BASE_URL = "http://localhost:5037/api/farms";

export const createFarmAPI = (farm) => {
  return axios.post(BASE_URL, farm);
};

export const getAllFarmsAPI = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};
