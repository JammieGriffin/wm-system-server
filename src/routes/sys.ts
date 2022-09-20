import { dbConf } from "../../const";
import { Response, Router, Express } from "express";
import { IRouterConf } from ".";
import { ILoginData } from "../types/sysType";
import { createToken } from "../utils/jwt";
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const db = mysql.createConnection(dbConf);
const hexoid = require("hexoid");
const sysApi: Array<IRouterConf> = [
  {
    path: "/sys",
    router: router.post("/login", (req: any, res: Response) => {
      const reqdata: ILoginData = req.body;
      const sql = `select * from user where wno=${reqdata.account} and pwd=${reqdata.pwd}`;
      db.query(sql, (err: any, result: any) => {
        if (err) {
          throw err;
        }
        if (result.length === 1) {
          const { uid, wno, pwd, userType, sex, usrName, phone } = result[0];
          const token = createToken({
            uid: uid,
            wno: wno,
            date: Date.now(),
          });
          res.send({
            success: true,
            token: token,
            result: {
              uid,
              wno,
              userType,
              sex,
              usrName,
              phone,
            },
          });
        } else {
          res.send({
            success: false,
            result: "账号或密码错误",
          });
        }
      });
    }),
  },
];

export default sysApi;
