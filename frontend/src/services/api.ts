export async function fetchTransactions(page = 1, limit = 10, search = "") {
  const url = new URL("http://localhost:3001/transactions");
  url.searchParams.append("page", String(page));
  url.searchParams.append("limit", String(limit));
  if (search) url.searchParams.append("search", search);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return await res.json(); // { data: [...], meta: {...} }
}
