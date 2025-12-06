export async function loginUser(payload: { email: string; password: string }) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_PATH;

  const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: any = null;

  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    // FastAPI can return string OR array
    const error =
      data?.detail ||
      data?.message ||
      data?.error ||
      "Login failed. Please try again.";

    throw new Error(
      typeof error === "string" ? error : error?.[0]?.msg || "Login failed"
    );
  }

  return data;
}
