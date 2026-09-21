import { useEffect, useState } from "react";

import {
  getCatches,
  createCatch,
  updateCatch,
  deleteCatch,
  getTrips,
  getSpecies,
  getLures
} from "../services/api";

function Catches() {
  const [catches, setCatches] = useState([]);
  const [trips, setTrips] = useState([]);
  const [species, setSpecies] = useState([]);
  const [lures, setLures] = useState([]);

  const [tripId, setTripId] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [lureId, setLureId] = useState("");
  const [caughtAt, setCaughtAt] = useState("");
  const [lengthCm, setLengthCm] = useState("");
  const [weightG, setWeightG] = useState("");
  const [depthM, setDepthM] = useState("");
  const [released, setReleased] = useState(true);
  const [notes, setNotes] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [
        catchesData,
        tripsData,
        speciesData,
        luresData
      ] = await Promise.all([
        getCatches(),
        getTrips(),
        getSpecies(),
        getLures()
      ]);

      setCatches(catchesData);
      setTrips(tripsData);
      setSpecies(speciesData);
      setLures(luresData);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function resetForm() {
    setTripId("");
    setSpeciesId("");
    setLureId("");
    setCaughtAt("");
    setLengthCm("");
    setWeightG("");
    setDepthM("");
    setReleased(true);
    setNotes("");
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!editingId && !tripId) {
      setError("Fishing trip is required");
      return;
    }

    const data = {
      trip_id: tripId ? Number(tripId) : undefined,
      species_id: speciesId ? Number(speciesId) : null,
      lure_id: lureId ? Number(lureId) : null,
      caught_at: caughtAt || null,
      length_cm: lengthCm ? Number(lengthCm) : null,
      weight_g: weightG ? Number(weightG) : null,
      depth_m: depthM ? Number(depthM) : null,
      released,
      notes: notes || null
    };

    try {
      if (editingId !== null) {
        delete data.trip_id;
        await updateCatch(editingId, data);
      } else {
        await createCatch(data);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEditing(item) {
    setEditingId(item.id);
    setTripId(item.trip_id || "");
    setSpeciesId(item.species_id || "");
    setLureId(item.lure_id || "");
    setCaughtAt(
      item.caught_at
        ? item.caught_at.slice(0, 16)
        : ""
    );
    setLengthCm(item.length_cm || "");
    setWeightG(item.weight_g || "");
    setDepthM(item.depth_m || "");
    setReleased(item.released ?? true);
    setNotes(item.notes || "");
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete catch?")) {
      return;
    }

    try {
      await deleteCatch(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <h2>Catches</h2>
      </div>

      <form className="data-form" onSubmit={handleSubmit}>
        <label>
          Fishing trip
          <select
            value={tripId}
            disabled={editingId !== null}
            onChange={(e) => setTripId(e.target.value)}
          >
            <option value=""></option>

            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.waterbody || "Trip"} -{" "}
                {new Date(trip.start_time).toLocaleString()}
              </option>
            ))}
          </select>
        </label>

        <label>
          Species
          <select
            value={speciesId}
            onChange={(e) => setSpeciesId(e.target.value)}
          >
            <option value=""></option>

            {species.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Lure
          <select
            value={lureId}
            onChange={(e) => setLureId(e.target.value)}
          >
            <option value=""></option>

            {lures.map((lure) => (
              <option key={lure.id} value={lure.id}>
                {lure.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Catch time
          <input
            type="datetime-local"
            value={caughtAt}
            onChange={(e) => setCaughtAt(e.target.value)}
          />
        </label>

        <label>
          Length cm
          <input
            type="number"
            step="0.1"
            value={lengthCm}
            onChange={(e) => setLengthCm(e.target.value)}
          />
        </label>

        <label>
          Weight g
          <input
            type="number"
            value={weightG}
            onChange={(e) => setWeightG(e.target.value)}
          />
        </label>

        <label>
          Depth m
          <input
            type="number"
            step="0.1"
            value={depthM}
            onChange={(e) => setDepthM(e.target.value)}
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={released}
            onChange={(e) => setReleased(e.target.checked)}
          />
          Released
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
            {editingId ? "Save changes" : "Add catch"}
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
        {catches.map((item) => (
          <article className="data-item" key={item.id}>
            <div>
              <h3>{item.species_name || "Catch"}</h3>

              {item.waterbody && (
                <p>
                  {item.waterbody}
                  {item.area_name
                    ? ` - ${item.area_name}`
                    : ""}
                </p>
              )}

              {item.lure_name && (
                <p>Lure: {item.lure_name}</p>
              )}

              {item.length_cm && (
                <p>Length: {item.length_cm} cm</p>
              )}

              {item.weight_g && (
                <p>Weight: {item.weight_g} g</p>
              )}
            </div>

            <div className="item-actions">
              <button onClick={() => startEditing(item)}>
                Edit
              </button>

              <button
                className="delete-button"
                onClick={() => handleDelete(item.id)}
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

export default Catches;
