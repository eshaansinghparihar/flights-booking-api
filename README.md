# Flight Booking API

This is a Flight Booking API developed using **Node.js**, **Express.js**, **TypeScript**, and **Jest** for unit testing. The API provides several functionalities to manage flight bookings, such as booking tickets, retrieving ticket details, viewing all passengers, canceling bookings, and modifying seat assignments.

## Features

### 1. **Book Flight Ticket API**
   - **Description**: Users can book a flight by providing their personal details (name, email), destination, and travel date.
   - **Functionality**: 
     - Automatically assigns a seat based on availability.
     - Returns a booking confirmation with flight details, seat number, and passenger information.
   
   - **Endpoint**: `POST /api/bookings`
   - **Request body**:
     ```json
     {
       "name": "John Doe",
       "email": "john@example.com",
       "flightId": "FL123"
     }
     ```

### 2. **View Flight Ticket Details API**
   - **Description**: Retrieve the flight ticket details for a passenger by providing their email address.
   - **Functionality**: Returns a list of all the bookings for the passenger along with the flight and seat details.

   - **Endpoint**: `GET /api/bookings/passenger/:email`
   - **Parameters**:
     - `email`: The email of the passenger whose booking details are to be fetched.
   
### 3. **View All Passengers API**
   - **Description**: Retrieve a list of all passengers booked on a specific flight, along with their seat numbers.
   - **Functionality**: Returns a list of all passengers who are confirmed on the given flight.
   
   - **Endpoint**: `GET /api/flights/passengers/:flightId`
   - **Parameters**:
     - `flightId`: The ID of the flight to fetch passenger details for.

### 4. **Cancel Flight Ticket API**
   - **Description**: Allow a user to cancel their flight booking by providing their email and PNR (booking reference).
   - **Functionality**: Marks the booking as canceled and makes the seat available again.
   
   - **Endpoint**: `POST /api/bookings/cancel`
   - **Request body**:
     ```json
     {
       "email": "john@example.com",
       "PNR": "ABC123"
     }
     ```

### 5. **Modify Seat Assignment API**
   - **Description**: Allow a passenger to modify their seat assignment by providing their email, flight number, and new seat preference.
   - **Functionality**: Changes the seat of the passenger to the new seat if available and updates the booking details.
   
   - **Endpoint**: `POST /api/bookings/modify-seat`
   - **Request body**:
     ```json
     {
       "email": "john@example.com",
       "PNR": "ABC123",
       "newSeatNumber": "2A"
     }
     ```

## Technologies Used

- **Node.js**: JavaScript runtime used for server-side logic.
- **Express.js**: Web framework for building the API endpoints.
- **TypeScript**: Superset of JavaScript for type safety and better development experience.
- **Jest**: Testing framework used for writing and running unit tests.
- **NPM**: Package manager to manage dependencies.

## Installation and Setup

### Prerequisites

1. Ensure that **Node.js** and **NPM** are installed on your system.
   - You can download Node.js from [here](https://nodejs.org/).

### Steps to Set Up

1. Clone the repository:

   ```bash
   git clone https://github.com/eshaansinghparihar/flights-booking-api.git
   cd flights-booking-api

2. Install the dependencies:

    ```bash
    npm install

3. Start the server:

    ```bash
    npm run start

    The server will start running at http://localhost:8000.

4. Run Unit Tests:

    ```bash
    npm run test

## Endpoints Reference

A Postman Collection is included in the repository for easy access to the endpoints and testing the API manually. You can import the collection in your Postman app to get started.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
