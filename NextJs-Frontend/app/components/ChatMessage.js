import React from 'react';
import { convertTimestamp } from '../utils/timestampConverter';

const ChatMessage = React.forwardRef(({ message }, ref) => {
  return (
    <div ref={ref} className="bg-gray-100 m-2 p-3 rounded-lg shadow" style={{ minHeight: 75 }}>
      <div className="flex justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          {message.userName}
        </h2>
        <span className="text-xs text-gray-500">
          {convertTimestamp(message.timeStamp)}
        </span>
      </div>
      <p className="text-gray-800">{message.message}</p>
    </div>
  );
});

export default ChatMessage;