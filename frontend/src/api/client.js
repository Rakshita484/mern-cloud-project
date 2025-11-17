<<<<<<< HEAD
const API = import.meta.env.VITE_API_BASE_URL;

async function post(url, data) {
  try {
    const res = await fetch(`${API}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include"
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.msg || json.error || "Something went wrong");
      return null;
    }

    return json;
  } catch (err) {
    alert("Network error");
    console.error(err);
  }
=======
// frontend/src/api/client.js

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function request(method, url, data, opts = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    credentials: opts.credentials ?? "include",
    body: data != null ? JSON.stringify(data) : undefined,
  });

  let json = null;
  try {
    json = await res.json();
  } catch (e) {
    // non-JSON response
  }

  if (!res.ok) {
    // prefer server-provided msg fields
    const message = json?.msg || json?.message || json?.error || "Something went wrong";
    const err = new Error(message);
    err.response = json;
    err.status = res.status;
    throw err;
  }

  return json;
}

async function get(url, opts = {}) {
  return request("GET", url, null, opts);
}

async function post(url, data, opts = {}) {
  return request("POST", url, data, opts);
>>>>>>> 17cebb5 (fix(api): add default export to API client for compatibility)
}

export async function registerUser(name, email, password) {
  return post("/api/auth/register", { name, email, password });
}

export async function loginUser(email, password) {
  return post("/api/auth/login", { email, password });
}
<<<<<<< HEAD
=======

// default export: object with helper methods so older imports `import API from "..."`
const APIclient = {
  get,
  post,
  registerUser,
  loginUser,
};

export default APIclient;
>>>>>>> 17cebb5 (fix(api): add default export to API client for compatibility)
