import React, { useEffect, useState } from 'react';
import { YouTubeEmbed } from 'react-social-media-embed';

export default function EmbeddedLink({ link }) {
    const [isImage, setIsImage] = useState(false);
    const [isYouTube, setIsYouTube] = useState(false);

    useEffect(() => {
        if (link.includes('youtube.com/watch') && link.includes('https://')) {
            setIsYouTube(true);
            return;
        }

        if (link.includes('youtube')) {
            return;
        }

    }, [link]);

    return (
        <div>
            {<img width={400} src={link} alt="Attachment" />}
            {/*isYouTube && <YouTubeEmbed width={400} height={225}  url={link} />*/}
        </div>
    );
}

export async function GetMediaType(link) {
    let mediaType = null;
    try {
      if (link.includes('youtube')) return null;
  
      const response = await fetch(link);
  
      if (!response.ok) return null;
  
      const contentType = response.headers.get('content-type');
      console.log(`${link}: ${contentType}`);
  
      if (contentType) {
        if (contentType.startsWith('image')) {
          mediaType = 'image';
        } else if (contentType.startsWith('video')) {
          mediaType = 'video';
        } else if (contentType.startsWith('audio')) {
          mediaType = 'audio';
        } else {
          // Additional check by trying to load the image
          const blob = await response.blob();
          const isImage = await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = URL.createObjectURL(blob);
          });
  
          if (isImage) {
            mediaType = 'image';
          }
        }
      }
    } catch (error) {
      mediaType = null;
    }
  
    return mediaType;
  }
  