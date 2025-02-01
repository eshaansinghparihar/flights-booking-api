import { NextFunction, Request, Response } from "express";

const express = require("express");

const { Flight } = require("./src/models/types");

const { FlightBookingService } = require("./src/services/flightBookingService");

const app = express();
app.use(express.json());

const bookingService = new FlightBookingService();

// Initialize some sample flights
const initializeSampleFlights = () => {
  const flight1 = new Flight("FL123", "BLR", "BOM", new Date("2024-03-01"), 30);
  const flight2 = new Flight("FL124", "BOM", "BLR", new Date("2024-03-02"), 30);
  bookingService.flights.set(flight1.flightId, flight1);
  bookingService.flights.set(flight2.flightId, flight2);
};

initializeSampleFlights();

// Middleware for error handling
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
};

// Input validation middleware
const validateBookingInput = (
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

// Book Flight Ticket API
app.post(
  "/api/bookings",
  validateBookingInput,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, flightId } = req.body;
      const booking = await bookingService.bookFlight(
        { name, email },
        flightId
      );
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  }
);

// View Flight Ticket Details API
app.get(
  "/api/bookings/passenger/:email",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.params;
      const tickets = await bookingService.getFlightTicketDetails(email);
      res.json(tickets);
    } catch (error) {
      next(error);
    }
  }
);

// View All Passengers API
app.get(
  "/api/flights/:flightId/passengers",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { flightId } = req.params;
      const passengers = await bookingService.getAllPassengers(flightId);
      res.json(passengers);
    } catch (error) {
      next(error);
    }
  }
);

// Cancel Flight Ticket API
app.post(
  "/api/bookings/cancel",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, bookingReference } = req.body;
      if (!email || !bookingReference) {
        return res.status(400).json({
          error: "Email and booking reference are required",
        });
      }
      const result = await bookingService.cancelBooking(
        email,
        bookingReference
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Modify Seat Assignment API
app.post(
  "/api/bookings/modify-seat",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, bookingReference, newSeatNumber } = req.body;
      if (!email || !bookingReference || !newSeatNumber) {
        return res.status(400).json({
          error: "Email, booking reference, and new seat number are required",
        });
      }
      const result = await bookingService.modifySeat(
        email,
        bookingReference,
        newSeatNumber
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Add error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.use("/api/service-health", (_req: Request, res: Response) => {
  res.status(200).send("Service Health OK");
});
app.use("/", (_req: Request, res: Response) => {
  res.status(200).send("Service Health OK");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app };
