// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_PATH;

export async function api<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const isFormData = options.body instanceof FormData;

    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
    });

    let data: T | null = null;

    const contentLength = res.headers.get("content-length");
    if (contentLength !== "0") {
      const text = await res.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Server returned invalid JSON.");
        }
      }
    }

    if (!res.ok) {
      const anyData: any = data;
      let errorMessage = "Request failed";

      if (typeof anyData?.detail === "string") {
        errorMessage = anyData.detail;
      } else if (Array.isArray(anyData?.detail)) {
        errorMessage = anyData.detail[0]?.msg || errorMessage;
      } else if (anyData?.message) {
        errorMessage = anyData.message;
      } else if (anyData?.error) {
        errorMessage = anyData.error;
      } else {
        errorMessage = `Request failed with status ${res.status}`;
      }

      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error: any) {
    if (error.message?.includes("Network request failed")) {
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

export const getMe = () =>
  api("/api/v1/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const forgotPassword = (payload: { email: string }) =>
  api("/api/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const resetPassword = (payload: {
  email: string;
  otp: string;
  new_password: string;
}) =>
  api("/api/v1/auth/reset-password", {
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
  api("/api/v1/tests", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const getQuestionsByTestCode = (
  testCode: string,
  token: string
) =>
  api(`/api/v1/tests/${testCode}/questions`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const upsertTestByCode = (
  testCode: string,
  payload: any,
  token: string
) =>
  api(`/api/v1/tests/${testCode}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

export const createTest = (payload: any) =>
  api("/api/v1/tests", {
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

export const deleteTestByCode = (testCode: string, token: string) =>
  api(`/api/v1/tests/${testCode}`, {
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

export const getDashboardStats = (period: string, date: string) => {
  return api(
    `/api/v1/admin/stats/dashboard/overview?date=${date}&period=${period}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const getDashboardChart = (period: string) => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  return api(
    `/api/v1/admin/stats/dashboard/chart?date=${today}&period=${period}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const getEmotionDistribution = () => {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM

  return api(
    `/api/v1/admin/stats/dashboard/emotions?month=${month}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const getPostsByTopic = () => {
  return api(`/api/v1/admin/stats/topics`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const getMostActiveUsers = () => {
  return api(`/api/v1/admin/stats/users/energetic`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const getMostPositiveUsers = () => {
  return api(`/api/v1/admin/stats/users/clean-posts`, {
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

export interface AdminPost {
  _id: string;
  content: string;
  created_at: string;
  moderation_status: "Approved" | "Pending" | "Blocked";
  is_anonymous: boolean;
  like_count: number;
  comment_count: number;
  username: string;
  user_email: string;
  author_display: string;
  hashtags?: string[];
}

export const getAdminPosts = (
  page = 1,
  limit = 50,
  status?: "Approved" | "Pending" | "Blocked"
) => {
  let url = `/api/v1/admin/posts?page=${page}&limit=${limit}`;

  if (status) {
    url += `&status=${status}`;
  }

  return api<AdminPost[]>(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// ===== COMMENTS =====

export interface AdminComment {
  _id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  moderation_status: "Approved" | "Pending" | "Blocked";
  is_preset: boolean;
  username: string;
}

export const getAdminComments = (
  post_id: string,
  limit = 50,
  status?: "Approved" | "Pending" | "Blocked"
) => {
  let url = `/api/v1/admin/comments?post_id=${post_id}&limit=${limit}`;

  if (status) {
    url += `&status=${status}`;
  }

  return api<AdminComment[]>(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export interface DeletePostResponse {
  message: string;
  post_id: string;
  deleted_by: string;
  deleted_at: string;
}

export const deleteAdminPost = (post_id: string, reason: string) =>
  api<DeletePostResponse>(
    `/api/v1/admin/posts/${post_id}?reason=${encodeURIComponent(reason)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  // ===== DELETE COMMENT =====

export interface DeleteCommentResponse {
  message: string;
  comment_id: string;
  deleted_by: string;
  deleted_at: string;
}

export const deleteAdminComment = (comment_id: string, reason: string) =>
  api<DeleteCommentResponse>(
    `/api/v1/admin/comments/${comment_id}?reason=${encodeURIComponent(reason)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
