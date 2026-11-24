
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const BASE_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

function obterToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("unesus_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwt")
  );
}

export async function api(endpoint, options = {}) {
  const token = obterToken();

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

  const texto = await response.text();
  let data = {};
  try {
    data = texto ? JSON.parse(texto) : {};
  } catch {
    data = { mensagem: texto };
  }

  if (!response.ok) {
    const detalhes = Array.isArray(data.erros)
      ? data.erros.join("\n")
      : "";

    throw new Error(
      detalhes
        ? `${data.mensagem}\n${detalhes}`
        : data.mensagem || data.message || (response.status === 401 || response.status === 403
          ? "Acesso não autorizado. Entre novamente com uma conta administradora."
          : `Não foi possível concluir a operação (erro ${response.status}).`)
    );
  }

  return data;
}
