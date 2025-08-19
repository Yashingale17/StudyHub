import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyInstructorCourses,
  fetchCourseContentByCourseId,
  updateCourseContent,
} from "../../redux/InstructorPannel/InstructorPannelAction";
import { toast } from "react-toastify";
import Select from 'react-select';

const UpdateCourseContetinst = () => {
  const dispatch = useDispatch();


  const { data: myCourses } = useSelector((state) => state.instructorCourse.myCourses);
  const { courseContentByCourseId, updateCourseContent: updateState } = useSelector(
    (state) => state.instructorCourse
  );
  console.log("courseContentByCourseId", courseContentByCourseId);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedContentId, setSelectedContentId] = useState("");
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    dispatch(fetchMyInstructorCourses());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCourseId) {
      dispatch(fetchCourseContentByCourseId(selectedCourseId));
      setSelectedContentId("");
      setInitialValues(null);
    }
  }, [selectedCourseId, dispatch]);


  useEffect(() => {
    if (selectedContentId && courseContentByCourseId.data.length > 0) {
      const selected = courseContentByCourseId.data.find((c) => c.id === parseInt(selectedContentId));
      if (selected) {
        setInitialValues({
          title: selected.title || "",
          duration: selected.duration || "",
          aboutLessons: selected.aboutLessons || "",
          videoUrl: selected.videoUrl || "",
          sequence: selected.sequence || 0,
          isPreview: selected.isPreview || true,
        });
      }
    }
  }, [selectedContentId, courseContentByCourseId]);

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title too long"),
    duration: Yup.string(),
    aboutLessons: Yup.string()
      .min(20, "Description too short")
      .max(500, "Description too long"),
    videoUrl: Yup.string().url("Must be a valid URL"),
    sequence: Yup.number(),
    isPreview: Yup.boolean(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || {
      title: "",
      duration: "",
      aboutLessons: "",
      videoUrl: "",
      sequence: 0,
      isPreview: false,
    },
    validationSchema,
    onSubmit: (values) => {
      if (!selectedContentId || !initialValues) return;

      const isSame =
        values.title === initialValues.title &&
        values.duration === initialValues.duration &&
        values.aboutLessons === initialValues.aboutLessons &&
        values.videoUrl === initialValues.videoUrl &&
        values.sequence === initialValues.sequence &&
        values.isPreview === initialValues.isPreview;

      if (isSame) {
        toast.info("No changes detected.");
        return;
      }

      dispatch(updateCourseContent({ id: selectedContentId, contentData: values }))
        .then((res) => {
          if (res.type.includes("fulfilled")) {
            toast.success("Course content updated");
          } else {
            toast.error(res.payload || "Failed to update content");
          }
        });
    },

  });

  const courseOptions = myCourses.map(course => ({
    value: course.id,
    label: course.title,
  }));

  const handleCourseChange = (selectedOption) => {
    setSelectedCourseId(selectedOption ? selectedOption.value : "");
  };

  const contentOptions = courseContentByCourseId.data.map(content => ({
    value: content.id,
    label: content.title,
  }));

  const handleContentChange = (selectedOption) => {
    setSelectedContentId(selectedOption ? selectedOption.value : "");
  };

  return (
    <div className="p-1 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Course Content</h2>


      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <label className="block mb-1 font-medium text-gray-700">Select Course:</label>
          <Select
            options={courseOptions}
            value={courseOptions.find(option => option.value === selectedCourseId) || null}
            onChange={handleCourseChange}
            placeholder="-- Select Course --"
            isClearable
            className="w-full mb-4"
            classNamePrefix="react-select"
          />

        </div>
        {courseContentByCourseId?.data?.length > 0 && (
          <div className="w-full md:w-1/2">
            <label className="block mb-1 font-medium text-gray-700">Select Content to Edit:</label>
            <Select
              options={contentOptions}
              value={contentOptions.find(option => option.value === selectedContentId) || null}
              onChange={handleContentChange}
              placeholder="-- Select Content --"
              isClearable
              className="w-full"
              classNamePrefix="react-select"
            />

          </div>
        )}
      </div>

      {/* Update Form */}
      {initialValues && (
        <form onSubmit={formik.handleSubmit} className="grid gap-4 mt-4">

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <label className="block mb-1 font-medium text-gray-700">Title</label>
              <input
                name="title"
                type="text"
                className="w-full border border-[#DDD8F9] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formik.values.title}
                onChange={formik.handleChange}
              />
              {formik.errors.title && <div className="text-red-500 text-sm">{formik.errors.title}</div>}
            </div>

            <div className="w-full md:w-1/2">
              <label className="block mb-1 font-medium text-gray-700">Duration</label>
              <input
                name="duration"
                type="text"
                className="w-full border border-[#DDD8F9] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formik.values.duration}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <label className="block mb-1 font-medium text-gray-700">Video URL</label>
              <input
                name="videoUrl"
                type="text"
                className="w-full border border-[#DDD8F9] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formik.values.videoUrl}
                onChange={formik.handleChange}
              />
              {formik.errors.videoUrl && <div className="text-red-500 text-sm">{formik.errors.videoUrl}</div>}
            </div>

            <div className="w-full md:w-1/2">
              <label className="block mb-1 font-medium text-gray-700">Sequence</label>
              <input
                name="sequence"
                type="number"
                className="w-full border border-[#DDD8F9] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formik.values.sequence}
                onChange={formik.handleChange}
              />
            </div>
          </div>

   
          <div>
            <label className="block mb-1 font-medium text-gray-700">About Lesson</label>
            <textarea
              name="aboutLessons"
              className="w-full border border-[#DDD8F9] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formik.values.aboutLessons}
              onChange={formik.handleChange}
            />
            {formik.errors.aboutLessons && (
              <div className="text-red-500 text-sm">{formik.errors.aboutLessons}</div>
            )}
          </div>

   
          <div className="flex items-center">
            <input
              name="isPreview"
              type="checkbox"
              checked={formik.values.isPreview}
              onChange={formik.handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">Is Preview?</label>
          </div>


          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Content
          </button>
        </form>

      )}
    </div>
  );

};

export default UpdateCourseContetinst;
