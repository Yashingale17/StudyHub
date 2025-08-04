import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-4">Page Not Found</p>
        <p className="text-gray-500 mb-6">
          The page you are looking for might have been removed or does not exist.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
