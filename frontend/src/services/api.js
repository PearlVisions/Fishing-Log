const API_BASE_URL = "http://localhost:3000/api";

export function getToken() {
  return localStorage.getItem("fishingLogToken");
}

export function setToken(token) {
  localStorage.setItem("fishingLogToken", token);
}

export function clearToken() {
  localStorage.removeItem("fishingLogToken");
}

function authHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token && {
      Authorization: `Bearer ${token}`
    })
  };
}

async function handleResponse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed: ${response.status}`
    );
  }

  return data;
}

// AUTH

export async function registerUser(data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  );
}

export async function loginUser(data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  );
}

export async function getCurrentUser() {
  return handleResponse(
    await fetch(`${API_BASE_URL}/auth/me`, {
      headers: authHeaders()
    })
  );
}

// LOCATIONS

export async function getLocations() {
  return handleResponse(
    await fetch(`${API_BASE_URL}/locations`, {
      headers: authHeaders()
    })
  );
}

export async function createLocation(data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/locations`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
  );
}

export async function updateLocation(id, data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/locations/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
  );
}

export async function deleteLocation(id) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/locations/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    })
  );
}

// LURES

export async function getLures() {
  return handleResponse(
    await fetch(`${API_BASE_URL}/lures`, {
      headers: authHeaders()
    })
  );
}

export async function createLure(data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/lures`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
  );
}

export async function updateLure(id, data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/lures/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
  );
}

export async function deleteLure(id) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/lures/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    })
  );
}

// SPECIES

export async function getSpecies() {
  return handleResponse(
    await fetch(`${API_BASE_URL}/species`, {
      headers: authHeaders()
    })
  );
}

export async function createSpecies(data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/species`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
  );
}

export async function updateSpecies(id, data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/species/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
  );
}

export async function deleteSpecies(id) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/species/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    })
  );
}

// TRIPS

export async function getTrips() {
  return handleResponse(
    await fetch(`${API_BASE_URL}/trips`, {
      headers: authHeaders()
    })
  );
}

export async function createTrip(data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/trips`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
  );
}

export async function updateTrip(id, data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/trips/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
  );
}

export async function deleteTrip(id) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/trips/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    })
  );
}

// CATCHES

export async function getCatches() {
  return handleResponse(
    await fetch(`${API_BASE_URL}/catches`, {
      headers: authHeaders()
    })
  );
}

export async function createCatch(data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/catches`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
  );
}

export async function updateCatch(id, data) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/catches/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
  );
}

export async function deleteCatch(id) {
  return handleResponse(
    await fetch(`${API_BASE_URL}/catches/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    })
  );
}
