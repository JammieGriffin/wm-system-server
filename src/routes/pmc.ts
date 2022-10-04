import { dbConf } from "../../const";
import { NextFunction, Response } from "express";
import { IRouterConf } from ".";
import hexoid from "hexoid";
import { check } from "express-validator";
import { pmcSql } from "../sql/pmc";
import { ICargo, ICargoType } from "../types/pmcTypes";
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const db = mysql.createConnection({ ...dbConf, multipleStatements: true });

const pmcApi: Array<IRouterConf> = [
  {
    path: "/pmc",
    router: router.post(
      "/addCargoType",
      (req: any, res: Response, next: NextFunction) => {
        db.query(
          pmcSql.addCargoType,
          [req.body.typeName],
          (err: any, result: any) => {
            if (err) {
              next(new Error(`500:${err.sqlMessage}`));
            }
            res.send({
              success: true,
              message: "添加成功",
              ctid: result.insertId,
            });
          }
        );
      }
    ),
  },
  {
    path: "/pmc",
    router: router.get(
      "/getCargoTypes",
      (req: any, res: Response, next: NextFunction) => {
        db.query(pmcSql.queryCargoTypes, (err: any, result: any) => {
          if (err) {
            next(new Error(`500:${err.sqlMessage}`));
          }
          res.send({
            success: true,
            result,
          });
        });
      }
    ),
  },
  {
    path: "/pmc",
    router: router.get(
      "/getCargos",
      (req: any, res: Response, next: NextFunction) => {
        console.log(req.query);
        let tmpSql = [pmcSql.queryCid,pmcSql.queryCargos];
        const { ctid, keyword } = req.query;
        if (ctid && keyword){
          tmpSql[0] += ` where ct.ctid=${ctid}'`;
          tmpSql[1] += ` where cg.cname like '%${keyword}%'`
        }
        else if (ctid) tmpSql[0] += ` where ctid=${ctid}`;
        else if (keyword) tmpSql[1] += ` where cg.cname like '%${keyword}%'`;
        const sql = `${tmpSql[0]};${tmpSql[1]}`;
        console.log(sql);
        
        db.query(sql, (err: any, result: any) => {
          if (err) {
            next(new Error(`500:${err.sqlMessage}`));
          }
          console.log(result);
          
          const cargos: Array<ICargo> = [];
          Array.from(
            result[0].map((item: { cid: string }) => {
              return item.cid;
            }),
            (cid: string) => {
              const tags: Array<ICargoType> = [];
              let cname: string = "";
              result[1].forEach((data: ICargo, index: number) => {
                if (data.cid === cid) {
                  cname === "" ? (cname = data.cname) : cname;
                  if (data.ctid) {
                    tags.push({
                      ctid: data.ctid as number,
                      typeName: data.typeName as string,
                    });
                  }
                }
              });
              if (cname) {
                cargos.push({ cid: cid, cname: cname, tags: [...tags] });
              }
            }
          );
          res.send({
            success: true,
            result: cargos,
          });
        });
      }
    ),
  },
];

export default pmcApi;
