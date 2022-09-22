import { Express, Request, Response, Router } from "express";
import sysApi from "./sys";
import consoleApi from "./console";
import warehouseApi from "./warehouse";

interface IRouterConf {
  path: string;
  router: Router;
  meta?: unknown;
}

const RouterConf: Array<IRouterConf> = [
  ...sysApi,
  ...consoleApi,
  ...warehouseApi,
];

function routes(app: Express): void {
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("hello express");
  });

  RouterConf.forEach((conf) => {
    app.use(conf.path, conf.router);
  });
}

export { routes, IRouterConf };
