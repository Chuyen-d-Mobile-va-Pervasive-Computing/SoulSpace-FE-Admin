// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_PATH;

export async function api(path: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    let data: any = null;

    // Parse JSON an toàn
    try {
      data = await res.json();
    } catch {
      throw new Error("Server returned invalid JSON.");
    }

    // Nếu lỗi từ server
    if (!res.ok) {
      let errorMessage = "Request failed";

      if (typeof data.detail === "string") {
        errorMessage = data.detail;
      } else if (Array.isArray(data.detail)) {
        errorMessage = data.detail[0]?.msg || errorMessage;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.error) {
        errorMessage = data.error;
      } else {
        errorMessage = `Request failed with status ${res.status}`;
      }

      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    if (error.message.includes("Network request failed")) {
      throw new Error("Cannot connect to server. Check your internet.");
    }
    throw error;
  }
}

// === AUTH API ===
export const loginUser = (payload: { email: string; password: string }) =>
  api("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  export const getAllExperts = () =>
  api("/api/v1/admin/experts/all", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const getExpertById = (profile_id: string) =>
  api(`/api/v1/admin/experts/${profile_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  export const approveExpert = (profile_id: string) =>
  api(`/api/v1/admin/experts/${profile_id}/approve`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const rejectExpert = (profile_id: string, reason: string) =>
  api(`/api/v1/admin/experts/${profile_id}/reject?reason=${encodeURIComponent(reason)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
