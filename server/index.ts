import { Socket } from "socket.io";
import { NextFunction } from 'express';
import './src/types/socket.io'; 
import express from 'express';
import cors from "cors";
import Jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';
import http from "http";
import { Server } from "socket.io";
import'./src/routes';
import router from './src/routes/index.ts'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


interface JwtDecoded  {
  id: number,
  name: string,
  email: string;
  password : string,
}

interface JoinRoomData {
  room: string;
}

interface SendMessageData {
  room: string;
  message: string;
}

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);


 app.use(cors())
const server = http.createServer(app);
const io = new Server(server, {

  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});




app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));




const verifyUser = (socket:Socket, next:NextFunction) => {
  const accessToken = socket.handshake.auth.token; 

  if (!accessToken) {
    if (renewToken(socket)) {
      return next();  
    } else {
      return next(new Error("No access token and failed to renew."));
    }
  } else {
    Jwt.verify(accessToken, "jwt-access-token-secret-key", (err : Error | null , decoded :  object | string | undefined | JwtDecoded) => {
      if (err) {
        return next(new Error("Invalid token")); 
      } else {
        if(decoded && typeof decoded === 'object' && 'email' in decoded){
          socket.email = decoded.email; // اضافه کردن ایمیل از توکن به داده‌های socket
        }
        return next(); // توکن معتبر است و ادامه می‌دهد
      }
    });
  }
};




const renewToken = (socket:Socket) => {

  const refreshtoken = socket.handshake.query.refreshToken;
  let exist = false;
  if (!refreshtoken) {
    socket.emit('tokenError' , {valid:false , message:'no refresh token'})
  } else {
    const refreshTokenString = Array.isArray(refreshtoken) ? refreshtoken.join('') : refreshtoken;
    Jwt.verify(refreshTokenString, "jwt-refresh-token-secret-key", (err:Error | null, decoded: object | string | undefined | JwtDecoded) => {
      if (err) {
        socket.emit('tokenError' , {valid: false , message:'invalid refresh Token'})
      } else {
        if(decoded && typeof decoded === 'object' && 'email' in decoded){
          const accessToken = Jwt.sign({ email: decoded.email },"jwt-access-token-secret-key",{ expiresIn: "1m" });
          socket.emit('accessToken', { accessToken });
          exist = true
        }
        
       ;
      }
    });
  }
  return exist;
};

let rooms: { [key: string]: string[] } = {}; 
io.on("connection" , (socket:Socket ) => {
  console.log(`User Connected to socket : ${socket.id}`);
  console.log(`User Connected to socketpp : ${socket.id}`);
  socket.on("join_room", (data : JoinRoomData) => {
    console.log('data in back join rooom', data)
    console.log('roooooooooooooooooooommmmmmmmmmmmmmmmm');
    const {room} = data ;
    console.log('room', room)
    if (!room){
      return socket.emit("error", { message: "Room name is required" });
    }
    socket.join(room);
    rooms[room] = rooms[room] ? [...rooms[room], socket.id] : [socket.id];
    console.log(socket.id + ' joined room ' + room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", async (data :SendMessageData) => {
    console.log('datasend_message', data);
    const { room, message } = data;
    console.log('room first', room)
    if (!room || !message){
      return socket.emit("error", { message: "Room name and message are required" });
    }

  

    try {
    
      let chat = await prisma.chat.findUnique({
        where: {
          id: parseInt(room),
        },
      });

      if (!chat) {
        chat = await prisma.chat.create({
          data: {
            // اطلاعات بیشتر برای چت را ذخیره کنید
          },
        });
      }
    
   
      const savedMessage = await prisma.message.create({
        data: {
          message: message,
          author: socket.id, 
          chatId: chat.id,
          room: room,  
          time: new Date().toISOString(),
        },
      });

      socket.to(room).emit("receive_message", {
        message: savedMessage.message,
        sender: savedMessage.author,
      });
  
      console.log(`Message from ${socket.id}: ${message}`);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("error", { message: "Error saving message" });
    }

    console.log('test resive masage')
    socket.to(room).emit("receive_message", { message, sender: socket.id });
    console.log(`Message from ${socket.id}: ${message}`);

  });
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });

 



app.use('/api' , router)

const ipaddr = process.env.IP_ADDR || "localhost";
const port = process.env.PORT || 3000;
app.set("ipaddr", ipaddr);
app.set( "port", port );


server.listen(app.get('port'), app.get('ipaddr'), () => {
  console.log(`Server is running at http://${app.get('ipaddr')}:${app.get('port')}`);
});




















// const varifyUserr = (req, res, next) => {
  
//   const accessToken =  socket.handshake.auth.token;
//   if (!accessToken) {
//     if (renewToken(req, res)) {
//       next();
//     }
//   } else {
//     Jwt.verify(accessToken, "jwt-access-token-secret-key", (err, decoded) => {
//       if (err) {
//         return res.json({ valid: false, message: "invalid Token" });
//       } else {
//         req.email = decoded.email;
//         next();
//       }
//     });
//   }
// };