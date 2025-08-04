import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllUsers,
  fetchUserDetails,
  deleteUser,
  updateUserStatus,
} from '../../../redux/Admin/Users/UserAdminAction';
import { resetUserState, clearUserDetails } from '../../../redux/Admin/Users/UserActionSlice';
import { Eye, UserX, UserCheck, Search, ChevronDown, MoreHorizontal } from 'lucide-react';
import { toast } from 'react-toastify';
import UserDetailModal from './UserDetailModal';

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users, userDetails, loading, error, success } = useSelector((state) => state.userManagementA || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Something went wrong');
      dispatch(resetUserState());
    }
    if (success) {
      toast.success('Operation completed successfully');
      dispatch(resetUserState());
    }
  }, [error, success, dispatch]);

  // Filter only USER role and apply other filters
  const filteredUsers = (users || [])
    .filter(user => user.role === 'USER') // Only show USER role
    .filter(user => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.enabled) ||
        (statusFilter === 'inactive' && !user.enabled);

      return matchesSearch && matchesStatus;
    });

  const handleViewDetails = (userId) => {
    dispatch(fetchUserDetails(userId)).then(() => {
      setIsDetailModalOpen(true);
    });
  };

  const handleDeleteUser = (userId) => {
    if (deleteConfirm === userId) {
      dispatch(deleteUser(userId));
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(userId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };
const handleToggleStatus = (userId, currentStatus) => {
  dispatch(updateUserStatus({ id: userId, enabled: !currentStatus }))
    .unwrap()
    .then(() => dispatch(fetchAllUsers()))
    .catch(() => {
      toast.error("Failed to update user status");
    });
};


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600">Manage all registered users</p>
          </div>
        </div>

        {/* Simplified Filters - Removed role filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined Date
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
                {loading && !users.length ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4f46e5&color=fff`}
                              alt={user.fullName}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        @{user.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {user.enabled ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetails(user.id)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(user.id, user.enabled)}
                            className={user.enabled ?
                              "text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50" :
                              "text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            }
                            title={user.enabled ? "Deactivate User" : "Activate User"}
                          >
                            {user.enabled ? <UserX size={18} /> : <UserCheck size={18} />}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className={`text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 ${deleteConfirm === user.id ? 'bg-red-100' : ''
                              }`}
                            title={deleteConfirm === user.id ? "Confirm Delete" : "Delete User"}
                          >
                            {deleteConfirm === user.id ? 'Confirm?' : <MoreHorizontal size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      {users.length > 0 ? 'No matching users found' : 'No users available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <UserDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            dispatch(clearUserDetails());
          }}
          user={userDetails}
          userId={userDetails?.id}
        />
      </div>
    </div>
  );
};

export default UsersPage;