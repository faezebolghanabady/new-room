import * as express from 'express';
import { body } from 'express-validator';

export default class Validator  {
  registerValidator(){
    return [
      body('email')
        .isEmail()
        .withMessage('Email is invalid'),
        body('name')
        .notEmpty()
        .withMessage('Name cannot be empty'),
        body('password')
        .notEmpty()
        .withMessage('Password cannot be empty'),
    ];
  }


  loginValidator() {
    return [
      body('email')
        .isEmail()
        .withMessage('Email is invalid'),
        body('password')
        .notEmpty()
        .withMessage('Password cannot be empty'),
    ];
  }

}

// module.exports = new class{
//   registerValidator() {
//     return [
//       check('email')
//         .isEmail()
//         .withMessage('Email is invalid'),
//       check('name')
//         .notEmpty()
//         .withMessage('Name cannot be empty'),
//       check('password')
//         .notEmpty()
//         .withMessage('Password cannot be empty'),
//     ];
//   }

//   loginValidator() {
//     return [
//       check('email')
//         .isEmail()
//         .withMessage('Email is invalid'),
//       check('password')
//         .notEmpty()
//         .withMessage('Password cannot be empty'),
//     ];
//   }
// };