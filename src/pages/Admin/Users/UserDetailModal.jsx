import React from 'react';
import { X, Mail, User, Calendar, Smartphone, Clock, Check, BookOpen } from 'lucide-react'; // Added BookOpen
import { useEffect } from 'react';
import CourseCard from '../../../Components/CourseCard/CourseCard';
import { fetchUserEnrolledCourses } from '../../../redux/Admin/Users/UserAdminAction';
import { useDispatch, useSelector } from 'react-redux';

const UserDetailModal = ({ isOpen, onClose, user, userId }) => {
  const dispatch = useDispatch();

  const enrolledCourses = useSelector((state) => state.userManagementA?.enrolledCourses || []);
  const loading = useSelector((state) => state.userManagementA?.loading || false);
  const error = useSelector((state) => state.userManagementA?.error || null);
  useEffect(() => {
    if (userId) {
      console.log("Fetching courses for user:", userId);
      dispatch(fetchUserEnrolledCourses(userId)).then((action) => {
        console.log("Courses fetched:", action.payload);
      });
    }
  }, [dispatch, userId]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 backdrop-blur bg-white/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800">User Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="flex flex-col gap-6">
            {/* User Profile Section */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* User Profile Image */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    className="h-32 w-32 rounded-full object-cover border-4 border-indigo-100"
                    src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4f46e5&color=fff&size=128`}
                    alt={user.fullName}
                  />
                  <span className={`absolute bottom-0 right-0 block h-6 w-6 rounded-full ring-2 ring-white ${user.enabled ? 'bg-green-400' : 'bg-red-400'}`}></span>
                </div>

                <h2 className="text-xl font-bold text-gray-800">{user.fullName}</h2>
                <p className="text-gray-600 mb-2">@{user.userName}</p>

                <div className={`px-3 py-1 rounded-full text-sm font-medium ${user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.enabled ? 'Active' : 'Inactive'}
                </div>
              </div>

              {/* User Details Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <User className="mr-2" size={16} /> Basic Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Display Name:</span> {user.displayName}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Role:</span> <span className="capitalize">{user.role.toLowerCase()}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Timezone:</span> {user.timezone || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <Mail className="mr-2" size={16} /> Contact Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Email:</span> {user.email}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Mobile:</span> {user.mob || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <Calendar className="mr-2" size={16} /> Account Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Last Active:</span> Recently
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <Check className="mr-2" size={16} /> Account Status
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Email Verified:</span> Yes
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Profile Complete:</span> {user.profileImage ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrolled Courses Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <BookOpen className="mr-2" /> Enrolled Courses ({enrolledCourses.length})
              </h3>
             
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <p>Loading courses...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-600">Error loading courses: {error.message}</p>
                </div>
              ) : enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {enrolledCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">No courses enrolled yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;