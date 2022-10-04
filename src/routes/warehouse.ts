import { dbConf } from "../../const";
import { NextFunction, Response } from "express";
import { IRouterConf } from ".";
import hexoid from "hexoid";
import { check } from "express-validator";
import { warehouseSql } from "../sql/warehouse";
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const db = mysql.createConnection({ ...dbConf, multipleStatements: true });
const toHex32 = hexoid(32);
const warehouseApi: Array<IRouterConf> = [
  {
    path: "/warehouse",
    router: router.post(
      "/newHouse",
      check("name").notEmpty(),
      check("type").notEmpty().isInt(),
      check("area").notEmpty().isInt(),
      check("capacity").notEmpty().isInt(),
      check("typeName").notEmpty(),
      (req: any, res: Response, next: NextFunction) => {
        const { name, type, area, capacity, typeName } = req.body;
        let hid = hexoid(32)();
        if (typeName) {
          db.query(
            warehouseSql.addNewHouseType,
            [typeName],
            (err: any, result: any) => {
              if (err) {
                next(new Error(`500:${err.sqlMessage}`));
              }
              console.log(result);

              const typeId = result.insertId;
              db.query(
                warehouseSql.addNewHouse,
                [hid, name, typeId, area, capacity],
                (err: any, result: any) => {
                  if (err) {
                    next(new Error(`500:${err.sqlMessage}`));
                  }
                  res.send({
                    success: true,
                    message: "新建成功",
                  });
                }
              );
            }
          );
        } else {
          db.query(
            warehouseSql.addNewHouse,
            [hid, name, type, area, capacity],
            (err: any, result: any) => {
              if (err) {
                next(new Error(`500:${err.sqlMessage}`));
              }
              res.send({
                success: true,
                message: "新建成功",
                result: {
                  hid: hid,
                },
              });
            }
          );
        }
      }
    ),
  },
  {
    path: "/warehouse",
    router: router.get(
      "/getHouseTypeList",
      (req: any, res: Response, next: NextFunction) => {
        db.query(warehouseSql.queryWarehouseType, (err: any, result: any) => {
          if (err) {
            next(new Error(`500:${err.sqlMessage}`));
          }
          res.send({
            success: true,
            result: result,
          });
        });
      }
    ),
  },
  {
    path: "warehouse",
    router: router.get(
      "/getWarehouseList",
      (req: any, res: Response, next: NextFunction) => {
        db.query(warehouseSql.queryWarehouse, (err: any, result: any) => {
          if (err) {
            next(new Error(`500:${err.sqlMessage}`));
          }
          res.send({
            success: true,
            result: result,
          });
        });
      }
    ),
  },
  {
    path: "warehouse",
    router: router.post(
      "/rename",
      (req: any, res: Response, next: NextFunction) => {
        const { hid, newName } = req.body;
        db.query(
          warehouseSql.updateHouseName,
          [newName, hid],
          (err: any, result: any) => {
            if (err) {
              next(new Error(`500:${err.sqlMessage}`));
            }
            res.send({
              success: true,
              message: "更新成功",
            });
          }
        );
      }
    ),
  },
  {
    path: "warehouse",
    router: router.post(
      "/changeHouseType",
      check("hsid").notEmpty().isInt(),
      check("id").notEmpty(),
      (req: any, res: Response, next: NextFunction) => {
        const { hsid, id } = req.body;
        db.query(
          warehouseSql.updateHouseType,
          [hsid, id],
          (err: any, result: any) => {
            if (err) {
              next(new Error(`500:${err.sqlMessage}`));
            }
            res.send({
              success: true,
              message: "更新成功",
            });
          }
        );
      }
    ),
  },
  {
    path: "warehouse",
    router: router.delete(
      "/delHouse",
      check("id").notEmpty(),
      (req: any, res: Response, next: NextFunction) => {
        db.query(
          warehouseSql.delWarehouse,
          [req.query.id],
          (err: any, result: any) => {
            if (err) {
              next(new Error(`500:${err.sqlMessage}`));
            }

            res.send({
              success: true,
              message: "删除成功",
            });
          }
        );
      }
    ),
  },
  {
    path: "/warehouse/detial",
    router: router.get(
      "/queryBaseInfo",
      check("id").notEmpty(),
      (req: any, res: Response, next: NextFunction) => {
        const hid = req.query.id;
        const sql = `${warehouseSql.queryWarehouseInfo};${warehouseSql.queryWarehouseStaff}`;
        db.query(sql, [hid, hid], (err: any, result: any) => {
          if (err) {
            next(new Error(`500:${err.sqlMessage}`));
          }
          const member = [...result[1]];
          res.send({
            success: true,
            result: {
              ...result[0][0],
              member,
            },
          });
        });
      }
    ),
  },
  {
    path: "/warehouse/detial",
    router: router.get(
      "/getWarehouseStatus",
      (req: any, res: Response, next: NextFunction) => {
        db.query(warehouseSql.queryWarehouseStatus, (err: any, result: any) => {
          if (err) {
            next(new Error(`500:${err}`));
          }
          res.send({
            success: true,
            result: result,
          });
        });
      }
    ),
  },
  {
    path: "/warehouse/detial",
    router: router.post(
      "/updateBaseInfo",
      (req: any, res: Response, next: NextFunction) => {
        console.log(req.body);
        const {
          houseName,
          houseId,
          houseAddr,
          houseArea,
          houseType,
          status,
          capacity,
        } = req.body;
        db.query(warehouseSql.updateBaseInfo, [
          houseName,
          houseAddr,
          houseType.htid,
          status.hsid,
          houseArea,
          capacity,
          houseId,
        ],((err:any,result:any) => {
          if (err) {
            next(new Error(`500:${err}`));

          }
          res.send({
            success:true,
            message:"仓库信息已更新"
          });
          
        }));
      }
    ),
  },
];
export default warehouseApi;
