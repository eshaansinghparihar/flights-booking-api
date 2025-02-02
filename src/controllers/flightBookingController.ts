import { Flight, IFlightConstructor, ISeat } from '../models/Flight';
import { Booking, BookingStatus, IBookingResponse, ICancellationResponse, ISeatModificationResponse } from '../models/Booking';
import { Passenger, IPassengerDetails, IPassengerListResponse } from '../models/Passenger';

import { FlightBookingService } from "../services/flightBookingService";

export class FlightBookingController{
  private static instance: FlightBookingController;
  private flights: Map<string, Flight>;
  private bookings: Map<string, Booking>;
  private passengers: Map<string, Passenger>;
  private readonly flightBookingService : FlightBookingService

  constructor() {
    this.flights = new Map<string, Flight>();
    this.bookings = new Map<string, Booking>();
    this.passengers = new Map<string, Passenger>();
    this.flightBookingService = new FlightBookingService();
  }

  static getInstance() {
    if (!FlightBookingController.instance) {
        console.info("Creating a new instance of FlightBookingController");
        FlightBookingController.instance = new FlightBookingController();
      } else {
        console.info("Using existing instance of FlightBookingController");
    }
    return FlightBookingController.instance;
  }

  public initializeFlights(flights: Map<string, Flight>) {
    this.flights = flights;
  }

  public getFleet(){
    return this.flights;
  }

  async bookFlight(passengerDetails: IPassengerDetails,
    flightNumber: string
  ): Promise<IBookingResponse|undefined> {
    const booking = await this.flightBookingService.bookFlight(passengerDetails, flightNumber, FlightBookingController.instance.flights, FlightBookingController.instance.passengers, FlightBookingController.instance.bookings);
    return booking;
  }

  async getFlightTicketDetails(email: string) {
    throw new Error("Method not implemented.");
  }

  async getAllPassengers(flightId: string) {
    throw new Error("Method not implemented.");
  }

  async cancelBooking(email: any, bookingReference: any) {
    throw new Error("Method not implemented.");
  }
  async modifySeat(email: any, bookingReference: any, newSeatNumber: any) {
    throw new Error("Method not implemented.");
  }
}