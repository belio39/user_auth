import { v4 as uuid } from "uuid";
import { Request, RequestHandler, Response } from "express";
import mssql from "mssql";
import { userSchema } from "../models/user-schema";
import sqlConfig from "../config/config";
import dotenv from "dotenv";
dotenv.config();

export const createUsers = async (req: Request, res: Response) => {
  try {
    const id = uuid();
    const { userName, fullName, email, age, password, role } = req.body as {
      userName: string;
      fullName: string;
      email: string;
      age: number;
      password: string;
      role: string;
    };

    let pool = await mssql.connect(sqlConfig);
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.json({ error: error.details[0].message });
    }
    await pool
      .request()
      .input("id", mssql.VarChar, id)
      .input("userName", mssql.VarChar, userName)
      .input("fullName", mssql.VarChar, fullName)
      .input("email", mssql.VarChar, email)
      .input("age", mssql.Numeric, age)
      .input("password", mssql.VarChar, password)
      .input("role", mssql.VarChar, role)
      .execute("createUsers");
    res.status(200).json({
      message: "User Created Successfully!",
    });
  } catch (error: any) {
    res.json({ error: error.message });
  }
};

export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    let pool = await mssql.connect(sqlConfig);
    const users = await pool.request().execute("getAllUsers");

    res.status(200).json({
      message: "Success",
      data: users.recordset,
    });
  } catch (error: any) {
    res.json({ error: error.message });
  }
};
