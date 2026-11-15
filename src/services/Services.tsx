import React, { useState, useEffect } from "react";
import axios from "axios";

// Vendor Interface matching your MongoDB schema
interface Vendor {
  _id?: string;
  emailid: string;
  name: string;
  contact: string;
  business: string;
  area: string;
  address: string;
  city: string;
  estd: string;
  selcate: string;
  website?: string;
  insta?: string;
  shoppicurl?: string;
  certpicurl?: string;
}

// Field-level Validation Errors
interface FormErrors {
  event?: string;
  services?: string;
  city?: string;
}

function Services() {
  // Aapke bataye gaye specific events combobox ke liye
  const eventOptions = [
    "Birthday",
    "Wedding",
    "Engagement",
    "Anniversary",
    "Jagran",
    "Bhog",
    "Sukhmani Sahib Path",
    "Akhand Path Sahib",
    "Housewarming",
    "Mata Ki Chowki",
    "Kirtan Darbar",
    "Baby Shower",
    "Retirement Party",
    "Griha Pravesh",
    "Bhangra Night",
    "Farewell Party",
  ];

  // Database States (Zero dummy data)
  const [citiesList, setCitiesList] = useState<string[]>([]);
  const [servicesList, setServicesList] = useState<string[]>([]);

  // Selected inputs
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]); // Single ya Multiple support
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Result vendors & UI states
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [citizenemail, setCitizenemail] = useState<string>(
    localStorage.getItem("citizenemail") || "",
  );
  const [favoriteEmails, setFavoriteEmails] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loadingServices, setLoadingServices] = useState<boolean>(false);
  const [loadingVendors, setLoadingVendors] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // ========================================================
  // 1. PAGE LOAD: FETCH CITIES FROM DATABASE
  // ========================================================
  useEffect(() => {
    doFetchCities();
  }, []);

  async function doFetchCities() {
    try {
      const url = "http://localhost:2005/eventServices/eventCityFetch";

      // POST Request
      const resp = await axios.post(url);

      if (resp.data.status === true) {
        setCitiesList(resp.data.msg);
      } else if (Array.isArray(resp.data)) {
        setCitiesList(resp.data);
      } else {
        setCitiesList([]);
      }
    } catch (error) {
      console.error("Error fetching cities from database:", error);
      setCitiesList([]);
    }
  }

  // ========================================================
  // 2. EVENT SELECT: FETCH SERVICES (POST TO MATCH BACKEND)
  // ========================================================

  async function doSelectEvent(event: React.ChangeEvent<HTMLSelectElement>) {
    const chosenEvent = event.target.value;
    setSelectedEvent(chosenEvent);
    setSelectedServices([]);
    setServicesList([]);

    if (!chosenEvent) return;

    setLoadingServices(true);
    try {
      const url = "http://localhost:2005/eventServices/eventSerFetch";

      // IMPORTANT: Headers add kiya gaya hai taaki backend req.body ko turant read kar sake
      const resp = await axios.post(
        url,
        { eventOptions: chosenEvent },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );

      console.log("Backend response:", resp.data);

      if (resp.data.status === true) {
        let serv = resp.data.msg?.services || resp.data.msg;

        if (Array.isArray(serv)) {
          setServicesList(serv);
        } else if (typeof serv === "string") {
          setServicesList(serv.split(",").map((s: string) => s.trim()));
        } else {
          setServicesList([]);
        }
      } else {
        alert(resp.data.msg || "Services not found");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      alert("Error fetching services from database!");
    } finally {
      setLoadingServices(false);
    }
  }
  // ========================================================
  // 3. TOGGLE SERVICE (Single / Multiple Selection)
  // ========================================================
  function doToggleService(service: string) {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }

    setErrors((prev) => ({ ...prev, services: "" }));
  }

  function doSelectAllServices() {
    setSelectedServices([...servicesList]);
    setErrors((prev) => ({ ...prev, services: "" }));
  }

  function doClearServices() {
    setSelectedServices([]);
  }

  // ========================================================
  // 4. FORM VALIDATION
  // ========================================================
  function validateForm(): boolean {
    const err: FormErrors = {};

    if (!selectedEvent.trim()) {
      err.event = "Please choose an event";
    }

    if (selectedServices.length === 0) {
      err.services = "Please select at least 1 service";
    }

    if (!selectedCity.trim()) {
      err.city = "Please select a city";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  // ========================================================
  // 5. FIND VENDORS: STRICTLY FETCH FROM DATABASE
  // ========================================================
  async function doFindVendors(event: React.FormEvent) {
    event.preventDefault();

    if (!validateForm()) return;

    setLoadingVendors(true);
    setHasSearched(true);

    try {
      const url = "http://localhost:2005/eventServices/eventVendorDetails";

      const payload = {
        event: selectedEvent,
        services: selectedServices,
        city: selectedCity,
      };

      const resp = await axios.post(url, payload);

      if (resp.data.status === true && Array.isArray(resp.data.msg)) {
        setVendors(resp.data.msg);
      } else {
        setVendors([]);
      }
    } catch (error) {
      console.error("Error finding vendors:", error);
      setVendors([]);
    } finally {
      setLoadingVendors(false);
    }
  }

  async function toggleVendorFav(vendor: Vendor) {
    const email = citizenemail.trim().toLowerCase();
    if (!email) {
      alert("Please enter citizen email before saving favorites.");
      return;
    }
    try {
      const resp = await axios.post("http://localhost:2005/favs/toggle", {
        citizenemail: email,
        vendoremail: vendor.emailid,
      });
      localStorage.setItem("citizenemail", email);
      setFavoriteEmails(
        (resp.data.vendoremails || []).map((x: string) => x.toLowerCase()),
      );
    } catch (error) {
      console.error(error);
      alert("Favorite save nahi hua. Backend/MongoDB check karein.");
    }
  }

  return (
    // Color 1: Orange background (#F18531)
    <div className="min-h-screen bg-gradient-to-br from-[#d0b29b] via-[#b08c6c] to-[#F2EDE4] text-[#090F0A] flex flex-col items-center px-4 py-6 sm:px-8">
      {/* ========================================================
          TOP NAVIGATION BAR
          Color 3: Dark forest green (#232F24)
          ======================================================== */}
      {/* <header className="w-full max-w-7xl bg-[#232F24] text-[#F2EDE4] rounded-2xl shadow-xl px-6 py-4 mb-6 border border-[#232F24]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          Brand Logo
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0048ff] flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
              E
            </div>
            <span className="text-3xl font-black tracking-tight text-[#F2EDE4]">
              Home Event Management<span className="text-[#dbb293]"></span>
            </span>
          </div> */}
          {/* Nav Links */}
          {/* <nav className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm font-semibold">
            <a href="#" className="hover:text-[#f6c29a] transition">
              Home
            </a>
            <a href="#" className="hover:text-[#F16E0A] transition">
              Bussiness
            </a>
            <a href="#" className="hover:text-[#F16E0A] transition">
              About Us
            </a>
            <a
              href="#"
              className="px-4 py-2 rounded-xl bg-[#151413] text-white hover:bg-[#d85e05] transition font-bold"
            >
              Register Your Bussiness
            </a>
            <a
              href="#"
              className="px-4 py-2 rounded-xl border border-[#DFD9CE] text-[#F2EDE4] hover:bg-[#F2EDE4] hover:text-[#232F24] transition font-bold"
            >
              Register Citizen
            </a>
          </nav>
        </div>
      </header> */}

      {/* ========================================================
          MAIN WEBSITE CONTAINER
          Color 2: Cream / Off-white (#F2EDE4)
          ======================================================== */}
      <main className="w-full max-w-7xl bg-[#F2EDE4] rounded-3xl shadow-2xl p-5 sm:p-8 border border-[#DFD9CE]">
        {/* Hero Header Panel (Color 3: Dark forest green #232F24) */}
        <div className="bg-[#232F24] rounded-2xl p-6 sm:p-8 mb-8 text-[#F2EDE4] shadow-md">
          <div className="flex items-center gap-2 mb-2">
            {/* Color 6: Bright Blue Pro badge (#1E90FF) */}
            <span className="bg-[#1E90FF] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              PRO SERVICES
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F2EDE4]">
            Find Vendors from your{" "}
            <span className="text-[#0077ff]">Website</span>
          </h1>
          <p className="text-sm text-[#DFD9CE] mt-1">
            Database driven event management. Pick an event, select your
            services, and choose your city.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label
              htmlFor="fav-citizen-email"
              className="text-sm font-semibold"
            >
              Citizen email for My Favs:
            </label>
            <input
              id="fav-citizen-email"
              type="email"
              value={citizenemail}
              onChange={(e) => setCitizenemail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-lg border border-white/30 bg-white px-3 py-2 text-sm text-[#232F24]"
            />
            <a
              href="/favs"
              className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-bold text-white"
            >
              My Favs ♥
            </a>
            <a
              href="/search-vendors"
              className="rounded-lg border border-white/40 px-4 py-2 text-sm font-bold text-white"
            >
              Search Vendors
            </a>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ==================== LEFT COLUMN: CONTROLS ==================== */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-md border border-[#DFD9CE]">
            <form onSubmit={doFindVendors} className="space-y-6">
              <div className="border-b border-[#DFD9CE] pb-3">
                <h2 className="text-xl font-bold text-[#090F0A]">
                  Select Requirements
                </h2>
                <p className="text-xs text-gray-500">
                  Connected to your MongoDB Database
                </p>
              </div>

              {/* 1. Event Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#090F0A] mb-1.5">
                  1. Select Event <span className="text-[#F16E0A]">*</span>
                </label>
                <select
                  value={selectedEvent}
                  onChange={doSelectEvent}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold outline-none bg-[#DFD9CE]/30 transition cursor-pointer ${
                    errors.event
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-[#DFD9CE] focus:border-[#F16E0A] focus:bg-white"
                  }`}
                >
                  <option value="">-- Choose Event --</option>
                  {eventOptions.map((ev, index) => (
                    <option key={index} value={ev}>
                      🎉 {ev}
                    </option>
                  ))}
                </select>
                {errors.event && (
                  <p className="text-xs text-red-600 font-semibold mt-1">
                    {errors.event}
                  </p>
                )}
              </div>

              {/* 2. Services List from Database */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#090F0A]">
                    2. Choose Services (Single / Multiple){" "}
                    <span className="text-[#F16E0A]">*</span>
                  </label>
                  {servicesList.length > 0 && !loadingServices && (
                    <div className="flex gap-2 text-xs font-bold">
                      <button
                        type="button"
                        onClick={doSelectAllServices}
                        className="text-[#F16E0A] hover:underline cursor-pointer"
                      >
                        Select All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={doClearServices}
                        className="text-gray-500 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {loadingServices ? (
                  <div className="p-4 text-center bg-[#DFD9CE]/20 rounded-xl border border-dashed border-[#DFD9CE]">
                    <p className="text-xs text-[#F16E0A] font-bold">
                      Loading services from database...
                    </p>
                  </div>
                ) : servicesList.length > 0 ? (
                  <div
                    className={`max-h-56 overflow-y-auto p-3 bg-[#DFD9CE]/20 rounded-xl border ${
                      errors.services ? "border-red-500" : "border-[#DFD9CE]"
                    } space-y-2`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {servicesList.map((service, index) => {
                        const isChecked = selectedServices.includes(service);
                        return (
                          <div
                            key={index}
                            onClick={() => doToggleService(service)}
                            className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs font-semibold cursor-pointer select-none transition ${
                              isChecked
                                ? "bg-[#232F24] text-[#F2EDE4] border-[#232F24]"
                                : "bg-white text-[#090F0A] border-[#DFD9CE] hover:border-[#F16E0A]"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="accent-[#F16E0A] cursor-pointer"
                            />
                            <span className="truncate">{service}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#DFD9CE]/30 border border-dashed border-[#DFD9CE] text-center text-xs text-gray-500">
                    {selectedEvent
                      ? "No services found in database for this event."
                      : "👈 Firstly Selct any event"}
                  </div>
                )}

                {selectedServices.length > 0 && (
                  <p className="text-xs text-[#232F24] font-bold mt-2">
                    Selected ({selectedServices.length}):{" "}
                    <span className="text-[#F16E0A] font-semibold">
                      {selectedServices.join(", ")}
                    </span>
                  </p>
                )}

                {errors.services && (
                  <p className="text-xs text-red-600 font-semibold mt-1">
                    {errors.services}
                  </p>
                )}
              </div>

              {/* 3. City Selection from Database */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#090F0A] mb-1.5">
                  3. Select City <span className="text-[#F16E0A]">*</span>
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setErrors((prev) => ({ ...prev, city: "" }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold outline-none bg-[#DFD9CE]/30 transition cursor-pointer ${
                    errors.city
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-[#DFD9CE] focus:border-[#F16E0A] focus:bg-white"
                  }`}
                >
                  <option value="">-- Choose City from Database --</option>
                  {citiesList.map((city, index) => (
                    <option key={index} value={city}>
                      📍 {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-xs text-red-600 font-semibold mt-1">
                    {errors.city}
                  </p>
                )}
              </div>

              {/* Submit Button (Color 4: Bright orange #F16E0A) */}
              <button
                type="submit"
                disabled={loadingVendors}
                className="w-full py-3.5 bg-[#050504] hover:bg-[#d85e05] text-white font-bold text-sm tracking-wider uppercase rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {loadingVendors ? "Searching Database..." : "Find Vendors"}
              </button>
            </form>
          </div>

          {/* ==================== RIGHT COLUMN: VENDORS CARDS ==================== */}
          <div className="lg:col-span-7">
            {/* Status bar */}
            <div className="bg-[#DFD9CE] rounded-xl px-5 py-3 mb-5 flex justify-between items-center text-xs font-bold text-[#090F0A]">
              <span>
                {hasSearched ? `Vendors in ${selectedCity}` : "Vendors List"}
              </span>
              <span className="bg-white px-2.5 py-1 rounded-md text-[#232F24]">
                {vendors.length} Found
              </span>
            </div>

            {/* Before Search Prompt */}
            {!loadingVendors && !hasSearched && (
              <div className="bg-white rounded-2xl p-10 text-center border border-[#DFD9CE]">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-bold text-[#090F0A]">
                  Find Database Vendors
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Event select karein, database se aayi services tick karein aur
                  city select karke <strong>"Find Vendors"</strong> par click
                  karein.
                </p>
              </div>
            )}

            {/* No Vendors Found State */}
            {!loadingVendors && hasSearched && vendors.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center border border-[#DFD9CE]">
                <div className="text-4xl mb-3">❌</div>
                <h3 className="text-lg font-bold text-[#090F0A]">
                  No Vendors Found
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Database me <strong>{selectedCity}</strong> city me select ki
                  gayi services ke liye koi vendor available nahi hai.
                </p>
              </div>
            )}

            {/* Vendor Cards (Only Database Results) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {vendors.map((vendor, index) => (
                <div
                  key={vendor._id || vendor.emailid || index}
                  className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#DFD9CE] flex flex-col justify-between hover:shadow-xl transition"
                >
                  {/* Photo area */}
                  <div className="relative h-44 bg-[#232F24] flex items-center justify-center">
                    {vendor.shoppicurl ? (
                      <img
                        src={vendor.shoppicurl}
                        alt={vendor.business || vendor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-[#DFD9CE] text-xs font-semibold">
                        No Image Uploaded
                      </div>
                    )}

                    {/* Pro Badge */}
                    {/* <span className="absolute top-3 right-3 bg-[#1E90FF] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow">
                      PRO
                    </span> */}
                    <button
                      type="button"
                      title={
                        favoriteEmails.includes(vendor.emailid.toLowerCase())
                          ? "Remove from My Favs"
                          : "Add to My Favs"
                      }
                      aria-label="Toggle favorite"
                      onClick={() => void toggleVendorFav(vendor)}
                      className="absolute top-3 right-3 rounded-full bg-white px-3 py-1 text-2xl leading-8 text-pink-600 shadow"
                    >
                      {favoriteEmails.includes(vendor.emailid.toLowerCase())
                        ? "♥"
                        : "♡"}
                    </button>
                    {vendor.estd && (
                      <span className="absolute bottom-3 left-3 bg-[#232F24]/80 text-[#F2EDE4] text-[10px] font-semibold px-2 py-0.5 rounded">
                        Estd. {vendor.estd}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-[#090F0A]">
                        {vendor.business || vendor.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        Owner: {vendor.name}
                      </p>

                      <p className="text-xs text-gray-600 mt-2 flex items-start gap-1">
                        <span className="text-[#F16E0A]">📍</span>
                        <span>
                          {vendor.address ? `${vendor.address}, ` : ""}
                          {vendor.area ? `${vendor.area}, ` : ""}
                          <strong>{vendor.city}</strong>
                        </span>
                      </p>

                      {/* Selected Category Badges */}
                      {vendor.selcate && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {vendor.selcate.split(",").map((cat, i) => (
                            <span
                              key={i}
                              className="bg-[#DFD9CE]/60 text-[#232F24] text-[10px] font-bold px-2 py-0.5 rounded"
                            >
                              {cat.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer Details */}
                    <div className="mt-4 pt-3 border-t border-[#DFD9CE] flex items-center justify-between text-xs">
                      {vendor.contact && (
                        <a
                          href={`tel:${vendor.contact}`}
                          className="font-bold text-[#232F24] hover:text-[#F16E0A]"
                        >
                          📞 {vendor.contact}
                        </a>
                      )}

                      <div className="flex items-center gap-2">
                        {vendor.insta && (
                          <a
                            href={
                              vendor.insta.startsWith("http")
                                ? vendor.insta
                                : `https://instagram.com/${vendor.insta.replace("@", "")}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-pink-600 font-bold"
                            title="Instagram"
                          >
                            Insta
                          </a>
                        )}

                        {vendor.website && (
                          <a
                            href={vendor.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#1E90FF] font-bold"
                            title="Website"
                          >
                            Web
                          </a>
                        )}

                        <a
                          href={`mailto:${vendor.emailid}`}
                          className="bg-[#232F24] text-[#F2EDE4] hover:bg-[#F16E0A] transition px-3 py-1 rounded-lg font-bold text-[11px]"
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mt-6 text-center text-xs text-[#F2EDE4]">
        © Home Event & Vendor Services
      </footer>
    </div>
  );
}

export default Services;
