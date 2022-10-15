import { dbConf } from "../../const";
import { NextFunction, Response } from "express";
import { IRouterConf } from "./index";
import hexoid from "hexoid";
import { staffSql } from "../sql/staff";
import { check } from "express-validator";
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const db = mysql.createConnection({
  ...dbConf,
  multipleStatements: true,
  namedPlaceholders: true,
});

const staffApi: Array<IRouterConf> = [
  {
    path: "/staff",
    router: router.post(
      "/addStaff",
      (req: any, res: Response, next: NextFunction) => {
        const { usrName, wno, sex, phone, usrType } = req.body;
        const uid = hexoid(32)();
        db.query(
          staffSql.addStaff,
          { usrName, wno, sex, phone, usrType, uid, pwd: "123456" },
          (err: any, result: any) => {
            if (err) {
              if (err.sqlState === "23000") {
                next(new Error(`500:所添加的工号已存在`));
              }
              next(new Error(`500:${err.sqlMessage}`));
            } else {
              res.send({
                success: true,
                message: "添加成功",
              });
            }
          }
        );
      }
    ),
  },
  {
    path: "/staff",
    router: router.get(
      "/getStaffInfo",
      (req: any, res: Response, next: NextFunction) => {
        const { keyWord, queryType } = req.query;
        console.log(keyWord, queryType);
        if (!keyWord && !queryType) {
          const sql = staffSql.queryStaffInfo + staffSql.options.suffix;
          db.query(sql, (err: any, result: any) => {
            if (err) {
              next(new Error(`500:${err.sqlMessage}`));
            } else {
              res.send({
                success: true,
                result,
              });
            }
          });
        } else {
          const { queryStaffInfo, options } = staffSql;
          const sql = queryStaffInfo + options[queryType] + options.suffix;
          db.query(sql, [`%${keyWord}%`], (err: any, result: any) => {
            if (err) {
              next(new Error(`500:${err.sqlMessage}`));
            } else {
              res.send({
                success: true,
                result,
              });
            }
          });
        }
      }
    ),
  },
  {
    path: "/staff",
    router: router.post(
      "/allocWarehouse",
      (req: any, res: Response, next: NextFunction) => {
        const { hid, currentHid, houseName, uid, usrName, wno, isPrincipal } =
          req.body;
        if (isPrincipal) {
          // hid存在 -> 添加或更新
          if (hid) {
            // 检查仓库是否已存在负责人
            db.query(
              staffSql.checkHousePrincipal,
              [hid],
              (err: any, result: any) => {
                if (err) {
                  next(new Error(`500:${err.sqlMessage}`));
                } else {
                  console.log(result);
                  // 仓库不存在负责人 -> 添加
                  if (result.length === 0) {
                    db.query(
                      staffSql.addAllocRelation,
                      { hid, uid },
                      (err: any, _result: any) => {
                        if (err) {
                          next(new Error(`500:${err.sqlMessage}`));
                        } else {
                          res.send({
                            success: true,
                            message: "分配成功",
                          });
                        }
                      }
                    );
                  } else {
                    // 更新目标仓库负责人
                    db.query(
                      staffSql.updateAllocRelation,
                      { hid, uid },
                      (err: any, _result: any) => {
                        if (err) {
                          next(new Error(`500:${err.sqlMessage}`));
                        } else {
                          res.send({
                            success: true,
                            message: "分配成功",
                          });
                        }
                      }
                    );
                  }
                }
              }
            );
          } else {
            // hid不存在 -> 删除负责人与仓库的关系
            db.query(
              staffSql.delAllocRelation,
              { uid },
              (err: any, _result: any) => {
                if (err) {
                  next(new Error(`500:${err.sqlMessage}`));
                } else {
                  res.send({
                    success: true,
                    message: "分配成功",
                  });
                }
              }
            );
          }
        } else {
          let sql;
          if (hid && currentHid) {
            sql = staffSql.updateAllocRelation;
          } else if (!hid && currentHid) {
            sql = staffSql.delAllocRelation;
          } else if (hid && !currentHid) {
            sql = staffSql.addAllocRelation;
          }
          db.query(sql, { hid, uid }, (err: any, result: any) => {
            if (err) {
              next(new Error(`500:${err.sqlMessage}`));
            } else {
              res.send({
                success: true,
                message: "分配成功",
              });
            }
          });
        }
      }
    ),
  },
  {
    path: "/staff",
    router: router.delete(
      "/delAllocRelation",
      (req: any, res: Response, next: NextFunction) => {
        const { uid } = req.query;

        db.query(staffSql.delAllocRelation, {uid}, (err: any, result: any) => {
          err
            ? next(new Error(err.sqlMessage))
            : res.send({ success: true, message: "删除成功" });
        });
      }
    ),
  },
];
export default staffApi;
