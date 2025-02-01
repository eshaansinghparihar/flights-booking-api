// api.test.ts
import request from 'supertest';
import { Flight, IBookingResponse, ICancellationResponse } from '../src/models/types';
import { FlightBookingService } from '../src/services/flightBookingService';

// Extend Express type to include our service
declare module 'express' {
    interface Application {
        bookingService: FlightBookingService;
    }
}

// Import your express app
import { app } from '../index';

describe('Flight Booking API', () => {
    // Helper function to get first flight with proper typing
    const getFirstFlight = (): Flight => {
        const flights: Flight[] = Array.from(app.bookingService.flights.values());
        if (flights.length === 0) {
            throw new Error('No flights available for testing');
        }
        return flights[0];
    };

    describe('POST /api/bookings', () => {
        it('should create a new booking', async () => {
            const firstFlight = getFirstFlight();

            const response = await request(app)
                .post('/api/bookings')
                .send({
                    name: 'John Doe',
                    email: 'john@example.com',
                    flightId: firstFlight.flightId
                });

            expect(response.status).toBe(201);
            const bookingResponse = response.body as IBookingResponse;
            expect(bookingResponse.bookingReference).toBeDefined();
            expect(bookingResponse.passengerDetails.name).toBe('John Doe');
        });

        it('should return 400 for invalid input', async () => {
            const response = await request(app)
                .post('/api/bookings')
                .send({
                    name: 'John Doe'
                    // missing email and flightId
                });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/bookings/passenger/:email', () => {
        it('should return bookings for a passenger', async () => {
            const firstFlight = getFirstFlight();

            // First create a booking
            const bookingResponse = await request(app)
                .post('/api/bookings')
                .send({
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    flightId: firstFlight.flightId
                });

            const response = await request(app)
                .get('/api/bookings/passenger/jane@example.com');

            expect(response.status).toBe(200);
            const bookings = response.body as IBookingResponse[];
            expect(Array.isArray(bookings)).toBe(true);
            expect(bookings[0].passengerDetails.email).toBe('jane@example.com');
        });
    });

    describe('POST /api/bookings/cancel', () => {
        it('should cancel a booking', async () => {
            const firstFlight = getFirstFlight();

            // First create a booking
            const bookingResponse = await request(app)
                .post('/api/bookings')
                .send({
                    name: 'Alice Smith',
                    email: 'alice@example.com',
                    flightId: firstFlight.flightId
                });

            const response = await request(app)
                .post('/api/bookings/cancel')
                .send({
                    email: 'alice@example.com',
                    bookingReference: (bookingResponse.body as IBookingResponse).bookingReference
                });

            expect(response.status).toBe(200);
            const cancellation = response.body as ICancellationResponse;
            expect(cancellation.message).toBe('Booking cancelled successfully');
        });
    });
});

// Helper types for testing
interface ErrorResponse {
    error: string;
}