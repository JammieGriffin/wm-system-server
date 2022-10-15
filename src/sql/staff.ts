export const staffSql:any = {
  addStaff:
    "insert into `user`(`uid`,`wno`,`usrType`,`usrName`,`phone`,`sex`,`pwd`) " +
    "values(:uid,:wno,:usrType,:usrName,:phone,:sex,:pwd)",
  queryStaffInfo:
    "select usr.uid,usr.wno,usr.usrType,usr.sex,usr.usrName,usr.phone,hm.hid,wh.houseName " +
    "from `user` as usr left join house_manage as hm on usr.uid = hm.uid " +
    "left join warehouse as wh on hm.hid=wh.hid where usr.usrType!='admin' ",
  addAllocRelation: "insert into house_manage(`uid`,`hid`)values (:uid,:hid)",
  updateAllocRelation: "update house_manage set uid=:uid where hid=:hid",
  delAllocRelation: "delete from house_manage where uid=:uid",
  checkHousePrincipal:
    "select hm.uid from house_manage as hm left join `user` as usr on hm.uid=usr.uid"+
    " where hm.hid=? and usr.usrType='principal'",
  options:{
    wno:"and usr.wno like ?",
    usrName:"and usr.usrName like ?",
    phone:"and usr.phone like ?",
    house:"and wh.houseName like ?",
    suffix:" order by usr.usrType",
  }
};
