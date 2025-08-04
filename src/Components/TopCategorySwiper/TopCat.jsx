import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import style from './TopCategory.module.css';
import developmentIcon from '../../pages/Home/Development.svg';
import marketingIcon from '../../pages/Home/Marketing.svg';
import businessIcon from '../../pages/Home/Business.svg';
import accountingIcon from '../../pages/Home/Accounting.svg';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCourses } from '../../redux/Users/UserActions/UserAction';
// import green from '../../pages/Home/gBuld.svg'
// import book from '../../pages/Home/booksvg.svg'
// import ShakyImage from '../Shake/ShakyImage';

const TopCat = () => {
  // const { courses } = useSelector((state) => state.course);

  const topCategories = [
    {id:6, name: "Development", icon: developmentIcon },
    { id:7, name: "Marketing", icon: marketingIcon },
    {id:4,  name: "Business", icon: businessIcon },
    {id:3,  name: "Accounting", icon: accountingIcon },
  ];

  const navigate = useNavigate();

  const { courses = [], allCourses = [] } = useSelector((state) => state.userData || {});

  const courseCountMap = courses?.reduce((acc, course) => {
    const cat = course.categoryName;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {}) || {};
  

  const topCategorySlides = [...topCategories, ...topCategories].map((cat) => ({
    ...cat,
    count: courseCountMap[cat.name] || 0,
  }));

  const handleSlideChange = (swiper) => {
    const bullets = document.querySelectorAll('.custom-swiper-pagination span');
    bullets.forEach(b => b.classList.remove('swiper-pagination-bullet-active'));
    const activeIndex = swiper.realIndex % 4;
    if (bullets[activeIndex]) {
      bullets[activeIndex].classList.add('swiper-pagination-bullet-active');
    }
  };

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          clickable: true,
          el: '.custom-swiper-pagination',
          renderBullet: (index, className) => {
            if (index < 4) {
              return `<span class="${className}"></span>`;
            }
            return '';
          },
        }}
        onSlideChange={handleSlideChange}
        loop={true}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1 },
          766: { slidesPerView: 2 },
          991: { slidesPerView: 3 },
          1200: { slidesPerView: 6 },
        }}
      >
        {topCategorySlides.map((cat, index) => (
          <SwiperSlide key={index}>
            <div onClick={(e) => {
              e.stopPropagation();
              navigate(`/courses?category=${cat.id}`);
            }} className="bg-white hover:shadow-lg transition p-8 rounded-lg text-center border border-[#E4E2FB] cursor-pointer hover:border-[#553cdf]">
              <img
                src={cat.icon}
                alt={cat.name}
                className="w-[60px] h-[60px] mx-auto mb-4"
              />
              <h4 className="text-[#221859] font-semibold font-hind text-[20px] mb-1">
                {cat.name}
              </h4>
              <p className="text-[#221859] font-inter text-[16px]">
                {String(cat.count).padStart(2, '0')} Courses
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={`${style.controlsWrapper} hidden md:flex`}>
        <div className={`${style.arrow} swiper-button-prev-custom`}>&#8249;</div>
        <div className={`custom-swiper-pagination ${style.dots}`}></div>
        <div className={`${style.arrow} swiper-button-next-custom`}>&#8250;</div>
      </div>
    </div>
  );
};

export default TopCat;
