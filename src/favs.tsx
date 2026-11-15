import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:2005";
interface Vendor {
  _id?: string;
  emailid: string;
  name: string;
  business: string;
  contact?: string;
  city?: string;
  address?: string;
  area?: string;
  selcate?: string;
  shoppicurl?: string;
}

export default function Favs() {
  const [citizenemail, setCitizenemail] = useState(
    localStorage.getItem("citizenemail") || "",
  );
  const [emailInput, setEmailInput] = useState(citizenemail);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadFavs = useCallback(async (email: string) => {
    if (!email.trim()) {
      setVendors([]);
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.get(
        `${API}/favs/${encodeURIComponent(email.trim())}`,
      );
      setVendors(response.data.vendors || []);
      localStorage.setItem("citizenemail", email.trim().toLowerCase());
      setCitizenemail(email.trim().toLowerCase());
    } catch (error) {
      console.error(error);
      setMessage("Favorites load nahi ho sake. Backend/MongoDB check karein.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (citizenemail) void loadFavs(citizenemail);
  }, []); // load saved citizen favorites on page open

  async function removeFav(vendorEmail: string) {
    try {
      await axios.delete(`${API}/favs/remove`, {
        data: { citizenemail, vendoremail: vendorEmail },
      });
      setVendors((current) =>
        current.filter(
          (v) => v.emailid.toLowerCase() !== vendorEmail.toLowerCase(),
        ),
      );
      setMessage("Vendor removed from My Favs.");
    } catch (error) {
      console.error(error);
      setMessage("Remove failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[#F2EDE4] p-5 sm:p-8 text-[#232F24]">
      <header className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#232F24] p-5 text-white">
        <h1 className="text-2xl font-extrabold">
          My Favs <span className="text-pink-300">♥</span>
        </h1>
        <nav className="flex gap-4 text-sm font-bold">
          <Link to="/" className="hover:text-orange-300">
            Home
          </Link>
          <Link to="/search-vendors" className="hover:text-orange-300">
            Search Vendors
          </Link>
        </nav>
      </header>
      <main className="mx-auto mt-6 max-w-6xl rounded-2xl bg-white p-5 shadow">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            void loadFavs(emailInput);
          }}
        >
          <label htmlFor="citizen-email" className="self-center font-semibold">
            Citizen email (temporary)
          </label>
          <input
            id="citizen-email"
            type="email"
            required
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter your email"
            className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3"
          />
          <button
            className="rounded-xl bg-[#F16E0A] px-5 py-3 font-bold text-white"
            type="submit"
          >
            Show My Favs
          </button>
        </form>
        {message && <p className="mt-4 text-sm font-medium">{message}</p>}
        {loading ? (
          <p className="py-10 text-center">Loading favorites...</p>
        ) : vendors.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            No favorite vendors yet. Search vendors and tap ♥ to save them.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((v) => (
              <article
                key={v.emailid}
                className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm"
              >
                <div className="flex h-40 items-center justify-center bg-[#DFD9CE]">
                  {v.shoppicurl ? (
                    <img
                      src={v.shoppicurl}
                      alt={v.business}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>No shop image</span>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-extrabold">
                    {v.business || v.name}
                  </h2>
                  <p className="text-sm text-gray-600">Owner: {v.name}</p>
                  <p className="mt-2 text-sm">
                    {[v.address, v.area, v.city].filter(Boolean).join(", ")}
                  </p>
                  <p className="mt-1 break-all text-xs text-gray-500">
                    {v.emailid}
                  </p>
                  <p className="mt-2 text-xs">{v.selcate}</p>
                  <button
                    onClick={() => void removeFav(v.emailid)}
                    className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100"
                  >
                    ♥ Remove from Favs
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
