import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, addCourseContent } from '../../../redux/Admin/CourseContent/CourseContentAction';
import { resetSuccess, clearError } from '../../../redux/Admin/CourseContent/CourseContentSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddContent = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, error, success } = useSelector(state => state.admincoursecontent);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, 'Title must be at least 3 characters')
      .max(60, 'Title must be at most 60 characters')
      .required('Title is required'),
    duration: Yup.string().required('Duration is required'),
    aboutLessons: Yup.string()
      .min(3, 'Title must be at least 3 characters')
      .max(120, 'Title must be at most 120 characters')
      .required('Lesson details are required'),
    videoUrl: Yup.string()
      .required('Video URL is required')
      .url('Must be a valid URL'),
    sequence: Yup.number()
      .min(1, 'Sequence must be at least 1')
      .required('Sequence is required'),
    courseId: Yup.string().required('Please select a course')
  });

  const handleSubmit = (values, { resetForm }) => {
    const contentData = {
      title: values.title,
      duration: values.duration,
      aboutLessons: values.aboutLessons,
      videoUrl: values.videoUrl,
      sequence: values.sequence,
      isPreview: values.isPreview,
      courseId: values.courseId
    };

    dispatch(addCourseContent(contentData)).then(() => {
      resetForm();
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-700">
            <h2 className="text-2xl font-bold text-white text-center">
              Add New Course Content
            </h2>
            <p className="mt-1 text-sm text-blue-100 text-center">
              Select a course and add new content
            </p>
          </div>

          {/* Form Container */}
          <div className="px-6 py-8 md:px-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-red-800">
                    {error}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(clearError())}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-green-800">
                    Course content added successfully!
                  </p>
                </div>
                <button
                  onClick={() => dispatch(resetSuccess())}
                  className="text-green-500 hover:text-green-700 focus:outline-none"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {/* Form */}
            <Formik
              initialValues={{
                title: '',
                duration: '',
                aboutLessons: '',
                videoUrl: '',
                sequence: 1,
                isPreview: false,
                courseId: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Course Selection */}
                    <div className="md:col-span-2">
                      <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Course <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="select"
                        name="courseId"
                        id="courseId"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="">Select a course</option>
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="courseId" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        name="title"
                        id="title"
                        className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Content title"
                      />
                      <ErrorMessage name="title" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* Duration */}
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        name="duration"
                        id="duration"
                        className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 10:30"
                      />
                      <ErrorMessage name="duration" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* About Lessons */}
                    <div className="md:col-span-2">
                      <label htmlFor="aboutLessons" className="block text-sm font-medium text-gray-700 mb-1">
                        About Lessons <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="textarea"
                        name="aboutLessons"
                        id="aboutLessons"
                        rows={4}
                        className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe what this lesson covers"
                      />
                      <ErrorMessage name="aboutLessons" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* Video URL */}
                    <div className="md:col-span-2">
                      <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        Video URL <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="url"
                        name="videoUrl"
                        id="videoUrl"
                        className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/video"
                      />
                      <ErrorMessage name="videoUrl" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* Sequence Number */}
                    <div>
                      <label htmlFor="sequence" className="block text-sm font-medium text-gray-700 mb-1">
                        Sequence Number <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="number"
                        name="sequence"
                        id="sequence"
                        min="1"
                        className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage name="sequence" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* Preview Checkbox */}
                    <div className="flex items-end">
                      <div className="flex items-center h-10">
                        <Field
                          type="checkbox"
                          name="isPreview"
                          id="isPreview"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isPreview" className="ml-2 block text-sm text-gray-700">
                          Available as preview
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </>
                      ) : (
                        'Add Content'
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContent;