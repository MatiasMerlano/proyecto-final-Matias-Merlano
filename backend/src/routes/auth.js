import {Router} from 'express';import bcrypt from 'bcryptjs';import jwt from 'jsonwebtoken';import db from '../db/database.js';
const router=Router();
router.post('/login',async(req,res)=>{const{username,password}=req.body||{};if(typeof username!=='string'||typeof password!=='string')return res.status(400).json({message:'Completa usuario y contraseña.'});
 const user=db.prepare('SELECT id,username,password_hash,role FROM users WHERE username=?').get(username.trim());
 if(!user||!(await bcrypt.compare(password,user.password_hash)))return res.status(401).json({message:'Usuario o contraseña incorrectos.'});
 const token=jwt.sign({sub:user.id,username:user.username,role:user.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'2h'});
 res.json({message:'Inicio de sesión correcto.',token,user:{username:user.username,role:user.role}});
});
export default router;
