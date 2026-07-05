// Base URL for the backend API.
//
// Reads VITE_API_URL, which is set per environment at build time (for
// example the Cloud Run service URL in production). Falls back to the
// local backend when the variable is not set, so local development keeps
// working with no .env. Using || (not ??) also falls back on an empty
// string, avoiding requests to a bare path.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9001'
