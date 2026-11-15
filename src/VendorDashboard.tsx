import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function VendorDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("authUser") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    localStorage.removeItem("utype");
    navigate("/");
  };

  const links = [
    { name: "Overview", path: "/vendor-dashboard", icon: "◈" },
    {
      name: "Vendor Registration",
      path: "/vendor-dashboard/register",
      icon: "▤",
    },
    { name: "Search Vendors", path: "/vendor-dashboard/search", icon: "⌕" },
    { name: "My Favourites", path: "/vendor-dashboard/favs", icon: "♡" },
  ];

  return (
    <div className="min-h-screen bg-[#f6f5fa]">
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-[#211b36] text-white md:flex">
        <div className="border-b border-white/10 px-7 py-7">
          <h1 className="text-2xl font-black tracking-tight">
            Home<span className="text-purple-400">Events.</span>
          </h1>
          <p className="mt-2 text-[10px] tracking-[3px] text-purple-300">
            EVENT MANAGEMENT
          </p>
        </div>

        <div className="mx-5 mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-400 text-xl font-bold text-[#211b36]">
            V
          </div>

          <h3 className="mt-3 font-bold">Vendor Account</h3>

          <p className="mt-1 break-all text-xs text-gray-400">
            {user.emailid || "Vendor"}
          </p>

          <span className="mt-3 inline-block rounded-full bg-purple-400/15 px-3 py-1 text-xs text-purple-300">
            ● Business Partner
          </span>
        </div>

        <p className="px-7 pb-3 pt-9 text-[10px] font-bold uppercase tracking-[2px] text-gray-500">
          Business Workspace
        </p>

        <nav className="flex-1 space-y-2 px-4">
          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/vendor-dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-purple-400 text-[#211b36] shadow-lg"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-5">
          <button
            onClick={logout}
            className="w-full rounded-xl border border-red-400/30 px-4 py-3 text-left text-sm font-semibold text-red-300 transition hover:bg-red-500 hover:text-white"
          >
            ↗ &nbsp; Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="min-h-screen md:ml-64">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/90 px-5 py-5 backdrop-blur-lg md:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-700">
              Vendor Workspace
            </p>
            <h2 className="mt-1 text-lg font-bold text-gray-800">
              Business Management
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-gray-800">
                {user.name || "Vendor"}
              </p>
              <p className="text-xs text-purple-500">Business Partner</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-800">
              V
            </div>
          </div>
        </header>

        <main className="p-5 md:p-10">
          <Outlet />
        </main>

        <footer className="px-8 py-5 text-center text-xs text-gray-400">
          © 2026 Home Events. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

// VENDOR HOME

export function VendorHome() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("authUser") || "{}");

  const cards = [
    {
      title: "Vendor Registration",
      desc: "Create or update your business profile.",
      icon: "▤",
      path: "/vendor-dashboard/register",
      color: "bg-purple-50 text-purple-700",
      tag: "BUSINESS",
    },
    {
      title: "Search Vendors",
      desc: "Explore other event service providers.",
      icon: "⌕",
      path: "/vendor-dashboard/search",
      color: "bg-blue-50 text-blue-700",
      tag: "EXPLORE",
    },
    {
      title: "My Favourites",
      desc: "View your saved favourite vendors.",
      icon: "♡",
      path: "/vendor-dashboard/favs",
      color: "bg-pink-50 text-pink-600",
      tag: "SAVED",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] bg-[#30234b] p-8 text-white shadow-xl md:p-12">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[35px] border-purple-300/10" />
        <div className="absolute -bottom-32 right-36 h-64 w-64 rounded-full bg-purple-400/10 blur-2xl" />

        <div className="relative z-10 max-w-2xl">
          <span className="rounded-full border border-purple-300/30 bg-purple-300/10 px-4 py-2 text-[10px] font-bold tracking-[2px] text-purple-300">
            VENDOR WORKSPACE
          </span>

          <h1 className="mt-7 text-3xl font-black leading-tight md:text-5xl">
            Hello, {user.name || "Vendor"}!
            <br />
            Let's Grow Together.
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-gray-300">
            Manage your business profile, register your services and explore the
            Home Events vendor community.
          </p>

          <button
            onClick={() => navigate("/vendor-dashboard/register")}
            className="mt-7 rounded-xl bg-purple-400 px-6 py-3 font-bold text-[#30234b] shadow-lg transition hover:-translate-y-1 hover:bg-purple-300"
          >
            Register Your Business →
          </button>
        </div>
      </section>

      {/* SECTION */}
      <div className="mb-6 mt-10">
        <p className="text-xs font-bold uppercase tracking-[2px] text-purple-700">
          Vendor Services
        </p>

        <h2 className="mt-2 text-2xl font-black text-gray-800">
          Your Business Workspace
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Everything you need to manage your vendor activities.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={() => navigate(card.path)}
            className="group rounded-3xl border border-gray-100 bg-white p-7 text-left shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-purple-200 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-4xl transition group-hover:scale-110 ${card.color}`}
              >
                {card.icon}
              </div>

              <span className="rounded-full bg-gray-50 px-3 py-1 text-[10px] font-bold tracking-widest text-gray-400">
                {card.tag}
              </span>
            </div>

            <h3 className="mt-7 text-xl font-extrabold text-gray-800">
              {card.title}
            </h3>

            <p className="mt-3 min-h-12 text-sm leading-6 text-gray-500">
              {card.desc}
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
              <span className="text-sm font-bold text-purple-700">
                Open Section
              </span>

              <span className="text-xl text-purple-700 transition group-hover:translate-x-2">
                →
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-9 rounded-2xl border border-purple-100 bg-purple-50 p-6">
        <h3 className="font-bold text-purple-900">
          🚀 Grow Your Business with Home Events
        </h3>
        <p className="mt-2 text-sm text-purple-800">
          Connect with event service providers and build your business network.
        </p>
      </div>
    </div>
  );
}
