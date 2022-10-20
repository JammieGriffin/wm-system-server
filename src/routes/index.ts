import { Express, Request, Response, Router } from "express";
import sysApi from "./sys";
import consoleApi from "./console";
import warehouseApi from "./warehouse";
import pmcApi from "./pmc";
import staffApi from "./staff";
import { checkAuth,errHandler } from "../middleware/index";

interface IRouterConf {
  path: string;
  router: Router;
  meta?: unknown;
}

const RouterConf: Array<IRouterConf> = [
  ...sysApi,
  ...consoleApi,
  ...warehouseApi,
  ...pmcApi,
  ...staffApi
];

function routes(app: Express): void {
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("hello express");
  });
  app.use(checkAuth)
  RouterConf.forEach((conf) => {
    app.use(conf.path, conf.router);
  });
  app.use(errHandler)
}

export { routes, IRouterConf };
