export const sysSql = {
  login:"select * from `user` where wno = ?",
  register:"insert into \`user\` (\`uid\`,\`wno\`,\`pwd\`,\`usrType\`,\`sex\`,\`usrName\`,\`phone\`)"+
    " values(?,?,?,'staff',?,?,?)",
  delUsr:"delete from `user` where uid=?"
}