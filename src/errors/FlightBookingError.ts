export class FlightBookingError extends Error {
    status: number;
    constructor(message: string, public statusCode : number = 400) {
      super(message);
      this.name = "FlightBookingError";
      this.status = statusCode
    }
  }