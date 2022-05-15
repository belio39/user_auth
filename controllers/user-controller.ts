import { v4 as uuid } from "uuid";
import { Request, RequestHandler, Response } from "express";
import mssql from "mssql";
import { userSchema } from "../models/user-schema";
import sqlConfig from "../config/config";
import dotenv from "dotenv";
dotenv.config();

// interface RequestExtended extends Request {
//   user?: any;
// }

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

export const getUserByUserName: RequestHandler<{ userName: string }> = async (
  req,
  res
) => {
  try {
    const userName = req.params.userName;
    let pool = await mssql.connect(sqlConfig);
    const user = await pool
      .request()
      .input("userName", mssql.VarChar, userName)
      .execute("getUserByUserName");
    if (!user.recordset[0]) {
      return res.json({
        message: `No user with ${userName} Does Not exist`,
      });
    }
    res.status(200).json({
      message: "Success",
      data: user.recordset,
    });
  } catch (error: any) {
    res.json({
      error: error.message,
    });
  }
};

export const updateUser: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const id = req.params.id;
    let pool = await mssql.connect(sqlConfig);
    const { userName, fullName, email, age, password, role } = req.body as {
      userName: string;
      fullName: string;
      email: string;
      age: number;
      password: string;
      role: string;
    };

    const user = await pool
      .request()
      .input("userName", mssql.VarChar, id)
      .execute("getUserByUserName");
    if (!user.recordset[0]) {
      return res.json({
        message: `No user with that ${id}`,
      });
    }

    await pool
      .request()
      .input("id", mssql.VarChar, user.recordset[0].id)
      .input("userName", mssql.VarChar, userName)
      .input("fullName", mssql.VarChar, fullName)
      .input("email", mssql.VarChar, email)
      .input("age", mssql.Numeric, age)
      .input("password", mssql.VarChar, password)
      .input("role", mssql.VarChar, role)
      .execute("updateUser");

    res.status(200).json({
      message: "User Successfully Updated",
    });
  } catch (error: any) {
    res.json({
      error: error.message,
    });
  }
};

export const deleteUser: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const id = req.params.id;
    let pool = await mssql.connect(sqlConfig);
    const user = await pool
      .request()
      .input("id", mssql.VarChar, id)
      .execute("getUserById");
    if (!user.recordset[0]) {
      return res.json({
        message: `User with userName : ${id} Does Not exist`,
      });
    }

    await pool.request().input("id", mssql.VarChar, id).execute("deleteUser");
    res.status(200).json({
      message: "User Successfully deleted",
    });
  } catch (error: any) {
    res.json({
      error: error.message,
    });
  }
};

// export const loginUser: RequestHandler = async (req, res) => {
//   try {
//     let pool = await mssql.connect(sqlConfig);
//     const { email, password } = req.body as { email: string; password: string };
//     const user = await pool.request().query(
//       `
//       `
//     );
//   } catch (error: any) {
//     res.json({
//       error: error.message,
//     });
//   }
// };
