import {  useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Chat from './Login';
// import { useParams, useLocation } from 'react-router-dom';
// import io from 'socket.io-client';
import io from 'socket.io-client';
import { useContext } from 'react';
import EmailContext from './UserContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import "./assets/Style.css"

 function Chat () {
    
    const[currentMessage , setCurrentMessage] = useState();
    let { email , room } = useContext(EmailContext);
    const[messageList , setMessagelist] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const token = Cookies.get('accessToken');
    let [socket, setSocket] = useState(null);
    const navigate = useNavigate();


    


    console.log('tocken:>> ', token);
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
          if (!email) {
            navigate('/login');
          }
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
      if (socket && room) {
        const joinData = {
          room: room,
          author: email,
        };
    
        socket.emit('join_room', joinData, (response) => {
          console.log('join_room message:data', response);
        });
    
        // دریافت پیام‌های قبلی
        socket.on('room_messages', (response) => {
          console.log('Previous messages:', response);
          setMessagelist(response); 
          console.log('messageList :>> ', messageList);
        });
    

        socket.on('receive_message', (message) => {
          console.log('received message:', message);
          setMessagelist((list) => [...list, message]); // اضافه کردن پیام جدید به لیست
        });
    
        return () => {
          socket.off('room_messages'); // حذف listener زمانی که کامپوننت غیر فعال می‌شود
          socket.off('receive_message'); // حذف listener پیام جدید
        };
      }
    }, [socket, room, email]);
    
  

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

  const deleteRoom = async () => {
    console.log('Deleting room...');
    if (socket) {
      socket.emit('leave_room', { email, room }); // به سرور اطلاع می‌دهیم که کاربر از اتاق می‌رود
      socket.disconnect();
      setSocket(null); // قطع اتصال WebSocket
    }

    addNotification('اتاق با موفقیت حذف شد'); // اضافه کردن نوتیفیکیشن حذف اتاق

    setTimeout(() => {
      navigate('/login'); // هدایت به صفحه ورود پس از 3 ثانیه
    }, 3000); // پیام را بعد از 3 ثانیه پاک می‌کنیم
  };


  const addNotification = (message) => {
    const id = new Date().getTime(); // استفاده از timestamp به عنوان شناسه یکتا برای نوتیفیکیشن‌ها
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id, message },
    ]);

    // حذف نوتیفیکیشن بعد از 3 ثانیه
    setTimeout(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    }, 3000);
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
                    <p id="author">{messageContent.email}</p>
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

        <div className="bg-read">
        <button onClick={deleteRoom}>حذف اتاق</button>
      </div>

      {/* نمایش نوتیفیکیشن‌ها */}
      <div className="notifications">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification">
            <p>{notification.message}</p>
          </div>
        ))}
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



















    
    // useEffect(() => {
    //   if (socket && room) {
    //     console.log('room' , room)
    //     const joinData = {
    //       room: room,
    //       author: email,
    //     };
    //     socket.emit('join_room', joinData , (response)=>{
    //       console.log('join_room message:data' , response);
    //     });

    //     socket.emit('')
    //   }
    // }, [socket , room]);

    // useEffect(() => {
    //   if (socket) {  
    //     socket.on('receive_message', (data) => {
    //       console.log('received message:', data);
    //       setMessagelist((list) => [...list, data]);
    //     });
    
    //     return () => {
    //       socket.off('receive_message'); 
    //     };
    //   }
    // }, [socket]);  