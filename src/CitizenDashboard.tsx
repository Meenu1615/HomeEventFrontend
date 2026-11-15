import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function CitizenDashboard() {
  const navigate = useNavigate();

  let user: any = {};

  try {
    user = JSON.parse(localStorage.getItem("authUser") || "{}");
  } catch {
    user = {};
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    localStorage.removeItem("utype");
    localStorage.removeItem("isLoggedIn");

    navigate("/", { replace: true });
  };

  const links = [
    {
      name: "Profile",
      path: "",
      icon: "◈",
    },
    {
      name: "Search Vendors",
      path: "search",
      icon: "⌕",
    },
    {
      name: "My Favourites",
      path: "favs",
      icon: "♡",
    },
    {
      name: "Citizen Form",
      path: "citizen",
      icon: "▤",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7f5]">

      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-[#102a25] text-white md:flex">

        <div className="border-b border-white/10 px-7 py-7">
          <h1 className="text-2xl font-black">
            Home<span className="text-emerald-400">Events.</span>
          </h1>

          <p className="mt-2 text-[10px] tracking-[3px] text-emerald-300">
            CITIZEN DASHBOARD
          </p>
        </div>

        {/* PROFILE */}
        <div className="mx-5 mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400 text-xl font-bold text-[#102a25]">
            {(user.name || user.emailid || "C")
              .charAt(0)
              .toUpperCase()}
          </div>

          <h3 className="mt-3 font-bold">
            {user.name || "Citizen"}
          </h3>

          <p className="mt-1 break-all text-xs text-gray-400">
            {user.emailid || "Citizen Account"}
          </p>

          <span className="mt-3 inline-block rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-300">
            ● Active
          </span>
        </div>

        <p className="px-7 pb-3 pt-9 text-[10px] font-bold uppercase tracking-[2px] text-gray-500">
          Workspace
        </p>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-2 px-4">

          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ""}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-400 text-[#102a25] shadow-lg"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}

        </nav>

        {/* LOGOUT */}
        <div className="border-t border-white/10 p-5">
          <button
            onClick={logout}
            className="w-full rounded-xl border border-red-400/30 px-4 py-3 text-left text-sm font-semibold text-red-300 transition hover:bg-red-500 hover:text-white"
          >
            ↗ &nbsp; Sign Out
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <div className="min-h-screen md:ml-64">

        {/* HEADER */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/90 px-5 py-5 backdrop-blur-lg md:px-10">

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
              Citizen Workspace
            </p>

            <h2 className="mt-1 text-lg font-bold text-gray-800">
              Home Event Management
            </h2>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-gray-800">
                {user.name || "Citizen"}
              </p>

              <p className="text-xs text-gray-400">
                Citizen Account
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
              {(user.name || user.emailid || "C")
                .charAt(0)
                .toUpperCase()}
            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
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


// CITIZEN DASHBOARD HOME PAGE

export function CitizenHome() {
  const navigate = useNavigate();

  let user: any = {};

  try {
    user = JSON.parse(localStorage.getItem("authUser") || "{}");
  } catch {
    user = {};
  }

  const cards = [
    {
      title: "Search Vendors",
      desc: "Find professional event service providers for your celebrations.",
      icon: "⌕",
      path: "search",
      color: "bg-blue-50 text-blue-700",
      tag: "EXPLORE",
    },
    {
      title: "My Favourites",
      desc: "View all your saved and favourite event vendors.",
      icon: "♡",
      path: "favs",
      color: "bg-pink-50 text-pink-600",
      tag: "SAVED",
    },
    {
      title: "Citizen Form",
      desc: "Submit your citizen details using the Aadhaar OCR form.",
      icon: "▤",
      path: "citizen",
      color: "bg-emerald-50 text-emerald-700",
      tag: "PROFILE",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">

      {/* WELCOME SECTION */}
      <section className="relative overflow-hidden rounded-[28px] bg-[#153b30] p-8 text-white shadow-xl md:p-12">

        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[35px] border-emerald-400/10" />

        <div className="relative z-10 max-w-2xl">

          <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-[10px] font-bold tracking-[2px] text-emerald-300">
            CITIZEN DASHBOARD
          </span>

          <h1 className="mt-7 text-3xl font-black leading-tight md:text-5xl">
            Welcome Back,
            <br />
            {user.name || user.emailid || "Citizen"}!
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-gray-300">
            Welcome to Home Events. Discover trusted event vendors,
            save your favourites and make every celebration special.
          </p>

          <button
            onClick={() => navigate("search")}
            className="mt-7 rounded-xl bg-emerald-400 px-6 py-3 font-bold text-[#153b30] shadow-lg transition hover:-translate-y-1 hover:bg-emerald-300"
          >
            Explore Vendors →
          </button>

        </div>
      </section>

      {/* QUICK NAVIGATION */}
      <div className="mb-6 mt-10">
        <p className="text-xs font-bold uppercase tracking-[2px] text-emerald-700">
          Quick Navigation
        </p>

        <h2 className="mt-2 text-2xl font-black text-gray-800">
          Manage Your Account
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Select an option to continue.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {cards.map((card) => (
          <button
            key={card.title}
            onClick={() => navigate(card.path)}
            className="group rounded-3xl border border-gray-100 bg-white p-7 text-left shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-xl"
          >

            <div className="flex items-center justify-between">

              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-4xl transition group-hover:scale-110 ${card.color}`}>
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

              <span className="text-sm font-bold text-emerald-700">
                Open Section
              </span>

              <span className="text-xl text-emerald-700 transition group-hover:translate-x-2">
                →
              </span>

            </div>

          </button>
        ))}

      </div>

      {/* FOOTER CARD */}
      <div className="mt-9 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
        <h3 className="font-bold text-emerald-900">
          ✨ Make Every Moment Special
        </h3>

        <p className="mt-2 text-sm text-emerald-800">
          Your celebration journey starts here. Explore services
          and find the perfect vendors for your event.
        </p>
      </div>

    </div>
  );
}