/**
 * Centralized Application Configuration
 * All hardcoded environment variables, API endpoints, and global constants
 * should be referenced from this single file.
 */

// Use process.env.REACT_APP_API_URL if deployed, otherwise fallback to local backend.
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
