import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllInstructors,
  deleteInstructor,
  softDeleteInstructor,
  fetchInstructorById,
  fetchCoursesByInstructor,
  updateInstructor,
  reactiveInstructor
} from "../../../redux/Admin/Actions/DashboardActions";

import { clearCurrentInstructor } from "../../../redux/Admin/DashboardSlice";
import { Loader2, Eye, Pencil, Trash2, Ban, X } from "lucide-react";
import { toast } from "react-toastify";
import CourseCard from "../../../Components/CourseCard/CourseCard";

const Instructors = () => {
  const dispatch = useDispatch();
  const { instructors, loading, error, currentInstructor } = useSelector(
    (state) => state.adminDashboard
  );

  const instructorCourses = useSelector((state) => state.adminDashboard?.instructorCourses) ?? [];

  const [deletingId, setDeletingId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    enabled: true,
    fullName: '',
    imageUrl: '',
    specialization: '',
    bio: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    fullName: '',
    specialization: '',
    bio: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
    dispatch(fetchAllInstructors());
    return () => {
      dispatch(clearCurrentInstructor());
    };
  }, [dispatch]);



  const handleViewInstructor = async (id) => {
    try {
      setIsViewModalOpen(true);
      await Promise.all([
        dispatch(fetchInstructorById(id)),
        dispatch(fetchCoursesByInstructor(id))
      ]);
    } catch (error) {
      toast.error(error.payload || "Failed to fetch instructor details");
    }
  };



  const handleSoftDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to deactivate this instructor?"
    );
    if (!confirm) return;
    try {
      setDeletingId(id);
      await dispatch(softDeleteInstructor(id)).unwrap();
      toast.success("Instructor disabled successfully");
      dispatch(fetchAllInstructors());
    } catch {
      toast.error("Failed to disable instructor");
    } finally {
      setDeletingId(null);
    }
  };

  const handleReactiveInstructor = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to reactivate this instructor?"
    );
    if (!confirm) return;
    try {
      setDeletingId(id);
      await dispatch(reactiveInstructor(id)).unwrap();
    } catch (error) {
      console.error("Reactivation error:", error);
    } finally {
      setDeletingId(null);
    }
  };
  const handleEditInstructor = (instructor) => {
    setIsEditModalOpen(true);
    setEditFormData({
      firstName: instructor.firstName || '',
      lastName: instructor.lastName || '',
      username: instructor.username || '',
      email: instructor.email || '',
      enabled: instructor.active,
      fullName: instructor.fullName || '',
      imageUrl: instructor.imageUrl || '',
      specialization: instructor.specialization || '',
      bio: instructor.bio || ''
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // const validateForm = () => {
  //   let valid = true;
  //   const newErrors = {
  //     username: '',
  //     email: '',
  //     fullName: '',
  //     specialization: '',
  //     bio: ''
  //   };

  //   if (!editFormData.username || editFormData.username.length < 4) {
  //     newErrors.username = 'Username must be at least 4 characters';
  //     valid = false;
  //   }
  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //   if (!editFormData.email || !emailRegex.test(editFormData.email.trim())) {
  //     newErrors.email = 'Please enter a valid email address';
  //     isValid = false;
  //   }

  //   if (!editFormData.fullName || editFormData.fullName.length < 2) {
  //     newErrors.fullName = 'Full name must be at least 2 characters';
  //     valid = false;
  //   }

  //   if (editFormData.specialization && editFormData.specialization.length < 3) {
  //     newErrors.specialization = 'Specialization must be at least 3 characters';
  //     valid = false;
  //   }

  //   if (editFormData.bio && editFormData.bio.length < 10) {
  //     newErrors.bio = 'Bio must be at least 10 characters';
  //     valid = false;
  //   }

  //   setErrors(newErrors);
  //   return valid;
  // };

  const handleUpdateInstructor = async () => {
    // Clear previous errors
    setErrors({
      username: '',
      email: '',
      fullName: '',
      specialization: '',
      bio: ''
    });

    // Frontend validation
    const frontendErrors = {};
    let hasFrontendErrors = false;

    if (!editFormData.username || editFormData.username.trim().length < 4) {
      frontendErrors.username = 'Username must be at least 4 characters';
      hasFrontendErrors = true;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!editFormData.email || !emailRegex.test(editFormData.email.trim())) {
      frontendErrors.email = 'Please enter a valid email address';
      hasFrontendErrors = true;
    }

    if (!editFormData.fullName || editFormData.fullName.trim().length < 2) {
      frontendErrors.fullName = 'Full name must be at least 2 characters';
      hasFrontendErrors = true;
    }

    if (editFormData.specialization?.trim() && editFormData.specialization.trim().length < 3) {
      frontendErrors.specialization = 'Specialization must be at least 3 characters';
      hasFrontendErrors = true;
    }

    if (editFormData.bio?.trim() && editFormData.bio.trim().length < 10) {
      frontendErrors.bio = 'Bio must be at least 10 characters';
      hasFrontendErrors = true;
    }

    // If frontend errors exist, show them and stop
    if (hasFrontendErrors) {
      setErrors(frontendErrors);
      scrollToFirstError(frontendErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', editFormData.username.trim());
      formData.append('email', editFormData.email.trim());
      formData.append('fullName', editFormData.fullName.trim());
      formData.append('specialization', editFormData.specialization?.trim() || '');
      formData.append('bio', editFormData.bio?.trim() || '');
      formData.append('enabled', editFormData.enabled);

      if (selectedImage) {
        formData.append('file', selectedImage);
      }

      const resultAction = await dispatch(updateInstructor({
        id: currentInstructor.id,
        formData
      }));

      if (updateInstructor.fulfilled.match(resultAction)) {
        // Success case
        toast.success("Instructor updated successfully");
        setIsEditModalOpen(false);
        setSelectedImage(null);

        // Refresh data
        await Promise.all([
          dispatch(fetchAllInstructors()),
          dispatch(fetchInstructorById(currentInstructor.id))
        ]);
      } else {
        // Handle backend validation errors
        handleBackendErrors(resultAction);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  const scrollToFirstError = (errorObj) => {
    const firstErrorField = Object.keys(errorObj)[0];
    if (firstErrorField) {
      document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };


  const handleBackendErrors = (resultAction) => {
    if (resultAction.payload) {
      const backendErrors = resultAction.payload;
      setErrors(prev => ({
        ...prev,
        ...backendErrors
      }));

      scrollToFirstError(backendErrors);

      if (backendErrors.specialization) {
        toast.error(`Specialization Error: ${backendErrors.specialization}`);
      }
      if (backendErrors.email) {
        toast.error(`Email Error: ${backendErrors.email}`);
      }
    } else {
      toast.error("Failed to update instructor");
    }
  };

  const handleHardDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to permanently delete this instructor? This cannot be undone."
    );
    if (!confirm) return;
    try {
      setDeletingId(id);
      await dispatch(deleteInstructor(id)).unwrap();
      toast.success("Instructor deleted permanently");
      dispatch(fetchAllInstructors());
    } catch {
      toast.error("Failed to delete instructor");
    } finally {
      setDeletingId(null);
    }
  };

  const sortedInstructors = [...(instructors || [])].sort((a, b) => {
    if (a.active === false && b.active !== false) return 1;
    if (a.active !== false && b.active === false) return -1;
    return 0;
  });

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Instructor Management</h2>

        {loading && !instructors ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : instructors?.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">No instructors found.</p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profile
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedInstructors.map((instructor) => (
                    <tr key={instructor.id} className={instructor.active ? 'hover:bg-gray-50' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={`http://localhost:8080${instructor.imageUrl}`}
                              alt={instructor.fullName}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/default-avatar.png";
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {instructor.fullName || '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{instructor.username || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {instructor.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {instructor.specialization || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${instructor.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {instructor.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewInstructor(instructor.id)}
                            disabled={deletingId === instructor.id}
                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                            title="View details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              handleEditInstructor(instructor);
                              handleViewInstructor(instructor.id);
                            }}
                            disabled={!instructor.active || deletingId === instructor.id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Edit"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          {instructor.active ? (
                            <button
                              onClick={() => handleSoftDelete(instructor.id)}
                              disabled={deletingId === instructor.id}
                              className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                              title="Deactivate"
                            >
                              <Ban className="h-5 w-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReactiveInstructor(instructor.id)}
                              disabled={deletingId === instructor.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              title="Reactivate"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => handleHardDelete(instructor.id)}
                            disabled={deletingId === instructor.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Delete permanently"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isViewModalOpen && currentInstructor && (
        <div className="fixed inset-0 backdrop-blur bg-white/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">Instructor Details</h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    className="h-32 w-32 rounded-full object-cover border-4 border-blue-100"
                    src={`http://localhost:8080${currentInstructor.imageUrl}`}
                    alt={currentInstructor.fullName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {currentInstructor.fullName || "Not available"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Username</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        @{currentInstructor.username || "Not available"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentInstructor.email || "Not available"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Specialization</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentInstructor.specialization || "Not available"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <p className="mt-1">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${currentInstructor.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {currentInstructor.active ? "Active" : "Inactive"}
                        </span>
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Average Rating</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentInstructor.averageRating?.toFixed(1) || "Not rated yet"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Total Courses</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentInstructor.totalCourses || 0}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Total Students</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentInstructor.totalStudents || 0}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                      {currentInstructor.bio || "No bio available"}
                    </p>
                  </div>
                </div>
              </div>
              {instructorCourses.length > 0 ? (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-700 mb-4">Courses by Instructor</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {instructorCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6 text-center text-gray-500">
                  No courses found for this instructor
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {isEditModalOpen && currentInstructor && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-900">Edit Instructor</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedImage(null);
                  setErrors({});
                }}
                className="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <img
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : editFormData.imageUrl
                          ? `http://localhost:8080${editFormData.imageUrl}`
                          : "/default-avatar.png"
                    }
                    alt="Profile preview"
                    className="h-32 w-32 rounded-full object-cover border-4 border-blue-100"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Pencil className="h-4 w-4" />
                  </label>
                </div>
                {errors.image && (
                  <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                )}
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={editFormData.username}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.username ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={editFormData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.fullName ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={editFormData.specialization}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.specialization ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.specialization && (
                    <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
                  )}
                </div>

                {/* Bio (Full width) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={editFormData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border ${errors.bio ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="enabled"
                      checked={editFormData.enabled}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Active Instructor
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t sticky bottom-0">
              <button
                type="button"
                onClick={handleUpdateInstructor}
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Updating...
                  </>
                ) : (
                  "Update Instructor"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedImage(null);
                  setErrors({});
                }}
                disabled={loading}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructors;