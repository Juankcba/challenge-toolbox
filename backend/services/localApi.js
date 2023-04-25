import axios from "axios";

// Set config defaults when creating the instance
const appApi = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default appApi;
