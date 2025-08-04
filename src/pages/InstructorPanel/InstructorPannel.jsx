import React, { useState, useEffect } from 'react';
import TopComp from '../../Components/Top/TopComp';
import { BookOpen, FileText, Edit3, RefreshCcw, ChevronDown, Loader2, PlusCircle } from 'lucide-react';
import AddCourseInst from './InstructorAddCourse';
import AddCourseContentInst from './AddCourseContentInst';
import UpdateCourseContetinst from './UpdateCourseContetinst';
import InstructorUpdateCourse from './InstructorUpdateCourse';

const InstructorPannel = () => {
  const [activeTab, setActiveTab] = useState('addCourse');
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  const tabs = [
    { key: 'addCourse', label: 'Add Course', icon: <PlusCircle size={18} /> },
    { key: 'addContent', label: 'Add Content', icon: <FileText size={18} /> },
    { key: 'updateCourse', label: 'Update Course', icon: <Edit3 size={18} /> },
    { key: 'updateContent', label: 'Update Content', icon: <RefreshCcw size={18} /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'addCourse':
        return <AddCourseInst />;
      case 'addContent':
        return <AddCourseContentInst courseId={selectedCourseId} />;
      case 'updateCourse':
        return <InstructorUpdateCourse/>
      case 'updateContent':
        return <UpdateCourseContetinst/>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-white">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className='mt-[79px] md:mt-[77px] lg:mt-[117px]'>
      <TopComp titleOne="Instructor-Pannel" titleTwo="Pannel" />

      <div className="max-w-[1410px] mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        <div className="hidden md:flex flex-col w-64 h-fit bg-white rounded-md shadow-sm border border-gray-100 p-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.key !== 'addContent') {
                  setSelectedCourseId(null);
                }
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150 
                ${activeTab === tab.key
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Dropdown */}
        <div className="md:hidden relative my-4">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 shadow-md hover:shadow-lg transition duration-200"
          >
            <span className="font-medium">{tabs.find(t => t.key === activeTab)?.label}</span>
            <ChevronDown size={20} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 animate-fade-in-down">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setShowDropdown(false);
                    if (tab.key !== 'addContent') {
                      setSelectedCourseId(null);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-all duration-150 
                    hover:bg-blue-50 ${activeTab === tab.key ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white p-5 rounded-md shadow-sm border border-gray-100">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default InstructorPannel;