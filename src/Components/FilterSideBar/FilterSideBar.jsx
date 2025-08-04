import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { useSearchParams, useNavigate } from 'react-router-dom';

const FilterSidebar = ({
  categories,
  tags,
  levels,
  prices,
  loading,
  error,
  onFilterChange,
  onSearchChange,
  onClearFiltersDone,
}) => {

  const [searchInput, setSearchInput] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const categoryIds = categoryParam.split(',').map(id => parseInt(id, 10));
      setSelectedCategories(categoryIds.filter(id => !isNaN(id)));
    }
  }, [searchParams]);


  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && categories.length > 0) {
      const categoryIds = categoryParam
        .split(",")
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id));

      setSelectedCategories(categoryIds);
    }
  }, [searchParams, categories]);

  useEffect(() => {
    onFilterChange({
      category: selectedCategories,
      tags: selectedTags,
      level: selectedLevels,
      price: selectedPrices,
    });
  }, [selectedCategories, selectedTags, selectedLevels, selectedPrices]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearchChange(searchInput);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  // NEW CODE (replace with this):
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSelectedLevels([]);
    setSelectedPrices([]);
    setSearchInput('');
    onSearchChange('');
    onFilterChange({
      category: [],
      tags: [],
      level: [],
      price: [],
    });
    // Clear URL parameters
    navigate(window.location.pathname, { replace: true });
    if (onClearFiltersDone) onClearFiltersDone();
  };

  // ⬜ Generic checkbox handler
  const handleCheckboxChange = (value, selected, setter) => {
    if (selected.includes(value)) {
      setter(selected.filter(v => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  return (
    <div>
      {/* 🔍 Search */}
      <div className='mb-[25px] pb-[40px] border-b border-[#EBEBEB]'>
        <h3 className='font-hind text-[18px] font-medium mb-5'>Search</h3>
        <div className='flex relative'>
          <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-[#777777] text-lg'>
            <CiSearch />
          </span>
          <input
            type="text"
            placeholder='Search'
            className='h-[46px] border border-[#DDD8F9] rounded-sm pl-4 pr-10 w-full text-sm'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {/* 📂 Category */}
      <FilterSection title="Category" data={categories} loading={loading} error={error}>
        {categories.map(cat => (
          <Checkbox
            key={cat.id}
            label={cat.categoryName}
            value={cat.id}
            checked={selectedCategories.includes(cat.id)}
            onChange={() =>
              handleCheckboxChange(cat.id, selectedCategories, setSelectedCategories)
            }
          />
        ))}
      </FilterSection>

      {/* 🏷️ Tags */}
      <FilterSection title="Tags" data={tags} loading={loading} error={error}>
        {tags.map(tag => (
          <Checkbox
            key={tag.id}
            label={tag.tagName}
            value={tag.tagName}
            checked={selectedTags.includes(tag.tagName)}
            onChange={() =>
              handleCheckboxChange(tag.tagName, selectedTags, setSelectedTags)
            }
          />
        ))}
      </FilterSection>

      {/* 📈 Level */}
      <FilterSection title="Level" data={levels} loading={loading} error={error}>
        {levels.map(level => (
          <Checkbox
            key={level.value}
            label={level.label}
            value={level.value}
            checked={selectedLevels.includes(level.value)}
            onChange={() =>
              handleCheckboxChange(level.value, selectedLevels, setSelectedLevels)
            }
          />
        ))}
      </FilterSection>

      {/* 💰 Price */}
      <FilterSection title="Price" data={prices} loading={loading} error={error}>
        {prices.map(price => (
          <Checkbox
            key={price.value}
            label={price.label}
            value={price.value}
            checked={selectedPrices.includes(price.value)}
            onChange={() =>
              handleCheckboxChange(price.value, selectedPrices, setSelectedPrices)
            }
          />
        ))}
      </FilterSection>

      {/* ❌ Clear All */}
      <div className="mt-2 flex justify-center">
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-2.5 px-4.5 py-3 border font-medium font-inter border-[#553CDF] text-[#553CDF] rounded-md hover:bg-[#553CDF] hover:text-white transition duration-200 hover:cursor-pointer"
        >
          <span className="text-2xl"><RxCross2 /></span>
          <span className="text-[16px] font-medium">Clear All Filters</span>
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;

// 🧩 Filter Section Wrapper
const FilterSection = ({ title, data, loading, error, children }) => (
  <div className='mb-[25px] pb-[40px] border-b border-b-[#EBEBEB]'>
    <h3 className='font-hind text-[18px] font-medium mb-5'>{title}</h3>
    {loading && <p>Loading...</p>}
    {error && <p className='text-red-500'>Error: {error}</p>}
    {!loading && data.length > 0 && (
      <ul className='space-y-3'>{children}</ul>
    )}
  </div>
);

// ✅ Checkbox
const Checkbox = ({ label, value, checked, onChange }) => (
  <li>
    <label className='flex items-center font-inter text-[16px] text-[#110C2D]'>
      <input
        type="checkbox"
        className='w-[17px] h-[17px] mr-4 rounded-sm'
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  </li>
);
