const mongoose = require("mongoose");

// Define a Mongoose schema for the BusStops collection
const BusStopSchema = mongoose.Schema({
  latitude: {
    type: Number,
    required: [true, "Latitude is required"],
  },
  longitude: {
    type: Number,
    required: [true, "Longitude is required"],
  },
  bus_stop_number: {
    type: String,
    required: [true, "Bus stop number is required"],
    unique: true,
  },
});

// Create a model for the BusStops collection
const BusStop = mongoose.model("BusStop", BusStopSchema);

// Add a bus stop
const addBusStop = async (data) => {
  try {
    const busStop = new BusStop(data);
    return await busStop.save();
  } catch (error) {
    throw error;
  }
};

// Delete a bus stop by number
const deleteBusStopByNumber = async (busStopNumber) => {
  try {
    return await BusStop.deleteOne({ bus_stop_number });
  } catch (error) {
    throw error;
  }
};

// Fetch all bus stops
const getAllBusStops = async () => {
  try {
    return await BusStop.find({}).exec();
  } catch (error) {
    throw error;
  }
};

// Fetch a bus stop by number
const getBusStopByNumber = async (busStopNumber) => {
  try {
    return await BusStop.findOne({ bus_stop_number }).exec();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  BusStop,
  addBusStop,
  deleteBusStopByNumber,
  getBusStopByNumber,
  getAllBusStops,
};
