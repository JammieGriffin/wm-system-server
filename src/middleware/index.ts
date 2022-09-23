import express, { Request, Response, NextFunction, Express } from "express";
import { checkToken } from "../utils/jwt";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    next();
  } else {
    let whiteList = ["/sys/login", "/sys/register", "/sys/resetPwd"].includes(
      req.url
    );
    if (!whiteList) {
      const token = req.headers.usrtoken;
      checkToken(token as string).then((res) => {
        console.log(res);
        
        next();
        
      }).catch((err) => {
        res.status(401).send("permission denied")
      })
    } else {
      next();
    }
  }
  
};

export default checkAuth;
