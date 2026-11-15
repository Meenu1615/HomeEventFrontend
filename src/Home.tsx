import React, { useState } from "react";
import { Link } from "react-router-dom";

const events = [
  {
    name: "Wedding",
    icon: "💍",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85",
    tag: "MOST SPECIAL",
  },
  {
    name: "Birthday",
    icon: "🎂",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=85",
    tag: "PARTY TIME",
  },
  {
    name: "Mehndi",
    icon: "🌿",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=85",
    tag: "TRADITIONAL",
  },
  {
    name: "Haldi",
    icon: "🌼",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=85",
    tag: "FULL OF JOY",
  },
  {
    name: "Engagement",
    icon: "💎",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=85",
    tag: "NEW BEGINNING",
  },
  {
    name: "Jagran & Kirtan",
    icon: "🙏",
    image:
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=800&q=85",
    tag: "TOGETHERNESS",
  },
];

const services = [
  {
    icon: "🌸",
    title: "Decoration",
    desc: "Creative themes & beautiful setups",
    color: "bg-[#7256E8]",
  },
  {
    icon: "📸",
    title: "Photography",
    desc: "Capture every beautiful memory",
    color: "bg-[#FF806D]",
  },
  {
    icon: "🎧",
    title: "Music & DJ",
    desc: "Make every celebration energetic",
    color: "bg-[#20B8A6]",
  },
  {
    icon: "🍰",
    title: "Catering & Cakes",
    desc: "Delicious food for your guests",
    color: "bg-[#E9A63A]",
  },
  {
    icon: "💄",
    title: "Makeup Artist",
    desc: "Get ready for your special day",
    color: "bg-[#D95791]",
  },
  {
    icon: "🎤",
    title: "Anchor & Artist",
    desc: "Entertainment for every occasion",
    color: "bg-[#467FD7]",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("All");

  const filteredEvents =
    selectedEvent === "All"
      ? events
      : events.filter((event) => event.name === selectedEvent);

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F6FA] text-[#101D2C]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

        * { font-family: 'DM Sans', sans-serif; }
        .display-font { font-family: 'Playfair Display', serif; }
        html { scroll-behavior: smooth; }

        @keyframes float {
          0%,100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-14px) rotate(3deg); }
        }

        @keyframes reveal {
          from { opacity: 0; transform: translateY(35px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 15px rgba(114,86,232,.15); }
          50% { box-shadow: 0 0 35px rgba(114,86,232,.4); }
        }

        @keyframes orbit {
          to { transform: rotate(360deg); }
        }

        .float { animation: float 5s ease-in-out infinite; }
        .reveal { animation: reveal .8s ease both; }
        .glow { animation: pulseGlow 3s ease-in-out infinite; }
        .orbit { animation: orbit 22s linear infinite; }

        .event-image {
          transition: transform .7s cubic-bezier(.2,.8,.2,1);
        }
        .event-card:hover .event-image {
          transform: scale(1.09);
        }
        .event-card { transition: all .35s ease; }
        .event-card:hover { transform: translateY(-8px); }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#101D2C]/95 text-white shadow-xl backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7256E8] to-[#20B8A6] text-2xl font-bold">
              ✦
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-wide">
                HOME<span className="text-[#FF806D]">EVENTS</span>
              </h1>
              <p className="text-[9px] tracking-[4px] text-[#20B8A6]">
                MAKE IT UNFORGETTABLE
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
            <a href="#home" className="font-semibold text-[#FF806D]">
              Home
            </a>
            <a href="#events" className="transition hover:text-[#20B8A6]">
              Events
            </a>
            <a href="#services" className="transition hover:text-[#20B8A6]">
              Services
            </a>
            <a href="#about" className="transition hover:text-[#20B8A6]">
              About
            </a>
            <Link
              to="/searchVendor"
              className="transition hover:text-[#20B8A6]"
            >
              Find Vendors
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-full border border-white/25 px-5 py-2.5 text-sm transition hover:border-[#FF806D] hover:text-[#FF806D]"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-[#FF806D] px-6 py-2.5 text-sm font-bold text-[#101D2C] shadow-lg transition hover:-translate-y-1 hover:bg-[#20B8A6]"
            >
              Get Started ↗
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-3xl md:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="space-y-4 border-t border-white/10 bg-[#101D2C] px-6 py-6 md:hidden">
            <a
              href="#home"
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              Home
            </a>
            <a
              href="#events"
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              Events
            </a>
            <a
              href="#services"
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              Services
            </a>
            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              About
            </a>
            <Link
              to="/searchVendor"
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              Find Vendors
            </Link>
            <div className="flex gap-3 pt-2">
              <Link
                to="/login"
                className="rounded-full border border-white/30 px-5 py-2"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-[#FF806D] px-5 py-2 font-bold text-[#101D2C]"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section
        id="home"
        className="relative overflow-hidden bg-[#101D2C] text-white"
      >
        <div className="absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-[#7256E8]/20 blur-[100px]" />
        <div className="absolute -bottom-40 left-1/4 h-[450px] w-[450px] rounded-full bg-[#20B8A6]/15 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          {/* LEFT CONTENT */}
          <div className="reveal">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#20B8A6]/40 bg-white/5 px-5 py-2.5 text-xs font-semibold tracking-widest text-[#20B8A6]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#20B8A6]" />
              YOUR CELEBRATION STARTS HERE
            </div>

            <h1 className="display-font text-5xl leading-[1.18] sm:text-6xl lg:text-[68px]">
              Let's Make
              <span className="block italic text-[#20B8A6]">Something</span>
              <span className="block text-[#FF806D]">Unforgettable.</span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-gray-300">
              From dream weddings to joyful birthdays, find everything you need
              to plan beautiful events and create memories that stay with you
              forever.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/services"
                className="glow rounded-full bg-[#7256E8] px-8 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-[#FF806D]"
              >
                Explore Celebrations ↗
              </Link>
              <Link
                to="/signup"
                className="rounded-full border border-white/30 px-8 py-4 text-sm font-semibold transition hover:border-[#20B8A6] hover:text-[#20B8A6]"
              >
                Find a Vendor →
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-white/15 pt-7">
              <div>
                <p className="text-2xl font-extrabold text-[#20B8A6]">
                  All-in-One
                </p>
                <p className="mt-1 text-xs text-gray-400">Event Platform</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <p className="text-2xl font-extrabold text-[#FF806D]">Easy</p>
                <p className="mt-1 text-xs text-gray-400">Vendor Discovery</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <p className="text-2xl font-extrabold text-[#A895FF]">Unique</p>
                <p className="mt-1 text-xs text-gray-400">Celebrations</p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE COLLAGE */}
          <div className="relative mx-auto h-[470px] w-full max-w-[540px] reveal">
            <div className="absolute right-0 top-4 h-[340px] w-[73%] overflow-hidden rounded-[35px] border-[5px] border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85"
                alt="Wedding celebration"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101D2C]/50 to-transparent" />
            </div>

            <div className="absolute bottom-3 left-0 h-[235px] w-[54%] overflow-hidden rounded-[30px] border-[5px] border-[#101D2C] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=85"
                alt="Birthday party"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute bottom-10 right-0 w-[43%] rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-xl float">
              <p className="text-xs font-semibold tracking-widest text-[#20B8A6]">
                SPECIAL MOMENTS
              </p>
              <p className="display-font mt-2 text-2xl italic">
                Made with love ✨
              </p>
              <div className="mt-3 flex -space-x-2 text-xl">
                <span>💐</span>
                <span>🎉</span>
                <span>💍</span>
              </div>
            </div>

            <div className="absolute left-5 top-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF806D] text-3xl shadow-xl float">
              ✨
            </div>

            <div className="absolute right-8 top-0 h-24 w-24 rounded-full border border-[#7256E8]/70 orbit" />
          </div>
        </div>
      </section>

      {/* MINI HIGHLIGHTS */}
      <section className="relative z-10 mx-auto -mt-1 max-w-7xl px-6 py-7">
        <div className="grid gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-[#101D2C]/5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["✦", "Creative Planning", "Ideas for every occasion", "#7256E8"],
            ["♧", "Beautiful Decor", "Make every space special", "#20B8A6"],
            ["♕", "Find Professionals", "Discover event vendors", "#FF806D"],
            ["✧", "Happy Memories", "Celebrate every moment", "#E9A63A"],
          ].map(([icon, title, desc, color]) => (
            <div key={title} className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#101D2C]">{title}</h3>
                <p className="mt-1 text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section id="events" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-extrabold tracking-[4px] text-[#7256E8]">
              FIND YOUR CELEBRATION
            </p>
            <h2 className="display-font text-4xl font-semibold text-[#101D2C] sm:text-5xl">
              Moments Worth{" "}
              <span className="italic text-[#7256E8]">Celebrating.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
              Explore our event categories and discover the perfect way to
              celebrate.
            </p>
          </div>
          <Link
            to="/signup"
            className="font-bold text-[#7256E8] hover:text-[#FF806D]"
          >
            View All Events ↗
          </Link>
        </div>

        <div className="mb-9 flex flex-wrap gap-3">
          {["All", ...events.map((event) => event.name)].map((name) => (
            <button
              key={name}
              onClick={() => setSelectedEvent(name)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                selectedEvent === name
                  ? "bg-[#7256E8] text-white shadow-lg shadow-purple-500/20"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-[#20B8A6] hover:text-[#20B8A6]"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div
              key={event.name}
              className="event-card group overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative h-[230px] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.name}
                  className="event-image h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101D2C]/70 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-[10px] font-extrabold tracking-widest text-[#7256E8]">
                  {event.tag}
                </span>
                <span className="absolute bottom-4 right-5 text-4xl drop-shadow-lg">
                  {event.icon}
                </span>
              </div>
              <div className="p-6">
                <h3 className="display-font text-2xl font-bold text-[#101D2C]">
                  {event.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Make your {event.name.toLowerCase()} celebration truly
                  unforgettable.
                </p>
                <Link
                  to="/signup"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#7256E8] transition group-hover:gap-4"
                >
                  Explore Event <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="bg-[#101D2C] px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[4px] text-[#20B8A6]">
                OUR SERVICES
              </p>
              <h2 className="display-font text-4xl sm:text-5xl">
                The Details Make{" "}
                <span className="italic text-[#FF806D]">The Magic.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-gray-400">
              Find the right people to bring your ideas to life. Explore a
              variety of services for every celebration.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                to="/signup"
                key={service.title}
                className="group rounded-3xl border border-white/10 bg-white/[0.05] p-7 transition duration-300 hover:-translate-y-2 hover:border-[#20B8A6]/50 hover:bg-white/[0.09]"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${service.color} text-3xl shadow-lg transition group-hover:rotate-6`}
                >
                  {service.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold">{service.title}</h3>
                <p className="mt-3 text-sm text-gray-400">{service.desc}</p>
                <p className="mt-6 text-sm font-bold text-[#20B8A6]">
                  Discover More →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VENDOR CTA */}
      <section className="px-6 py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[35px] bg-gradient-to-r from-[#7256E8] via-[#5947B9] to-[#20B8A6] px-8 py-16 text-center text-white shadow-2xl md:px-20">
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/20" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <div className="text-5xl">🚀</div>
            <p className="mt-6 text-xs font-bold tracking-[4px]">
              FOR EVENT PROFESSIONALS
            </p>
            <h2 className="display-font mx-auto mt-4 max-w-3xl text-4xl sm:text-5xl">
              Turn Your Passion Into Possibilities.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/85">
              Showcase your services, connect with customers and grow your
              business with Home Events.
            </p>
            <Link
              to="/signup"
              className="mt-9 inline-flex rounded-full bg-white px-9 py-4 text-sm font-extrabold text-[#7256E8] shadow-xl transition hover:-translate-y-1 hover:bg-[#101D2C] hover:text-white"
            >
              Join as a Vendor ↗
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 md:grid-cols-2"
      >
        <div className="relative">
          <div className="absolute -inset-4 rounded-[35px] bg-gradient-to-br from-[#7256E8]/20 to-[#20B8A6]/20 blur-xl" />
          <img
            src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=85"
            alt="Beautiful celebration setup"
            className="relative h-[350px] w-full rounded-[30px] object-cover shadow-xl"
          />
          <div className="absolute -bottom-5 -right-4 rounded-2xl bg-[#FF806D] p-5 text-3xl shadow-xl float">
            🎉
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-extrabold tracking-[4px] text-[#7256E8]">
            ABOUT HOME EVENTS
          </p>
          <h2 className="display-font text-4xl leading-tight sm:text-5xl">
            More Than Events.
            <span className="block italic text-[#20B8A6]">
              Beautiful Memories.
            </span>
          </h2>
          <p className="mt-6 text-sm leading-8 text-gray-500">
            Home Events is designed to simplify event planning. Explore
            celebrations, discover services and connect with vendors in one
            convenient platform. Your ideas deserve a beautiful celebration.
          </p>
          <Link
            to="/signup"
            className="mt-8 inline-flex rounded-full bg-[#101D2C] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#7256E8]"
          >
            Explore Our Platform →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#101D2C] px-6 pb-8 pt-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-xl font-extrabold">
              HOME<span className="text-[#FF806D]">EVENTS</span>
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
              Every event tells a story. Let's make yours unforgettable.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#20B8A6]">Quick Links</h3>
            <div className="mt-5 space-y-3 text-sm text-gray-400">
              <Link to="/" className="block hover:text-white">
                Home
              </Link>
              <Link to="/services" className="block hover:text-white">
                Services
              </Link>
              <Link to="/searchVendor" className="block hover:text-white">
                Find Vendors
              </Link>
              <Link to="/favs" className="block hover:text-white">
                My Favourites
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#20B8A6]">Account</h3>
            <div className="mt-5 space-y-3 text-sm text-gray-400">
              <Link to="/signup" className="block hover:text-white">
                Sign Up
              </Link>
              <Link to="/login" className="block hover:text-white">
                Login
              </Link>
              {/* <Link to="/vendor" className="block hover:text-white">
                Vendor Registration
              </Link> */}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#20B8A6]">Start Celebrating</h3>
            <p className="mt-5 text-sm leading-7 text-gray-400">
              Find the right services for your next big celebration.
            </p>
            <Link
              to="/signup"
              className="mt-5 inline-block rounded-full bg-[#FF806D] px-6 py-3 text-sm font-bold text-[#101D2C] transition hover:bg-[#20B8A6]"
            >
              Get Started ↗
            </Link>
          </div>
        </div>

        <p className="pt-7 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Home Events. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
