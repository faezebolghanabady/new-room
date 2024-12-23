import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
import { validationResult } from 'express-validator';

import autobind from 'auto-bind';

export default class controller {
  constructor() {
    autobind(this);
  }

  // Method for validating the request body
  validationBody(req: Request, res: Response): boolean{
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const message = result.array().map((err)=>err.msg)
      res.status(400).json({
        message: 'Validation error',
        data: message,
      });
      return false;  
    }

    return true; 
  }

  // Middleware method to handle validation and call next if valid
  validate(req: Request, res: Response, next: NextFunction): void {
    if (!this.validationBody(req, res)) {  // If validation failed
      return;  // Stop processing
    }
    next();  // Proceed to the next middleware or route handler
  }

  // Method to send a response
  response({ res, message, code = 200, data = {} }: { res: Response; message: string; code?: number; data?: any }): void {
    res.status(code).json({
      message,
      data,
    });
  }
}
