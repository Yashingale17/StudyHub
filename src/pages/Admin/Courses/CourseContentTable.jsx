import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCourses, 
  deleteCourseContent,
  updateCourseContent
} from '../../../redux/Admin/CourseContent/CourseContentAction';
import { 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiPlus, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight,
  FiClock,
  FiFilm,
  FiBookOpen,
  FiSave
} from 'react-icons/fi';
import { clearError } from '../../../redux/Admin/CourseContent/CourseContentSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseContentTable = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, error } = useSelector((state) => state.admincoursecontent);
  
  // State variables
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [filteredContents, setFilteredContents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [contentToEdit, setContentToEdit] = useState(null);
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Form state for editing
  const [editFormData, setEditFormData] = useState({
    title: '',
    duration: '',
    aboutLessons: '',
    isPreview: false,
    sequence: 0,
    videoUrl: ''
  });

  // Validation functions
  const validateTitle = (title) => title.length >= 5 && title.length <= 100;
  const validateAboutLessons = (about) => about.length >= 20 && about.length <= 1000;

  // Fetch courses on mount and when operations complete
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Filter contents based on selected course
  useEffect(() => {
    if (selectedCourseId) {
      const selectedCourse = courses.find(course => course.id === parseInt(selectedCourseId));
      if (selectedCourse) {
        setFilteredContents(selectedCourse.content || []);
      }
    } else {
      const allContents = courses.flatMap(course => 
        (course.content || []).map(content => ({
          ...content,
          courseTitle: course.title,
          courseId: course.id
        }))
      );
      setFilteredContents(allContents);
    }
    setCurrentPage(1);
  }, [selectedCourseId, courses]);

  // Show error toasts
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  // Filter data based on search term
  const filteredData = filteredContents.filter(content => 
    content.title.toLowerCase().includes(searchTerm) ||
    (content.courseTitle && content.courseTitle.toLowerCase().includes(searchTerm))
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // View content details
  const handleView = (content) => {
    setSelectedContent(content);
    setIsViewModalOpen(true);
  };

  // Prepare content for editing
  const handleEdit = (content) => {
    setContentToEdit(content);
    setEditFormData({
      title: content.title,
      duration: content.duration,
      aboutLessons: content.aboutLessons,
      isPreview: content.isPreview,
      sequence: content.sequence,
      videoUrl: content.videoUrl
    });
    setIsEditModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (content) => {
    setContentToDelete(content);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (contentToDelete) {
      dispatch(deleteCourseContent({
        courseId: contentToDelete.courseId,
        contentId: contentToDelete.id
      }))
      .then(() => {
        toast.success("Content deleted successfully!");
        dispatch(fetchCourses());
      })
      .catch(() => {
        toast.error("Failed to delete content");
      });
      setIsDeleteModalOpen(false);
      setContentToDelete(null);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Submit edited content
  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    if (!validateTitle(editFormData.title)) {
      toast.error("Title must be between 5 and 100 characters");
      return;
    }
    
    if (!validateAboutLessons(editFormData.aboutLessons)) {
      toast.error("About lesson must be between 20 and 1000 characters");
      return;
    }

    if (contentToEdit) {
      dispatch(updateCourseContent({
        contentId: contentToEdit.id,
        contentData: editFormData
      }))
      .then(() => {
        toast.success("Content updated successfully!");
        dispatch(fetchCourses());
      })
      .catch(() => {
        toast.error("Failed to update content");
      });
      setIsEditModalOpen(false);
    }
  };

  // Close all modals
  const closeModal = () => {
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedContent(null);
    setContentToDelete(null);
    setContentToEdit(null);
  };

  // Generate visible page numbers for pagination
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Course Content Management</h1>
          <p className="text-gray-600">Manage all course lessons and materials</p>
        </div>

        {/* Filter and Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Course
              </label>
              <select
                id="course-select"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-1/3">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Content
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Content Table */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preview
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((content, index) => (
                      <tr key={content.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {content.courseTitle || courses.find(c => c.content?.some(cont => cont.id === content.id))?.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{content.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {content.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${content.isPreview ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {content.isPreview ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button 
                              className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                              onClick={() => handleView(content)}
                              title="View"
                            >
                              <FiEye className="h-5 w-5" />
                            </button>
                            <button 
                              className="text-yellow-600 hover:text-yellow-900 transition-colors duration-200"
                              onClick={() => handleEdit(content)}
                              title="Edit"
                            >
                              <FiEdit2 className="h-5 w-5" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900 transition-colors duration-200"
                              onClick={() => handleDeleteClick(content)}
                              title="Delete"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No course content found. {selectedCourseId ? 'Select a different course or' : ''} try adding some content.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredData.length > itemsPerPage && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredData.length)}
              </span>{' '}
              of <span className="font-medium">{filteredData.length}</span> results
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded-md text-sm font-medium flex items-center ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FiChevronLeft className="mr-1" /> Previous
              </button>
              
              {/* Show first page if not in visible range */}
              {getVisiblePages()[0] > 1 && (
                <>
                  <button
                    onClick={() => paginate(1)}
                    className={`px-3 py-1 border rounded-md text-sm font-medium ${
                      1 === currentPage 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    1
                  </button>
                  {getVisiblePages()[0] > 2 && (
                    <span className="px-3 py-1 text-gray-500">...</span>
                  )}
                </>
              )}
              
              {/* Visible page numbers */}
              {getVisiblePages().map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                    currentPage === number 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {number}
                </button>
              ))}
              
              {/* Show last page if not in visible range */}
              {getVisiblePages()[getVisiblePages().length - 1] < totalPages && (
                <>
                  {getVisiblePages()[getVisiblePages().length - 1] < totalPages - 1 && (
                    <span className="px-3 py-1 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => paginate(totalPages)}
                    className={`px-3 py-1 border rounded-md text-sm font-medium ${
                      totalPages === currentPage 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded-md text-sm font-medium flex items-center ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Next <FiChevronRight className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedContent && (
        <div className="fixed inset-0 backdrop-blur bg-white/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">Content Details</h3>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <FiBookOpen className="mr-2 text-indigo-600" />
                    Course Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Course Title</p>
                      <p className="text-sm text-gray-800 font-medium">
                        {selectedContent.courseTitle || courses.find(c => c.content?.some(cont => cont.id === selectedContent.id))?.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Content Title</p>
                      <p className="text-sm text-gray-800 font-medium">{selectedContent.title}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <FiClock className="mr-2 text-indigo-600" />
                    Lesson Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Duration</p>
                      <p className="text-sm text-gray-800 font-medium">{selectedContent.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Preview Available</p>
                      <p className="text-sm text-gray-800 font-medium">
                        {selectedContent.isPreview ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Sequence</p>
                      <p className="text-sm text-gray-800 font-medium">{selectedContent.sequence}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-2">About This Lesson</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedContent.aboutLessons}</p>
                </div>
              </div>

              {selectedContent.videoUrl && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <FiFilm className="mr-2 text-indigo-600" />
                    Lesson Video
                  </h4>
                  <div className="bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={selectedContent.videoUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-96"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              <div className="border-t pt-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && contentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete the following content?
                </p>
                <div className="mt-2 p-3 bg-red-50 rounded-md">
                  <p className="text-sm font-medium text-gray-900">{contentToDelete.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    From course: {contentToDelete.courseTitle || courses.find(c => c.content?.some(cont => cont.id === contentToDelete.id))?.title}
                  </p>
                </div>
                <p className="text-sm text-red-600 mt-2">
                  This action cannot be undone and will permanently remove the content.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && contentToEdit && (
        <div className="fixed inset-0 backdrop-blur bg-white/15 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">Edit Content</h3>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleEditSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      name="title"
                      type="text"
                      value={editFormData.title}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        editFormData.title && !validateTitle(editFormData.title) 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      required
                    />
                    {editFormData.title && !validateTitle(editFormData.title) && (
                      <p className="mt-1 text-sm text-red-600">
                        Title must be between 5 and 100 characters
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                    <input
                      name="duration"
                      type="text"
                      value={editFormData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sequence *</label>
                    <input
                      name="sequence"
                      type="number"
                      value={editFormData.sequence}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      name="isPreview"
                      type="checkbox"
                      checked={editFormData.isPreview}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Available as Preview</label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                    <input
                      name="videoUrl"
                      type="url"
                      value={editFormData.videoUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">About Lesson *</label>
                    <textarea
                      name="aboutLessons"
                      value={editFormData.aboutLessons}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-3 py-2 border ${
                        editFormData.aboutLessons && !validateAboutLessons(editFormData.aboutLessons) 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      required
                    />
                    {editFormData.aboutLessons && !validateAboutLessons(editFormData.aboutLessons) && (
                      <p className="mt-1 text-sm text-red-600">
                        About lesson must be between 20 and 1000 characters
                      </p>
                    )}
                  </div>
                </div>
                <div className="border-t pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center transition-colors duration-200"
                  >
                    <FiSave className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default CourseContentTable;