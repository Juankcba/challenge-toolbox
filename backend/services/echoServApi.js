import axios from "axios";

// Set config defaults when creating the instance
const api = axios.create({
  baseURL: "https://echo-serv.tbxnet.com/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
// Alter defaults after instance has been created
api.defaults.headers["Authorization"] = "Bearer aSuperSecretKey";

export default api;
