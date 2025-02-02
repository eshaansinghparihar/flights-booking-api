import { Request, Response, NextFunction } from "express";

export const validateBookingInput = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, flightId } = req.body;
    if (!name || !email || !flightId) {
      return res.status(400).json({
        error: "Missing required fields: name, email, and flightId are required",
      });
    }
    if (!email.includes("@")) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }
    next();
  };
  