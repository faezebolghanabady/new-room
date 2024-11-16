const expresse = require("express");
const cors = require("cors");
const Jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const http = require("http")
const { createServer } = require('ws');
const { Server } = require("socket.io");
const bcrypt = require('bcrypt');

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





io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});



app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({where:{email}})
   
    if (!user) {
      return res.status(401).json({ error: 'کاربر یافت نشد' });
    }
   
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'رمز عبور اشتباه است' });
    }

    const accessToken = Jwt.sign({ userId: user.id }, 'jwt-access-token-secret-key', { expiresIn: '1h' });
    const refreshToken = Jwt.sign({ email: email },"jwt-refresh-token-secret-key",{ expiresIn: "5m" });
      
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    res.json({ message: 'ورود با موفقیت انجام شد' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطای داخلی سرور' });
  }
  
});



app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
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
});

const varifyUser = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    if (renewToken(req, res)) {
      next();
    }
  } else {
    Jwt.verify(accessToken, "jwt-access-token-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ valid: false, message: "invalid Token" });
      } else {
        req.email = decoded.email;
        next();
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

app.get("/dahboard", varifyUser, (req, res) => {
  return res.json({ valid: true, message: "authorized" });
});




const port = process.env.PORT || 3000;
app.set( "ipaddr", "127.0.0.1" );
app.set( "port", 3000 );


server.listen(app.get('port'), app.get('ipaddr'), () => {
  console.log(`Server is running at http://${app.get('ipaddr')}:${app.get('port')}`);
});