import React, { useRef } from 'react';

const ChatImage = (url) => {
    const imgRef = useRef(null);

    const handleContextMenu = (e) => {
        e.preventDefault();

        // Create a temporary input to hold the URL
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);

        // Select the input value and copy it to clipboard
        tempInput.select();
        document.execCommand('copy');

        // Remove the temporary input
        document.body.removeChild(tempInput);

        alert('Image URL copied to clipboard!');
    };

    return (
        <img
            ref={imgRef}
            src={`${url}`}
            alt="Example"
            onContextMenu={handleContextMenu}
            style={{ cursor: 'context-menu' }}
        />
    );
};

export default ChatImage;
