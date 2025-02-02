import router from "./src/routes/flightBookingRoutes";
import { errorHandler } from "./src/middlewares/errorHandling";
import { initializeSampleFlights } from "./src/middlewares/initializeFlights";

const express = require("express");

const app = express();
app.use(express.json());
app.use(errorHandler);
app.use(initializeSampleFlights);

const PORT = process.env.PORT || 8000;
app.use("/", router);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

