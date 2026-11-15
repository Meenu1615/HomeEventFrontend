import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:2005/citizen";

interface CitizenData {
  emailid: string;
  acardno: string;
  name: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  contact: string;
}

const blankForm: CitizenData = {
  emailid: "",
  acardno: "",
  name: "",
  dob: "",
  gender: "",
  address: "",
  city: "",
  contact: "",
};

const fieldClass =
  "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export default function Citizen() {
  const [form, setForm] = useState<CitizenData>(blankForm);
  const [recordId, setRecordId] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const [frontPreview, setFrontPreview] = useState("");
  const [backPreview, setBackPreview] = useState("");

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Aadhaar OCR
  const scan = async (side: "front" | "back", file: File) => {
    const data = new FormData();
    data.append("image", file);

    setBusy(true);
    setStatus(`Scanning Aadhaar ${side}...`);

    try {
      const response = await axios.post(`${API}/ocr/${side}`, data);

      console.log("OCR RESPONSE:", response.data);

      const fields = response.data.fields;

      setForm((prev) => ({
        ...prev,
        ...fields,
      }));

      const extracted = Object.entries(fields)
        .filter(([key, value]) => value)
        .map(([key]) => key);

      setStatus(
        extracted.length
          ? `Extracted successfully: ${extracted.join(", ")}`
          : "No details detected. Upload a clearer image.",
      );
    } catch (error: any) {
      console.log("OCR ERROR:", error.response?.data || error);

      setStatus(
        error.response?.data?.message || "OCR failed. Check backend terminal.",
      );
    } finally {
      setBusy(false);
    }
  };

  // Fetch citizen using email
  const fetchCitizen = async () => {
    if (!form.emailid.trim()) {
      setStatus("Please enter Email ID first.");
      return;
    }

    setBusy(true);

    try {
      const response = await axios.get(
        `${API}/email/${encodeURIComponent(form.emailid.trim())}`,
      );

      const citizen = response.data.citizen;

      setForm({
        ...blankForm,
        ...citizen,
      });

      setRecordId(citizen._id || "");

      setStatus("Citizen record fetched successfully.");
    } catch (error: any) {
      setRecordId("");

      setStatus(error.response?.data?.message || "Citizen record not found.");
    } finally {
      setBusy(false);
    }
  };

  // Save or update citizen
  const saveCitizen = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.emailid.trim()) {
      setStatus("Email ID is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailid)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    setBusy(true);

    try {
      let response;

      if (recordId) {
        response = await axios.put(`${API}/${recordId}`, form);
      } else {
        response = await axios.post(API, form);
      }

      setRecordId(response.data.citizen?._id || recordId);

      setStatus(response.data.message || "Citizen data saved successfully.");
    } catch (error: any) {
      console.log("Save Error:", error);

      setStatus(
        error.response?.data?.message || "Unable to save citizen data.",
      );
    } finally {
      setBusy(false);
    }
  };

  // Clear form
  const clearForm = () => {
    setForm(blankForm);
    setRecordId("");
    setFrontPreview("");
    setBackPreview("");
    setStatus("Form cleared.");
  };

  // Reusable input
  const input = (label: string, name: keyof CitizenData, type = "text") => (
    <label className="block text-sm font-semibold text-slate-700">
      {label}

      <input
        className={`${fieldClass} mt-2`}
        name={name}
        type={type}
        value={form[name]}
        onChange={change}
        placeholder={`Enter ${label}`}
      />
    </label>
  );

  // Image upload component
  const imagePicker = (side: "front" | "back") => {
    const preview = side === "front" ? frontPreview : backPreview;

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-lg font-bold text-blue-800">
          Aadhaar {side === "front" ? "Front Side" : "Back Side"}
        </h3>

        <div className="flex h-48 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-blue-300 bg-slate-50">
          {preview ? (
            <img
              src={preview}
              alt={`${side} preview`}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="text-center text-slate-400">
              <p className="text-4xl">📄</p>
              <p className="mt-2 text-sm">Upload Aadhaar {side} image</p>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-4 w-full text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (!file) return;

            const url = URL.createObjectURL(file);

            if (side === "front") {
              setFrontPreview((old) => {
                if (old) URL.revokeObjectURL(old);
                return url;
              });
            } else {
              setBackPreview((old) => {
                if (old) URL.revokeObjectURL(old);
                return url;
              });
            }

            void scan(side, file);

            // Allows selecting the same file again
            e.target.value = "";
          }}
        />

        <p className="mt-2 text-xs text-slate-500">
          JPG, PNG or WEBP. Maximum 5 MB.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* NAVBAR */}
      <nav className="bg-blue-900 px-6 py-5 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold md:text-2xl">
              Citizen Management Portal
            </h1>

            <p className="mt-1 text-xs text-blue-200">
              SMART CITIZEN REGISTRATION SYSTEM
            </p>
          </div>

          <span className="rounded-full bg-blue-700 px-4 py-2 text-xs">
            ADMIN PORTAL
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* HEADING */}
        <div className="mb-7">
          <h2 className="text-3xl font-bold text-slate-800">
            Citizen Registration
          </h2>

          <p className="mt-2 text-slate-500">
            Upload Aadhaar images to automatically extract citizen details.
          </p>
        </div>

        <form onSubmit={saveCitizen} className="space-y-6">
          {/* EMAIL SECTION */}
          <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm md:flex-row md:items-end">
            <div className="flex-1">
              {input("Email ID", "emailid", "email")}
            </div>

            <button
              type="button"
              onClick={fetchCitizen}
              disabled={busy}
              className="rounded-lg bg-blue-700 px-8 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              Fetch Citizen
            </button>
          </section>

          {/* IMAGE UPLOAD AND DETAILS */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* LEFT SIDE */}
            <div className="space-y-6">
              {imagePicker("front")}

              {imagePicker("back")}
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">
              {/* PERSONAL DETAILS */}
              <section className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-5 border-b pb-3 text-xl font-bold text-blue-900">
                  Personal Details
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    {input("Aadhaar Number", "acardno")}
                  </div>

                  {input("Full Name", "name")}

                  {input("Date of Birth", "dob")}

                  <label className="block text-sm font-semibold text-slate-700">
                    Gender
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={change}
                      className={`${fieldClass} mt-2`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                    </select>
                  </label>
                </div>
              </section>

              {/* ADDRESS DETAILS */}
              <section className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-5 border-b pb-3 text-xl font-bold text-blue-900">
                  Address Details
                </h3>

                <div className="space-y-5">
                  {input("Full Address", "address")}

                  {input("City / District", "city")}

                  {input("Contact Number", "contact", "tel")}
                </div>
              </section>
            </div>
          </div>

          {/* STATUS AND BUTTONS */}
          <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-medium text-slate-600" role="status">
              {status}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={clearForm}
                disabled={busy}
                className="rounded-lg border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-100"
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-blue-800 px-7 py-3 font-semibold text-white hover:bg-blue-900 disabled:opacity-50"
              >
                {busy
                  ? "Please Wait..."
                  : recordId
                    ? "Modify Data"
                    : "Save Citizen"}
              </button>
            </div>
          </section>
        </form>

        <p className="mt-6 text-xs leading-6 text-slate-500">
          OCR extraction may contain errors. Verify all details before saving.
          Only upload Aadhaar images with the cardholder's permission.
        </p>
      </main>
    </div>
  );
}
