import { useEffect, useState } from "react";

import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation
} from "../services/api";

function Locations() {
  const [locations, setLocations] = useState([]);

  const [waterbody, setWaterbody] = useState("");
  const [areaName, setAreaName] = useState("");
  const [notes, setNotes] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadLocations() {
    try {
      setError("");

      const data = await getLocations();
      setLocations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLocations();
  }, []);

  function resetForm() {
    setWaterbody("");
    setAreaName("");
    setNotes("");
    setEditingId(null);
  }

  function startEditing(location) {
    setEditingId(location.id);
    setWaterbody(location.waterbody || "");
    setAreaName(location.area_name || "");
    setNotes(location.notes || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!waterbody.trim()) {
      setError("Waterbody is required");
      return;
    }

    const locationData = {
      waterbody: waterbody.trim(),
      area_name: areaName.trim() || null,
      notes: notes.trim() || null
    };

    try {
      setSaving(true);
      setError("");

      if (editingId !== null) {
        const updatedLocation = await updateLocation(
          editingId,
          locationData
        );

        setLocations((currentLocations) =>
          currentLocations.map((location) =>
            location.id === editingId
              ? updatedLocation
              : location
          )
        );
      } else {
        const newLocation = await createLocation(locationData);

        setLocations((currentLocations) => [
          newLocation,
          ...currentLocations
        ]);
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(location) {
    const confirmed = window.confirm(
      `Delete ${location.waterbody}${
        location.area_name
          ? ` - ${location.area_name}`
          : ""
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteLocation(location.id);

      setLocations((currentLocations) =>
        currentLocations.filter(
          (item) => item.id !== location.id
        )
      );

      if (editingId === location.id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="locations-page">
      <div className="page-heading">
        <h2>Locations</h2>

        <p>
          Save fishing waters and specific areas inside them.
        </p>
      </div>

      <form
        className="location-form"
        onSubmit={handleSubmit}
      >
        <h3>
          {editingId !== null
            ? "Edit location"
            : "Add location"}
        </h3>

        <label>
          Waterbody

          <input
            type="text"
            value={waterbody}
            onChange={(event) =>
              setWaterbody(event.target.value)
            }
           
          />
        </label>

        <label>
          Area in waterbody

          <input
            type="text"
            value={areaName}
            onChange={(event) =>
              setAreaName(event.target.value)
            }
           
          />
        </label>

        <label>
          Notes

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            
            rows="4"
          />
        </label>

        <div className="form-actions">
          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId !== null
              ? "Save changes"
              : "Add location"}
          </button>

          {editingId !== null && (
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

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="location-list">
        <h3>Saved locations</h3>

        {loading && (
          <p>Loading locations...</p>
        )}

        {!loading &&
          locations.length === 0 && (
            <p>No locations saved yet.</p>
          )}

        {!loading &&
          locations.map((location) => (
            <article
              className="location-item"
              key={location.id}
            >
              <div className="location-content">
                <h4>
                  {location.waterbody}
                </h4>

                {location.area_name && (
                  <p>
                    <strong>Area:</strong>{" "}
                    {location.area_name}
                  </p>
                )}

                {location.notes && (
                  <p>
                    <strong>Notes:</strong>{" "}
                    {location.notes}
                  </p>
                )}
              </div>

              <div className="location-actions">
                <button
                  type="button"
                  onClick={() =>
                    startEditing(location)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    handleDelete(location)
                  }
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

export default Locations;
