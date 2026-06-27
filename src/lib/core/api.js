/**
 * Client-safe API helpers — mirrors server.js but without 'use server'.
 * Use these in "use client" components.
 *
 * server.js  → for Server Components / Server Actions
 * api.js     → for Client Components ("use client")
 */

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * Helper to safely parse and handle responses from the server.
 */
const handleResponse = async (res, path) => {
  // Handle HTTP Error Statuses (401, 403, 500, etc.)
  if (!res.ok) {
    if ([401, 403].includes(res.status)) {
      console.warn(`Unauthorized access (Status ${res.status}) on path: ${path}`);
    }
    const errorBody = await res.text();
    console.error(`[API Error ${res.status}] on ${path}:`, errorBody);
    throw new Error(`API request failed with status ${res.status}`);
  }

  // Safely verify that the content-type is actually JSON before parsing
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const textData = await res.text();
    console.error(
      `[Type Error] Expected JSON from ${path} but received non-JSON instead:`,
      textData
    );
    throw new TypeError("Received non-JSON response from the server.");
  }

  return res.json();
};

/**
 * GET request
 * @param {string} path - API path e.g. "/api/lawyers"
 */
export const apiFetch = async (path) => {
  try {
    const res = await fetch(`${baseUrl}${path}`);
    return await handleResponse(res, path);
  } catch (error) {
    console.error(`apiFetch failed for path: ${path}`, error);
    throw error;
  }
};

/**
 * POST / PUT / DELETE request
 * @param {string} path   - API path e.g. "/api/comments"
 * @param {object} data   - Request body
 * @param {string} method - HTTP method (default: "POST")
 */
export const apiMutation = async (path, data, method = "POST") => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(res, path);
  } catch (error) {
    console.error(`apiMutation failed for path: ${path}`, error);
    throw error;
  }
};

/**
 * PATCH request
 * @param {string} path - API path e.g. "/api/comments/123"
 * @param {object} data - Partial update body
 */
export const apiPatch = async (path, data) => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(res, path);
  } catch (error) {
    console.error(`apiPatch failed for path: ${path}`, error);
    throw error;
  }
};
