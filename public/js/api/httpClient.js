/* ============================================================
   HTTP CLIENT
   ------------------------------------------------------------
   The only module that calls fetch. It centralises headers,
   JSON encoding and error handling, so the API layer above it
   reads as a list of endpoints.
   ============================================================ */

async function request(url, method = "GET", body) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body !== undefined) options.body = JSON.stringify(body);

  const response = await fetch(url, options);

  if (!response.ok) {
    // the server sends { error: "..." } for known problems
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data && data.error) message = data.error;
    } catch {
      /* response wasn't JSON, keep the generic message */
    }
    throw new Error(message);
  }

  return response.json();
}

export const get = (url) => request(url, "GET");
export const post = (url, body) => request(url, "POST", body);
export const patch = (url, body) => request(url, "PATCH", body);
