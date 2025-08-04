// src/Components/Formfield.jsx
import React from "react";

const FormField = ({ label, name, value, onChange, error, type = "text" }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`w-full border rounded-md px-4 py-2 text-sm focus:outline-none ${
        error
          ? "border-red-500 ring-1 ring-red-400"
          : "border-gray-300 focus:ring-2 focus:ring-blue-500"
      }`}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default FormField;
