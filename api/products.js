export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const url = "https://cdn5.editmysite.com/app/store/api/v28/editor/users/43097125/sites/223996372125883883/products?page=1&per_page=3&sort_by=created_date&sort_order=desc&include=images,media_files,discounts";

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const data = await response.json();

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: "Proxy error", detail: err });
  }
}
