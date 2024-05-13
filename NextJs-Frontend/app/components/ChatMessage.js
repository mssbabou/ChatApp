import React from 'react';
import ConvertTimestamp from '../utils/ConvertTimestamp';
import Linkify from 'react-linkify';
import linkify from 'linkifyjs';
import EmbeddedLink from './EmbeddedLink';

const ChatMessage = React.forwardRef(({ message }, ref) => {
  const [links, setLinks] = React.useState([]);

  React.useEffect(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = message.message.match(urlRegex);
    if (matches) {
      setLinks(matches);
      console.log(matches);
    }
  }, [message.message]);

  const linkifyComponentDecorator = (decoratedHref, decoratedText, key) => (
    <a target='blank' href={decoratedHref} key={key} style={{ color: 'blue', textDecoration: 'underline'}}>
      {decoratedText}
    </a>
  );
  
  return (
    <div ref={ref} className="bg-gray-100 m-2 p-3 rounded-lg shadow" style={{ minHeight: 75 }}>
      <div className="flex justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          {message.userName}
        </h2>
        <span className="text-xs text-gray-500">
          {ConvertTimestamp(message.timeStamp)}
        </span>
      </div>
      <Linkify componentDecorator={linkifyComponentDecorator}>
        <p className="text-gray-800 break-all">{message.message}</p>
      </Linkify>
      {links.map((link, index) => (
        <EmbeddedLink key={index} link={link} />
      ))}
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;