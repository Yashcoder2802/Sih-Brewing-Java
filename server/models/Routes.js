const mongoose = require("mongoose");

// Define a Mongoose schema for the Routes collection
const RouteSchema = mongoose.Schema({
  id: {
    type: Number,
    required: [true, "ID is required"],
  },
  bus_number: {
    type: String,
    required: [true, "Bus number is required"],
  },
  bus_stop_name: [
    {
      type: String,
      required: [true, "Bus stop name is required"],
    },
  ],
  stop_order: [
    {
      type: Number,
      required: [true, "Stop order is required"],
    },
  ],
});

// Create a model for the Routes collection
const Route = mongoose.model("Route", RouteSchema);

// CRUD operations

// Create (Insert) a new route
const createRoute = async (data) => {
  try {
    const route = new Route(data);
    return await route.save();
  } catch (error) {
    throw error;
  }
};

// Read (Retrieve) routes
const getAllRoutes = async () => {
  try {
    return await Route.find();
  } catch (error) {
    throw error;
  }
};

const getRouteById = async (id) => {
  try {
    const route = await Route.findOne({ id }).sort({ stop_order: 1 }); // Sorting by stop_order in ascending order
    return route;
  } catch (error) {
    throw error;
  }
};

// Update a route by ID
const updateRouteById = async (id, newData) => {
  try {
    return await Route.findOneAndUpdate({ id }, newData, { new: true });
  } catch (error) {
    throw error;
  }
};

// Delete a route by ID
const deleteRouteById = async (id) => {
  try {
    return await Route.deleteOne({ id });
  } catch (error) {
    throw error;
  }
};

const getRoutesBetweenStops = async (startStopName, endStopName) => {
  try {
      // Query the Routes collection
      const routes = await Route.find({
          bus_stop_name: { 
              $all: [startStopName, endStopName] // both stops should be in the route
          }
      });

      // Filter out routes where start comes before end
      const validRoutes = routes.filter(route => {
          const startIndex = route.bus_stop_name.indexOf(startStopName);
          const endIndex = route.bus_stop_name.indexOf(endStopName);

          return startIndex < endIndex;
      });

      return validRoutes;

  } catch (error) {
      throw error;
  }
};

module.exports = {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRouteById,
  deleteRouteById,
  getRoutesBetweenStops,
};
