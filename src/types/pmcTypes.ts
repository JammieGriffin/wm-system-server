export interface ICargoType{
  ctid:number;
  typeName:string;
}
export interface ICargo{
  cid:string;
  cname:string;
  quantity:number;
  ctid?:number;
  typeName?:string;
  tags?:Array<ICargoType>
}