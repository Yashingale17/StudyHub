import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ladyFeed from './LadyFeedBack.jpg';
import manFeed from './ManFeedBack.jpg';
import Comas from './Comas.svg';

import { FaStar, FaRegStar } from 'react-icons/fa';

import styles from './Feed.module.css';

const testimonials = [
  {
    id: 1,
    name: 'Emma Elizabeth',
    role: 'Assistant Teacher',
    image: ladyFeed,
    rating: 5,
    content:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
  },
  {
    id: 2,
    name: 'Emma Elizabeth',
    role: 'Assistant Teacher',
    image: manFeed,
    rating: 5,
    content:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
  },
  {
    id: 3,
    name: 'Emma Elizabeth',
    role: 'Assistant Teacher',
    image: ladyFeed,
    rating: 4,
    content:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
  },
  {
    id: 4,
    name: 'Emma Elizabeth',
    role: 'Assistant Teacher',
    image: manFeed,
    rating: 5,
    content:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
  },
];

const FeedBack = () => {
  
  const handleSlideChange = (swiper) => {
    const bullets = document.querySelectorAll('.custom-swiper-pagination span');
    bullets.forEach(b => b.classList.remove('swiper-pagination-bullet-active'));
    const activeIndex = swiper.realIndex % 4;
    if (bullets[activeIndex]) {
      bullets[activeIndex].classList.add('swiper-pagination-bullet-active');
    }
  };

  return (
    <div className="px-2.5 md:px-5 ">
      <div className="flex flex-col max-w-[1410px] mx-auto gap-8 pt-[30px] pb-[60px] md:pt-[80px] md:pb-[110px]">
        <div className="mb-[15px] text-center">
          <h2 className="mb-[10px] mt-[20px] text-[24px] md:text-[40px] font-hind text-[#110C2D] font-semibold">
            My Students Feedback
          </h2>
          <p className="mb-[14px] font-inter text-[16px] text-[#777777]">
            You'll find something to spark your curiosity and enhance
          </p>
        </div>

        <div className="w-full relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            loop={true}
            speed={800}
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
            breakpoints={{
              0: { slidesPerView: 1 },
              991: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="bg-[#F9F8FF] shadow-md border border-[#DDD8F9] p-5 md:pt-[40px] md:pl-[40px] md:pr-[55px] md:pb-[45px] relative">
                  <RatingStars count={item.rating} />

                  <p className="text-[19.5px] font-inter font-normal mb-[25px] text-[#110C2D] leading-8">
                    {item.content}
                  </p>

                  <div className="flex items-center mt-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div className="text-[#110C2D]">
                      <p className="font-hind text-[18px] font-bold">{item.name}</p>
                      <p className="text-[15px] font-inter text-gray-500">{item.role}</p>
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 text-purple-200 text-3xl md:block">
                    <img src={Comas} alt="" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={`${styles.controlsWrapper}`}>
            <div className={`${styles.arrow} swiper-button-prev-custom`}>&#8249;</div>
            <div className={`custom-swiper-pagination ${styles.dots}`}></div>
            <div className={`${styles.arrow} swiper-button-next-custom`}>&#8250;</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedBack;

const RatingStars = ({ count }) => (
  <div className="flex mb-[25px] text-[#553CDF] text-[16px] gap-[6px]">
    {Array(5)
      .fill(0)
      .map((_, index) =>
        index < count ? (
          <FaStar key={index} />
        ) : (
          <FaRegStar key={index} />
        )
      )}
  </div>
);
