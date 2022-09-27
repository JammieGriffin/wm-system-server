export const warehouseSql = {
  addNewHouseType: "insert into `house_type`(`typeName`) values(?)",
  addNewHouse:
    "insert into `warehouse` " +
    "(`hid`,`houseStatus`,`houseName`,`houseAddr`,`houseType`,`houseArea`,`capacity`) " +
    "values(?,1,?,'未设置',?,?,?)",

  queryWarehouse:
    "select h.hid,h.houseName,h.houseArea,h.capacity,ht.typeName,hs.hsid,hs.style,hs.value " +
    "from warehouse as h left join house_type as ht on h.houseType=ht.htid " +
    "left join house_status as hs on h.houseStatus=hs.hsid",

  updateHouseName: "update warehouse set houseName=? where hid=?",

  updateHouseType: "update warehouse set houseStatus = ? where hid = ?",

  delWarehouse: "delete from warehouse where hid = ?",

  queryWarehouseInfo:
    "select h.hid,h.houseName,h.houseAddr,h.capacity,h.houseArea,hs.style,hs.value,ht.typeName " +
    "from warehouse as h inner join house_status as hs on h.houseStatus = hs.hsid " +
    "inner join house_type as ht on h.houseType = ht.htid where h.hid = ?",

  queryWarehouseStaff:
    "select hm.uid,usr.usrName,usr.usrType from house_manage as hm " +
    "inner join `user` as usr on hm.uid = usr.uid where hm.hid = ?",

  queryWarehouseType:"select * from house_type",
  queryWarehouseStatus:"select * from house_status where hsid != 4",


};
