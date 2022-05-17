import express from "express";
import sqlConfig from "./config/config";
import mssql from "mssql";
import dotenv from "dotenv";
import router from "./routes/user-routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/", router);

const connecton = async () => {
  try {
    const conn = await mssql.connect(sqlConfig);
    if (conn.connected) {
      console.log("Connected to DB");
    }
  } catch (error: any) {
    console.log(error.message);
  }
};

connecton();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
