
'use server'
console.log("BASE URL:", process.env. NEXT_PUBLIC_SERVER_URL);
const baseUrl = process.env. NEXT_PUBLIC_SERVER_URL;

/**
 * Helper to safely parse and handle responses from the server
 */
const handleResponse = async (res, path) => {
  // 1. Handle HTTP Error Statuses (401, 403, 500, etc.)
  if (!res.ok) {
    if ([401, 403].includes(res.status)) {
       console.warn(`Unauthorized access (Status ${res.status}) on path: ${path}`);
       // TODO: Implement your redirect to login or clear session logic here
    }
    
    // Read the body as text to see what the server actually sent (often HTML or a text error)
    const errorBody = await res.text();
    console.error(`[Server Error ${res.status}] on ${path}:`, errorBody);
    throw new Error(`API request failed with status ${res.status}`);
  }

  // 2. Safely verify that the content-type is actually JSON before parsing
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const textData = await res.text();
    console.error(`[Type Error] Expected JSON from ${path} but received text/html instead:`, textData);
    throw new TypeError("Received non-JSON response from the server.");
  }

  return res.json();
};

export const authHeader = async () => {
    const token = await getUserToken();
    const header = token ? {
        authorization: `Bearer ${token}`
    } : {};
    return header;
}

export const serverFetch = async (path) => {
  try {
    const res = await fetch(`${baseUrl}${path}`);
    return await handleResponse(res, path);
  } catch (error) {
    console.error(`serverFetch failed for path: ${path}`, error);
    throw error;
  }
}


export const serverMutation = async (path, data, method = 'POST') => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
         ... await authHeader()
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(res, path);
  } catch (error) {
    console.error(`serverMutation failed for path: ${path}`, error);
    throw error;
  }
}



export const serverPatch = async (path, data) => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(res, path);
};