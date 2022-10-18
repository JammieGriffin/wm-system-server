import { dbConf } from "../../const";
import { NextFunction, Response } from "express";
import { IRouterConf } from ".";
import { consoleSql } from "../sql/console";

const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const db = mysql.createConnection({ ...dbConf, multipleStatements: true });

const consoleApi: Array<IRouterConf> = [
  {
    path: "/ctrl",
    router: router.get("/queryOverviewData", (req: any, res: Response) => {
      const date = new Date().toLocaleDateString().replace(/\//g, "-");
      db.query(
        consoleSql.queryOverviewData,
        [`${date}%`],
        (err: any, result: any) => {
          if (err) throw err;
          console.log(result);

          res.send({
            success: true,
            result: {
              ...result[0][0],
              ...result[1][0],
              trading: [...result[2]],
            },
          });
        }
      );
    }),
  },
  {
    path: "/ctrl",
    router: router.get(
      "/getLatestTrading",
      (req: any, res: Response, next: NextFunction) => {
        const now: number = Date.now();
        const weekAgo = now - 604800000;
        const today = new Date(now).toLocaleDateString().replace(/\//g, "-");
        const lastWeek = new Date(weekAgo)
          .toLocaleDateString()
          .replace(/\//g, "-");
        console.log(today, lastWeek);

        db.query(
          consoleSql.queryLatestTrading,
          [lastWeek, today],
          (err: any, result: any) => {
            err
              ? next(new Error(`500:${err.sqlMessage}`))
              : res.send({ success: true, result });
          }
        );
      }
    ),
  },
  {
    path: "/ctrl",
    router: router.get(
      "/getCapacityUsage",
      (req: any, res: Response, next: NextFunction) => {
        db.query(consoleSql.queryCapacityUsage, (err: any, result: any) => {
          err
            ? next(new Error(`500:${err.sqlMessage}`))
            : res.send({ success: true, result });
        });
      }
    ),
  },
];
export default consoleApi;
