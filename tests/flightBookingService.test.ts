// const {
//   FlightBookingService,
// } = require("../src/services/flightBookingService");

// const { Flight } = require("../src/models/types");

// describe("FlightBookingService", () => {
//   let service : typeof FlightBookingService;
//   let testFlight : typeof Flight;

//   beforeEach(() => {
//     service = new FlightBookingService();
//     testFlight = new Flight("FL123", "NYC", "LAX", new Date("2024-03-01"), 6);
//     service.flights.set(testFlight.flightId, testFlight);
//   });

//   describe("bookFlight", () => {
//     it("should successfully book a flight", async () => {
//       const booking = await service.bookFlight(
//         { name: "John Doe", email: "john@example.com" },
//         testFlight.flightId
//       );

//       expect(booking.passengerDetails.name).toBe("John Doe");
//       expect(booking.flightDetails.flightNumber).toBe("FL123");
//       expect(booking.bookingReference).toBeDefined();
//     });

//     it("should throw error when flight is full", async () => {
//       // Book all seats
//       for (let i = 0; i < 6; i++) {
//         await service.bookFlight(
//           { name: `Passenger ${i}`, email: `passenger${i}@example.com` },
//           testFlight.flightId
//         );
//       }

//       await expect(
//         service.bookFlight(
//           { name: "Late Passenger", email: "late@example.com" },
//           testFlight.flightId
//         )
//       ).rejects.toThrow("No seats available");
//     });
//   });

//   describe("getFlightTicketDetails", () => {
//     it("should return ticket details for a booked passenger", async () => {
//       await service.bookFlight(
//         { name: "John Doe", email: "john@example.com" },
//         testFlight.flightId
//       );

//       const tickets = await service.getFlightTicketDetails("john@example.com");
//       expect(tickets).toHaveLength(1);
//       expect(tickets[0].passengerDetails.name).toBe("John Doe");
//     });
//   });

//   describe("cancelBooking", () => {
//     it("should successfully cancel a booking", async () => {
//       const booking = await service.bookFlight(
//         { name: "John Doe", email: "john@example.com" },
//         testFlight.flightId
//       );

//       const result = await service.cancelBooking(
//         "john@example.com",
//         booking.bookingReference
//       );
//       expect(result.message).toBe("Booking cancelled successfully");

//       // Verify seat is available again
//       const seat = testFlight.seats.find(
//         (s: { seatNumber: any; }) => s.seatNumber === booking.seatNumber
//       );
//       expect(seat.isAvailable).toBe(true);
//     });
//   });
// });
