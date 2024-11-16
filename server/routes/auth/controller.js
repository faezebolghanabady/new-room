const controller = require ('./../controller');
const _ = require('Lodash')

module.exports = new (
    class extends controller {
        async register (req , res) {
            
          let user =  await this.User.findOne({email:req.body.email})
          if(user){
            return this.response({
                res:res,
                code:400,
                message:'this uoser already registered'
            })
          }
         user = new this.User(_.pick(req.body , ["name" , "email" , "password"]))
         await user.save();

         this.response({
          res , message :"the user secsufuly message",
          data:_.pick(user , ["name" , "email" , "_id"])
         })

        }
    
        async login (req , res) {
            res.send('login')
        }
    }
)();