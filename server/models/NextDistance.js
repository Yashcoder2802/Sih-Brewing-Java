const mongoose = require("mongoose");
const geolib = require("geolib");
const googleMapsClient = require("@google/maps").createClient({
  key: "AIzaSyB4r1Cn6UoyYUxP3XCIx-YLE1I0MysGpOw", // Replace with your Google Maps API key
  Promise: Promise,
});

const NextDistanceSchema = mongoose.Schema({
  conductor_id: {
    type: String,
    required: [true, "Conductor ID is required"],
  },
  distance_to_next: {
    type: Number,
    required: [true, "Distance to next stop is required"],
  },
  next_stop_longitude: {
    type: Number,
    required: [true, "Next stop longitude is required"],
  },
  next_stop_latitude: {
    type: Number,
    required: [true, "Next stop latitude is required"],
  },
});

// Mongoose model imports
const Conductor = require("./Conductor");
const Routes = require("./Routes");
const { LiveTable } = require("./LiveTable");
const { BusStop } = require("./BusStop");
const NextDistance = mongoose.model("NextDistance", NextDistanceSchema);

const getConductorNextStopDistance = async (conductorId) => {
  try {
    // 1. Fetching Next Stop Latitude and Longitude for the Conductor
    const liveData = await LiveTable.findOne({ conductor_id: conductorId });

    if (!liveData) {
      throw new Error("Conductor data not found in 'LiveTable' collection");
    }

    const busStopNumber = liveData.next_stop;
    const busStopData = await BusStop.findOne({
      bus_stop_number: busStopNumber,
    });

    if (!busStopData) {
      throw new Error("Bus stop not found in 'BusStop' collection");
    }

    const nextStop = {
      latitude: busStopData.latitude,
      longitude: busStopData.longitude,
    };

    // 2. Getting Current Location of the Conductor
    // if (!("geolocation" in navigator)) {
    //   throw new Error("Geolocation is not available in this browser.");
    // }

    // const currentLocation = await new Promise((resolve, reject) => {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       resolve({
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //       });
    //     },
    //     (error) => {
    //       reject(error);
    //     }
    //   );
    // });

    const currentLocation = {
      latitude: 40.7128, // Example latitude
      longitude: -74.006, // Example longitude
    };

    // 3. Calculating Distance to Next Stop for the Conductor
    const distance = geolib.getDistance(currentLocation, nextStop);

    // 4. Updating Distance to Next Stop for the Conductor in the Database
    await NextDistance.findOneAndUpdate(
      { conductor_id: conductorId },
      {
        distance_to_next: distance,
        next_stop_longitude: nextStop.longitude,
        next_stop_latitude: nextStop.latitude,
      }
    );

    return distance;
  } catch (error) {
    throw new Error(`Error calculating next stop distance: ${error.message}`);
  }
};

const getETA = async (origin, destination) => {
  try {
    const response = await googleMapsClient
      .directions({
        origin: {
          // latitude: origin.latitude,
          // longitude: origin.longitude,
          latitude: 19.1150281,
          longitude: 72.8398195,
        },
        destination: {
          // latitude: destination.latitude,
          // longitude: destination.longitude,
          latitude: 32.248021,
          longitude: 77.173488,
        },
        mode: "driving", // you can change the mode to walking, bicycling, etc.
      })
      .asPromise();

    if (
      response &&
      response.json &&
      response.json.routes &&
      response.json.routes.length > 0
    ) {
      const route = response.json.routes[0];
      if (route.legs && route.legs.length > 0) {
        const leg = route.legs[0];
        return {
          distance: leg.distance.text,
          duration: leg.duration.text,
        };
      }
    }
    throw new Error("Unable to retrieve ETA.");
  } catch (error) {
    throw error;
  }
};

const findNextBusStop = async (conductorId) => {
  try {
    const liveData = await LiveTable.findOne({ conductor_id: conductorId });

    if (!liveData) {
      throw new Error("Conductor data not found in 'LiveTable' collection");
    }

    const busStopNumber = liveData.next_stop;
    const busStopData = await BusStop.findOne({
      bus_stop_number: busStopNumber,
    });

    if (!busStopData) {
      throw new Error("Bus stop not found in 'BusStop' collection");
    }

    return {
      latitude: busStopData.latitude,
      longitude: busStopData.longitude,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getConductorNextStopDistance,
  getETA,
  findNextBusStop,
};