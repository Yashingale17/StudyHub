import React from 'react'
import TopComp from '../../Components/Top/TopComp'
import bulb from "../../pages/Home/bulb.png"

const ContactUs = () => {
  return (
    <div>
      <div className='mt-[79px]  md:mt-[77px] lg:mt-[117px]'>
        <TopComp titleOne={"Contact"} titleTwo={"Contact"} />
      </div>

      <div className='w-full'>
        <div className='px-2.5 md:px-5 w-full'>
          <div className='flex flex-col max-w-[1410px] mx-auto lg:flex-row-reverse gap-12 lg:gap-0 pt-[60px] pb-[40px] lg:pt-[110px] lg:pb-[20px]'>
            <div className='p-2.5 lg:w-[58.33%]'>
              <div className='lg:pl-[40px] lg:mt-3.5'>
                 <iframe
                title="StudyHub Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.123456789012!2d-122.08500000000001!3d37.421999999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb123456789ab%3A0xabcdefabcdefabcd!2sYour+Business+Name!5e0!3m2!1sen!2sin!4v1711234567890"
                width="100%"
                height="400px"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="border-0 lg:h-[450px]"
              ></iframe>
              </div>
            </div>

            <div className='flex flex-col lg:w-[42.66%] gap-1'>
              <div>
                <div className='flex items-center'>
                  <img className='w-[22px]' src={bulb} alt="buld" />
                  <span className='px-2.5 font-inter txt-color font-medium leading-[16px]'>Contact</span>
                </div>

                <div>
                  <h2 className='mt-2.5 mb-3 text-[24px] md:text-[40px] font-hind font-semibold sm:leading-13 lg:leading-13'>Love to hear from you <br />
                    <span className='font-medium'>Get in touch!</span>
                  </h2>
                </div>
              </div>

              <div className='py-2.5'>
                <div className='flex flex-col'>
                  <label htmlFor="name" className="mb-2.5 text-[16px] font-inter font-medium text-gray-700">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your Name..."
                    className="border border-[#DDD8F9] rounded-md px-[15px] py-2.5 mb-2.5 focus:outline-none focus:ring-2 focus:ring-[#553CDF]"
                  />
                </div>
                <div className='flex flex-col'>
                  <label htmlFor="name" className="mb-2.5 text-[16px] font-inter font-medium text-gray-700">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="name"
                    id="name"
                    placeholder="Your Email..."
                    className="border border-[#DDD8F9] rounded-md px-[15px] py-2.5 mb-2.5 focus:outline-none focus:ring-2 focus:ring-[#553CDF]"
                  />
                </div>
                <div className='flex flex-col'>
                  <label htmlFor="name" className="mb-2.5 text-[16px] font-inter font-medium text-gray-700">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    type="text"
                    name="name"
                    id="name"
                    cols="30"
                    rows="10"
                    placeholder="Tell us about your project..."
                    className="border border-[#DDD8F9] rounded-md lg:h-40 px-[15px] py-2.5 mb-2.5 focus:outline-none focus:ring-2 focus:ring-[#553CDF]"
                  />
                </div>

              </div>

              <div className='mt-[23px]'>
                <button className='py-[15px] px-[25px] bg-[#553CDF] hover:bg-white hover:text-[#553CDF] font-hind hover:cursor-pointer text-white rounded-sm border border-[#553CDF] transition-all duration-150 delay-150 ease-in'>
                  Send Message
                </button>
              </div>

            </div>
          </div>


        </div>
      </div>
    </div>

  )
}

export default ContactUs
