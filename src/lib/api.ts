// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_PATH;

export async function api(path: string, options: RequestInit = {}) {
  try {
    const isFormData = options.body instanceof FormData;

    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        // ❗ Chỉ set JSON khi KHÔNG phải upload file
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
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

export const getAllTests = () =>
  api("/api/v1/admin/tests", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const getTestById = (test_id: string, token: string) =>
  api(`/api/v1/admin/tests/${test_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateTestById = (test_id: string, payload: any, token: string) =>
  api(`/api/v1/admin/tests/${test_id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

export const createTest = (payload: any) =>
  api("/api/v1/admin/tests", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

export const changePassword = (payload: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}) =>
  api("/api/v1/auth/change-password", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

export const deleteTestById = (test_id: string, token: string) =>
  api(`/api/v1/admin/tests/${test_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// UPLOAD TEST IMAGE
export const uploadTestImage = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append("file", file);

  return api("/api/v1/upload/admin/test-image", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};

export const getAllReports = () =>
  api("/api/v1/admin/reports", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const resolveReport = async (
  report_id: string,
  action: "delete_content" | "warn_user" | "dismiss",
  token: string
) =>
  api(`/api/v1/admin/reports/${report_id}/resolve?action=${action}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getDashboardStats = (period: string, date?: string) => {
  const query = date
    ? `date=${date}`
    : `period=${period}`;

  return api(`/api/v1/admin/stats?${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const getPendingExpertArticles = async () =>
  api("/api/v1/admin/expert-articles/pending", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const updateExpertArticleStatus = async (
  article_id: string,
  status: "approved" | "rejected"
) =>
  api(`/api/v1/admin/expert-articles/${article_id}/status?status=${status}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
