export const consoleSql = {
  queryOverviewData:"select count(hid) as warehouses from warehouse;"+
    "select count(1) as staffs from `user` where usrType != 'admin';"+
    "select count(isPop) as total,isPop from trading where `time` like ? group by isPop",
  
  queryLatestTrading:"select date_format(`time`,'%m-%d') as `date`,`count`,isPop from trading "+
    "where date_format(`time`,'%Y-%m-%d') between ? and ? "+
    "group by `date`,`count`,isPop desc",
  
  queryCapacityUsage:"select sum(`count`) as total,wh.houseName from store as st "+
    "left join warehouse as wh on st.hid = wh.hid group by st.hid"
}