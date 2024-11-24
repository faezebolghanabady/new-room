

const { check } = require('express-validator');

module.exports = new class{
  registerValidator() {
    return [
      check('email')
        .isEmail()
        .withMessage('Email is invalid'),
      check('name')
        .notEmpty()
        .withMessage('Name cannot be empty'),
      check('password')
        .notEmpty()
        .withMessage('Password cannot be empty'),
    ];
  }

  loginValidator() {
    return [
      check('email')
        .isEmail()
        .withMessage('Email is invalid'),
      check('password')
        .notEmpty()
        .withMessage('Password cannot be empty'),
    ];
  }
};