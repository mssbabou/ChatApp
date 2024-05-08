export default function ChatMessage({ message }) {
  return (
    <div className="bg-gray-100 m-2 p-3 rounded-lg shadow" style={{ height: 100 }}>
    <div className="flex justify-between">
      <h2 className="text-base font-semibold text-gray-900">
        {message.userName}
      </h2>
      <span className="text-xs text-gray-500">
        {message.timeStamp}
      </span>
    </div>
    <p className="text-gray-800">{message.message}</p>
  </div>
  );
}