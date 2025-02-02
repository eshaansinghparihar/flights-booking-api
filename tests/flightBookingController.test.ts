import { FlightBookingController } from "../src/controllers/flightBookingController";
import { FlightBookingService } from "../src/services/flightBookingService";
import { Flight } from "../src/models/Flight";
import { Booking, BookingStatus } from "../src/models/Booking";
import { Passenger } from "../src/models/Passenger";

// Mocking the service class
jest.mock('../src/services/flightBookingService');

describe('FlightBookingController', () => {
  let controller: FlightBookingController;
  let mockService: jest.Mocked<FlightBookingService>;

  beforeEach(() => {
    mockService = new FlightBookingService() as jest.Mocked<FlightBookingService>;
    controller = new FlightBookingController(mockService);
  });

  test('should book a flight', async () => {
    const mockFlight = new Flight({ flightNumber: 'FL123', origin: 'BLR', destination: 'BOM', departureDate: new Date().toLocaleDateString(), totalSeats: 10 });
    const mockPassenger = new Passenger('John Doe', 'john@example.com');
    const mockBooking = new Booking('FL123', mockPassenger.passengerId, '1A');

    const mockFlights = new Map().set(mockFlight.flightNumber, mockFlight);
    FlightBookingController.getInstance().initializeFlights(mockFlights)

    mockService.bookFlight.mockResolvedValueOnce({
      PNR: mockBooking.PNR,
      flightDetails: mockFlight,
      seatNumber: '1A',
      passengerDetails: mockPassenger,
    });

    const bookingResponse = await controller.bookFlight({ name: 'John Doe', email: 'john@example.com' }, 'FL123');
    expect(bookingResponse).toBeDefined();
    expect(bookingResponse?.PNR).toBe(mockBooking.PNR);
    expect(FlightBookingController.getInstance().getFleet().size).toBe(1);
    expect(mockService.bookFlight).toHaveBeenCalled()
  });

  test('should get flight ticket details by email', async () => {
    const mockFlight = new Flight({ flightNumber: 'FL123', origin: 'BLR', destination: 'BOM', departureDate: '2023-12-31', totalSeats: 10 });
    const mockPassenger = new Passenger('John Doe', 'john@example.com');
    const mockBooking = new Booking('FL123', mockPassenger.passengerId, '1A');

    mockService.getFlightTicketDetails.mockResolvedValue([{
      PNR: mockBooking.PNR,
      flightDetails: mockFlight,
      seatNumber: '1A',
      passengerDetails: mockPassenger,
    }]);

    const ticketDetails = await controller.getFlightTicketDetails('john@example.com');
    expect(ticketDetails).toHaveLength(1);
    expect(ticketDetails[0].PNR).toBe(mockBooking.PNR);
  });

  test('should cancel a booking', async () => {
    const mockFlight = new Flight({ flightNumber: 'FL123', origin: 'BLR', destination: 'BOM', departureDate: '2023-12-31', totalSeats: 10 });
    const mockPassenger = new Passenger('John Doe', 'john@example.com');
    const mockBooking = new Booking('FL123', mockPassenger.passengerId, '1A');
    mockBooking.status = BookingStatus.CONFIRMED;

    mockService.cancelBooking.mockResolvedValue({ message: 'Booking cancelled successfully' });

    const cancelResponse = await controller.cancelBooking('john@example.com', mockBooking.PNR);
    expect(cancelResponse.message).toBe('Booking cancelled successfully');
  });
  
  test('should modify seat', async () => {
    const mockFlight = new Flight({ flightNumber: 'FL123', origin: 'BLR', destination: 'BOM', departureDate: '2023-12-31', totalSeats: 10 });
    const mockPassenger = new Passenger('John Doe', 'john@example.com');
    const mockBooking = new Booking('FL123', mockPassenger.passengerId, '1A');
    mockBooking.status = BookingStatus.CONFIRMED;

    mockService.modifySeat.mockResolvedValue({ PNR: mockBooking.PNR, newSeatNumber: '2A' });

    const modifySeatResponse = await controller.modifySeat('john@example.com', mockBooking.PNR, '2A');
    expect(modifySeatResponse.newSeatNumber).toBe('2A');
  });
});
