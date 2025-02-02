export interface IPassengerListResponse {
    passenger: Passenger;
    seatNumber: string;
  }

export interface IPassengerDetails {
    name: string;
    email: string;
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
  