'use client';

import './preloader.css';
import { useEffect, useState } from 'react';

const DESTRUCTION_CLASS = '_destruction';

export const Preloader = () => {
  const [isAnimDestruction, setIsAnimDestruction] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsAnimDestruction(true);

        setTimeout(() => {
          setIsLoading(false);
        }, 350);
      }, 500);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className={`preloader ${isAnimDestruction ? DESTRUCTION_CLASS : ''}`}>
      <div className="preloader-icon"></div>
    </div>
  );
};
