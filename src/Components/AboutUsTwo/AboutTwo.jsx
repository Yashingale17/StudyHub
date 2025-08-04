import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import Bgtwo from "./Bgtwo.jpg";
import Students from "./Students.svg";
import Cirtificates from "./Cirtificates.svg";
import Capp from "./capp.svg";
import world from "./world.svg";
import circle from "./circles.png"
import cirsleSide from './circleSide.png'
import ShakyImage from '../Shake/ShakyImage';

const AboutTwo = () => {
  const [count, setCount] = useState(0);
  const target = 65972;
  const duration = 2000;

  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = target / (duration / 9);

      const counter = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(counter);
        } else {
          setCount(Math.ceil(start));
        }
      }, 10);
    }
  }, [inView]);

  const stats = [
    { img: Students, label: "Student Enrolled" },
    { img: Cirtificates, label: "Certificates" },
    { img: Capp, label: "Course Complete" },
    { img: world, label: "Global Learners" }
  ];

  return (
    <div className='px-2.5 relative' style={{ backgroundImage: `url(${Bgtwo})` }}>
      <div className='absolute right-1 md:right-20 top-30'>
        <ShakyImage src={circle}/>
      </div>

      <div className='absolute left-1 md:left-25 top-30'>
        <ShakyImage src={cirsleSide}/>
      </div>

      <div className='flex flex-wrap py-[50px]'>
        {stats.map((item, index) => {
          let borderClass = '';
          if (index === 0 || index === 2) {
            borderClass = 'md:border-r border-r-[#725AF9]';
          } else if (index === 1) {
            borderClass = 'lg:border-r border-r-[#725AF9]';
          }

          return (
            <div
              key={index}
              className={`flex justify-center p-2.5 md:p-0 w-[50%] md:w-[48%] lg:w-[25%] mx-auto ${borderClass}`}
            >
              <div className='mb-[30px] md:mb-0 flex flex-col justify-center items-center' ref={ref}>
                <div>
                  <img src={item.img} alt={item.label} />
                </div>
                <div className='flex flex-col justify-center items-center text-[#FFFFFF] pt-5 pb-[7px]'>
                  <span className='font-inter text-[22px] font-bold'>{count}</span>
                  <span className='text-center text-[18px] font-inter'>{item.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AboutTwo;
