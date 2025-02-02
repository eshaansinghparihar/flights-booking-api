import { Flight } from '../models/Flight';
import { Booking, IBookingResponse, ICancellationResponse, ISeatModificationResponse } from '../models/Booking';
import { Passenger, IPassengerDetails, IPassengerListResponse } from '../models/Passenger';

import { FlightBookingService } from "../services/flightBookingService";

export class FlightBookingController{
  private static instance: FlightBookingController;
  private flights: Map<string, Flight>;
  private bookings: Map<string, Booking>;
  private passengers: Map<string, Passenger>;
  private readonly flightBookingService : FlightBookingService

  constructor(service?: FlightBookingService) {
    this.flights = new Map<string, Flight>();
    this.bookings = new Map<string, Booking>();
    this.passengers = new Map<string, Passenger>();
    this.flightBookingService = service || new FlightBookingService();
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
    'Purchasing Planes.....Painting Them.....Improving Ambience.....Lifting Tray Table.....Opening Window Shades.....Straightening Seats'
    this.flights = flights;
  }

  public getFleet(){
    return this.flights;
  }

  async bookFlight(passengerDetails: IPassengerDetails,
    flightNumber: string
  ): Promise<IBookingResponse|undefined> {
    try{
        const booking = await this.flightBookingService.bookFlight(passengerDetails, flightNumber, FlightBookingController.instance.flights, FlightBookingController.instance.passengers, FlightBookingController.instance.bookings);
        return booking;
    }
    catch(error){
        throw error;
    }
  }

  async getFlightTicketDetails(email: string) : Promise<IBookingResponse[]>{
    try{
        const response = await this.flightBookingService.getFlightTicketDetails(email, FlightBookingController.instance.flights, FlightBookingController.instance.passengers, FlightBookingController.instance.bookings);
        return response;
    }
    catch(error){
        throw error;
    }
  }

  async getAllPassengers(flightId: string) : Promise<IPassengerListResponse[]>{
    try{
        const passengers = await this.flightBookingService.getAllPassengers(flightId, FlightBookingController.instance.flights, FlightBookingController.instance.passengers, FlightBookingController.instance.bookings);
        return passengers;
    }
    catch(error){
        throw error;
    }
  }

  async cancelBooking(email: any, pnr: any) : Promise<ICancellationResponse>{
    try{
        const response = await this.flightBookingService.cancelBooking(email, pnr, FlightBookingController.instance.flights, FlightBookingController.instance.passengers, FlightBookingController.instance.bookings);
        return response;
    }
    catch(error){
        throw error;
    }
  }
  async modifySeat(email: any, bookingReference: any, newSeatNumber: any) : Promise<ISeatModificationResponse> {
    try{
        const response = await this.flightBookingService.modifySeat(email, bookingReference, newSeatNumber, FlightBookingController.instance.flights, FlightBookingController.instance.passengers, FlightBookingController.instance.bookings);
        return response;
    }
    catch(error)
    {
        throw error;
    }
  }
}