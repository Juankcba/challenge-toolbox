import express from "express";
import apiV1 from "./api/v1/index.js";
import cors from "cors";
//Create a app

const app = express();
app.use(cors());
//Routing
app.use("/", apiV1);

//Define the Port
const port = 3000;

app.listen(port, () => {
  console.log(`El servidor esta funcionando en el puerto ${port}`);
});

export default app;
