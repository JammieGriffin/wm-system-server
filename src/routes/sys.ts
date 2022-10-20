import { dbConf } from "../../const";
import { Response, Router, Express, NextFunction } from "express";
import { IRouterConf } from ".";
import { ILoginData } from "../types/sysType";
import { createToken } from "../utils/jwt";
import { sysSql } from "../sql/system";
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const db = mysql.createConnection(dbConf);
const hexoid = require("hexoid");
const toHex32 = hexoid(32);
const sysApi: Array<IRouterConf> = [
  {
    path: "/sys",
    router: router.post("/login", (req: any, res: Response) => {
      // const reqdata: ILoginData = req.body;
      const { account, pwd } = req.body;
      // const sql = `select * from user where wno=${reqdata.account}`;
      db.query(sysSql.login, [account], (err: any, result: any) => {
        if (err) {
          throw err;
        }
        if (result.length === 1) {
          const { uid, wno, pwd, usrType, sex, usrName, phone } = result[0];
          if (pwd === pwd) {
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
                usrType,
                sex,
                usrName,
                phone,
              },
            });
          } else {
            res.send({
              success: false,
              message: "密码错误",
            });
          }
        } else {
          res.send({
            success: false,
            message: "该账号不存在，请注册",
          });
        }
      });
    }),
  },
  {
    path: "/sys",
    router: router.post("/register", (req: any, res: Response) => {
      const sql_checkAcc = `select wno from user where wno=${req.body.account}`;
      db.query(sql_checkAcc, (err: any, result: any) => {
        if (err) {
          throw err;
        }
        if (result.length === 0) {
          const uid = toHex32();
          const { account, pwd, phone, sex, usrName } = req.body;
          const sql_addUsr = `insert into \`user\` (\`uid\`,\`wno\`,\`pwd\`,\`usrType\`,\`sex\`,\`usrName\`,\`phone\`) values ('${uid}','${account}','${pwd}','staff','${sex}','${usrName}','${phone}')`;
          db.query(sql_addUsr, (err: any, result: any) => {
            if (err) {
              res.send({
                success: false,
                errono: err.errno,
                message: err.sqlMessage,
              });
              throw err;
            }
            const token = createToken({
              uid: uid,
              wno: account,
              date: Date.now(),
            });
            res.send({
              success: true,
              message: "注册成功",
              result: {
                uid: uid,
                wno: account,
                userType: "staff",
                sex: sex,
                usrName: usrName,
                phone: phone,
              },
              token: token,
              timestap: Date.now(),
            });
          });
        } else {
          res.send({
            success: false,
            message: "该账号已经存在",
          });
        }
      });
    }),
  },
  {
    path: "/sys",
    router: router.delete(
      "/del",
      (req: any, res: Response, next: NextFunction) => {
        const { uid } = req.query;
        
        db.query(sysSql.delUsr, [uid], (err: any, result: any) => {
          err
            ? next(new Error(err.sqlMessage))
            : res.send({ success: true, message: "删除成功" });
        });
      }
    ),
  },
];

export default sysApi;
