import React, { useState } from 'react';
import dane from "./DanaWhite.jpg";
import { FiShare2 } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const InstructorCard = ({
  id,
  imageUrl = dane,
  fullName = "Instructor Name",
  specialization = "Specialization"
}) => {
  const [showShare, setShowShare] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/instructor-info/${id}`);
  };

  return (
    <div
      className='w-full px-[13.5px] md:w-[50%] lg:w-[25%] md:px-[13.5px] relative'
      onClick={handleCardClick}
    >
      <div className='relative group hover:cursor-pointer'>
        <img className='w-full rounded-sm' src={imageUrl} alt={fullName} />

        <div
          className='absolute top-3 right-3 z-10 flex flex-col items-center'
          onMouseEnter={() => setShowShare(true)}
          onMouseLeave={() => setShowShare(false)}
        >
          <div className='bg-white text-[#553CDF] p-2 rounded-md cursor-pointer flex items-center justify-center'>
            <FiShare2 className='text-[16px]' />
          </div>

          <div className='mt-2 flex flex-col gap-2 items-center'>
            {[
              {
                icon: <FaFacebookF className='text-[#553CDF] text-[16px]' />,
                url: 'https://www.facebook.com/login',
                delay: 'delay-100'
              },
              {
                icon: <FaTwitter className='text-[#553CDF] text-[16px]' />,
                url: 'https://twitter.com/login',
                delay: 'delay-200'
              },
              {
                icon: <FaYoutube className='text-[#553CDF] text-[16px]' />,
                url: 'https://www.youtube.com/',
                delay: 'delay-300'
              },
              {
                icon: <FaInstagram className='text-[#553CDF] text-[16px]' />,
                url: 'https://www.instagram.com/accounts/login/',
                delay: 'delay-400'
              }
            ].map(({ icon, url, delay }, index) => (
              <a
                key={index}
                href={url}
                target='_blank'
                rel='noopener noreferrer'
                className={`
                  bg-white p-2 rounded-md shadow transform
                  transition-all duration-300 ease-in-out
                  ${delay}
                  ${showShare ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
                `}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className='py-5 text-center'>
        <h5 className='mb-[5px] text-[24px] font-hind font-semibold text-[#110C2D] hover:text-[#553CDF] transition-all ease-in duration-200 hover:cursor-pointer'>
          {fullName}
        </h5>
        <span className='mb-[3px] text-[16px] font-inter text-[#777777]'>
          {specialization}
        </span>
      </div>
    </div>
  );
};

export default InstructorCard;
