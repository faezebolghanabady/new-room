import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import Chat from './Login';
// import { useParams, useLocation } from 'react-router-dom';
// import io from 'socket.io-client';
import io from 'socket.io-client';
import { useContext } from 'react';
import EmailContext from './UserContext';
import "./assets/Style.css"

 function Chat () {
    const { email , room } = useContext(EmailContext);
    const socket = io.connect("http://localhost:3000");

    const[currentMessage , setCurrentMessage] = useState("");
    const[messageList , setMessagelist] = useState([]);

      const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room:room,
        author: email,
        message: currentMessage,
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      };

      try {
        await socket.emit('send_message', messageData);
        setMessagelist((list) => [...list , messageData]);
        setCurrentMessage("");
        
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  useEffect(()=>{
    socket.on("receive_message" , (data)=>{
      console.log('received message:', data);
        setMessagelist((list) => [...list , data])
    })
  } , [socket])
  

   
  return (
    <div className='chat-window'>
        <div className='chat-header'>
            <p>chat room </p>
        </div>
        <div className='chat-body'>
          {
            messageList.map((messageContent)=>{
              return (
                <div className='message' id={email === messageContent.author ? "you" : "other"}>
                  <div className='message-content'>
                    <p>
                      {messageContent.message}
                    </p>
                  </div>
                  <div className='message-meta'>
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className='chat-footer'>
            <input
            onChange={(event)=>{
                setCurrentMessage(event.target.value)
            }}
             type='text'
              placeholder='hiii'
              ></input>
            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>
  )
}

export default Chat;
