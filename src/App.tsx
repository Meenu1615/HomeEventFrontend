import { Routes, Route, Navigate } from "react-router-dom";

// import Navbar from "./Navbar";
import Services from "./services/Services";

import Signup from "./Signup";
import Login from "./Login";

import CitizenForm from "./citizen";
import Favs from "./favs";
import SearchVendors from "./searchVendor";
import VendorRegistration from "./vendor-registration";
import CitizenDashboard, { CitizenHome } from "./CitizenDashboard";
import VendorDashboard, { VendorHome } from "./VendorDashboard";
import Home from "./Home";
import ProtectedRoute from "./ProtectedRoute";


function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}

      <Route
        path="/"
        element={
          <>
            {/* <Navbar /> */}
            <Home />
          </>
        }
      />

      <Route path="/signup" element={<Signup />} />

      <Route path="/login" element={<Login />} />

      {/* ADMIN / USER DASHBOARD */}

      <Route path="/citizen-dashboard" element={<CitizenDashboard />}>
        <Route index element={<CitizenHome />} />

        <Route path="citizen" element={<CitizenForm />} />
        <Route path="search" element={<SearchVendors />} />
        <Route path="favs" element={<Favs />} />

        {/* NEW SERVICES PAGE */}
        <Route path="services" element={<Services />} />
      </Route>

      {/* VENDOR DASHBOARD */}

      <Route element={<ProtectedRoute allowedRoles={["Vendor"]} />}>
        <Route path="/vendor-dashboard" element={<VendorDashboard />}>
          <Route index element={<VendorHome />} />

          <Route path="register" element={<VendorRegistration />} />

          <Route path="search" element={<SearchVendors />} />

          <Route path="favs" element={<Favs />} />
        </Route>
      </Route>

      {/* FALLBACK */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
