export const pmcSql = {
  addCargoType: "insert into `cargotypes`(`typeName`) values(?)",

  queryUsageCargoTypes:
    "select cts.ctid,cts.typeName,count(1) as `num` from cargo_type as ct " +
    "left join cargotypes as cts on ct.ctid = cts.ctid group by ct.ctid",

  queryAllCargoTypes: "select ctid,typeName from cargotypes",

  queryCargos:
    `select ct.cid,cg.cname,ct.ctid,cts.typeName from cargo_type as ct ` +
    `left join cargotypes as cts on ct.ctid = cts.ctid left join cargo as cg on ct.cid = cg.cid`,
  queryCid: "select distinct cid,quantity from cargo",

  addCargo: "insert into `cargo`(`cid`,`cname`) values(?,?)",
  addCargo_Type: "insert into `cargo_type`(`cid`,`ctid`) values(?,?)",
  delCargo_Type: "delete from `cargo_type` where cid=? and ctid=?",

  queryDistributeData:
    "select sto.count,wh.houseName from store as sto " +
    "left join warehouse as wh on sto.hid = wh.hid where cid = ?",

  delCargo:
    "delete from trading where cid = :cid;delete from cargo_type where cid = :cid;delete from cargo where cid = :cid",
};
