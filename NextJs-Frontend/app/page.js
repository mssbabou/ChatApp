"use client";

import { useState, useEffect, Suspense } from "react";
import FlipMove from "react-flip-move";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from 'next/navigation';
import { IconButton, InputBase, Paper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import useChat from './hooks/useChat';

const ChatComponent = () => {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  const searchParams = useSearchParams();
  const initialChatId = searchParams.get('c');

  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);

  const {
    chatId,
    setChatId,
    messages,
    messageCount,
    hasMore,
    sendMessage,
    fetchMessagesBehind,
    fetchUploadFile,
    rankedChatids,
    animateMessage,
    scrollToBottom,
    initialized,
    userRef,
    scrollableDivRef,
  } = useChat(initialChatId, isDevelopment);

  useEffect(() => {
    if (!initialized.current) {
      scrollToBottom();
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
  }, [messages]);

  function RedirectToChat() {
    if (initialChatId !== chatId) {
      window.location.href = `/?c=${chatId}`;
    }
  }

  function isUserAtBottom() {
    if (!scrollableDivRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = scrollableDivRef.current;
    return scrollHeight - scrollTop === clientHeight;
  }

  return (
    <main className="flex flex-col h-screen">
      <div className="bg-gray-300 flex justify-between">
        <div className="flex items-center m-3 shadow">
          <IconButton onClick={() => setBurgerMenuOpen(!burgerMenuOpen)} style={{ width: 40, height: 40, background: 'white', borderRadius: '4px' }}>
            {burgerMenuOpen ? <CloseIcon className="text-black"/> : <MenuIcon className="text-black"/>} 
          </IconButton>
        </div>
        <div className="flex flex-row justify-end items-center">
          <Paper
            component="form"
            className="m-3"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, height: 40 }}
            onSubmit={(e) => {
              e.preventDefault();
              RedirectToChat();
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Go to Chat"
              inputProps={{ 'aria-label': 'Go to Chat' }}
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
            />
            <IconButton onClick={() => setChatId("")} sx={{ p: '10px' }} aria-label="reset">
              <CloseIcon fontSize="small" />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          <h2
            className="text-md mr-3 flex items-center justify-center shadow"
            style={{
              height: 40,
              border: '1px solid #e0e0e0',
              padding: '2px 4px',
              borderRadius: '4px',
              backgroundColor: 'white',
              color: 'black'
            }}
          >
            {userRef.current ? userRef.current.username : "No Name"}
          </h2>
        </div>
      </div>
      <div className="flex flex-grow overflow-hidden">
      {burgerMenuOpen &&
      <div className="h-full bg-gray-400" style={{ width: 300 }}>
        <div className="flex flex-col justify-center m-2">
          <h1 className="text-2xl">Top Chats🔥</h1>
          <Divider style={{ margin: '8px' }}/>
          {rankedChatids.map((rankedChatid, index) => (
            <div
              key={index}
              className="flex items-center w-full p-2 my-1 rounded bg-white cursor-pointer shadow"
              onClick={() => setChatId(rankedChatid.chatId)}
            >
              <h2 className="text-lg">{`${rankedChatid.chatId}`}</h2>
            </div>
          ))}
        </div>
      </div>
      }
        <div className="flex flex-col flex-grow h-full items-center justify-center">
          <div id="scrollableDiv" className="flex flex-col-reverse overflow-auto my-2" style={{ maxWidth: 900, width: "100%", height: "100%" }} ref={scrollableDivRef}>
            <InfiniteScroll
              scrollThreshold={0.9}
              dataLength={messageCount}
              next={fetchMessagesBehind}
              hasMore={hasMore}
              inverse={true}
              scrollableTarget="scrollableDiv"
            >
              <FlipMove duration={175} disableAllAnimations={!animateMessage}>
                {messages.map((message) => (
                  <ChatMessage
                    key={message.timeStamp}
                    isAuthor={message.userName === userRef.current?.username}
                    message={message}
                  />
                ))}
              </FlipMove>
            </InfiniteScroll>
          </div>
          <div className="flex-none" style={{ maxWidth: 900, width: "100%" }}>
            <ChatInput
              sendMessage={sendMessage}
              uploadFile={fetchUploadFile}
              receiver={initialChatId}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

const ChatPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatComponent />
    </Suspense>
  );
};

export default ChatPage;
