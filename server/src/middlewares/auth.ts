// const jwt = require('jsonwebtoken');

// async function isLogin(req , res , next) {

//     const token = req.header("x-auth-token");
//     if(!token) res.status(401).send('access denied');
//     try {
//         const decoded = jwt.verify(token , 'jwt-access-token-secret-key' );
//          const user = await prisma.user.findFirst({where:{id}});
//          console.log(user);
//          req.user = user
//          next();
//     } catch (error) {
//         res.status(400).send('invalid token');
//     }
    
// }

// module.exports = {
//     isLogin
// }