import React from 'react';
import bg from './RegisterPageimg.jpg';

const TopComp = ({ titleOne, titleTwo }) => {
  return (
    <div
      className="w-full flex bg-cover bg-center text-white shadow-lg"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className='w-full px-2.5 lg:px-12'>
        <div className='py-[110px]'>
          <div>
            <h1 className='text-[#FFFFFF] text-[45px] font-semibold font-hind mb-[30px] leading-13'>
              {titleOne}
            </h1>
          </div>

          {
            titleTwo?.toLowerCase() !== "courses" && (
              <div className='text-[18px] font-normal font-inter'>
                <span>Home</span> {" > "}
                <span>{titleTwo}</span>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default TopComp;
