export const pmcSql = {
  addCargoType:"insert into `cargotypes`(`typeName`) values(?)",
  queryCargoTypes:"select cts.ctid,cts.typeName,count(1) as `num` from cargo_type as ct "+
    "left join cargotypes as cts on ct.ctid = cts.ctid group by ct.ctid",
  
  queryCargos:"select ct.cid,cg.cname,ct.ctid,cts.typeName from cargo_type as ct "+
    "left join cargotypes as cts on ct.ctid = cts.ctid left join cargo as cg on ct.cid = cg.cid",
  queryCid:"select distinct cid from cargo_type",
};