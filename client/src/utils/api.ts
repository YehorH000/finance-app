const API_BASE = process.env.REACT_APP_API_URL

export const apiFetch = (endpoint: string, options?: RequestInit) => {
    return fetch(`${API_BASE}${endpoint}`, options)
}
