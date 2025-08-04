import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { XCircle } from "lucide-react";
import Select from 'react-select';

import {
  fetchMyInstructorCourses,
  fetchInstructorCategories,
  updateCourseInst,
} from "../../redux/InstructorPannel/InstructorPannelAction";
import { fetchInstructorByIdSecure } from "../../redux/Instructor/InstructorAction";

const InstructorUpdateCourse = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const { data: categories } = useSelector((state) => state.instructorCourse.categories);
  const { instructor: instructorInfo } = useSelector((state) => state.instructor);
  const { data: myCourses } = useSelector((state) => state.instructorCourse.myCourses);
  const { loading: updateLoading, error: updateError } = useSelector((state) => state.instructorCourse.updateCourse);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
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
  });
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    dispatch(fetchMyInstructorCourses());
    dispatch(fetchInstructorCategories());
    if (userId) {
      dispatch(fetchInstructorByIdSecure(userId));
    }
  }, [dispatch, userId]);

  const handleCourseSelect = (e) => {
    const courseId = Number(e.target.value);
    setSelectedCourseId(courseId);
    const selectedCourse = myCourses.find((course) => course.id === courseId);

    if (selectedCourse) {

      const category = categories.find(cat => cat.categoryName === selectedCourse.categoryName);

      const newFormData = {
        title: selectedCourse.title,
        description: selectedCourse.description,
        priceType: selectedCourse.price === 0 ? "FREE" : "PAID",
        price: selectedCourse.price || "",
        level: selectedCourse.level,
        categoryId: category?.id || "",
        tags: selectedCourse.tags || "",
        thumbnail: selectedCourse.thumbnail,
        introVideo: selectedCourse.introVideo,
        discountPercentage: selectedCourse.discountPercentage || 0,
      };

      setFormData(newFormData);
      setPreviewImage(selectedCourse.thumbnail
        ? `http://localhost:8080${selectedCourse.thumbnail}`
        : null);
      setErrors({});

      // Debug logs
      console.log('Selected category:', category);
      console.log('Prepared formData:', newFormData);
    }
  };

  useEffect(() => {
    if (!selectedCourseId) return;

    const current = myCourses.find(c => c.id === selectedCourseId);
    if (!current) return;

    const dirty = hasChanges(current, formData);
    console.log('Is dirty?', dirty, { current, formData });
    setIsDirty(dirty);
  }, [formData, selectedCourseId, myCourses]);

  const hasChanges = (current, updated) => {
    const currentCategory = categories.find(cat => cat.categoryName === current.categoryName);
    const currentCategoryId = currentCategory?.id || "";

    const currentPriceType = current.price === 0 ? "FREE" : "PAID";
    const updatedPrice = updated.priceType === "FREE" ? 0 : Number(updated.price || 0);

    const currentDiscount = current.discountPercentage || 0;
    const updatedDiscount = updated.discountPercentage || 0;

    return (
      current.title !== updated.title ||
      current.description !== updated.description ||
      current.level !== updated.level ||
      currentCategoryId !== updated.categoryId ||
      current.tags !== updated.tags ||
      current.introVideo !== updated.introVideo ||
      Number(currentDiscount) !== Number(updatedDiscount) ||
      currentPriceType !== updated.priceType ||
      Number(current.price) !== updatedPrice ||
      updated.thumbnail instanceof File ||
      (updated.thumbnail === null && current.thumbnail)
    );
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    if (["price", "discountPercentage"].includes(name)) {
      newValue = value === "" ? "" : Number(value); // keep empty string to allow clearing
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));


    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setFormData(prev => ({
      ...prev,
      thumbnail: null
    }));
    setPreviewImage(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.priceType === "PAID" && (!formData.price || isNaN(formData.price) || formData.price <= 0)) {
      newErrors.price = "Valid price is required for paid courses";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const currentCourse = myCourses.find(c => c.id === selectedCourseId);
    if (!currentCourse) {
      toast.error("Course not found");
      return;
    }

    // Convert form data to comparable format
    const formPrice = formData.priceType === "FREE" ? 0 : Number(formData.price);
    const currentPrice = currentCourse.price;
    const currentDiscount = currentCourse.discountPercentage || 0;
    const formDiscount = Number(formData.discountPercentage) || 0;

    // Check each field for changes - MUST MATCH hasChanges() logic exactly
    const changes = {
      title: formData.title !== currentCourse.title,
      description: formData.description !== currentCourse.description,
      price: formPrice !== currentPrice,
      priceType: (currentCourse.price === 0 ? "FREE" : "PAID") !== formData.priceType,
      level: formData.level !== currentCourse.level,
      categoryId: formData.categoryId !== currentCourse.categoryId,
      tags: JSON.stringify(formData.tags || []) !== JSON.stringify(currentCourse.tags || []),
      introVideo: formData.introVideo !== currentCourse.introVideo,
      discountPercentage: formDiscount !== currentDiscount,
      thumbnail: formData.thumbnail instanceof File ||
        (formData.thumbnail === null && currentCourse.thumbnail)
    };

    // Debug: Log the changes object
    console.log('Changes detected:', changes);

    // Check if any changes exist
    const hasActualChanges = Object.values(changes).some(Boolean);

    if (!hasActualChanges) {
      toast.info("No changes detected");
      return;
    }

    const dataToSend = new FormData();

    // Only append changed fields
    if (changes.title) dataToSend.append('title', formData.title);
    if (changes.description) dataToSend.append('description', formData.description);
    if (changes.price || changes.priceType) {
      dataToSend.append('price', formPrice.toString());
      dataToSend.append('priceType', formData.priceType);
    }
    if (changes.level) dataToSend.append('level', formData.level);
    if (changes.categoryId) dataToSend.append('categoryId', formData.categoryId);
    if (changes.tags) dataToSend.append('tags', formData.tags);
    if (changes.introVideo) dataToSend.append('introVideo', formData.introVideo);
    if (changes.discountPercentage) {
      dataToSend.append('discountPercentage', formDiscount.toString());
    }

    // Handle thumbnail changes
    if (formData.thumbnail instanceof File) {
      dataToSend.append('thumbnail', formData.thumbnail);
    } else if (formData.thumbnail === null && currentCourse.thumbnail) {
      dataToSend.append('thumbnail', '');
    }

    try {
      await dispatch(updateCourseInst({
        id: selectedCourseId,
        formData: dataToSend
      })).unwrap();

      toast.success("Course updated successfully!");
      const updatedCourses = await dispatch(fetchMyInstructorCourses()).unwrap();

      const updatedCourse = updatedCourses.find(c => c.id === selectedCourseId);
      dispatch(fetchMyInstructorCourses());

      // Update preview if thumbnail changed
      if (updatedCourse?.thumbnail) {
        setPreviewImage(`http://localhost:8080${updatedCourse.thumbnail}?t=${Date.now()}`);
        setFormData(prev => ({
          ...prev,
          thumbnail: updatedCourse.thumbnail
        }));
      } else if (formData.thumbnail === null) {
        // If image was removed
        setPreviewImage(null);
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.message || "Failed to update course");
    }
  };

  const resetForm = () => {
    const selectedCourse = myCourses.find((course) => course.id === selectedCourseId);
    if (selectedCourse) {
      const category = categories.find(cat => cat.categoryName === selectedCourse.categoryName);

      setFormData({
        title: selectedCourse.title,
        description: selectedCourse.description,
        priceType: selectedCourse.price === 0 ? "FREE" : "PAID",
        price: selectedCourse.price || "",
        level: selectedCourse.level,
        categoryId: category?.id || "",
        tags: Array.isArray(selectedCourse.tags) ? selectedCourse.tags.join(', ') : selectedCourse.tags || "",
        thumbnail: selectedCourse.thumbnail,
        introVideo: selectedCourse.introVideo,
        discountPercentage: selectedCourse.discountPercentage || 0, // Make sure this is preserved
      });

      setPreviewImage(selectedCourse.thumbnail
        ? `http://localhost:8080${selectedCourse.thumbnail}`
        : null);
      setErrors({});
    }
  };

  const courseOptions = myCourses?.map((course) => ({
    value: course.id,
    label: course.title,
  }));

  // Handle selection
  const handleReactSelectChange = (selectedOption) => {
    if (selectedOption) {
      handleCourseSelect({ target: { value: selectedOption.value } });
    } else {
      setSelectedCourseId("");
      setFormData({
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
      });
      setPreviewImage(null);
    }
  };


  const inputClass = "w-full border border-[#DDD8F9] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "mt-1 text-sm text-red-600";

  return (
    <div className="py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto rounded-lg p-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Course</h2>

        <div className="mb-6">
          <label className={labelClass}>Select Course to Update</label>
          <Select
            options={courseOptions}
            value={courseOptions?.find((option) => option.value === selectedCourseId) || null}
            onChange={handleReactSelectChange}
            placeholder="-- Select a course --"
            isClearable
            className="mb-6"
            classNamePrefix="react-select"
          />
        </div>


        {selectedCourseId && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className={labelClass}>Course Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  onChange={handleChange}
                  value={formData.title}
                  className={inputClass}
                />
                {errors.title && <p className={errorClass}>{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="priceType" className={labelClass}>Price Type</label>
                <select
                  id="priceType"
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Price</option>
                  <option value="FREE">Free</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>

              {formData.priceType === "PAID" && (
                <>
                  <div>
                    <label htmlFor="price" className={labelClass}>Price ($)</label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      onChange={handleChange}
                      value={formData.price}
                      className={inputClass}
                      min="1"
                      step="0.01"
                    />
                    {errors.price && <p className={errorClass}>{errors.price}</p>}
                  </div>

                  <div>
                    <label htmlFor="discountPercentage" className={labelClass}>Discount Percentage</label>
                    <input
                      id="discountPercentage"
                      name="discountPercentage"
                      type="number"
                      onChange={handleChange}
                      value={formData.discountPercentage}
                      className={inputClass}
                      min="0"
                      max="100"
                    />
                  </div>
                </>
              )}

              <div>
                <label htmlFor="level" className={labelClass}>Level</label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Level</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
                {errors.level && <p className={errorClass}>{errors.level}</p>}
              </div>

              <div>
                <label htmlFor="categoryId" className={labelClass}>Category</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                  ))}
                </select>
                {errors.categoryId && <p className={errorClass}>{errors.categoryId}</p>}
              </div>

              <div>
                <label htmlFor="tags" className={labelClass}>Tags (comma separated)</label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  onChange={handleChange}
                  value={formData.tags}
                  className={inputClass}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                onChange={handleChange}
                value={formData.description}
                className={inputClass}
              />
              {errors.description && <p className={errorClass}>{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="introVideo" className={labelClass}>Intro Video (YouTube URL)</label>
              <input
                id="introVideo"
                name="introVideo"
                type="text"
                onChange={handleChange}
                value={formData.introVideo}
                className={inputClass}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {errors.introVideo && <p className={errorClass}>{errors.introVideo}</p>}
            </div>

            <div>
              <label className={labelClass}>Thumbnail Image</label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  id="thumbnail"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {previewImage && (
                <div className="relative mt-2 w-48">
                  <img src={previewImage} alt="Course thumbnail preview" className="rounded-md shadow h-32 object-cover" />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                  >
                    <XCircle className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              )}
            </div>

            {updateError && (
              <div className="p-4 bg-red-50 rounded-md">
                <h3 className="text-sm font-medium text-red-800">Update failed</h3>
                <p className="mt-1 text-sm text-red-700">{updateError}</p>
              </div>
            )}

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Reset Changes
              </button>

              <button
                type="submit"
                disabled={updateLoading || !isDirty}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50`}
              >
                {updateLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65z" />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Course"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InstructorUpdateCourse;