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
}

export async function registerUser(name, email, password) {
  return post("/api/auth/register", { name, email, password });
}

export async function loginUser(email, password) {
  return post("/api/auth/login", { email, password });
}
