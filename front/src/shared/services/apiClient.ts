import axios from "axios";
import { BaseURL } from "../constants/urls";

const apiClient = axios.create({
  baseURL: BaseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
