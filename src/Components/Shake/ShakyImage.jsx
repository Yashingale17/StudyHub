import React, { useEffect, useRef } from "react";
import style from "./Shake.module.css";

const ShakyImage = ({ src, alt }) => {
  const imageRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const image = imageRef.current;
      if (!image) return;

      const { innerWidth, innerHeight } = window;
      const x = e.clientX;
      const y = e.clientY;

      const offsetX = ((x / innerWidth) - 0.8) * 2; 
      const offsetY = ((y / innerHeight) - 0.5) * 2;

      const translateX = offsetX * 20;
      const translateY = offsetY * 20;
      const rotateY = offsetX * 10;
      const rotateX = -offsetY * 10;

      image.style.transform = `
        perspective(1000px)
        translate3d(${translateX}px, ${translateY}px, 0)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    };

    const handleMouseLeave = () => {
      const image = imageRef.current;
      if (image) {
        image.style.transform = `
          perspective(1000px)
          translate3d(0px, 0px, 0)
          rotateX(0deg)
          rotateY(0deg)
        `;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={imageRef} className={style.imagecontainer}>
      <img src={src} alt={alt} className={style.image} />
    </div>
  );
};

export default ShakyImage;
