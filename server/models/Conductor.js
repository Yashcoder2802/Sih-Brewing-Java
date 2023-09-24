const mongoose = require("mongoose");

// Define a Mongoose schema for the Conductor collection
const ConductorSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

// Create a model for the Conductor collection
const Conductor = mongoose.model("Conductor", ConductorSchema);

// CRUD operations

// Create (Insert) a new conductor
const createConductor = async (data) => {
  try {
    const conductor = new Conductor(data);
    return await conductor.save();
  } catch (error) {
    throw error;
  }
};

// Read (Retrieve) conductors
const getAllConductors = async () => {
  try {
    return await Conductor.find();
  } catch (error) {
    throw error;
  }
};

const getConductorById = async (conductor_id) => {
  try {
    return await Conductor.findOne({ conductor_id });
  } catch (error) {
    throw error;
  }
};

// Update a conductor by email
const updateConductorByEmail = async (email, newData) => {
  try {
    return await Conductor.findOneAndUpdate({ email }, newData, { new: true });
  } catch (error) {
    throw error;
  }
};

// Delete a conductor by email
const deleteConductorByEmail = async (email) => {
  try {
    return await Conductor.deleteOne({ email });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createConductor,
  getAllConductors,
  getConductorById,
  updateConductorByEmail,
  deleteConductorByEmail,
};
