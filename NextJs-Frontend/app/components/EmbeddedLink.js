import React, { useEffect, useState } from 'react';

export default function EmbeddedLink({ link }) {
    const [isImage, setIsImage] = useState(false);

    useEffect(() => {
        fetch(link)
            .then(response => {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.startsWith('image')) {
                    setIsImage(true);
                }
            })
            .catch(error => console.error(error));
    }, [link]);

    return (
        <div>
            {<img style={{ maxWidth: 400 }} src={link} alt="description" />}
        </div>
    );
}