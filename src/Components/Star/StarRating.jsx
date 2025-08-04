import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating }) => {
  const stars = [];

  const roundedRating = Math.round(rating * 2) / 2;

  for (let i = 1; i <= 5; i++) {
    if (roundedRating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (roundedRating + 0.5 === i) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
  }

  return <div className="flex items-center gap-[2px]">{stars}</div>;
};

export default StarRating;
