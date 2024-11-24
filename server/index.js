const expresse = require("express");
const cors = require("cors");
const Jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const http = require("http")
const { createServer } = require('ws');
const { Server } = require("socket.io");
const bcrypt = require('bcrypt');
const router = require('./src/routes');
const chat = require('./src/models/chat')

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

var app = expresse();
app.use(expresse.json());
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




const verifyUser = (socket, next) => {
  const accessToken = socket.handshake.auth.token; 

  if (!accessToken) {
    if (renewToken(socket)) {
      return next();  
    } else {
      return next(new Error("No access token and failed to renew."));
    }
  } else {
    Jwt.verify(accessToken, "jwt-access-token-secret-key", (err, decoded) => {
      if (err) {
        return next(new Error("Invalid token")); 
      } else {
        socket.email = decoded.email; // اضافه کردن ایمیل از توکن به داده‌های socket
        return next(); // توکن معتبر است و ادامه می‌دهد
      }
    });
  }
};




const renewToken = (req, res) => {

  const refreshtoken = req.cookies.refreshToken;
  let exist = false;
  if (!refreshtoken) {
    return res.json({ valid: false, message: "no refresh token" });
  } else {
    Jwt.verify(refreshtoken, "jwt-refresh-token-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ valid: false, message: "invalid refresh Token" });
      } else {
        const accessToken = Jwt.sign(
          { email: decoded.email },
          "jwt-access-token-secret-key",
          { expiresIn: "1m" }
        );
        res.cookie("accessToken", accessToken, { maxAge: 60000 });
        exist = true;
      }
    });
  }
  return exist;
};

let rooms = {}; // ذخیره‌سازی اتاق‌ها
// io.use(verifyUser);
io.on("connection" , (socket) => {
  console.log(`User Connected to socket : ${socket.id}`);


  socket.on("join_room", (data) => {
    const room = data ;
    console.log('room', room)
    if (!room){
      return socket.emit("error", { message: "Room name is required" });
    }
    socket.join(room);
    rooms[room] = rooms[room] ? [...rooms[room], socket.id] : [socket.id];
    console.log(socket.id + ' joined room ' + room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    console.log('datasend_message', data)
    const { room, message } = data;
    if (!room || !message){
      return socket.emit("error", { message: "Room name and message are required" });
    }
    console.log('test resive masage')
    socket.to(room).emit("receive_message", { message, sender: socket.id });
    console.log(`Message from ${socket.id}: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });

} )



app.use('/api' , router)


const port = process.env.PORT || 3000;
app.set( "ipaddr", "127.0.0.1" );
app.set( "port", 3000 );



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