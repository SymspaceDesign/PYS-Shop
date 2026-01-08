export default async function handler(req, res) {

  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // URL base fixa (não vem do client)
    const BASE_URL =
      "https://cdn5.editmysite.com/app/store/api/v28/editor/users/43097125/sites/223996372125883883/products";

    // Cria objeto URL
    const url = new URL(BASE_URL);

    /**
     * Parâmetros permitidos vindos do Webflow
     * (whitelist evita abuso)
     */
    const allowedParams = [
      "page",
      "limit",
      "sort_by",
      "sort_order",
      "include",
      "search"
    ];

    // Copia params simples
    for (const key of allowedParams) {
      if (req.query[key]) {
        url.searchParams.set(key, req.query[key]);
      }
    }

    /**
     * categories[] pode vir como:
     * ?categories=ID1,ID2
     * ou
     * ?categories[]=ID1&categories[]=ID2
     */
    if (req.query.categories) {
      const categories = Array.isArray(req.query.categories)
        ? req.query.categories
        : req.query.categories.split(",");

      categories.forEach(cat =>
        url.searchParams.append("categories[]", cat)
      );
    }

    // Fallbacks padrão
    if (!url.searchParams.has("page")) url.searchParams.set("page", "1");
    if (!url.searchParams.has("limit")) url.searchParams.set("limit", "30");

    // Fetch final
    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: "Upstream API error",
        detail: text
      });
    }

    const data = await response.json();

    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Proxy error",
      detail: err.message
    });
  }
}
