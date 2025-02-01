enum BookingStatus {
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
}

interface ISeat {
  seatId: string;
  seatNumber: string;
  isAvailable: boolean;
}

interface IFlightConstructor {
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: Date;
  totalSeats: number;
}

export class Flight {
  readonly flightId: string;
  readonly flightNumber: string;
  readonly origin: string;
  readonly destination: string;
  readonly departureDate: Date;
  readonly totalSeats: number;
  seats: ISeat[];

  constructor({
    flightNumber,
    origin,
    destination,
    departureDate,
    totalSeats,
  }: IFlightConstructor) {
    this.flightId = Math.random().toString(36).substr(2, 9);
    this.flightNumber = flightNumber;
    this.origin = origin;
    this.destination = destination;
    this.departureDate = departureDate;
    this.totalSeats = totalSeats;
    this.seats = this.initializeSeats(totalSeats);
  }

  private initializeSeats(totalSeats: number): ISeat[] {
    return Array.from({ length: totalSeats }, (_, index) => ({
      seatId: Math.random().toString(36).substr(2, 9),
      seatNumber: `${Math.floor(index / 6) + 1}${String.fromCharCode(
        65 + (index % 6)
      )}`,
      isAvailable: true,
    }));
  }
}

export class Booking {
  readonly bookingId: string;
  readonly flightId: string;
  readonly passengerId: string;
  seatId: string;
  status: BookingStatus;
  readonly bookingReference: string;
  readonly createdAt: Date;

  constructor(flightId: string, passengerId: string, seatId: string) {
    this.bookingId = Math.random().toString(36).substr(2, 9);
    this.flightId = flightId;
    this.passengerId = passengerId;
    this.seatId = seatId;
    this.status = BookingStatus.CONFIRMED;
    this.bookingReference = Math.random()
      .toString(36)
      .toUpperCase()
      .substr(2, 6);
    this.createdAt = new Date();
  }
}

export class Passenger {
  readonly passengerId: string;
  readonly name: string;
  readonly email: string;

  constructor(name: string, email: string) {
    this.passengerId = Math.random().toString(36).substr(2, 9);
    this.name = name;
    this.email = email;
  }
}

// Type definitions for API responses
export interface IBookingResponse {
  bookingReference: string;
  flightDetails: Flight;
  seatNumber: string;
  passengerDetails: Passenger;
}

export interface ICancellationResponse {
  message: string;
}

export interface ISeatModificationResponse {
  bookingReference: string;
  newSeatNumber: string;
}

export interface IPassengerListResponse {
  passenger: Passenger;
  seatNumber: string;
}

export { BookingStatus, ISeat, IFlightConstructor };
