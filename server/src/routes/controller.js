const autobind = require('auto-bind')
const {validatioResult} = require ("express-validator");




module.exports = class {
    constructor(){
        autobind(this);
    }

    validationBody (req,res) {
        const result = validatioResult(req);
        if(!result.isEmpty()){
            const errors = result.array();
            const message = []
            errors.forEach(err => {
                message.push(err.msg)
                res.status(400).json({
                    message:'validation error',
                    data:message
                })
                return false;
            });
            return true;
        }
    
    }

    validate (req , res , next) {
        
        if(this.validationBody.isEmpty){
            return;
        }
        next();
    }

    response({res , message , code=200 , data={}}){
        res.status(code).json({
            message,
            data
        })
    }
 

};
