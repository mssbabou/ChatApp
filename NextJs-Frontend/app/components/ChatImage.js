import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const ChatImage = ({ src, alt, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className={`relative flex items-center justify-center w-full h-full ${loading ? 'bg-gray-300' : ''} ${error ? 'bg-red-500' : ''}`}>
      {loading && !error && <CircularProgress className="absolute" />}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`${loading || error ? 'hidden' : 'block'}`}
        {...props}
      />
    </div>
  );
};

export default ChatImage;