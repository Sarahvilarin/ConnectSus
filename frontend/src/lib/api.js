
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  const response = await fetch(`${API_URL}${endpoint}`, {
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
