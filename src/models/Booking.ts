import { Flight } from "./Flight";
import { Passenger } from "./Passenger";

export enum BookingStatus {
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    PENDING = "PENDING",
  }

export class Booking {
    readonly bookingId: string;
    readonly flightId: string;
    readonly passengerId: string;
    seatId: string;
    status: BookingStatus;
    readonly PNR: string;
    readonly createdAt: Date;
  
    constructor(flightId: string, passengerId: string, seatId: string) {
      this.bookingId = Math.random().toString(36).substr(2, 9);
      this.flightId = flightId;
      this.passengerId = passengerId;
      this.seatId = seatId;
      this.status = BookingStatus.CONFIRMED;
      this.PNR = Math.random()
        .toString(36)
        .toUpperCase()
        .substr(2, 6);
      this.createdAt = new Date();
    }
  }

export interface IBookingResponse {
    PNR: string;
    flightDetails: Flight;
    seatNumber: string;
    passengerDetails: Passenger;
  }

export interface ICancellationResponse {
    message: string;
  }

export interface ISeatModificationResponse {
    PNR: string;
    newSeatNumber: string;
  }