const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const expresse = require("express");
const Jwt = require("jsonwebtoken");
const http = require("http")
const { createServer } = require('ws');
const { Server } = require("socket.io");
const { app }  = require('../../../index');

const prisma = new PrismaClient();
const controller = require('./../controller');
const { Domain } = require('domain');


module.exports = new (class extends controller{
    async register ( req , res) {
      console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm')
        const { name, email, password } = req.body;
        console.log('firstreq.bodyreq.body', req.body.password)
        try {
      
          const existingUser = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });
      
          if (existingUser) {
            return res.status(409).json({ error: "ایمیل قبلاً استفاده شده است" });
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
          console.error(err);
          res.status(500).json({ error: err.message });
        }
    }

    async login(req , res){
      console.log('firstpassword', req.body.password);

        const { email, password } = req.body;
     

     
        try {
           
          const user = await prisma.user.findFirst({where:{email}})
         
          if (!user) {
            return res.status(401).json({ error: 'کاربر یافت نشد' });
          }
          console.log('user', user)
         
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return res.status(401).json({ error: 'رمز عبور اشتباه است' });
          }
      
          const accessToken = Jwt.sign({ userId: user.id }, 'jwt-access-token-secret-key', { expiresIn: '1h' });
          
          const refreshToken = Jwt.sign({ userId: user.id  },"jwt-refresh-token-secret-key",{ expiresIn: '1h'});
        

          res.cookie('accessToken', accessToken, { httpOnly: false , secure:true });
          res.cookie('refreshToken', refreshToken, { httpOnly: false , secure:true });


          res.cookie("accessToken", accessToken,   {
            httpOnly: false, // Optional, ensures cookie is sent over HTTP(S) only
            sameSite: 'none', // Allow cross-site requests
            domain:'localhost',
            secure: true,    // Secure is not required on localhost
          });

        
         
          res.json({ message: 'ورود با موفقیت انجام شد' });
          console.log('hujkyujkyvu')

          // this.joinRoom()
    
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'خطای داخلی سرور' });
        }
    } 



   

  //   async chat(req , res){

       
  //       console.log('kkkkkkkkkkklllllllllllllllllllll');


  //       // const varifyUser = (req, res, next) => {
  //       //   const accessToken = req.cookies.accessToken;
  //       //   if (!accessToken) {
  //       //     if (renewToken(req, res)) {
  //       //       next();
  //       //     }
  //       //   } else {
  //       //     Jwt.verify(accessToken, "jwt-access-token-secret-key", (err, decoded) => {
  //       //       if (err) {
  //       //         return res.json({ valid: false, message: "invalid Token" });
  //       //       } else {
  //       //         req.email = decoded.email;
  //       //         next();
  //       //       }
  //       //     });
  //       //   }
  //       // };
        
  //       // const renewToken = (req, res) => {
  //       //   const refreshtoken = req.cookies.refreshToken;
  //       //   let exist = false;
  //       //   if (!refreshtoken) {
  //       //     return res.json({ valid: false, message: "no refresh token" });
  //       //   } else {
  //       //     Jwt.verify(refreshtoken, "jwt-refresh-token-secret-key", (err, decoded) => {
  //       //       if (err) {
  //       //         return res.json({ valid: false, message: "invalid refresh Token" });
  //       //       } else {
  //       //         const accessToken = Jwt.sign(
  //       //           { email: decoded.email },
  //       //           "jwt-access-token-secret-key",
  //       //           { expiresIn: "1m" }
  //       //         );
  //       //         res.cookie("accessToken", accessToken, { maxAge: 60000 });
  //       //         exist = true;
  //       //       }
  //       //     });
  //       //   }
  //       //   return exist;
  //       // };

  //       const server = http.createServer(app);
  //       const io = new Server(server, {
  //         cors: {
  //           origin: "http://localhost:5173",
  //           credentials: true,
  //           methods: ["GET", "POST"],
  //         },
  //       });
  
  //       console.log(io);
        
  //       io.on("connection", (socket) => {
  //         console.log(`User Connected: ${socket.id}`);
  
  //         socket.on("join_room", (data) => {
  //           socket.join(data);
  //           console.log(`User with ID: ${socket.id} joined room: ${data}`);
  //         });
  
  //         socket.on("send_message", (data) => {
  //           console.log('dataaaaaaaaaaaaaaaaaaaaa', data.room)
  //           socket.to(data.room).emit("receive_message", data);
  //           console.log(data);
  //         });
  
  //         socket.onmessage = (event) => {
  //           console.log('Message from server:', event.data);
  //       };
  
  //         socket.on("disconnect", () => {
  //           console.log("User Disconnected", socket.id);
  //         });
  //       });


  //       // Handle potential errors during server startup
  //         server.on('error', (error) => {
  //           console.error('Error starting chat server:', error);
  //         });

  //       // Start the server
  //       server.listen(process.env.PORT || 3000, () => {
  //         console.log(`Chat server listening on port ${process.env.PORT || 3000}`);
  //       });
            
  // } 



})

