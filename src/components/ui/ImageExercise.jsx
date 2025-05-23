"use client";

import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

const ImageExercise = ({ title }) => {
  const divRef = useRef(null);
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    html2canvas(divRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      setImgSrc(imgData);
    });
  }, [title]);

  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl">
      {imgSrc ? (
        <img src={imgSrc} alt={title} style={{ width: '100%', height: '100%' }} />
      ) : (
        <div
          ref={divRef}
          style={{
            width: '90%',
            height: '90%',
            fontSize: '24px',
            color: '#000',
            backgroundColor: '#E4E3E3',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
};

export default ImageExercise;
