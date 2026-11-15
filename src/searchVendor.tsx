import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:2005";
interface Vendor {
  _id?: string;
  emailid: string;
  name: string;
  contact?: string;
  business: string;
  area?: string;
  address?: string;
  city?: string;
  selcate?: string;
  shoppicurl?: string;
}
export default function SearchVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filtered, setFiltered] = useState<Vendor[]>([]);
  const [query, setQuery] = useState("");
  const [citizenemail, setCitizenemail] = useState(
    localStorage.getItem("citizenemail") || "",
  );
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`${API}/vendor/all`);
        const list: Vendor[] = res.data.vendors || [];
        setVendors(list);
        setFiltered(list);
        const email = localStorage.getItem("citizenemail") || "";
        if (email) {
          const fav = await axios.get(
            `${API}/favs/${encodeURIComponent(email)}`,
          );
          setSaved(
            (fav.data.vendoremails || []).map((x: string) => x.toLowerCase()),
          );
        }
      } catch (err) {
        console.error(err);
        setMessage("Vendors load nahi hue. Backend aur MongoDB check karein.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    setFiltered(
      vendors.filter((v) =>
        [v.business, v.name, v.city, v.area, v.selcate].some((value) =>
          (value || "").toLowerCase().includes(q),
        ),
      ),
    );
  }, [query, vendors]);

  async function toggleFav(vendor: Vendor) {
    const email = citizenemail.trim().toLowerCase();
    if (!email) {
      setMessage(
        "Favorite save karne ke liye pehle citizen email enter karein.",
      );
      return;
    }
    try {
      const res = await axios.post(`${API}/favs/toggle`, {
        citizenemail: email,
        vendoremail: vendor.emailid,
      });
      localStorage.setItem("citizenemail", email);
      setSaved(
        (res.data.vendoremails || []).map((x: string) => x.toLowerCase()),
      );
      setMessage(
        res.data.action === "added"
          ? "Vendor My Favs mein save ho gaya."
          : "Vendor My Favs se remove ho gaya.",
      );
    } catch (err) {
      console.error(err);
      setMessage("Favorite save nahi hua. Backend/MongoDB check karein.");
    }
  }

  return (
    <div className="min-h-screen bg-[#F2EDE4] px-4 py-6 sm:px-8 text-[#232F24]">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#232F24] p-5 text-white">
        <h1 className="text-2xl font-extrabold">Search Vendors</h1>
        <nav className="flex gap-4 text-sm font-bold">
          <Link to="/" className="hover:text-orange-300">
            Home
          </Link>
          <Link to="/vendors" className="hover:text-orange-300">
            My Favs ♥
          </Link>
        </nav>
      </header>
      <main className="mx-auto mt-6 max-w-6xl rounded-2xl bg-white p-5 shadow">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm font-bold">
            Citizen email (temporary)
            <input
              type="email"
              value={citizenemail}
              onChange={(e) => setCitizenemail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 font-normal"
            />
          </label>
          <label className="text-sm font-bold">
            Search by vendor, city or service
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Birthday, Ludhiana, Cake"
              className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 font-normal"
            />
          </label>
        </div>
        {message && <p className="mt-3 text-sm font-semibold">{message}</p>}
        {loading ? (
          <p className="py-10 text-center">Loading vendors...</p>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-gray-500">No vendors found.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => {
              const isSaved = saved.includes(v.emailid.toLowerCase());
              return (
                <article
                  key={v.emailid}
                  className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm"
                >
                  <div className="relative flex h-40 items-center justify-center bg-[#232F24]">
                    {v.shoppicurl ? (
                      <img
                        src={v.shoppicurl}
                        alt={v.business}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-white">No Image Uploaded</span>
                    )}
                    <button
                      aria-label={
                        isSaved ? "Remove from favorites" : "Add to favorites"
                      }
                      title={
                        isSaved ? "Remove from favorites" : "Add to favorites"
                      }
                      onClick={() => void toggleFav(v)}
                      className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-2 text-2xl shadow"
                    >
                      {isSaved ? "♥" : "♡"}
                    </button>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-extrabold">
                      {v.business || v.name}
                    </h2>
                    <p className="text-sm text-gray-600">Owner: {v.name}</p>
                    <p className="mt-2 text-sm">
                      {[v.address, v.area, v.city].filter(Boolean).join(", ")}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">{v.selcate}</p>
                    {v.contact && (
                      <a
                        className="mt-3 inline-block font-bold"
                        href={`tel:${v.contact}`}
                      >
                        📞 {v.contact}
                      </a>
                    )}
                    <p className="mt-1 break-all text-xs text-gray-500">
                      {v.emailid}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
