
import { useState, useEffect } from 'react';

export const useLoader = (minLoadTime = 1000) => {
  const [isLoading, setIsLoading] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, minLoadTime);

    return () => clearTimeout(timer);
  }, [minLoadTime]);

  const stopLoading = () => {
    setIsLoading(false);
  };

  const showLoader = isLoading || !minTimePassed;

  return { showLoader, stopLoading };
};