import { dbConf } from "../../const";
import { Response } from "express";
import { IRouterConf } from ".";
import hexoid from "hexoid";

const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const db = mysql.createConnection({ ...dbConf, multipleStatements: true });
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
  {
    path: "warehouse",
    router: router.get("/getWarehouseList", (req: any, res: Response) => {
      const sql = `select h.hid,h.houseName,h.houseArea,h.capacity,ht.typeName,hs.hsid,hs.style,hs.value from warehouse as h left join house_type as ht on h.houseType=ht.htid left join house_status as hs on h.houseStatus=hs.hsid`;
      db.query(sql, (err: any, result: any) => {
        if (err) {
          res.send({
            success: false,
            message: err.sqlMessage,
          });
          throw err;
        }
        res.send({
          success: true,
          result: result,
        });
      });
    }),
  },
  {
    path: "warehouse",
    router: router.post("/rename", (req: any, res: Response) => {
      const { hid, newName } = req.body;
      const sql = `update warehouse set houseName='${newName}' where hid='${hid}'`;
      db.query(sql, (err: any, result: any) => {
        if (err) {
          res.send({
            success: false,
            message: "更新仓库名称失败",
          });
          throw err;
        }
        res.send({
          success: true,
          message: "更新成功",
        });
      });
    }),
  },
  {
    path: "warehouse",
    router: router.post("/changeHouseType", (req: any, res: Response) => {
      console.log(req.body);
      const sql = `update warehouse set houseStatus = '${req.body.hsid}' where hid='${req.body.id}'`;
      db.query(sql, (err: any, result: any) => {
        if (err) {
          res.send({
            success: false,
            message: "更新仓库状态失败",
          });
          throw err;
        }
        res.send({
          success: true,
          message: "更新成功",
        });
      });
    }),
  },
  {
    path: "warehouse",
    router: router.delete("/delHouse", (req: any, res: Response) => {
      console.log(req.query);

      const sql = `delete from warehouse where hid='${req.query.id}'`;
      db.query(sql, (err: any, result: any) => {
        if (err) {
          res.send({
            success: false,
            message: "删除仓库失败",
          });
          throw err;
        }
        console.log(result);

        res.send({
          success: true,
          message: "删除成功",
        });
      });
    }),
  },
  {
    path: "/warehouse/detial",
    router: router.get("/queryBaseInfo", (req: any, res: Response) => {
      const queryHouseInfo =
        `select h.hid,h.houseName,h.houseAddr,h.capacity,h.houseArea,hs.style,hs.value,ht.typeName ` +
        `from warehouse as h inner join house_status as hs on h.houseStatus = hs.hsid ` +
        `inner join house_type as ht on h.houseType = ht.htid where h.hid = '${req.query.id}'`;

      const queryHouseStaff =
        `select hm.uid,usr.usrName,usr.usrType from house_manage as hm ` +
        `inner join \`user\` as usr on hm.uid = usr.uid where hm.hid = '${req.query.id}'`;
      const sql = `${queryHouseInfo};${queryHouseStaff}`;
      db.query(sql, (err: any, result: any) => {
        if (err) {
          res.send({
            success: false,
            message: "查询仓库基础信息失败",
          });
          throw err;
        }
        const member = [ ...result[1] ];
        res.send({
          success: true,
          result: {
            ...result[0][0],
            member,
          },
        });
      });
    }),
  },
  {
    path:"/warehouse/detial",
    router: router.post("/updateBaseInfo",(req:any,res:Response) => {
      
    })
  }
];
export default warehouseApi;
