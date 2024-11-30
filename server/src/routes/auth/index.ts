import express from 'express';
import AuthController from './controller.ts';
import  Validator from './validator.ts';
const validator = new Validator(); 
const authController = new AuthController();; 
const router = express.Router();


router.post(
    '/register',
    validator.registerValidator(),
    authController.register 
);

router.post(
    '/login',
    validator.loginValidator(),
    authController.login ,
)
export default router;