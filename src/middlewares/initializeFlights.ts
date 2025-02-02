import { Request, Response, NextFunction } from "express";
import { FlightBookingController } from "../controllers/flightBookingController";
import { IFlightConstructor, Flight } from "../models/Flight";

export const initializeSampleFlights = (_req : Request,_res : Response, next : NextFunction) => {
    const bookingController = FlightBookingController.getInstance();
    if(!bookingController.getFleet().size)
    {
        console.log('Initializing Flights.....Dressing Crew.....Warming Cafe....Fueling Up......Ready to take off');
        const flight1 = new Flight({flightNumber: "FL123", origin: "BLR", destination : "BOM", departureDate : new Date().toLocaleDateString(), totalSeats : 16} as IFlightConstructor);
        const flight2 = new Flight({flightNumber: "FL124", origin: "BOM", destination : "BLR", departureDate : new Date().toLocaleDateString(), totalSeats : 16} as IFlightConstructor);
        const flight3 = new Flight({flightNumber: "FL125", origin: "BLR", destination : "CCU", departureDate : new Date().toLocaleDateString(), totalSeats : 16} as IFlightConstructor);
        const flight4 = new Flight({flightNumber: "FL126", origin: "CCU", destination : "BLR", departureDate : new Date().toLocaleDateString(), totalSeats : 16} as IFlightConstructor);
        const flights = new Map<string, Flight>();
        flights.set(flight1.flightNumber, flight1);
        flights.set(flight2.flightNumber, flight2);
        flights.set(flight3.flightNumber, flight3);
        flights.set(flight4.flightNumber, flight4);
        bookingController.initializeFlights(flights);
    }
    next();
  };