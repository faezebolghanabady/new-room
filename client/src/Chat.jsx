import {  useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Chat from './Login';
// import { useParams, useLocation } from 'react-router-dom';
// import io from 'socket.io-client';
import io from 'socket.io-client';
import { useContext } from 'react';
import EmailContext from './UserContext';
import Cookies from 'js-cookie';
import "./assets/Style.css"

 function Chat () {
    
    const[currentMessage , setCurrentMessage] = useState();
    const { email , room } = useContext(EmailContext);
    const[messageList , setMessagelist] = useState([]);
    const token = Cookies.get('accessToken');
    const [socket, setSocket] = useState(null);



    useEffect(() => {
   
      if (token) {

        const newSocket = io.connect('http://localhost:3000', {
          
          auth: {
            token: token,  
            email: email, 
            room: room   
          }
        });

        newSocket.on('connect', () => {
          console.log('WebSocket connected');
          newSocket.data = { email, room };
          newSocket.emit('user_data', { email, room });
          console.log('Socket data set:', { email, room });
        });
        setSocket(newSocket);
        return () => {
          newSocket.disconnect();
          console.log('WebSocket disconnected');
        };
      } else {
        console.log('No access token found');
      }
    }, [token]);

  
    useEffect(() => {
      console.log('11111111111111')
      if (socket && room) {
        console.log('room' , room)
        const joinData = {
          room: room,
          author: email,
        };
        socket.emit('join_room', joinData , (response)=>{
         console.log('3333333333333333333333')
          console.log('join_room message:data' , response);
        });
      }
    }, [socket , room]);

    useEffect(() => {
      if (socket) {  
        socket.on('receive_message', (data) => {
          console.log('received message:', data);
          setMessagelist((list) => [...list, data]);
        });
    
        return () => {
          socket.off('receive_message'); 
        };
      }
    }, [socket]);  
    
  

  const sendMessage = async () => {
    if (currentMessage !== '' && socket) {
      const messageData = {
        room:room,
        author: email,
        message: currentMessage,
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        token: token
        
      };

      
      try {
        await socket.emit('send_message', messageData);
        setMessagelist((list) => [...list , messageData]);
        console.log('test input mesage')
        setCurrentMessage('');
        console.log('currentMessage', currentMessage)
        
      } catch (error) {
        console.error('Error sending message:', error);
      }  

     
    }
  };

  return (
    
    <div className='chat-window'>
        <div className='chat-header'>
            <p>chat room </p>
        </div>
        <div className='chat-body'>
          {
            messageList.map((messageContent)=>{
              return (
                <div className='message' key={messageContent.id} id={email === messageContent.author ? "you" : "other"}>
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
            value={currentMessage}
             type='text'
              placeholder='hiii'
              ></input>
            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>
  )
}

export default Chat;












    // if (!token) {
    //   console.log('No access token found');
    //   return null;
    // }
  
  
    // const socket = io.connect('http://127.0.0.1:3000', {
    //   auth: {
    //     token: token,  // ارسال توکن از طریق handshake.auth
    //   }
    // });
