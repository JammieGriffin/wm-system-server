import { dbConf } from "../../const";
import { NextFunction, Response } from "express";
import { IRouterConf } from "./index";
import hexoid from "hexoid";
import { check } from "express-validator";
import { pmcSql } from "../sql/pmc";
import { ICargo, ICargoType } from "../types/pmcTypes";
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const db = mysql.createConnection({
  ...dbConf,
  multipleStatements: true,
  namedPlaceholders: true,
});

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
      "/getUsageCargoTypes",
      (req: any, res: Response, next: NextFunction) => {
        db.query(pmcSql.queryUsageCargoTypes, (err: any, result: any) => {
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
        let tmpSql = [pmcSql.queryCid, pmcSql.queryCargos];
        const { ctid, keyWord } = req.query;
        if (ctid && keyWord) {
          tmpSql[1] += ` where cg.cname like '%${keyWord}%' and ct.ctid=${ctid}`;
        } else if (ctid) {
          tmpSql[1] += ` where ct.ctid=${ctid}`;
        } else if (keyWord) {
          tmpSql[1] += ` where cg.cname like '%${keyWord}%'`;
        }
        const sql = `${tmpSql[0]};${tmpSql[1]}`;
        db.query(sql, (err: any, result: any) => {
          if (err) {
            next(new Error(`500:${err.sqlMessage}`));
          }
          const cargos: Array<ICargo> = [];
          Array.from(
            result[0].map((item: { cid: string; quantity: number }) => {
              //return item.cid;
              return item;
            }),
            (item: { cid: string; quantity: number }) => {
              const tags: Array<ICargoType> = [];
              let cname: string = "";

              result[1].forEach((data: ICargo, index: number) => {
                if (data.cid === item.cid) {
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
                cargos.push({
                  cid: item.cid,
                  cname: cname,
                  tags: [...tags],
                  quantity: item.quantity,
                });
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
  {
    path: "/pmc",
    router: router.get(
      "/getAllCargoTypes",
      (req: any, res: Response, next: NextFunction) => {
        db.query(pmcSql.queryAllCargoTypes, (err: any, result: any) => {
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
    router: router.post(
      "/addCargo",
      async (req: any, res: Response, next: NextFunction) => {
        const { cname, tags } = req.body;
        const hexid = hexoid(32)();
        const cid = hexid;
        db.query(pmcSql.addCargo, [cid, cname], (err: any, _result: any) => {
          if (err) {
            next(new Error(`500:${err.sqlMessage}`));
          }
          tags.forEach((ctid: number) => {
            db.query(
              pmcSql.addCargo_Type,
              [cid, ctid],
              (err: any, _result: any) => {
                if (err) {
                  next(new Error(`500:${err.sqlMessage}`));
                }
              }
            );
          });
          res.send({
            success: true,
            message: "添加成功",
          });
        });
      }
    ),
  },
  {
    path: "/pmc",
    router: router.post(
      "/updateCargoTypes",
      (req: any, res: Response, next: NextFunction) => {
        const { cid, del, add } = req.body;
        if (add.length > 0) {
          add.forEach((ctid: number) => {
            db.query(
              pmcSql.addCargo_Type,
              [cid, ctid],
              (err: any, _result: any) => {
                if (err) {
                  next(new Error(`500:${err.sqlMessage}`));
                }
              }
            );
          });
        }
        if (del.length > 0) {
          del.forEach((ctid: number) => {
            db.query(
              pmcSql.delCargo_Type,
              [cid, ctid],
              (err: any, _result: any) => {
                if (err) {
                  next(new Error(`500:${err.sqlMessage}`));
                }
              }
            );
          });
        }
        res.send({
          success: true,
          message: "修改成功",
        });
      }
    ),
  },
  {
    path: "/pmc",
    router: router.get(
      "/getDistributeData",
      (req: any, res: Response, next: NextFunction) => {
        const { cid } = req.query;
        db.query(pmcSql.queryDistributeData, [cid], (err: any, result: any) => {
          err
            ? next(new Error(`500:${err.sqlMessage}`))
            : res.send({ success: true, result });
        });
      }
    ),
  },
  {
    path: "/pmc",
    router: router.delete(
      "/delCargo",
      (req: any, res: Response, next: NextFunction) => {
        const { cid } = req.query;
        db.query(pmcSql.delCargo, { cid }, (err: any, _result: any) => {
          err
            ? next(new Error(`500:${err.sqlMessage}`))
            : res.send({ message: "删除成功" });
        });
      }
    ),
  },
];

export default pmcApi;
