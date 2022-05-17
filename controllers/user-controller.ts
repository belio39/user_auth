import { v4 as uuid } from "uuid";
import { Request, RequestHandler, Response } from "express";
import mssql from "mssql";
import { userSchema } from "../models/user-schema";
import { logInSchema } from "../models/user-login";
import { RegisterSchema } from "../models/register-schema";
import sqlConfig from "../config/config";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();

interface RequestExtended extends Request {
  user?: any;
}

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
    const hashedPassword = await bcrypt.hash(password, 10);
    let pool = await mssql.connect(sqlConfig);
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.json(error.details[0].message);
    } else {
      await pool
        .request()
        .input("id", mssql.VarChar, id)
        .input("userName", mssql.VarChar, userName)
        .input("fullName", mssql.VarChar, fullName)
        .input("email", mssql.VarChar, email)
        .input("age", mssql.Numeric, age)
        .input("password", mssql.VarChar, hashedPassword)
        .input("role", mssql.VarChar, role)
        .execute("createUsers");

      res.status(200).json({
        message: "User Created Successfully!",
      });
    }
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

export const deleteUser = async (req: RequestExtended, res: Response) => {
  try {
    const id = req.params.id;
    let pool = await mssql.connect(sqlConfig);
    const user = await pool
      .request()
      .input("id", mssql.VarChar, id)
      .execute("getUserById");
    if (!user.recordset[0]) {
      return res.json({
        message: `User with ID : ${id} Does Not exist`,
      });
    }

    await pool.request().input("id", mssql.VarChar, id).execute("deleteUser");
    res.status(200).json({
      message: "User Successfully deleted",
      deletedBy: req.body.users.fullName,
    });
  } catch (error: any) {
    res.json({
      error: error.message,
    });
  }
};

export const loginUser: RequestHandler = async (req, res) => {
  try {
    let pool = await mssql.connect(sqlConfig);
    const { userName, password } = req.body as {
      userName: string;
      password: string;
    };
    // Check if email and password exist
    if (!userName || !password) {
      return res.status(400).json({
        message: "Please provide email and password!",
      });
    }

    const { error } = logInSchema.validate(req.body);
    if (error) {
      return res.json({
        error: error.details[0].message,
      });
    }

    const user = await pool
      .request()
      .input("userName", mssql.VarChar, userName)
      .execute("getUserByUserName");

    if (!user.recordset[0]) {
      return res.json({ message: `Invalid credentials` });
    }
    const passwordMatch = await bcrypt.compare(
      password,
      user.recordset[0].password
    );
    if (!passwordMatch) {
      return res.json({ message: `Invalid credentials` });
    }

    const { password: _, ...details } = user.recordset[0];

    const token = await jwt.sign(
      { id: details.id },
      process.env.SECRET_KEY as string,
      { expiresIn: "24h" }
    );

    res.json({ message: "Login Successfulll", user: details, token });
  } catch (error: any) {
    res.json({
      error: error.message,
    });
  }
};

export const resetPassWord: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    let pool = await mssql.connect(sqlConfig);
    const { error } = RegisterSchema.validate(req.body);
    if (error) {
      return res.json(error.details[0].message);
    }
    const { password } = req.body as { password: string };
    const user = await pool
      .request()
      .input("id", mssql.VarChar, id)
      .execute("getUserById");
    if (!user.recordset[0]) {
      return res.json({
        message: `No user with that ID ${id}`,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool
      .request()
      .input("id", mssql.VarChar, id)
      .input("password", mssql.VarChar, hashedPassword)
      .execute("resetPassWord");
    res.status(200).json({
      messege: "Password reset was successful",
    });
  } catch (error: any) {
    res.json({
      error: error.message,
    });
  }
};

export const homePage = (req: RequestExtended, res: Response) => {
  res.json({
    Message: `Hello user ${req.body.users.fullname} Welcome..`,
  });
};
