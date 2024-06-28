import { useContext, useEffect, useRef, useState, useCallback } from 'react';
import './chat.scss';
import { AuthContext } from '../../context/AuthContext';
import apiRequest from '../../lib/apiRequest';
import { format } from 'timeago.js';
import { SocketContext } from '../../context/SocketContext';
import { useNotificationStore } from '../../lib/notificationStore';
import { useLocation } from 'react-router-dom';

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const location = useLocation();
  const messageEndRef = useRef();
  const formRef = useRef();

  const decrease = useNotificationStore((state) => state.decrease);

  const handleOpenChat = useCallback(
    async (id, receiver) => {
      try {
        const res = await apiRequest('/chats/' + id);
        if (!res.data.seenBy.includes(currentUser.id)) {
          decrease();
        }
        setChat({ ...res.data, receiver });
      } catch (err) {
        console.log(err);
      }
    },
    [currentUser.id, decrease]
  );

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  useEffect(() => {
    if (location.state?.chatId && location.state?.receiver) {
      handleOpenChat(location.state.chatId, location.state.receiver);
    }
  }, [location.state, handleOpenChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get('text');

    if (!text) return;
    try {
      const res = await apiRequest.post('/messages/' + chat.id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      socket.emit('sendMessage', {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put('/chats/read/' + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on('getMessage', (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off('getMessage');
    };
  }, [socket, chat]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current.requestSubmit(); // Программно отправляем форму
    }
  };

  return (
    <div className='chat'>
      <div className='messages'>
        <h1>Сообщения</h1>
        {chats?.map((c) => (
          <div
            className='message'
            key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? 'white'
                  : '#fecd514e',
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <img
              src={c.receiver.avatar || '/noavatar.png'}
              alt=''
            />
            <span>{c.receiver.username}</span>
            <p>{c.lastMessage}</p>
          </div>
        ))}
      </div>
      {chat && (
        <div className='chatBox'>
          <div className='top'>
            <div className='user'>
              <img
                src={chat.receiver.avatar || 'noavatar.png'}
                alt=''
              />
              {chat.receiver.username}
            </div>
            <span
              className='close'
              onClick={() => setChat(null)}
            >
              X
            </span>
          </div>
          <div className='center'>
            {chat.messages.map((message) => (
              <div
                className='chatMessage'
                style={{
                  alignSelf:
                    message.userId === currentUser.id
                      ? 'flex-end'
                      : 'flex-start',
                  textAlign:
                    message.userId === currentUser.id ? 'right' : 'left',
                }}
                key={message.id}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form
            ref={formRef} // Привязываем форму к рефу
            onSubmit={handleSubmit}
            className='bottom'
          >
            <textarea
              name='text'
              placeholder='Напишите что-нибудь'
              onKeyPress={handleKeyPress} // Обработчик нажатия клавиши
            ></textarea>
            <button>Отправить</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
