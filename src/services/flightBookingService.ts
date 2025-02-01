import {
  Flight,
  Booking,
  Passenger,
  BookingStatus,
  IBookingResponse,
  ICancellationResponse,
  ISeatModificationResponse,
  IPassengerListResponse,
} from "../models/types";

// Custom error class
export class FlightBookingError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = "FlightBookingError";
  }
}

export interface IPassengerDetails {
  name: string;
  email: string;
}

export class FlightBookingService {
  private flights: Map<string, Flight>;
  private bookings: Map<string, Booking>;
  private passengers: Map<string, Passenger>;

  constructor() {
    this.flights = new Map<string, Flight>();
    this.bookings = new Map<string, Booking>();
    this.passengers = new Map<string, Passenger>();
  }

  async bookFlight(
    passengerDetails: IPassengerDetails,
    flightId: string
  ): Promise<IBookingResponse> {
    const flight = this.flights.get(flightId);
    if (!flight) {
      throw new FlightBookingError("Flight not found", 404);
    }

    // Find first available seat
    const availableSeat = flight.seats.find((seat) => seat.isAvailable);
    if (!availableSeat) {
      throw new FlightBookingError("No seats available");
    }

    // Create or get passenger
    let passenger = Array.from(this.passengers.values()).find(
      (p) => p.email === passengerDetails.email
    );

    if (!passenger) {
      passenger = new Passenger(passengerDetails.name, passengerDetails.email);
      this.passengers.set(passenger.passengerId, passenger);
    }

    // Create booking
    const booking = new Booking(
      flightId,
      passenger.passengerId,
      availableSeat.seatId
    );
    this.bookings.set(booking.bookingId, booking);

    // Update seat availability
    availableSeat.isAvailable = false;

    return {
      bookingReference: booking.bookingReference,
      flightDetails: flight,
      seatNumber: availableSeat.seatNumber,
      passengerDetails: passenger,
    };
  }

  async getFlightTicketDetails(email: string): Promise<IBookingResponse[]> {
    const passenger = Array.from(this.passengers.values()).find(
      (p) => p.email === email
    );

    if (!passenger) {
      throw new FlightBookingError("No bookings found for this email", 404);
    }

    const bookings = Array.from(this.bookings.values()).filter(
      (booking) =>
        booking.passengerId === passenger.passengerId &&
        booking.status === BookingStatus.CONFIRMED
    );

    return bookings.map((booking) => {
      const flight = this.flights.get(booking.flightId);
      if (!flight) {
        throw new FlightBookingError("Flight not found", 404);
      }
      const seat = flight.seats.find((s) => s.seatId === booking.seatId);
      if (!seat) {
        throw new FlightBookingError("Seat not found", 404);
      }

      return {
        bookingReference: booking.bookingReference,
        flightDetails: flight,
        seatNumber: seat.seatNumber,
        passengerDetails: passenger,
      };
    });
  }

  async getAllPassengers(flightId: string): Promise<IPassengerListResponse[]> {
    const flight = this.flights.get(flightId);
    if (!flight) {
      throw new FlightBookingError("Flight not found", 404);
    }

    const flightBookings = Array.from(this.bookings.values()).filter(
      (booking) =>
        booking.flightId === flightId &&
        booking.status === BookingStatus.CONFIRMED
    );

    return flightBookings.map((booking) => {
      const passenger = this.passengers.get(booking.passengerId);
      if (!passenger) {
        throw new FlightBookingError("Passenger not found", 404);
      }
      const seat = flight.seats.find((s) => s.seatId === booking.seatId);
      if (!seat) {
        throw new FlightBookingError("Seat not found", 404);
      }

      return {
        passenger,
        seatNumber: seat.seatNumber,
      };
    });
  }

  async cancelBooking(
    email: string,
    bookingReference: string
  ): Promise<ICancellationResponse> {
    const booking = Array.from(this.bookings.values()).find(
      (b) => b.bookingReference === bookingReference
    );

    if (!booking) {
      throw new FlightBookingError("Booking not found", 404);
    }

    const passenger = this.passengers.get(booking.passengerId);
    if (!passenger) {
      throw new FlightBookingError("Passenger not found", 404);
    }
    if (passenger.email !== email) {
      throw new FlightBookingError("Invalid email for this booking", 403);
    }

    const flight = this.flights.get(booking.flightId);
    if (!flight) {
      throw new FlightBookingError("Flight not found", 404);
    }
    const seat = flight.seats.find((s) => s.seatId === booking.seatId);
    if (!seat) {
      throw new FlightBookingError("Seat not found", 404);
    }

    booking.status = BookingStatus.CANCELLED;
    seat.isAvailable = true;

    return { message: "Booking cancelled successfully" };
  }

  async modifySeat(
    email: string,
    bookingReference: string,
    newSeatNumber: string
  ): Promise<ISeatModificationResponse> {
    const booking = Array.from(this.bookings.values()).find(
      (b) => b.bookingReference === bookingReference
    );

    if (!booking || booking.status !== BookingStatus.CONFIRMED) {
      throw new FlightBookingError("Booking not found", 404);
    }

    const passenger = this.passengers.get(booking.passengerId);
    if (!passenger) {
      throw new FlightBookingError("Passenger not found", 404);
    }
    if (passenger.email !== email) {
      throw new FlightBookingError("Invalid email for this booking", 403);
    }

    const flight = this.flights.get(booking.flightId);
    if (!flight) {
      throw new FlightBookingError("Flight not found", 404);
    }

    const newSeat = flight.seats.find((s) => s.seatNumber === newSeatNumber);
    if (!newSeat || !newSeat.isAvailable) {
      throw new FlightBookingError("Seat not available");
    }

    const oldSeat = flight.seats.find((s) => s.seatId === booking.seatId);
    if (!oldSeat) {
      throw new FlightBookingError("Current seat not found", 404);
    }

    oldSeat.isAvailable = true;
    newSeat.isAvailable = false;
    booking.seatId = newSeat.seatId;

    return {
      bookingReference: booking.bookingReference,
      newSeatNumber: newSeat.seatNumber,
    };
  }
}
