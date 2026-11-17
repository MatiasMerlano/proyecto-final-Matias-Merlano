import {Router} from 'express';import db from '../db/database.js';import{requireAdmin}from'../middleware/auth.js';
const router=Router();router.get('/messages',requireAdmin,(req,res)=>{const rows=db.prepare('SELECT id,name,email,message,source,created_at FROM contacts ORDER BY id DESC LIMIT 100').all();res.json({messages:rows});});export default router;
