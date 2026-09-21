const API_BASE_URL = "http://localhost:3000/api";

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || `Request failed: ${response.status}`
    );
  }

  return response.json();
}

// LOCATIONS

export async function getLocations() {
  return handleResponse(
    await fetch(`${API_BASE_URL}/locations`)
  );
}

export async function createLocation(data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  );
}

export async function updateLocation(id, data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/locations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  );
}

export async function deleteLocation(id) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/locations/${id}`, {
      method: "DELETE"
    })
  );
}

// LURES

export async function getLures() {
  return handleResponse(
    await fetch(`${API_BASE_URL}/lures`)
  );
}

export async function createLure(data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/lures`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  );
}

export async function updateLure(id, data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/lures/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  );
}

export async function deleteLure(id) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/lures/${id}`, {
      method: "DELETE"
    })
  );
}

// SPECIES

export async function getSpecies() {
  return handleResponse(
    await fetch(`${API_BASE_URL}/species`)
  );
}

export async function createSpecies(data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/species`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  );
}

export async function updateSpecies(id, data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/species/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  );
}

export async function deleteSpecies(id) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/species/${id}`, {
      method: "DELETE"
    })
  );
}

// TRIPS

export async function getTrips() {
  return handleResponse(
    await fetch(`${API_BASE_URL}/trips`)
  );
}

export async function createTrip(data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  );
}

export async function updateTrip(id, data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/trips/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  );
}

export async function deleteTrip(id) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/trips/${id}`, {
      method: "DELETE"
    })
  );
}

// CATCHES

export async function getCatches() {
  return handleResponse(
    await fetch(`${API_BASE_URL}/catches`)
  );
}

export async function createCatch(data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/catches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  );
}

export async function updateCatch(id, data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/catches/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  );
}

export async function deleteCatch(id) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/catches/${id}`, {
      method: "DELETE"
    })
  );
}
