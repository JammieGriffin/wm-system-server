import { dbConf } from "../../const";
import { Response, Router,Express} from "express";
import { IRouterConf } from ".";
import { ILoginData } from "../types/sysType";
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const db = mysql.createConnection(dbConf);
const sysApi:Array<IRouterConf> = [
  {
    path:'/sys',
    router: router.post('/login',(req:any,res:Response) =>{
      
      const reqdata:ILoginData = req.body;
      const sql = `select * from user where wno=${reqdata.account} and pwd=${reqdata.pwd}`;
      db.query(sql,(err: any,res: any) => {
        if (err) {
          throw err
        }
        
        
      })
    })
  }
];

export default sysApi;