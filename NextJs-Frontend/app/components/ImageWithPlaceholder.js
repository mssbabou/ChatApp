import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ImageWithPlaceholder = ({
  src,
  placeholder,
  alt,
  width,
  height,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div
      className="relative"
      style={{ width: width, height: height }}
      {...props}
    >
      {!imageLoaded && (
        <img
          src={placeholder}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        className={`w-full h-full object-cover ${imageLoaded ? 'block' : 'hidden'}`}
      />
    </div>
  );
};

ImageWithPlaceholder.propTypes = {
  src: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ImageWithPlaceholder.defaultProps = {
  alt: '',
  width: '100%',
  height: '100%',
};

export default ImageWithPlaceholder;
