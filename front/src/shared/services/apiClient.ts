import axios from "axios";
import { BaseURL } from "../constants/urls";

const apiClient = axios.create({
  baseURL: BaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
