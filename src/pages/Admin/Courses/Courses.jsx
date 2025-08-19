import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaEye,
  FaToggleOn,
  FaToggleOff,
  FaEdit,
  FaTrash,
  FaStar,
  FaUserGraduate,
  FaClock,
  FaBook,
  FaTags,
  FaInfoCircle
} from 'react-icons/fa';
import { MdClose, MdCheckCircle, MdCancel } from 'react-icons/md';
import UpdateCourseForm from './UpdateCourseForm';

const API_URL = 'http://localhost:8080/api/admin';
const Base_URL = 'http://localhost:8080'
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data);
    } catch (error) {
      if (error.response?.status !== 401) {
        showNotification('Failed to fetch courses', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseStatus = async (courseId, isActive) => {
    try {
      setLoading(true);
      const endpoint = isActive ? 'deactivate' : 'activate';
      await axios.put(`${API_URL}/courses/${courseId}/${endpoint}`, {});
      showNotification(`Course ${endpoint}d successfully`, 'success');
      fetchCourses();
    } catch (error) {
      if (error.response?.status !== 401) {
        showNotification(`Failed to update course status`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/deleteCourse/${courseId}`);
      showNotification('Course deleted successfully', 'success');
      fetchCourses(); 
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to delete course', 'error');
    } finally {
      setLoading(false);
      setCourseToDelete(null);
    }
  };

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <MdCancel className="text-red-600 text-xl" />
          </div>
          <h3 className="text-lg font-semibold">Delete Course</h3>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-medium">"{courseToDelete?.title}"</span>?
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setCourseToDelete(null)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteCourse(courseToDelete.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"></svg>
                Deleting...
              </>
            ) : (
              'Delete Course'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const openCourseModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeCourseModal = () => {
    setIsModalOpen(false);
  };

  if (loading && courses.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          Add New Course
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course, index) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={`${Base_URL}${course.thumbnail}`}
                        alt={course.title}
                        className="w-12 h-12 rounded-md object-cover mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FaBook className="mr-1" />
                          <span className="mr-3">{course.totalLessons} lessons</span>
                          <FaClock className="mr-1" />
                          <span>{course.duration}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={`${Base_URL}${course.instructor.imageUrl}`}
                        alt={course.instructorName}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <span className="text-sm text-gray-900">{course.instructorName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {course.categoryName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {course.priceType === 'PAID' ? (
                      <div>
                        <span className="font-medium">${course.discountedPrice}</span>
                        {course.discountPercentage > 0 && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${course.price}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        FREE
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${course.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {course.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openCourseModal(course)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => toggleCourseStatus(course.id, course.active)}
                        className={course.active ?
                          "text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50" :
                          "text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-50"
                        }
                        title={course.active ? 'Deactivate' : 'Activate'}
                      >
                        {course.active ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setCourseToDelete(course)}
                        className={`p-1 rounded-full hover:bg-red-50 ${loading ? 'text-red-300 cursor-not-allowed' : 'text-red-600 hover:text-red-900'
                          }`}
                        title="Delete"
                        disabled={loading}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedCourse && (
        <div className="fixed top-0 inset-0 backdrop-blur bg-white/10 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start justify-between">
                  <div className="flex items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mr-3">
                      {selectedCourse.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${selectedCourse.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {selectedCourse.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <button
                    onClick={closeCourseModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <MdClose size={24} />
                  </button>
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1">
                      <img
                        src={`${Base_URL}${selectedCourse.thumbnail}`}
                        alt={selectedCourse.title}
                        className="w-full h-auto rounded-lg"
                      />
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Intro Video</h4>
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe
                            src={selectedCourse.introVideo}
                            title={selectedCourse.title}
                            className="w-full h-48"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Instructor</h4>
                          <div className="flex items-center mt-1">
                            <img
                              src={`${Base_URL}${selectedCourse.instructor.imageUrl}`}
                              alt={selectedCourse.instructorName}
                              className="w-8 h-8 rounded-full mr-2"
                            />
                            <span className="text-sm text-gray-900">{selectedCourse.instructorName}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Category</h4>
                          <p className="text-sm text-gray-900 mt-1">{selectedCourse.categoryName}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Level</h4>
                          <p className="text-sm text-gray-900 mt-1 capitalize">{selectedCourse.level.toLowerCase()}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Rating</h4>
                          <div className="flex items-center mt-1">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-900">
                              {selectedCourse.rating || 'No ratings yet'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Students</h4>
                          <div className="flex items-center mt-1">
                            <FaUserGraduate className="text-blue-500 mr-1" />
                            <span className="text-sm text-gray-900">{selectedCourse.totalEnrollments}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                          <div className="flex items-center mt-1">
                            <FaClock className="text-gray-500 mr-1" />
                            <span className="text-sm text-gray-900">{selectedCourse.duration}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500">Price</h4>
                        {selectedCourse.priceType === 'PAID' ? (
                          <div className="flex items-center mt-1">
                            <span className="text-xl font-bold text-gray-900">
                              ${selectedCourse.discountedPrice}
                            </span>
                            {selectedCourse.discountPercentage > 0 && (
                              <>
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  ${selectedCourse.price}
                                </span>
                                <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                  {selectedCourse.discountPercentage}% OFF
                                </span>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            FREE
                          </span>
                        )}
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500">Description</h4>
                        <p className="text-sm text-gray-700 mt-1">{selectedCourse.description}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 flex items-center">
                          <FaTags className="mr-1" /> Tags
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedCourse.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeCourseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <MdCheckCircle className="mr-2" size={20} />
            ) : (
              <MdCancel className="mr-2" size={20} />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {
        editingCourse && (
          <UpdateCourseForm
            course={editingCourse}
            onClose={() => setEditingCourse(null)}
            onUpdate={(updatedCourse) => {
              // Update your courses list state
              setCourses(courses.map(c =>
                c.id === updatedCourse.id ? updatedCourse : c
              ));
              setEditingCourse(null);
            }}
          />
        )
      }

      {courseToDelete && (
        <DeleteConfirmationModal
          courseToDelete={courseToDelete}
          onCancel={() => setCourseToDelete(null)}
          onConfirm={() => deleteCourse(courseToDelete.id)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Courses;
