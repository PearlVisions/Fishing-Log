import { useEffect, useState } from "react";

import {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  getLocations
} from "../services/api";

function Trips() {
  const [trips, setTrips] = useState([]);
  const [locations, setLocations] = useState([]);

  const [locationId, setLocationId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [weather, setWeather] = useState("");
  const [airTemperature, setAirTemperature] = useState("");
  const [waterTemperature, setWaterTemperature] = useState("");
  const [notes, setNotes] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [tripData, locationData] = await Promise.all([
        getTrips(),
        getLocations()
      ]);

      setTrips(tripData);
      setLocations(locationData);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function resetForm() {
    setLocationId("");
    setStartTime("");
    setEndTime("");
    setWeather("");
    setAirTemperature("");
    setWaterTemperature("");
    setNotes("");
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!startTime) {
      setError("Start time is required");
      return;
    }

    const data = {
      location_id: locationId ? Number(locationId) : null,
      start_time: startTime,
      end_time: endTime || null,
      weather: weather || null,
      air_temperature:
        airTemperature !== "" ? Number(airTemperature) : null,
      water_temperature:
        waterTemperature !== "" ? Number(waterTemperature) : null,
      notes: notes || null
    };

    try {
      if (editingId !== null) {
        await updateTrip(editingId, data);
      } else {
        await createTrip(data);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEditing(trip) {
    setEditingId(trip.id);
    setLocationId(trip.location_id || "");
    setStartTime(
      trip.start_time
        ? trip.start_time.slice(0, 16)
        : ""
    );
    setEndTime(
      trip.end_time
        ? trip.end_time.slice(0, 16)
        : ""
    );
    setWeather(trip.weather || "");
    setAirTemperature(trip.air_temperature || "");
    setWaterTemperature(trip.water_temperature || "");
    setNotes(trip.notes || "");
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete fishing trip?")) {
      return;
    }

    try {
      await deleteTrip(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <h2>Fishing trips</h2>
      </div>

      <form className="data-form" onSubmit={handleSubmit}>
        <label>
          Location
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
          >
            <option value=""></option>

            {locations.map((location) => (
              <option
                key={location.id}
                value={location.id}
              >
                {location.waterbody}
                {location.area_name
                  ? ` - ${location.area_name}`
                  : ""}
              </option>
            ))}
          </select>
        </label>

        <label>
          Start time
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>

        <label>
          End time
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>

        <label>
          Weather
          <input
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
          />
        </label>

        <label>
          Air temperature °C
          <input
            type="number"
            step="0.1"
            value={airTemperature}
            onChange={(e) =>
              setAirTemperature(e.target.value)
            }
          />
        </label>

        <label>
          Water temperature °C
          <input
            type="number"
            step="0.1"
            value={waterTemperature}
            onChange={(e) =>
              setWaterTemperature(e.target.value)
            }
          />
        </label>

        <label>
          Notes
          <textarea
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>

        <div className="form-actions">
          <button type="submit">
            {editingId ? "Save changes" : "Add trip"}
          </button>

          {editingId && (
            <button
              type="button"
              className="secondary-button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="item-list">
        {trips.map((trip) => (
          <article className="data-item" key={trip.id}>
            <div>
              <h3>
                {trip.waterbody || "No location"}
              </h3>

              {trip.area_name && <p>{trip.area_name}</p>}

              <p>
                {new Date(trip.start_time).toLocaleString()}
              </p>

              {trip.weather && <p>{trip.weather}</p>}
            </div>

            <div className="item-actions">
              <button onClick={() => startEditing(trip)}>
                Edit
              </button>

              <button
                className="delete-button"
                onClick={() => handleDelete(trip.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Trips;
