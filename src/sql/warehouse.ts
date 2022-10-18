export const warehouseSql = {
  addNewHouseType: "insert into `house_type`(`typeName`) values(?)",
  addNewHouse:
    "insert into `warehouse` " +
    "(`hid`,`houseStatus`,`houseName`,`houseAddr`,`houseType`,`houseArea`,`capacity`) " +
    "values(?,4,?,'未设置',?,?,?)",

  queryWarehouse:
    "select h.hid,h.houseName,h.houseArea,h.capacity,ht.typeName,hs.hsid,hs.style,hs.value " +
    "from warehouse as h left join house_type as ht on h.houseType=ht.htid " +
    "left join house_status as hs on h.houseStatus=hs.hsid",

  updateHouseName: "update warehouse set houseName=? where hid=?",

  updateHouseType: "update warehouse set houseStatus = ? where hid = ?",

  delWarehouse: "delete from warehouse where hid = ?",

  queryWarehouseInfo:
    "select h.hid,h.houseName,h.houseAddr,h.capacity,h.houseArea,hs.hsid,hs.style,hs.value,ht.htid,ht.typeName " +
    "from warehouse as h inner join house_status as hs on h.houseStatus = hs.hsid " +
    "inner join house_type as ht on h.houseType = ht.htid where h.hid = ?",

  queryWarehouseStaff:
    "select hm.uid,usr.usrName,usr.usrType from house_manage as hm " +
    "inner join `user` as usr on hm.uid = usr.uid where hm.hid = ?",

  queryWarehouseType: "select * from house_type",
  queryWarehouseStatus: "select * from house_status where hsid != 4",
  updateBaseInfo:
    "update warehouse set houseName = ?,houseAddr = ?,houseType = ?,houseStatus = ?,houseArea = ?," +
    "capacity = ? where hid = ?",

  queryHosueStaffs:
    "select usr.uid,usr.usrName from user as usr where usr.uid" +
    " in(select hm.uid from house_manage as hm where hm.hid = ?)",

  queryCargos: "select cid,cname from cargo",
  queryUsageCapacity:
    "select sum(store.count) as total from store where store.hid = ?",
  queryExistCargos:
    "select cg.cid,cg.cname from store as st left join cargo as cg on st.cid = cg.cid" +
    " where st.hid = ?",
  updateStore:{
    basesql:"insert into store(`hid`,`cid`,`count`)values(:hid,:cid,:count)" +
    " on duplicate key update `count` = `count` ",
    plusCargo:"+ :count",
    subCargo:"- :count",
  },
  addTradingRecord:
    "insert into trading(`tid`,`cid`,`hid`,`uid`,`time`,`count`,`remark`,`isPop`) " +
    "values(:tid,:cid,:hid,:uid,current_timestamp,:count,:remark,:isPop)",

  updateCargoQuantity: {
    prefix: "update cargo set quantity = ",
    plus: "quantity + :quantity ",
    sub: "quantity - :quantity ",
    suffix: "where cid = :cid",
  },
  queryDeliverableQuantity: "select store.count from store where hid=? and cid=?",

  queryTradingRecord:
    "select tr.hid,wh.houseName,cg.cname,tr.count,tr.isPop,tr.time,usr.usrName,tr.remark "+
    "from trading as tr left join warehouse as wh on tr.hid = wh.hid "+
    "left join `user` as usr on tr.uid = usr.uid left join cargo as cg on tr.cid = cg.cid "+
    "where tr.hid = ?",

  queryStoreInfoByhid:"select st.count,cg.cname from store as st left join cargo as cg "+
    "on st.cid = cg.cid where st.hid = ?"
};
