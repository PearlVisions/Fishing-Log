import { useEffect, useState } from "react";

import {
  getSpecies,
  createSpecies,
  updateSpecies,
  deleteSpecies
} from "../services/api";

function Species() {
  const [species, setSpecies] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function loadSpecies() {
    try {
      setSpecies(await getSpecies());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadSpecies();
  }, []);

  function resetForm() {
    setName("");
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      if (editingId !== null) {
        await updateSpecies(editingId, {
          name: name.trim()
        });
      } else {
        await createSpecies({
          name: name.trim()
        });
      }

      resetForm();
      await loadSpecies();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete species?")) {
      return;
    }

    try {
      await deleteSpecies(id);
      await loadSpecies();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <h2>Fish species</h2>
      </div>

      <form className="data-form" onSubmit={handleSubmit}>
        <label>
          Species name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="form-actions">
          <button type="submit">
            {editingId ? "Save changes" : "Add species"}
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
        {species.map((item) => (
          <article className="data-item" key={item.id}>
            <strong>{item.name}</strong>

            <div className="item-actions">
              <button
                onClick={() => {
                  setEditingId(item.id);
                  setName(item.name);
                }}
              >
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

export default Species;
