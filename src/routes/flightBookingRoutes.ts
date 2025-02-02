import { Router } from "express";
import { validateBookingInput } from "../middlewares/validation";
import { Request, Response, NextFunction } from "express";
import { FlightBookingController } from "../controllers/flightBookingController";

const router = Router();

const bookingController = new FlightBookingController();

//Get Service Health
router.get("/api/service-health", (_req: Request, res: Response) => {
    res.status(200).json({"status":"Service Health OK"});
});

// Book Flight Ticket API
router.post(
    "/api/bookings",
    validateBookingInput,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name, email, flightId } = req.body;
        const booking = await bookingController.bookFlight(
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
router.get(
    "/api/bookings/passenger/:email",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email } = req.params;
        const tickets = await bookingController.getFlightTicketDetails(email);
        res.json(tickets);
      } catch (error) {
        next(error);
      }
    }
  );

// View All Passengers API
router.get(
    "/api/flights/passengers/:flightId",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { flightId } = req.params;
        const passengers = await bookingController.getAllPassengers(flightId);
        res.json(passengers);
      } catch (error) {
        next(error);
      }
    }
  );

// Cancel Flight Ticket API
router.post(
    "/api/bookings/cancel",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, PNR } = req.body;
        if (!email || !PNR) {
          return res.status(400).json({
            error: "Email and booking reference are required",
          });
        }
        const result = await bookingController.cancelBooking(
          email,
          PNR
        );
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );
  
// Modify Seat Assignment API
router.post(
    "/api/bookings/modify-seat",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, PNR, newSeatNumber } = req.body;
        if (!email || !PNR || !newSeatNumber) {
          return res.status(400).json({
            error: "Email, booking reference, and new seat number are required",
          });
        }
        const result = await bookingController.modifySeat(
          email,
          PNR,
          newSeatNumber
        );
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

export default router;