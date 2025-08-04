import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { UserPlus, XCircle } from "lucide-react";
import * as Yup from "yup";
import FormField from "../../../Components/Formfield"; // adjust the path as needed

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  specialization: Yup.string().required("Specialization is required"),
  bio: Yup.string()
    .min(30, "Bio must be at least 30 characters")
    .max(5000, "Bio must be at most 5000 characters")
    .required("Bio is required"),
});

const AddInstructor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    specialization: "",
    bio: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      if (!image) {
        setErrors((prev) => ({ ...prev, image: "Profile image is required" }));
        return;
      }
      if (!image.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Only image files are allowed" }));
        return;
      }
      if (image.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "File size must be under 2MB" }));
        return;
      }

      // Submit form
      const instructorForm = new FormData();
      Object.entries(formData).forEach(([key, value]) => instructorForm.append(key, value));
      instructorForm.append("image", image);

      setSubmitting(true);
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:8080/api/admin/createInstructor", instructorForm, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Instructor created successfully!");
      navigate("/admin/instructors");

    } catch (err) {
      if (err.name === "ValidationError") {
        // Collect all Yup validation errors
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else if (err.response?.data) {
        const data = err.response.data;
        if (data.general) setGeneralError(data.general);
        else setErrors(data);
      } else {
        toast.error("Failed to create instructor");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <UserPlus className="text-blue-600" size={28} />
          <h1 className="text-3xl font-semibold text-gray-800">Add New Instructor</h1>
        </div>

        {generalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm font-medium">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
            <FormField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
            <FormField label="Username" name="username" value={formData.username} onChange={handleChange} error={errors.username} />
            <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
            <FormField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
            <FormField label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} error={errors.specialization} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {preview && (
              <div className="relative mt-2 w-24 h-24">
                <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-full border" />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute -top-2 -right-2 bg-white rounded-full text-red-500 hover:text-red-700"
                >
                  <XCircle size={18} />
                </button>
              </div>
            )}
            {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              placeholder="Instructor bio (30 to 5000 characters)..."
              className={`w-full border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                errors.bio ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition"
            >
              {submitting ? "Adding..." : "Add Instructor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInstructor;
