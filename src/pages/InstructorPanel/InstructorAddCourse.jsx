import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { XCircle } from "lucide-react";
import { fetchInstructorCategories, createInstructorCourse } from "../../redux/InstructorPannel/InstructorPannelAction";
import { fetchInstructorByIdSecure } from '../../redux/Instructor/InstructorAction';


const InstructorAddCourse = () => {
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const role = user?.role;

  const { data: categories, loading: categoriesLoading } = useSelector(
    (state) => state.instructorCourse.categories
  );
  const { instructor: instructorInfo, loading: instructorLoading } = useSelector((state) => state.instructor);
  const { loading } = useSelector((state) => state.instructorCourse.createCourse);

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    dispatch(fetchInstructorCategories());
    if (role === 'INSTRUCTOR') {
      dispatch(fetchInstructorByIdSecure(userId));
    }
  }, [dispatch, userId, role]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      priceType: "FREE",
      price: "",
      level: "",
      categoryId: "",
      tags: "",
      thumbnail: null,
      introVideo: "",
      discountPercentage: 0,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Title is required")
        .min(5, "Title must be at least 5 characters")
        .max(100, "Title must not exceed 100 characters"),

      description: Yup.string()
        .required("Description is required")
        .min(50, "Description must be at least 50 characters")
        .max(2000, "Description must not exceed 2000 characters"),

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
              .max(100000, "Price cannot exceed ₹1,00,000"),
          otherwise: (schema) => schema.notRequired(),
        }),

      level: Yup.string()
        .required("Level is required"),

      categoryId: Yup.string()
        .required("Category is required"),

      thumbnail: Yup.mixed()
        .required("Thumbnail is required")
        .test(
          "fileSize",
          "File too large (max 2MB allowed)",
          (value) => !value || (value && value.size <= 2097152)
        )
        .test(
          "fileType",
          "Only image files are allowed",
          (value) => !value || (value && ["image/jpeg", "image/png"].includes(value.type))
        ),

      introVideo: Yup.string()
        .url("Invalid YouTube link")
        .required("Intro video URL is required"),
      discountPercentage: Yup.number()
        .min(0, "Discount cannot be negative")
        .max(100, "Discount cannot exceed 100%")

    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "price" && values.priceType === "FREE") return;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      formData.append('instructorId', userId);

      try {
        await dispatch(createInstructorCourse(formData)).unwrap();
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
    <div className=" py-10">
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
              value={formik.values.title}
              className={inputClass}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
            )}
          </div>

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
                value={formik.values.price}
                className={inputClass}
              />
              {formik.touched.price && formik.errors.price && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
              )}
            </div>
          )}

          {formik.values.priceType === "PAID" && (
            <div>
              <label className={labelClass}>Discount Percentage</label>
              <input
                type="number"
                name="discountPercentage"
                onChange={formik.handleChange}
                value={formik.values.discountPercentage}
                className={inputClass}
                min="0"
                max="100"
              />
              {formik.touched.discountPercentage && formik.errors.discountPercentage && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.discountPercentage}</p>
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
              disabled={categoriesLoading}
            >
              <option value="">Select Category</option>
              {categoriesLoading ? (
                <option>Loading categories...</option>
              ) : (
                categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))
              )}
            </select>
            {formik.touched.categoryId && formik.errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.categoryId}</p>
            )}
          </div>

          {/* Instructor  */}
          <div>
            <label className={labelClass}>Instructor</label>
            <input
              type="text"
              value={
                instructorLoading
                  ? "Loading..."
                  :
                  instructorInfo?.fullName ||
                  "Instructor information"
              }
              className={`${inputClass} bg-gray-100`}
              readOnly
            />
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
              className={inputClass}
              placeholder="YouTube link"
            />
            {formik.touched.introVideo && formik.errors.introVideo && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.introVideo}</p>
            )}
          </div>

          {/* Submit */}
          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200"
            >
              {loading ? "Submitting..." : "Add Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstructorAddCourse;