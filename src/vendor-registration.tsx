import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
// ⭐ Separate Axios file se import
import {
  fetchVendorByEmail,
  registerVendor,
  updateVendor,
} from "./axios/vendorapi";

export interface VendorFormData {
  emailid: string;
  name: string;
  contact: string;
  business: string;
  area: string;
  address: string;
  city: string;
  estd: string;
  selcate: string;
  website: string;
  insta: string;
  shoppic: File | null;
  certpic: File | null;
  shoppicurl?: string;
  certpicurl?: string;
}

const AVAILABLE_CATEGORIES = [
  "Cake",
  "Decoration",
  "Music",
  "Anchor",
  "Bhajan Singer",
  "Sound System",
  "Stage Decoration",
  "Lighting",
  "Catering",
  "Photography",
  "DJ / Sound",
  "Mehndi Artist",
  "Makeup Artist",
  "Tent",
  "Venue",
  "Event Planner",
  "Invitation Cards",
];

export const VendorRegistration: React.FC = () => {
  const [formData, setFormData] = useState<VendorFormData>({
    emailid: "",
    name: "",
    contact: "",
    business: "",
    area: "",
    address: "",
    city: "",
    estd: "",
    selcate: "",
    website: "",
    insta: "",
    shoppic: null,
    certpic: null,
    shoppicurl: "",
    certpicurl: "",
  });

  const [shopPicPreview, setShopPicPreview] = useState<string | null>(null);
  const [certPicPreview, setCertPicPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({
    text: "",
    type: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (cat: string) => {
    const currentList = formData.selcate
      ? formData.selcate
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    let updatedList: string[];
    if (currentList.includes(cat)) {
      updatedList = currentList.filter((item) => item !== cat);
    } else {
      updatedList = [...currentList, cat];
    }
    setFormData((prev) => ({ ...prev, selcate: updatedList.join(",") }));
  };

  const handleDropdownSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected) {
      toggleCategory(selected);
      e.target.value = "";
    }
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "shoppic" | "certpic",
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [field]: file }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (field === "shoppic") setShopPicPreview(previewUrl);
      if (field === "certpic") setCertPicPreview(previewUrl);
    }
  };

  const createPayload = () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value as any);
      }
    });
    return data;
  };

  // 1. FETCH VENDOR BY EMAIL
  const handleFetch = async () => {
    if (!formData.emailid.trim()) {
      setStatusMessage({
        text: "Please enter an Email ID to fetch vendor details.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      setStatusMessage({ text: "", type: "" });

      // ⭐ Separate axios service call
      const response = await fetchVendorByEmail(formData.emailid);

      if (response.data?.vendor) {
        const v = response.data.vendor;
        setFormData({
          emailid: v.emailid || "",
          name: v.name || "",
          contact: v.contact || "",
          business: v.business || "",
          area: v.area || "",
          address: v.address || "",
          city: v.city || "",
          estd: v.estd || "",
          selcate: v.selcate || "",
          website: v.website || "",
          insta: v.insta || "",
          shoppic: null,
          certpic: null,
          shoppicurl: v.shoppicurl || "",
          certpicurl: v.certpicurl || "",
        });

        if (v.shoppicurl) setShopPicPreview(v.shoppicurl);
        if (v.certpicurl) setCertPicPreview(v.certpicurl);

        setStatusMessage({
          text: "Vendor data loaded successfully!",
          type: "success",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        text: err.message || "Failed to fetch vendor. Check email ID.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. SAVE (REGISTER NEW VENDOR)
  // 2. SAVE (REGISTER NEW VENDOR)
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    // Check actual values before sending
    console.log("Vendor form values:", {
      emailid: formData.emailid,
      name: formData.name,
      contact: formData.contact,
      business: formData.business,
    });

    if (
      !formData.emailid.trim() ||
      !formData.name.trim() ||
      !formData.contact.trim() ||
      !formData.business.trim()
    ) {
      setStatusMessage({
        text: "Please fill Email ID, Name, Contact, and Business Name.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      setStatusMessage({ text: "", type: "" });

      const payload = createPayload();

      // Check the data being sent
      console.log(
        "Payload:",
        Array.from(payload.entries()).map(([key, value]) => [
          key,
          value instanceof File ? value.name : value,
        ]),
      );

      const response = await registerVendor(payload);

      setStatusMessage({
        text: response.data?.message || "Vendor registered successfully!",
        type: "success",
      });
    } catch (err: any) {
      console.error("Vendor registration error:", err.response?.data || err);

      setStatusMessage({
        text:
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to register vendor.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  // 3. UPDATE EXISTING VENDOR
  const handleUpdate = async () => {
    if (!formData.emailid.trim()) {
      setStatusMessage({
        text: "Email ID is required to update details.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      setStatusMessage({ text: "", type: "" });
      const payload = createPayload();

      // ⭐ Separate axios service call
      const response = await updateVendor(payload);

      setStatusMessage({
        text: response.data?.message || "Vendor details updated successfully!",
        type: "success",
      });
    } catch (err: any) {
      setStatusMessage({
        text: err.message || "Failed to update vendor.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCategoriesList = formData.selcate
    ? formData.selcate
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/30 to-blue-50/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden transition-all duration-300">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-800 px-8 py-8 text-white relative">
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-indigo-100 backdrop-blur-md mb-3 border border-white/20">
                Partner Onboarding Portal
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Vendor Registration
              </h1>
              <p className="mt-2 text-sm text-indigo-100 max-w-xl">
                Register your business or search using your registered email ID
                to update your profile.
              </p>
            </div>
          </div>

          {/* Alert Notification */}
          {statusMessage.text && (
            <div className="px-8 pt-6">
              <div
                className={`p-4 rounded-xl border text-sm font-medium ${
                  statusMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}
              >
                {statusMessage.text}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-8">
            {/* 1. Account Search / Email */}
            <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/80">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Account Lookup & Email <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  name="emailid"
                  value={formData.emailid}
                  onChange={handleChange}
                  placeholder="Enter registered vendor email (e.g. contact@business.com)"
                  required
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
                <button
                  type="button"
                  onClick={handleFetch}
                  disabled={loading}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium text-sm rounded-lg shadow-sm"
                >
                  {loading ? "Fetching..." : "Fetch Details"}
                </button>
              </div>
            </div>

            {/* 2. Personal & Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* 3. Business Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="business"
                  value={formData.business}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Area
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Established Year
                </label>
                <input
                  type="text"
                  name="estd"
                  value={formData.estd}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* 4. Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Categories
                </label>
                <select
                  onChange={handleDropdownSelect}
                  defaultValue=""
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                >
                  <option value="" disabled>
                    Choose category...
                  </option>
                  {AVAILABLE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Selected Categories
                </label>
                <div className="min-h-[44px] p-2 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap gap-1.5">
                  {selectedCategoriesList.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 text-xs flex items-center gap-1"
                    >
                      {cat}
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className="font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Online Presence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Instagram
                </label>
                <input
                  type="text"
                  name="insta"
                  value={formData.insta}
                  onChange={handleChange}
                  placeholder="instagram_handle"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* 6. Media Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Shop Photo
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 h-44 relative flex items-center justify-center">
                  {shopPicPreview ? (
                    <img
                      src={shopPicPreview}
                      alt="Shop Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-xs text-slate-500">
                      Upload Shop Picture
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "shoppic")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Business Certificate
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 h-44 relative flex items-center justify-center">
                  {certPicPreview ? (
                    <img
                      src={certPicPreview}
                      alt="Cert Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-xs text-slate-500">
                      Upload Certificate
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, "certpic")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleUpdate}
                disabled={loading}
                className="px-6 py-2.5 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-lg font-semibold text-sm"
              >
                {loading ? "Updating..." : "Update Details"}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm"
              >
                {loading ? "Saving..." : "Save Registration"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};;

export default VendorRegistration;
