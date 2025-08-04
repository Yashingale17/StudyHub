import React from 'react'
import News1 from '../pages/Home/News1.jpg'

const Blog = () => {
  return (
    <div className='mt-[120px] px-[20px] py-5'>
      <div className="flex flex-col xl:w-[25%] border border-green-200 p-1.5">
        <div className="w-full h-full">
          <img src={News1} alt="example"
            className="w-full h-full object-contain " />
        </div>
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-xl font-bold">Title</h2>
          <p className="text-gray-600">Some description goes here...</p>
        </div>
      </div>

    </div>
  )
}

export default Blog
