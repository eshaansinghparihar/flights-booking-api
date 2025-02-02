import { FlightBookingError } from "../errors/FlightBookingError";
import { Flight } from '../models/Flight';
import { Booking, BookingStatus, IBookingResponse, ICancellationResponse, ISeatModificationResponse } from '../models/Booking';
import { Passenger, IPassengerDetails, IPassengerListResponse } from '../models/Passenger';


export class FlightBookingService {
  async bookFlight(
    passengerDetails: IPassengerDetails,
    flightNumber: string,
    flights: Map<string, Flight>,
    passengers : Map<string, Passenger>,
    bookings : Map<string, Booking>
  ): Promise<IBookingResponse|undefined> {
      const flight = flights.get(flightNumber);
      if (!flight) {
        throw new FlightBookingError("Flight not found", 404);
      }
  
      const availableSeat = flight.seats.find((seat) => seat.isAvailable);
      if (!availableSeat) {
        throw new FlightBookingError("No seats available", 404);
      }
  
      let passenger = Array.from(passengers.values()).find(
        (p) => p.email === passengerDetails.email
      );
  
      if (!passenger) {
        passenger = new Passenger(passengerDetails.name, passengerDetails.email);
        passengers.set(passenger.passengerId, passenger);
      }
  
      const booking = new Booking(
        flightNumber,
        passenger.passengerId,
        availableSeat.seatId
      );
      bookings.set(booking.bookingId, booking);
  
      availableSeat.isAvailable = false;
  
      return {
        PNR: booking.PNR,
        flightDetails: flight,
        seatNumber: availableSeat.seatNumber,
        passengerDetails: passenger,
      };
  }

  async getFlightTicketDetails(email: string, flights: Map<string, Flight>,
    passengers : Map<string, Passenger>,
    bookings : Map<string, Booking>): Promise<IBookingResponse[]> {
    const passenger = Array.from(passengers.values()).find(
      (p) => p.email === email
    );

    if (!passenger) {
      throw new FlightBookingError("No bookings found for this email", 404);
    }

    const bookingArray = Array.from(bookings.values()).filter(
      (booking) =>
        booking.passengerId === passenger.passengerId &&
        booking.status === BookingStatus.CONFIRMED
    );

    return bookingArray.map((booking) => {
      const flight = flights.get(booking.flightId);
      if (!flight) {
        throw new FlightBookingError("Flight not found", 404);
      }
      const seat = flight.seats.find((s) => s.seatId === booking.seatId);
      if (!seat) {
        throw new FlightBookingError("Seat not found", 404);
      }

      return {
        PNR: booking.PNR,
        flightDetails: flight,
        seatNumber: seat.seatNumber,
        passengerDetails: passenger,
      };
    });
  }

  async getAllPassengers(flightId: string, flights: Map<string, Flight>,
    passengers : Map<string, Passenger>,
    bookings : Map<string, Booking>): Promise<IPassengerListResponse[]> {
    const flight = flights.get(flightId);
    if (!flight) {
      throw new FlightBookingError("Flight not found", 404);
    }

    const flightBookings = Array.from(bookings.values()).filter(
      (booking) =>
        booking.flightId === flightId &&
        booking.status === BookingStatus.CONFIRMED
    );

    return flightBookings.map((booking) => {
      const passenger = passengers.get(booking.passengerId);
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
    pnr: string,
    flights: Map<string, Flight>,
    passengers : Map<string, Passenger>,
    bookings : Map<string, Booking>
  ): Promise<ICancellationResponse> {
    const booking = Array.from(bookings.values()).find(
      (b) => b.PNR === pnr
    );

    if (!booking) {
      throw new FlightBookingError("Booking not found", 404);
    }

    const passenger = passengers.get(booking.passengerId);
    if (!passenger) {
      throw new FlightBookingError("Passenger not found", 404);
    }
    if (passenger.email !== email) {
      throw new FlightBookingError("Invalid email for this booking", 403);
    }

    const flight = flights.get(booking.flightId);
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
    pnr: string,
    newSeatNumber: string,
    flights: Map<string, Flight>,
    passengers : Map<string, Passenger>,
    bookings : Map<string, Booking>
  ): Promise<ISeatModificationResponse> {
    const booking = Array.from(bookings.values()).find(
      (b) => b.PNR === pnr
    );

    if (!booking || booking.status !== BookingStatus.CONFIRMED) {
      throw new FlightBookingError("Booking not found", 404);
    }

    const passenger = passengers.get(booking.passengerId);
    if (!passenger) {
      throw new FlightBookingError("Passenger not found", 404);
    }
    if (passenger.email !== email) {
      throw new FlightBookingError("Invalid email for this booking", 403);
    }

    const flight = flights.get(booking.flightId);
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
      PNR: booking.PNR,
      newSeatNumber: newSeat.seatNumber,
    };
  }
}
