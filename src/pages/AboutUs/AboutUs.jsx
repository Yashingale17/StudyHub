import React, { useState } from 'react';
import TopComp from '../../Components/Top/TopComp';

import bulb from "../../pages/Home/bulb.png"

import FeedBack from '../../Components/FeedBack/FeedBack';

import { FaTimes } from "react-icons/fa";
import style from './About.module.css';
import AboutTwo from '../../Components/AboutUsTwo/AboutTwo';
import ChooseUs from '../../Components/ChooseUs/ChooseUs';
import InstructorProfile from '../../Components/InstructorProfile/InstructorProfile';
import LifeLong from '../../Components/LifeLong/LifeLong';

const AboutUs = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <div>
        <div className='mt-[79px] md:mt-[77px] lg:mt-[117px]'>
          <TopComp titleOne={"About Us"} titleTwo={"About Us"} />
        </div>

        <div>
          <LifeLong/>
        </div>

        <div>
          <AboutTwo />
        </div>

        <div>
          <FeedBack />
        </div>

        <ChooseUs/>

        <InstructorProfile/>

       
      </div>
    </>
  );
};

export default AboutUs;
