const jwt = require('jsonwebtoken');
const secret = 'jgsjwtsec95ret27qwq';

function createToken(data:any):string{
  const token = jwt.sign(data,secret,{
    expiresIn:60*60
  });
  return token;
}

async function checkToken(token:string){
  return await jwt.verify(token,secret)
}