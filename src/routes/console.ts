import { dbConf } from "../../const";
import { Response } from "express";
import { IRouterConf } from ".";

const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const db = mysql.createConnection({ ...dbConf, multipleStatements: true });

const consoleApi: Array<IRouterConf> = [
  {
    path: "/ctrl",
    router: router.get("/queryOverviewData", (req: any, res: Response) => {
      const sql = `select count(\`hid\`) from warehouse;select count(1) from \`user\` where \`usrType\` != 'admin'`;

      db.query(sql, (err: any, result: any) => {
        if (err) throw err;
        result.forEach((e: any) => {
          console.log(e);
        });
      });
    }),
  },
];
export default consoleApi;
