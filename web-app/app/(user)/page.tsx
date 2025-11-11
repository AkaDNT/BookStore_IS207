import ListBooks from "../components/layout/ListBooks";
import Slider from "../components/layout/Slider";
import KeyHighlights from "../components/layout/KeyHighlights";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeBooks(json: any): any[] {
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.items)) return json.items;
  if (Array.isArray(json?.data?.items)) return json.data.items;
  return [];
}

export default async function Home() {
  const base = (process.env.API_URL || "")
    .replace(/^['"]|['"]$/g, "")
    .replace(/\/+$/, "");
  if (!base) throw new Error("Missing API_URL");
  const url = `${base}/books`;

  let json: any = {};
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Fetch failed ${res.status}: ${text}`);
    }
    const ct = res.headers.get("content-type") || "";
    json = ct.includes("application/json")
      ? await res.json()
      : JSON.parse(await res.text());
  } catch (e) {
    console.error("Fetch/parse error at /books:", e);
    json = {};
  }

  const items = normalizeBooks(json);
  const sortedBooks = items.slice().sort((a, b) => {
    const da = a?.publicationDate ? new Date(a.publicationDate).getTime() : 0;
    const db = b?.publicationDate ? new Date(b.publicationDate).getTime() : 0;
    return db - da;
  });

  return (
    <div className="space-y-8 md:space-y-10">
      <Slider />
      <KeyHighlights />
      <ListBooks books={items} title="Selected for you" />
      <ListBooks books={sortedBooks} title="Recently update" />
    </div>
  );
}
