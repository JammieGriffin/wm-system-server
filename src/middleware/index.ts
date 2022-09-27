import express, { Request, Response, NextFunction, Express } from "express";
import { checkToken } from "../utils/jwt";

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    next();
  } else {
    let whiteList = ["/sys/login", "/sys/register", "/sys/resetPwd"].includes(
      req.url
    );
    if (!whiteList) {
      const token = req.headers.usrtoken;
      const auth = checkToken(token as string);
      auth
        .then(() => {
          next();
        })
        .catch(() => {
          next(new Error("401:token失效请重新登录"));
        });
    } else {
      next();
    }
  }
};
const errHandler = (
  err: Error,
  req: any,
  res: Response,
  next: NextFunction
) => {
  const errInfo = err.message.split(":");
  const code = errInfo[0];
  const msg = errInfo[1];
  res.status(Number(code)).send(msg);
};

export { checkAuth, errHandler };
