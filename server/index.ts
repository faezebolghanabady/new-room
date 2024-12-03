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
  userId: number;
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




const verifyUser = (socket:Socket, next:(err?: Error)=>void) => {
  const accessToken = socket.handshake.auth.token; 
  console.log("Access Token:", accessToken);

  if (!accessToken) {
    console.log('No access token found. Attempting to renew...');
    if (renewToken(socket)) {
      console.log('Token renewed successfully');
      return next();  
    } else {
      console.log('Failed to renew token');
      return next(new Error("No access token and failed to renew."));
    }
  } else {
    Jwt.verify(accessToken, "jwt-access-token-secret-key", (err : Error | null , decoded :  object | string | undefined | JwtDecoded) => {
      console.log('ok')
      if (err) {
        console.log('erorrr darim ')
        return next(new Error("Invalid token")); 
       
      } else {
        console.log('engaaa')


        if (decoded && typeof decoded === 'object') {
          console.log("Decoded Token: ", decoded); 
        
          // بررسی وجود فیلد 'email' در توکن
          if ('email' in decoded) {
            console.log('email ro darim migirim');
            socket.email = decoded.email;
          }
        
          // بررسی وجود فیلد 'userId' در توکن
          if ('userId' in decoded) {
            console.log('userId ro darim migirim');
            socket.userId = decoded.userId;
          }
          
          console.log('ok verify');
          return next();
        } else {
          return next(new Error("Invalid token data"));
        }
        
        

        // if(decoded && typeof decoded === 'object' && 'email' in decoded){
        //   console.log('email ro darim migirim')
        //   console.log("Decoded Tokenjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj: ", decoded); 
        //   socket.email = decoded.email;
          
        // }



        console.log('ok verify ');
        return next();
         // توکن معتبر است و ادامه می‌دهد
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
          const accessToken = Jwt.sign({ email: decoded.email },"jwt-access-token-secret-key",{ expiresIn: "1h" });
          socket.emit('accessToken', { accessToken });
          exist = true
        }
        
       ;
      }
    });
  }
  return exist;
};

io.use(verifyUser);

let rooms: { [key: string]: string[] } = {}; 

io.on("connection" , async(socket:Socket ) => {

  socket.on('error', (error: Error) => {
    console.log('Error in socket connection:', error.message);
  });

  console.log(`User Connected to socketpp : ${socket.id}`);

  // try{

  //   const userRoom = await prisma.userRooms.findFirst({
  //     where : {
  //       id: roomId
  //     }
  //   });
  //   if (userRoom) {
      
  //   }

  // }catch{

  // }

  socket.on("join_room", (data : JoinRoomData) => {
  
    const {room} = data ;
    console.log('room', room)
    if (!room){
      return socket.emit("error", { message: "Room name is required" });
    }
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
    rooms[room] = rooms[room] ? [...rooms[room], socket.id] : [socket.id];
    console.log(socket.id + ' joined room ' + room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", async (data :SendMessageData) => {
    console.log('datasend_message', data);
    const { room, message } = data;
    console.log('room firsteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', room)
    if (!room || !message){
      return socket.emit("error", { message: "Room name and message are required" });
    }


    try {
      let RoomUser = await prisma.room.findUnique({
        where: {
          id: parseInt(room)
        },
      });

      if (!RoomUser) {
        RoomUser = await prisma.room.create({
          data : {
            id: parseInt(room, 10),
            name: room,
          }
        });
      }

      console.log('socket.userId: رررررررررررررررررررررررررررررررررررررررررررر', socket.userId);
     
      const roomId = parseInt(room, 10);
      console.log('rommid: رررررررررررررررررررررررررررررررررررررررررررر', roomId);
       if (isNaN(roomId)) {
       return socket.emit("error", { message: "Invalid room ID" });
       }
    
      const savedMessage = await prisma.message.create({
        data: {
          message: message,
          authorId: socket.userId,
          roomId:roomId,
          time: new Date().toISOString(),
        },
      });

  
      console.log(`Message from ${socket.id}: ${message}`);
    } catch (error) {
      console.error("Error saving messageثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثثث:", error);
      socket.emit("error", { message: "Error saving message" });
    }
    socket.to(room).emit("receive_message", { message, author: socket.id });
    console.log(`Message from ${socket.id}: ${message}`);

  });


    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });


  });


  async function testConnection() {
    try {
      await prisma.$connect();  // تست اتصال به پایگاه داده
      console.log("Database connection successful!------------------------------------------------------------------------");
    } catch (error) {
      console.error("Database connection failed:", error);
    } finally {
      await prisma.$disconnect();  // قطع اتصال در صورت پایان تست
    }
  }
  
  testConnection();

 



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