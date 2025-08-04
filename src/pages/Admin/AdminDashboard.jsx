import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats, fetchFiveUsers } from "../../redux/Admin/Actions/DashboardActions";
import {
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  Eye, 
  Pencil, 
  UserX, 
  ArrowUpRight, 
  MoreHorizontal,
  Download,
  Filter,
  Search,
  ChevronDown,
  Bell,
  MessageSquare,
  Settings,
  HelpCircle
} from "lucide-react";
import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  UserCheck,
  Clock,
  TrendingUp,
  BarChart2,
  PieChart as PieChartIcon,
  Activity
} from "lucide-react";

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('month');

  const { stats, loading, error, users } = useSelector(
    (state) => state.adminDashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchFiveUsers());
  }, [dispatch]);

  const categoryChartData = stats?.categoryWiseCourseCount
    ? Object.entries(stats.categoryWiseCourseCount).map(([category, count]) => ({
      name: category,
      value: count,
    }))
    : [];

  const enrollmentGrowth = stats?.monthlyEnrollments?.length > 1 
    ? ((stats.monthlyEnrollments[stats.monthlyEnrollments.length - 1].count - 
        stats.monthlyEnrollments[stats.monthlyEnrollments.length - 2].count) / 
        stats.monthlyEnrollments[stats.monthlyEnrollments.length - 2].count * 100
      ).toFixed(1)
    : 0;

  const revenueGrowth = 8.5; // This would typically come from your API

  const user = JSON.parse(localStorage.getItem("user"));

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md" role="alert">
        <p className="font-bold text-red-800">Error Loading Dashboard</p>
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => {
            dispatch(fetchDashboardStats());
            dispatch(fetchFiveUsers());
          }}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800">StudyHub Admin</h1>
            <div className="hidden md:flex items-center space-x-1">
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium ${activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium ${activeTab === 'reports' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('reports')}
              >
                Reports
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell className="text-gray-500" size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MessageSquare className="text-gray-500" size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings className="text-gray-500" size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <img 
                src={`https://ui-avatars.com/api/?name=${user?.userName || 'Admin'}&background=4f46e5&color=fff`}
                alt="User"
                className="h-8 w-8 rounded-full"
              />
              <span className="hidden md:inline text-sm font-medium text-gray-700">{user?.userName || 'Admin'}</span>
              <ChevronDown className="text-gray-500" size={16} />
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome back, <span className="text-indigo-600">{user?.userName || "Admin"}</span>
            </h1>
            <p className="text-gray-500 mt-2">
              Here's what's happening with your platform today
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="relative">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 90 days</option>
                <option value="year">Last 12 months</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} />
            </div>
            
            <button className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Users"
            value={stats?.totalUsers}
            change="+12%"
            icon={<Users className="text-indigo-600" size={20} />}
            bgColor="bg-indigo-50"
            chartData={[12, 19, 8, 15, 12, 18, 10]}
          />
          <StatCard
            label="Instructors"
            value={stats?.totalInstructors}
            change="+5%"
            icon={<UserCheck className="text-blue-600" size={20} />}
            bgColor="bg-blue-50"
            chartData={[5, 8, 6, 9, 5, 7, 6]}
          />
          <StatCard
            label="Courses"
            value={stats?.totalCourses}
            change="+8%"
            icon={<BookOpen className="text-purple-600" size={20} />}
            bgColor="bg-purple-50"
            chartData={[8, 12, 10, 14, 8, 11, 9]}
          />
          <StatCard
            label="Enrollments"
            value={stats?.totalEnrollments}
            change={`${enrollmentGrowth}%`}
            icon={<GraduationCap className="text-green-600" size={20} />}
            bgColor="bg-green-50"
            chartData={[15, 22, 18, 25, 15, 20, 17]}
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Enrollment Chart */}
          <div className="bg-white p-6  rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Enrollment Trends</h2>
                <p className="text-sm text-gray-500">Last 12 months performance</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                  <Filter size={16} />
                  <span>Filter</span>
                </button>
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <MoreHorizontal size={18} className="text-gray-500" />
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyEnrollments || []}>
                  <defs>
                    <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    allowDecimals={false} 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorEnrollments)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800">Revenue Summary</h3>
                <DollarSign className="text-indigo-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-2">
                ${stats?.totalRevenue?.toLocaleString("en-IN") || 0}
              </p>
              <div className="flex items-center text-sm">
                <TrendingUp className="text-green-500 mr-1" size={16} />
                <span className="text-green-600 font-medium">{revenueGrowth}%</span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Target</span>
                  <span className="font-medium text-gray-700">$1,250,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (stats?.totalRevenue / 1250000) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800">Course Categories</h3>
                <PieChartIcon className="text-indigo-600" size={20} />
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                  View all <ArrowUpRight className="ml-1" size={16} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
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
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                user.fullName
                              )}&background=4f46e5&color=fff`}
                              alt={user.fullName}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.enabled ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            className={user.enabled ? "text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" : "text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"}
                            title={user.enabled ? "Deactivate" : "Activate"}
                          >
                            {user.enabled ? <UserX size={18} /> : <UserCheck size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions & System Status */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                  <div className="bg-indigo-100 p-2 rounded-full mb-2">
                    <UserCheck className="text-indigo-600" size={20} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Add User</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <div className="bg-purple-100 p-2 rounded-full mb-2">
                    <BookOpen className="text-purple-600" size={20} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">New Course</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                  <div className="bg-green-100 p-2 rounded-full mb-2">
                    <BarChart2 className="text-green-600" size={20} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Reports</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="bg-blue-100 p-2 rounded-full mb-2">
                    <Settings className="text-blue-600" size={20} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Settings</span>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4">System Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Server Load</span>
                    <span className="font-medium">24%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Database</span>
                    <span className="font-medium">Normal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Storage</span>
                    <span className="font-medium">65% used</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last updated</span>
                  <span className="text-gray-800">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Our support team is here to help you with any questions or issues you might have.
              </p>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                <HelpCircle size={16} />
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, change, icon, bgColor, chartData }) => {
  return (
    <div className={`${bgColor} p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md group`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${bgColor.replace('50', '100')} group-hover:bg-white transition-colors`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
          <span className="text-xs text-gray-500 ml-1">vs last period</span>
        </div>
        <div className="h-10 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.map((value, index) => ({ value, index }))}>
              <defs>
                <linearGradient id={`color${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={icon.props.className.replace('text-', 'bg-').replace('600', '500')} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={icon.props.className.replace('text-', 'bg-').replace('600', '500')} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={icon.props.className.replace('text-', 'stroke-')}
                strokeWidth={1.5}
                fillOpacity={1}
                fill={`url(#color${label})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;