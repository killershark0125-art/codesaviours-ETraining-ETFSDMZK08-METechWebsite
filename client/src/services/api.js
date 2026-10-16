const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')

/** Send a request to the Express API and return its data envelope. */
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('me_admin_token')
  const headers = new Headers(options.headers || {})
  const isFormData = options.body instanceof FormData

  if (options.body && !isFormData && typeof options.body !== 'string') {
    headers.set('Content-Type', 'application/json')
  }
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response
  try {
    response = await fetch(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`, {
      ...options,
      headers,
      body: options.body && !isFormData && typeof options.body !== 'string'
        ? JSON.stringify(options.body)
        : options.body,
    })
  } catch (cause) {
    const error = new Error(
      `Could not reach the ME Technologies API at ${API_URL}. Start the backend on port 5000, open the frontend at http://localhost:5173 (not 127.0.0.1 or another port), and check the backend CORS setting if it still fails.`
    )
    error.status = 0
    error.errors = []
    error.cause = cause
    throw error
  }

  let body = {}
  try { body = await response.json() } catch { /* Some error responses may not contain JSON. */ }

  if (!response.ok || body.success === false) {
    const error = new Error(body.message || `Request failed (${response.status})`)
    error.status = response.status
    error.errors = Array.isArray(body.errors) ? body.errors : []
    if (response.status === 401 && token && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('me_admin_token')
      window.dispatchEvent(new Event('me-auth-expired'))
    }
    throw error
  }

  return body
}

export const apiUrl = API_URL
