
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import cookieParser from "cookie-parser";
import Jwt from "jsonwebtoken";
import http from "http";
// import { createServer } from 'ws';
import { Server } from "socket.io";
// import { app } from '../../../index';
import controller from '../controller.ts';
import { Domain } from 'domain';
import express, { Request, Response } from 'express';

export default class AuthController extends controller  {
  
  async register ( req:Request  , res:Response ): Promise <void>{
    const { name, email, password } = req.body;
    console.log('firstreq.bodyreq.body', req.body.password)
    try {
  
      const existingUser = await prisma.user.findFirst({
        where: {
            email: email,
        },
    });
  
      if (existingUser) {
       res.status(409).json({ error: "ایمیل قبلاً استفاده شده است" });
       return;
      }
  
      const saltRounds = 10 ;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashPassword = await bcrypt.hash(password ,salt)
      
      const newUser = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password : hashPassword
        },
    });
  
      res.status(201).json({ message: "ثبت نام با موفقیت انجام شد" });
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message); 
        res.status(500).json({ error: err.message });
      }else {
        console.error("An unknown error occurred");
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
}



    async login(req : Request , res : Response): Promise <void>{

        const { email, password } = req.body;
     

     
        try {
           
          const user = await prisma.user.findFirst({where:{email}})
         
          if (!user) {
             res.status(401).json({ error: 'کاربر یافت نشد' });
             return
          }
          console.log('user', user)
         
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
             res.status(401).json({ error: 'رمز عبور اشتباه است' });
             return
          }
      
          const accessToken = Jwt.sign({ userId: user.id }, 'jwt-access-token-secret-key', { expiresIn: '1h' });
          
          const refreshToken = Jwt.sign({ userId: user.id  },"jwt-refresh-token-secret-key",{ expiresIn: '1h'});
        

          res.cookie('accessToken', accessToken, { httpOnly: false , secure:true });
          res.cookie('refreshToken', refreshToken, { httpOnly: false , secure:true });


          res.cookie("accessToken", accessToken,   {
            httpOnly: false, 
            sameSite: 'none', 
            domain:'localhost',
            secure: true,   
          });

        
         
          res.json({ message: 'ورود با موفقیت انجام شد' });
        
    
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'خطای داخلی سرور' });
        }
    } 

}



