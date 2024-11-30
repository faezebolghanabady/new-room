import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator'; // Import ValidationError
import { validationResult } from 'express-validator';

import autobind from 'auto-bind';

export default class controller {
  constructor() {
    autobind(this);
  }

  // Method for validating the request body
  validationBody(req: Request, res: Response): boolean | void {
    const result = validationResult(req);  // Get validation result from express-validator

    if (!result.isEmpty()) {  // Check if validation result is not empty
      const errors = result.array();
      const message: string[] = [];

      // Explicitly type 'err' as 'ValidationError'
      errors.forEach((err: ValidationError) => {
        message.push(err.msg);  // Push the error message to 'message' array
      });

      res.status(400).json({
        message: 'Validation error',
        data: message,
      });
      return false;  // Validation failed, return false
    }

    return true;  // Validation successful
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
