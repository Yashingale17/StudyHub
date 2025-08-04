import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { XCircle } from "lucide-react";
import {
  fetchAllCategories,
  fetchAllInstructors,
  createCourse,
} from "../../../redux/Admin/Actions/DashboardActions";

const AddCourses = () => {
  const dispatch = useDispatch();
  const { categories, instructors, loading } = useSelector((state) => state.adminDashboard);

  const [previewImage, setPreviewImage] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchAllInstructors());
  }, [dispatch]);

  const convertToEmbedUrl = (url) => {
    if (!url) return '';
    
    // Clean the URL first
    let cleanedUrl = url.trim();
    if (!cleanedUrl.startsWith('http')) {
      cleanedUrl = `https://${cleanedUrl}`;
    }

    try {
      const urlObj = new URL(cleanedUrl);
      
      // Handle youtu.be links
      if (urlObj.hostname === 'youtu.be') {
        const videoId = urlObj.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Handle youtube.com links
      if (['www.youtube.com', 'youtube.com'].includes(urlObj.hostname)) {
        // Handle watch URLs
        if (urlObj.pathname === '/watch') {
          const videoId = urlObj.searchParams.get('v');
          if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
          }
        }
        // Handle embed URLs
        if (urlObj.pathname.startsWith('/embed/')) {
          return cleanedUrl;
        }
      }
    } catch (e) {
      console.error('Invalid URL:', e);
    }
    
    return '';
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      priceType: "FREE",
      price: "",
      level: "",
      categoryId: "",
      instructorId: "",
      tags: "",
      thumbnail: null,
      introVideo: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Title is required")
        .min(10, "Title must be at least 10 characters")
        .max(100, "Title must not exceed 100 characters"),

      description: Yup.string()
        .required("Description is required")
        .min(50, "Description must be at least 50 characters")
        .max(1000, "Description must not exceed 1000 characters"),

      priceType: Yup.string()
        .oneOf(["FREE", "PAID"])
        .required("Price type is required"),

      price: Yup.number()
        .nullable()
        .when("priceType", {
          is: "PAID",
          then: (schema) =>
            schema
              .required("Price is required")
              .min(1, "Must be greater than ₹0")
              .max(100000, "Price must be less than ₹1,00,000"),
          otherwise: (schema) => schema.notRequired(),
        }),

      level: Yup.string().required("Level is required"),
      categoryId: Yup.string().required("Category is required"),
      instructorId: Yup.string().required("Instructor is required"),

      thumbnail: Yup.mixed()
        .required("Thumbnail is required")
        .test(
          'fileSize',
          'File too large (max 2MB)',
          value => !value || (value && value.size <= 2000000)
        )
        .test(
          'fileType',
          'Unsupported file format (only jpg/jpeg/png)',
          value => !value || (value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type))
        ),

      introVideo: Yup.string()
        .required("Intro video URL is required")
        .test(
          'is-youtube-url',
          'Must be a valid YouTube URL (e.g., youtube.com/watch?v=ID or youtu.be/ID)',
          (value) => {
            if (!value) return false;
            try {
              const url = value.startsWith('http') ? value : `https://${value}`;
              const urlObj = new URL(url);
              return ['youtube.com', 'www.youtube.com', 'youtu.be'].includes(urlObj.hostname);
            } catch {
              return false;
            }
          }
        )
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "price" && values.priceType === "FREE") return;
        if (key === "introVideo") {
          formData.append(key, convertToEmbedUrl(value));
        } else {
          formData.append(key, value);
        }
      });

      try {
        await dispatch(createCourse(formData)).unwrap();
        toast.success("Course created successfully!");
        resetForm();
        setPreviewImage(null);
      } catch (err) {
        toast.error(err || "Failed to create course");
      }
    },
  });

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("thumbnail", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    formik.setFieldValue("thumbnail", null);
    setPreviewImage(null);
  };

  const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen px-6 py-10 bg-[#f9fafb]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Add New Course</h2>

        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className={labelClass}>Course Title *</label>
            <input
              type="text"
              name="title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              className={inputClass}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
            )}
          </div>

          {/* Price Type */}
          <div>
            <label className={labelClass}>Price Type *</label>
            <select
              name="priceType"
              value={formik.values.priceType}
              onChange={formik.handleChange}
              className={inputClass}
            >
              <option value="FREE">Free</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          {/* Price */}
          {formik.values.priceType === "PAID" && (
            <div>
              <label className={labelClass}>Price (₹) *</label>
              <input
                type="number"
                name="price"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
                className={inputClass}
              />
              {formik.touched.price && formik.errors.price && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
              )}
            </div>
          )}

          {/* Level */}
          <div>
            <label className={labelClass}>Course Level *</label>
            <select
              name="level"
              value={formik.values.level}
              onChange={formik.handleChange}
              className={inputClass}
            >
              <option value="">Select Level</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
            {formik.touched.level && formik.errors.level && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.level}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category *</label>
            <select
              name="categoryId"
              value={formik.values.categoryId}
              onChange={formik.handleChange}
              className={inputClass}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
              ))}
            </select>
            {formik.touched.categoryId && formik.errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.categoryId}</p>
            )}
          </div>

          {/* Instructor */}
          <div>
            <label className={labelClass}>Instructor *</label>
            <select
              name="instructorId"
              value={formik.values.instructorId}
              onChange={formik.handleChange}
              className={inputClass}
            >
              <option value="">Select Instructor</option>
              {instructors.map((ins) => (
                <option key={ins.id} value={ins.id}>{ins.fullName}</option>
              ))}
            </select>
            {formik.touched.instructorId && formik.errors.instructorId && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.instructorId}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>Tags</label>
            <input
              type="text"
              name="tags"
              value={formik.values.tags}
              onChange={formik.handleChange}
              className={inputClass}
              placeholder="Comma-separated tags"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className={labelClass}>Description *</label>
            <textarea
              name="description"
              rows={4}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              className={inputClass}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
            )}
          </div>

          {/* Thumbnail */}
          <div className="md:col-span-2">
            <label className={labelClass}>Thumbnail Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="mt-1 text-sm"
            />
            {formik.touched.thumbnail && formik.errors.thumbnail && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.thumbnail}</p>
            )}
            {previewImage && (
              <div className="relative mt-2 w-48">
                <img src={previewImage} alt="Thumbnail preview" className="rounded-md shadow" />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow"
                >
                  <XCircle className="w-5 h-5 text-red-600" />
                </button>
              </div>
            )}
          </div>

          {/* Intro Video */}
          <div className="md:col-span-2">
            <label className={labelClass}>Intro Video (YouTube) *</label>
            <input
              type="text"
              name="introVideo"
              value={formik.values.introVideo}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                const formattedUrl = convertToEmbedUrl(e.target.value);
                formik.setFieldValue('introVideo', formattedUrl);
              }}
              className={inputClass}
              placeholder="e.g., https://youtu.be/abc123 or https://www.youtube.com/watch?v=abc123"
            />
            {formik.touched.introVideo && formik.errors.introVideo ? (
              <p className="text-red-500 text-sm mt-1">{formik.errors.introVideo}</p>
            ) : (
              formik.values.introVideo && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Video Preview:</h4>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden">
                    {videoLoading && (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                    <iframe
                      src={convertToEmbedUrl(formik.values.introVideo)}
                      title="Video preview"
                      className="w-full h-64"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => setVideoLoading(false)}
                      onError={() => {
                        setVideoLoading(false);
                        toast.error("Failed to load video. Please check the URL.");
                      }}
                      style={{ display: videoLoading ? 'none' : 'block' }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Embed URL: {convertToEmbedUrl(formik.values.introVideo)}
                  </p>
                </div>
              )
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Add Course"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourses;