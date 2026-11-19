
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const BASE_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

export async function api(endpoint, options = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("unesus_token")
      : null;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const path = cleanEndpoint.startsWith("/api/") ? cleanEndpoint : `/api${cleanEndpoint}`;
  const url = endpoint.startsWith("http://") || endpoint.startsWith("https://")
    ? endpoint
    : `${BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detalhes = Array.isArray(data.erros)
      ? data.erros.join("\n")
      : "";

    throw new Error(
      detalhes
        ? `${data.mensagem}\n${detalhes}`
        : data.mensagem || "Não foi possível realizar a solicitação."
    );
  }

  return data;
}
