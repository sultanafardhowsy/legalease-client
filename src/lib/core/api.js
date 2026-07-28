import { getClientToken } from "../auth-client";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

const handleResponse = async (res, path) => {
  if (!res.ok) {
    if ([401, 403].includes(res.status)) {
      console.warn(`Unauthorized access (Status ${res.status}) on path: ${path}`);
    }
    const errorBody = await res.text();
    if (res.status === 404) {
      console.warn(`[API Error 404] on ${path}:`, errorBody);
    } else {
      console.error(`[API Error ${res.status}] on ${path}:`, errorBody);
    }
    throw new Error(`API request failed with status ${res.status}`);
  }

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const textData = await res.text();
    console.error(
      `[Type Error] Expected JSON from ${path} but received non-JSON instead:`,
      textData,
    );
    throw new TypeError("Received non-JSON response from the server.");
  }

  return res.json();
};

// GET
export async function apiFetch(endpoint, options = {}) {
  try {
    const token = await getClientToken();
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${baseUrl}${endpoint}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    });

    return await handleResponse(response, endpoint);
  } catch (error) {
    if (error.message && error.message.includes("status 404")) {
      console.warn("API Fetch Warning:", error.message);
    } else {
      console.error("API Fetch Error:", error);
    }
    throw error;
  }
}

// POST / PUT / PATCH / DELETE
export const apiMutation = async (path, data = {}, method = "POST") => {
  try {
    const token = await getClientToken();
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await fetch(`${baseUrl}${path}`, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    return await handleResponse(res, path);
  } catch (error) {
    console.error(`apiMutation failed for path: ${path}`, error);
    throw error;
  }
};

export const apiMutationPatch = async (path, data = {}, method = "PATCH") => {
  try {
    const token = await getClientToken();
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await fetch(`${baseUrl}${path}`, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });
    console.log(res, "from admin");
    return await handleResponse(res, path);
  } catch (error) {
    console.error(`apiMutation failed for path: ${path}`, error);
    throw error;
  }
};
