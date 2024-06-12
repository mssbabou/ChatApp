import React from 'react';
import ConvertTimestamp from '../utils/ConvertTimestamp';
import Linkify from 'react-linkify';
import EmbeddedLink, { GetMediaType } from './EmbeddedLink';

let MediaLinks = {};

const ChatMessage = React.forwardRef(({ isAuthor, message }, ref) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  const [links, setLinks] = React.useState([]);

  React.useEffect(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    if (!message.message) return;
    let matches = message.message.match(urlRegex);
    if (matches) {
      (async () => {
        for (const link of matches) {
          if (MediaLinks[link]) {
            if (MediaLinks[link] !== 'unsupported') {
              message.message = message.message.replace(link, '');
            }
          } else if (MediaLinks[link] === undefined) {
            let mediaType = await GetMediaType(link);
            if (mediaType) {
              message.message = message.message.replace(link, '');
              MediaLinks[link] = mediaType;
            } else {
              matches = matches.filter((item) => item !== link);
              MediaLinks[link] = 'unsupported';
            }
          }
        }
        setLinks([...new Set(matches)]);
      })();
    }
  }, [message.message]);

  const linkifyComponentDecorator = (decoratedHref, decoratedText, key) => (
    <a target='blank' href={decoratedHref} key={key} style={{ color: 'blue', textDecoration: 'underline' }}>
      {decoratedText}
    </a>
  );

  return (
    <div className={`flex ${isAuthor ? "justify-end" : "justify-start"}`}>
      <div ref={ref} className={`${isAuthor ? "bg-gray-300" : "bg-gray-200"} mx-2 mt-4 p-3 rounded-lg shadow`} style={{ minHeight: 75, width: '100%' }}>
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {message.userName}
          </h2>
          <span className="text-xs text-gray-500">
            {ConvertTimestamp(message.timeStamp)}
          </span>
        </div>
        <Linkify componentDecorator={linkifyComponentDecorator}>
          {message.message?.trim() && (
            <p className="text-gray-800 break-all">
              {message.message.trim().split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          )}
        </Linkify>
        {links.map((link, index) => {
          const mediaType = MediaLinks[link];
          if (mediaType === 'image') {
            return <img key={index} width={400} height={400} src={link} alt="Attachment" />;
          } else if (mediaType === 'video') {
            return (
              <video key={index} width={400} height={400} controls>
                <source src={link} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            );
          } else if (mediaType === 'audio') {
            return (
              <audio key={index} controls>
                <source src={link} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
