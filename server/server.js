const connectDB = require("./db");
const express = require("express");
const mongoose = require("mongoose");
const geolib = require("geolib");
const cors = require("cors");

connectDB();
const app = express();
const port = 8000; // Specify the port you want your server to run on
const Conductor = require("./models/Conductor");
const Routes = require("./models/Routes");
const LiveTable = require("./models/LiveTable");
const BusStop = require("./models/BusStop");
const NextDistance = require("./models/NextDistance");

app.use(express.json());
app.use(cors());

app.post("/conductors", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newConductor = await Conductor.createConductor({
      name,
      email,
      password,
    });
    console.log(req);
    res.status(201).json(newConductor);
  } catch (error) {
    console.error("Error creating conductor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/conductors", async (req, res) => {
  try {
    // Use the getAllConductors function to retrieve all conductor documents
    const conductors = await Conductor.getAllConductors();

    // Send the array of conductors as a JSON response
    res.json(conductors);
  } catch (error) {
    console.error("Error fetching conductors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/routes", async (req, res) => {
  try {
    const { id, bus_number, bus_stop_name, stop_order } = req.body;
    const newRoute = await Routes.createRoute({
      id,
      bus_number,
      bus_stop_name,
      stop_order,
    });
    res.status(201).json(newRoute);
  } catch (error) {
    console.error("Error creating route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/routes", async (req, res) => {
  try {
    const routes = await Routes.getAllRoutes();
    res.json(routes);
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/routes/:id", async (req, res) => {
  try {
    const routeId = req.params.id;
    const route = await Routes.getRouteById(routeId);
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }
    res.json(route);
  } catch (error) {
    console.error("Error fetching route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/routes/:id", async (req, res) => {
  try {
    const routeId = req.params.id;
    const newData = req.body;
    const updatedRoute = await Routes.updateRouteById(routeId, newData);
    if (!updatedRoute) {
      return res.status(404).json({ error: "Route not found" });
    }
    res.json(updatedRoute);
  } catch (error) {
    console.error("Error updating route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/routes/:id", async (req, res) => {
  try {
    const routeId = req.params.id;
    const result = await Routes.deleteRouteById(routeId);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Route not found" });
    }
    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error("Error deleting route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/routesBetweenStops', async (req, res) => {
  console.log("Endpoint /routesBetweenStops accessed!");
  const { startStopName, endStopName } = req.query;

  if (!startStopName || !endStopName) {
    return res.status(400).send({ error: 'Both startStopName and endStopName are required!' });
  }

  try {
    const routes = await Routes.getRoutesBetweenStops(startStopName, endStopName);
    res.status(200).send(routes);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// CREATE - Create a new LiveTable record
app.post("/live-table", async (req, res) => {
  try {
    const data = req.body;
    const liveTableRecord = await LiveTable.createLiveTableRecord(data);
    res.status(201).json(liveTableRecord);
  } catch (error) {
    console.error("Error creating LiveTable record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// READ - Get a LiveTable record by ID
app.get("/live-table/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const liveTableRecord = await LiveTable.getLiveTableRecordById(id);
    if (!liveTableRecord) {
      return res.status(404).json({ error: "LiveTable record not found" });
    }
    res.json(liveTableRecord);
  } catch (error) {
    console.error("Error fetching LiveTable record by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// READ - Get all LiveTable records
app.get("/live-table", async (req, res) => {
  try {
    const liveTableRecords = await LiveTable.getAllLiveTableRecords();
    res.json(liveTableRecords);
  } catch (error) {
    console.error("Error fetching all LiveTable records:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE - Update a LiveTable record by ID
app.put("/live-table/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const liveTableRecord = await LiveTable.updateLiveTableRecordById(id, data);
    if (!liveTableRecord) {
      return res.status(404).json({ error: "LiveTable record not found" });
    }
    res.json(liveTableRecord);
  } catch (error) {
    console.error("Error updating LiveTable record by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE - Delete a LiveTable record by ID
app.delete("/live-table/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const liveTableRecord = await LiveTable.deleteLiveTableRecordById(id);
    if (!liveTableRecord) {
      return res.status(404).json({ error: "LiveTable record not found" });
    }
    res.json(liveTableRecord);
  } catch (error) {
    console.error("Error deleting LiveTable record by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CREATE - Add a new Bus Stop
app.post("/bus-stops", async (req, res) => {
  try {
    const data = req.body;
    const busStop = await BusStop.addBusStop(data);
    res.status(201).json(busStop);
  } catch (error) {
    console.error("Error adding Bus Stop:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/bus-stops", async (req, res) => {
  try {
    const busStops = await BusStop.getAllBusStops();
    res.json(busStops);
  } catch (error) {
    console.error("Error fetching all bus stops:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET - Get a bus stop by number
app.get("/bus-stops/:busStopNumber", async (req, res) => {
  try {
    const busStopNumber = req.params.busStopNumber;
    const busStop = await BusStop.getBusStopByNumber(busStopNumber);
    if (!busStop) {
      return res.status(404).json({ error: "Bus Stop not found" });
    }
    res.json(busStop);
  } catch (error) {
    console.error("Error fetching bus stop by number:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE - Delete a Bus Stop by number
app.delete("/bus-stops/:busStopNumber", async (req, res) => {
  try {
    const busStopNumber = req.params.busStopNumber;
    const result = await BusStop.deleteBusStopByNumber(busStopNumber);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Bus Stop not found" });
    }
    res.json({ message: "Bus Stop deleted successfully" });
  } catch (error) {
    console.error("Error deleting Bus Stop:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/conductor-next-stop-distance/:conductorId", async (req, res) => {
  try {
    const conductorId = req.params.conductorId;
    const distance = await NextDistance.getConductorNextStopDistance(
      conductorId
    );

    // Sending back the calculated distance
    res.json({ distance });
  } catch (error) {
    console.error("Error fetching distance for conductor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/eta", async (req, res) => {
  try {
    const { startLat, startLong, endLat, endLong } = req.body;

    if (!startLat || !startLong || !endLat || !endLong) {
      return res
        .status(400)
        .json({ error: "All coordinates must be provided." });
    }

    const origin = {
      // latitude: parseFloat(startLat),
      // longitude: parseFloat(startLong),
      latitude: 19.1150281,
      longitude: 72.8398195,
    };

    const destination = {
      // latitude: parseFloat(endLat),
      // longitude: parseFloat(endLong),
      latitude: 32.248021,
      longitude: 77.173488,
    };

    const result = await NextDistance.getETA(origin, destination);
    res.json(result);
  } catch (error) {
    console.error("Error calculating ETA:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/createLiveTableRecord', async (req, res) => {
  try {
    const { conductorId, routeId } = req.body;

    if (!conductorId || !routeId) {
      return res.status(400).json({ error: 'conductorId and routeId are required' });
    }

    const liveTableRecord = await LiveTable.createLiveTableRecord(conductorId, routeId);

    return res.status(201).json({ message: 'LiveTable record created successfully', data: liveTableRecord });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/next-stop/:conductorId", async (req, res) => {
  try {
    const conductorId = req.params.conductorId;
    const nextStop = await NextDistance.findNextBusStop(conductorId);

    res.json(nextStop);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// // CREATE - Create a new NextDistance record
// app.post("/next-distances", async (req, res) => {
//   try {
//     const data = req.body;
//     const nextDistance = await NextDistance.createNextDistance(data);
//     res.status(201).json(nextDistance);
//   } catch (error) {
//     console.error("Error creating NextDistance record:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // READ - Get a NextDistance record by ID
// app.get("/next-distances/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const nextDistance = await NextDistance.getNextDistanceById(id);
//     if (!nextDistance) {
//       return res.status(404).json({ error: "NextDistance record not found" });
//     }
//     res.json(nextDistance);
//   } catch (error) {
//     console.error("Error fetching NextDistance record by ID:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // READ - Get all NextDistance records
// app.get("/next-distances", async (req, res) => {
//   try {
//     const nextDistances = await NextDistance.getAllNextDistances();
//     res.json(nextDistances);
//   } catch (error) {
//     console.error("Error fetching all NextDistance records:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // UPDATE - Update a NextDistance record by ID
// app.put("/next-distances/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const data = req.body;
//     const nextDistance = await NextDistance.updateNextDistanceById(id, data);
//     if (!nextDistance) {
//       return res.status(404).json({ error: "NextDistance record not found" });
//     }
//     res.json(nextDistance);
//   } catch (error) {
//     console.error("Error updating NextDistance record by ID:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // DELETE - Delete a NextDistance record by ID
// app.delete("/next-distances/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const nextDistance = await NextDistance.deleteNextDistanceById(id);
//     if (!nextDistance) {
//       return res.status(404).json({ error: "NextDistance record not found" });
//     }
//     res.json(nextDistance);
//   } catch (error) {
//     console.error("Error deleting NextDistance record by ID:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.get("/conductor-next-stop-distance/:conductorId", async (req, res) => {
  try {
    const conductorId = req.params.conductorId;
    const distance = await NextDistance.getConductorNextStopDistance(
      conductorId
    );

    // Sending back the calculated distance
    res.json({ distance });
  } catch (error) {
    console.error("Error fetching distance for conductor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get;

app.post('/api/send-location', async (req, res) => {
  const location = req.body;
  // You can now process the location data or perform any other actions
  console.log(location);
  // Send a response to the client
  res.send('Location received');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
