import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { toast } from "react-toastify";


const API_URL = 'http://localhost:8080/api/admin';

// Add to your existing interceptors
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const UpdateCourseForm = ({ course, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    introVideo: course.introVideo,
    priceType: course.priceType,
    price: course.price,
    level: course.level,
    duration: course.duration,
    categoryId: '',
    instructorId: String(course.instructor?.id || ''),
    tags: course.tags.join(','),
    discountPercentage: course.discountPercentage,
    rating: course.rating
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categories.length > 0 && !formData.categoryId) {
      const matchedCategory = categories.find(cat => cat.categoryName === course.categoryName);
      if (matchedCategory) {
        setFormData(prev => ({
          ...prev,
          categoryId: String(matchedCategory.id)
        }));
      }
    }
  }, [categories]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, instRes] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/getAllInstructors`)
        ]);
        setCategories(catRes.data);
        setInstructors(instRes.data);
      } catch (err) {
        setError('Failed to load required data');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  // ✅ Validation logic
  const trimmedTitle = formData.title.trim();
  const trimmedDescription = formData.description.trim();
  const introUrl = formData.introVideo.trim();

  const isValidYoutubeUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(embed\/|watch\?v=)|youtu\.be\/)[\w\-]{11}$/;
    return regex.test(url);
  };

  if (trimmedTitle.length < 5) {
    toast.error("Title must be at least 5 characters.");
    setLoading(false);
    return;
  }

  if (trimmedDescription.length < 10) {
    toast.error("Description must be at least 10 characters.");
    setLoading(false);
    return;
  }

  if (!isValidYoutubeUrl(introUrl)) {
    toast.error("Please enter a valid YouTube URL.");
    setLoading(false);
    return;
  }

  try {
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataToSend.append(key, value);
      }
    });

    if (thumbnailFile) {
      formDataToSend.append('thumbnailFile', thumbnailFile);
    }

    const response = await axios.put(
      `${API_URL}/course/${course.id}`,
      formDataToSend,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    toast.success("Course updated successfully!");
    onUpdate(response.data);
    onClose();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update course');
    setError(error.response?.data?.message || 'Failed to update course');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 backdrop-blur bg-white/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Update Course</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <MdClose size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intro Video URL</label>
                  <input
                    type="url"
                    name="introVideo"
                    value={formData.introVideo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
                  <div className="flex items-center">
                    <label className="flex flex-col items-center px-4 py-2 bg-white rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50">
                      <FaUpload className="mr-2" />
                      <span>{thumbnailFile ? thumbnailFile.name : 'Choose file'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {course.thumbnail && !thumbnailFile && (
                      <img
                        src={`http://localhost:8080${course.thumbnail}`}
                        alt="Current thumbnail"
                        className="ml-4 w-16 h-16 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing and Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
                  <select
                    name="priceType"
                    value={formData.priceType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="FREE">Free</option>
                    <option value="PAID">Paid</option>
                  </select>
                </div>

                {formData.priceType === 'PAID' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                      <input
                        type="number"
                        name="discountPercentage"
                        value={formData.discountPercentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={String(cat.id)}>{cat.categoryName}</option>

                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                  <select
                    name="instructorId"
                    value={formData.instructorId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.fullName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                disabled={loading}
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">↻</span>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Update Course
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourseForm;