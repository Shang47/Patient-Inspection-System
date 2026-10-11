const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  })
  if (!response.ok) {
    const message = await response.text().catch(() => '')
    throw new Error(message || `Request failed (${response.status})`)
  }
  if (response.status === 204) return null
  return response.json()
}

export const api = {
  login: (username, password) => request('/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  patients: () => request('/patients'),
  currentPatient: () => request('/inspection/current'),
  startInspection: (id) => request(`/inspection/start/${id}`, { method: 'POST' }),
  finishInspection: () => request('/inspection/finish', { method: 'POST' }),
  addPatient: (patient) => request('/patients', { method: 'POST', body: JSON.stringify(patient) }),
}