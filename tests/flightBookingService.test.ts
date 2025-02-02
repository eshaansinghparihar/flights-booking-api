import { FlightBookingService } from "../src/services/flightBookingService";
import { Flight, ISeat } from "../src/models/Flight";
import { Booking, BookingStatus } from "../src/models/Booking";
import { Passenger } from "../src/models/Passenger";
import { FlightBookingError } from "../src/errors/FlightBookingError";

jest.mock('../src/models/Flight');

describe.only('FlightBookingService', () => {
  let service: FlightBookingService;

  beforeEach(() => {
    service = new FlightBookingService();
  });

  test('should successfully book a flight', async () => {
    const mockFlight = new Flight({ flightNumber: 'FL123', origin: 'BLR', destination: 'BOM', departureDate: '2023-12-31', totalSeats: 10 });
    const mockPassenger = new Passenger('John Doe', 'john@example.com');
    const mockAvailableSeat: ISeat = { seatId: '1A', seatNumber: '1A', isAvailable: true };
    
    mockFlight.seats = [mockAvailableSeat];

    const booking = await service.bookFlight({ name: 'John Doe', email: 'john@example.com' }, 'FL123', new Map([['FL123', mockFlight]]), new Map([['john@example.com', mockPassenger]]), new Map());

    expect(booking).toBeDefined();
    expect(booking?.seatNumber).toBe('1A');
  });

  test('should throw error if flight not found', async () => {
    try {
      await service.getFlightTicketDetails('nonexistent@example.com', new Map(), new Map(), new Map());
    } catch (error: any) {
      expect(error).toBeInstanceOf(FlightBookingError);
      expect(error.message).toBe('No bookings found for this email');
    }
  });
});
