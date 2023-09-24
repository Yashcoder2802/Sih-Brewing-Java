const mongoose = require("mongoose");
const Conductor = require("./Conductor")
const Routes = require("./Routes");

const LiveTableSchema = mongoose.Schema({
  conductor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conductor",
    required: [true, "Conductor ID is required"],
  },
  conductor_name: {
    type: String,
    required: [true, "Conductor name is required"],
  },
  route_number: {
    type: String,
    required: [true, "Route number is required"],
  },
  next_stop_order: {
    type: Number,
    required: [true, "Next stop order is required"],
  },
  direction: {
    type: String,
    required: [true, "Direction is required"],
  },
  next_stop: {
    type: String,
    required: [true, "Next stop is required"],
  },
  start_stop: {
    type: String,
    required: [true, "Start stop is required"],
  },
  end_stop: {
    type: String,
    required: [true, "End stop is required"],
  },
});

const LiveTable = mongoose.model("LiveTable", LiveTableSchema);

// const createLiveTableRecord = async (data) => {
//   try {
//     const liveTableRecord = await LiveTable.create(data);
//     return liveTableRecord;
//   } catch (error) {
//     throw error;
//   }
// };

const createLiveTableRecord = async (conductorId, routeId) => {
  try {
    // Retrieve conductor data based on conductorId
    const conductor = await Conductor.findOne({ id: conductorId });
    if (!conductor) {
      throw new Error('Conductor not found');
    }

    // Retrieve route data based on routeId
    const route = await Routes.findOne({ id: routeId });
    if (!route) {
      throw new Error('Route not found');
    }

    // Define the data to be inserted into the LiveTable
    const data = {
      conductor_id: conductor.id,
      conductor_name: conductor.name,
      route_number: route.bus_number,
      next_stop_order: 1,
      direction: 1,
      next_stop: route.bus_stop_name[0], // Assuming bus_stop_name is an array
      start_stop: route.bus_stop_name[0], // Assuming bus_stop_name is an array
      end_stop: route.bus_stop_name[route.bus_stop_name.length - 1], // Last stop in the array
    };

    // Create the LiveTable record with the populated data
    const liveTableRecord = await LiveTable.create(data);

    return liveTableRecord;
  } catch (error) {
    throw error;
  }
};

// READ - Get a LiveTable record by ID
const getLiveTableRecordById = async (id) => {
  try {
    const liveTableRecord = await LiveTable.findById(id).populate(
      "conductor_id"
    );
    return liveTableRecord;
  } catch (error) {
    throw error;
  }
};

// READ - Get all LiveTable records
const getAllLiveTableRecords = async () => {
  try {
    const liveTableRecords = await LiveTable.find().populate("conductor_id");
    return liveTableRecords;
  } catch (error) {
    throw error;
  }
};

// UPDATE - Update a LiveTable record by ID
const updateLiveTableRecordById = async (id, data) => {
  try {
    const liveTableRecord = await LiveTable.findByIdAndUpdate(id, data, {
      new: true,
    });
    return liveTableRecord;
  } catch (error) {
    throw error;
  }
};

// DELETE - Delete a LiveTable record by ID
const deleteLiveTableRecordById = async (id) => {
  try {
    const liveTableRecord = await LiveTable.findByIdAndRemove(id);
    return liveTableRecord;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  LiveTable,
  createLiveTableRecord,
  getLiveTableRecordById,
  getAllLiveTableRecords,
  updateLiveTableRecordById,
  deleteLiveTableRecordById,
};
