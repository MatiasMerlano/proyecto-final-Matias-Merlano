import jwt from 'jsonwebtoken';
export function requireAdmin(req,res,next){
 const header=req.headers.authorization||'';const token=header.startsWith('Bearer ')?header.slice(7):null;
 if(!token)return res.status(401).json({message:'Debes iniciar sesión.'});
 try{const payload=jwt.verify(token,process.env.JWT_SECRET);if(payload.role!=='admin')return res.status(403).json({message:'Acceso denegado.'});req.user=payload;next();}
 catch{return res.status(401).json({message:'La sesión no es válida o ha expirado.'});}
}
