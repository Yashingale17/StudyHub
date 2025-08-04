import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyInstructorCourses, createCourseContent } from "../../redux/InstructorPannel/InstructorPannelAction";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Select from 'react-select';


const AddCourseContentInst = () => {
  const dispatch = useDispatch();
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const { data: myCourses, loading: courseLoading, error: courseError } = useSelector(
    (state) => state.instructorCourse.myCourses
  );
  const { loading: contentLoading, error: contentError, success: contentSuccess } = useSelector(
    (state) => state.instructorCourse.createContent
  );

  useEffect(() => {
    dispatch(fetchMyInstructorCourses());
  }, [dispatch]);

  useEffect(() => {
    if (contentSuccess) {
      toast.success("Course content added successfully!");
      dispatch({ type: "instructorCourse/resetCourseState" });
    }

    if (contentError) {
      toast.error(contentError);
      dispatch({ type: "instructorCourse/resetCourseState" });
    }
  }, [contentSuccess, contentError, dispatch]);

  const formik = useFormik({
    initialValues: {
      title: "",
      duration: "",
      aboutLessons: "",
      videoUrl: "",
      sequence: "",
      isPreview: false,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Title is required")
        .min(5, "Title must be at least 5 characters")
        .max(100, "Title must not exceed 100 characters"),
      duration: Yup.string()
        .required("Duration is required")
        .matches(
          /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
          "Duration must be in HH:MM:SS format"
        ),
      aboutLessons: Yup.string()
        .required("About lessons is required")
        .min(20, "Description must be at least 20 characters")
        .max(1000, "Description must not exceed 1000 characters"),
      videoUrl: Yup.string()
        .url("Enter a valid URL")
        .required("Video URL is required"),
      sequence: Yup.number()
        .typeError("Sequence must be a number")
        .required("Sequence is required")
        .positive("Sequence must be a positive number")
        .integer("Sequence must be an integer"),
    }),
    onSubmit: (values, { resetForm }) => {
      if (!selectedCourseId) return;

      const payload = {
        ...values,
        courseId: selectedCourseId,
      };

      dispatch(createCourseContent(payload)).then((res) => {
        if (!res.error) {
          resetForm();
          setSelectedCourseId("");
        }
      });
    },
  });

  const courseOptions = myCourses.map((course) => ({
    value: course.id,
    label: course.title,
  }));

  // Handle selection
  const handleCourseChange = (selectedOption) => {
    setSelectedCourseId(selectedOption?.value || "");
  };

  return (
    <div className="rounded p-1 mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Add Course Content</h2>

      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold text-gray-700">
          Select Course
        </label>

        {courseLoading ? (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="animate-spin" />
            <span>Fetching your courses...</span>
          </div>
        ) : courseError ? (
          <p className="text-red-500">{courseError}</p>
        ) : myCourses?.length === 0 ? (
          <p className="text-yellow-600 font-medium">You don’t have any course by your name.</p>
        ) : (
          <Select
            value={courseOptions.find(option => option.value === selectedCourseId) || null}
            onChange={handleCourseChange}
            options={courseOptions}
            placeholder="-- Select Course --"
            isClearable
            className="w-full"
            classNamePrefix="react-select"
          />
        )}
      </div>

      {selectedCourseId && (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <input
                type="text"
                name="title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                className="w-full border border-[#DDD8F9] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block mb-1 font-medium">Duration</label>
              <input
                type="text"
                name="duration"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.duration}
                placeholder="e.g. 01:30:00"
                className="w-full border border-[#DDD8F9] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formik.touched.duration && formik.errors.duration && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.duration}</p>
              )}
            </div>

            {/* Video URL */}
            <div>
              <label className="block mb-1 font-medium">Video URL</label>
              <input
                type="text"
                name="videoUrl"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.videoUrl}
                placeholder="https://..."
                className="w-full border border-[#DDD8F9] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formik.touched.videoUrl && formik.errors.videoUrl && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.videoUrl}</p>
              )}
            </div>

            {/* Sequence */}
            <div>
              <label className="block mb-1 font-medium">Sequence</label>
              <input
                type="number"
                name="sequence"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sequence}
                className="w-full border border-[#DDD8F9] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formik.touched.sequence && formik.errors.sequence && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.sequence}</p>
              )}
            </div>
          </div>

          {/* About Lessons */}
          <div>
            <label className="block mb-1 font-medium">About Lessons</label>
            <textarea
              name="aboutLessons"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.aboutLessons}
              rows={4}
              className="w-full border border-[#DDD8F9] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formik.touched.aboutLessons && formik.errors.aboutLessons && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.aboutLessons}</p>
            )}
          </div>

          {/* Preview Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPreview"
              name="isPreview"
              checked={formik.values.isPreview}
              onChange={formik.handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="isPreview" className="text-sm">
              Make this lesson a preview
            </label>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={contentLoading}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {contentLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Submitting...
                </div>
              ) : (
                "Add Content"
              )}
            </button>
          </div>

          {/* General error from backend */}
          {contentError && <p className="text-red-500 text-sm">{contentError}</p>}
        </form>
      )}
    </div>
  );
};

export default AddCourseContentInst;
