import { useEffect, useState } from "react";

import {
  getLures,
  createLure,
  updateLure,
  deleteLure
} from "../services/api";

function Lures() {
  const [lures, setLures] = useState([]);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [color, setColor] = useState("");
  const [lengthMm, setLengthMm] = useState("");
  const [weightG, setWeightG] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadLures() {
    try {
      setError("");

      const data = await getLures();
      setLures(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLures();
  }, []);

  function resetForm() {
    setName("");
    setType("");
    setManufacturer("");
    setColor("");
    setLengthMm("");
    setWeightG("");
    setEditingId(null);
  }

  function startEditing(lure) {
    setEditingId(lure.id);
    setName(lure.name || "");
    setType(lure.type || "");
    setManufacturer(lure.manufacturer || "");
    setColor(lure.color || "");
    setLengthMm(lure.length_mm || "");
    setWeightG(lure.weight_g || "");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Lure name is required");
      return;
    }

    const lureData = {
      name: name.trim(),
      type: type.trim() || null,
      manufacturer: manufacturer.trim() || null,
      color: color.trim() || null,
      length_mm: lengthMm ? Number(lengthMm) : null,
      weight_g: weightG ? Number(weightG) : null
    };

    try {
      setSaving(true);
      setError("");

      if (editingId !== null) {
        const updatedLure = await updateLure(
          editingId,
          lureData
        );

        setLures((currentLures) =>
          currentLures.map((lure) =>
            lure.id === editingId
              ? updatedLure
              : lure
          )
        );
      } else {
        const newLure = await createLure(lureData);

        setLures((currentLures) => [
          newLure,
          ...currentLures
        ]);
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(lure) {
    const confirmed = window.confirm(
      `Delete ${lure.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteLure(lure.id);

      setLures((currentLures) =>
        currentLures.filter(
          (item) => item.id !== lure.id
        )
      );

      if (editingId === lure.id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="lures-page">
      <div className="page-heading">
        <h2>Lures</h2>
        <p>
          Manage the lures used during fishing trips.
        </p>
      </div>

      <form
        className="lure-form"
        onSubmit={handleSubmit}
      >
        <h3>
          {editingId !== null
            ? "Edit lure"
            : "Add lure"}
        </h3>

        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="  "
          />
        </label>

        <label>
          Type
          <input
            type="text"
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
            placeholder=" "
          />
        </label>

        <label>
          Manufacturer
          <input
            type="text"
            value={manufacturer}
            onChange={(event) =>
              setManufacturer(event.target.value)
            }
            placeholder=""
          />
        </label>

        <label>
          Color
          <input
            type="text"
            value={color}
            onChange={(event) =>
              setColor(event.target.value)
            }
            placeholder=" "
          />
        </label>

        <label>
          Length (mm)
          <input
            type="number"
            value={lengthMm}
            onChange={(event) =>
              setLengthMm(event.target.value)
            }
            placeholder=""
          />
        </label>

        <label>
          Weight (g)
          <input
            type="number"
            step="0.1"
            value={weightG}
            onChange={(event) =>
              setWeightG(event.target.value)
            }
            placeholder=" "
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
              : "Add lure"}
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

      <div className="lure-list">
        <h3>Saved lures</h3>

        {loading && <p>Loading lures...</p>}

        {!loading && lures.length === 0 && (
          <p>No lures saved yet.</p>
        )}

        {!loading &&
          lures.map((lure) => (
            <article
              className="lure-item"
              key={lure.id}
            >
              <div className="lure-content">
                <h4>{lure.name}</h4>

                {lure.type && (
                  <p>
                    <strong>Type:</strong> {lure.type}
                  </p>
                )}

                {lure.manufacturer && (
                  <p>
                    <strong>Manufacturer:</strong>{" "}
                    {lure.manufacturer}
                  </p>
                )}

                {lure.color && (
                  <p>
                    <strong>Color:</strong> {lure.color}
                  </p>
                )}

                {lure.length_mm && (
                  <p>
                    <strong>Length:</strong>{" "}
                    {lure.length_mm} mm
                  </p>
                )}

                {lure.weight_g && (
                  <p>
                    <strong>Weight:</strong>{" "}
                    {lure.weight_g} g
                  </p>
                )}
              </div>

              <div className="location-actions">
                <button
                  type="button"
                  onClick={() =>
                    startEditing(lure)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    handleDelete(lure)
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

export default Lures;
