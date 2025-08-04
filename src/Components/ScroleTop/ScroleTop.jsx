import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const smoothScrollToTop = () => {
      const duration = 1000;
      const start = window.scrollY;
      const startTime = performance.now();

      const easeOutCubic = (t) => (--t) * t * t + 1;

      const animate = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        window.scrollTo(0, start * (1 - easedProgress));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    smoothScrollToTop();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
