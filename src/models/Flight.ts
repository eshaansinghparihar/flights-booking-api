export interface IFlightConstructor {
    flightNumber: string;
    origin: string;
    destination: string;
    departureDate: string;
    totalSeats: number;
}

export interface ISeat {
    seatId: string;
    seatNumber: string;
    isAvailable: boolean;
}


export class Flight {
    readonly flightId: string;
    readonly flightNumber: string;
    readonly origin: string;
    readonly destination: string;
    readonly departureDate: string;
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
        seatNumber: `${Math.floor(index / 4) + 1}${String.fromCharCode(
          65 + (index % 4)
        )}`,
        isAvailable: true,
      }));
    }
  }