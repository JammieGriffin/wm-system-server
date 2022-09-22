import { dbConf } from "../../const";
import { Response } from "express";
import { IRouterConf } from ".";
import hexoid from "hexoid";

const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const db = mysql.createConnection({ ...dbConf });
const toHex32 = hexoid(32);
const warehouseApi: Array<IRouterConf> = [
  {
    path: "/warehouse",
    router: router.post("/newHouse", (req: any, res: Response) => {
      const { name, type, area, capacity, typeName } = req.body;
      const hid = toHex32();
      const sql_newType = `insert into \`house_type\` (\`value\`) values ('${typeName}')`;
      const sql_newHouse = `insert into \`warehouse\` (\`hid\`,\`houseStatus\`,\`houseName\`,\`houseAddr\`,\`houseType\`,\`houseArea\`,\`capacity\`) values('${hid}','1','${name}','未设置','${type}','${capacity}','${area}')`;
      if (typeName) {
        db.query(sql_newType, (err: any, result: any) => {
          if (err) {
            res.send({
              success: false,
              message: "新增仓库类型失败",
            });
            throw err;
          }
          const typeId = result.insertId;
          const sql_newHouse_newType = `insert into \`warehouse\` (\`hid\`,\`houseStatus\`,\`houseName\`,\`houseAddr\`,\`houseType\`,\`houseArea\`,\`capacity\`) values('${hid}','1','${name}','未设置','${typeId}','${capacity}','${area}')`;
          db.query(sql_newHouse_newType, (err: any, result: any) => {
            if (err) {
              res.send({
                success: false,
                message: "新建仓库失败",
              });
              throw err;
            }
            res.send({
              success: true,
              message: "新建成功",
              result: {
                hid: hid,
              },
            });
          });
        });
      } else {
        db.query(sql_newHouse, (err: any, result: any) => {
          if (err) {
            res.send({
              success: false,
              message: "新建仓库失败",
            });
            throw err;
          }
          res.send({
            success: true,
            message: "新建成功",
            result: {
              hid: hid,
            },
          });
        });
      }
    }),
  },
  {
    path: "/warehouse",
    router: router.get("/queryHouseTypeList", (req: any, res: Response) => {
      const sql = `select * from \`house_type\``;
      db.query(sql, (err: any, result: any) => {
        if (err) {
          res.send({
            success: false,
            message: "获取仓库类型列表失败",
          });
        }
        res.send({
          success: true,
          result: result,
        });
      });
    }),
  },
];
export default warehouseApi;
