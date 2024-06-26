import { Link, useNavigate } from 'react-router-dom';
import './card.scss';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import apiRequest from '@/lib/apiRequest';

// Aibol Bissenkul

function Card({ item }) {
  const { currentUser } = useContext(AuthContext);
  const isOwner = currentUser?.id === item.userId;
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      // Получаем все чаты текущего пользователя
      const res = await apiRequest.get('/chats');
      const existingChat = res.data.find(
        (chat) => chat.receiver.id === item.userId
      );

      if (existingChat) {
        // Если существует, перенаправляем на существующий чат
        navigate('/profile', {
          state: { chatId: existingChat.id, receiver: item.user },
        });
      } else {
        // Если не существует, создаем новый чат
        const newChat = await apiRequest.post('/chats', {
          receiverId: item.userId,
        });
        navigate('/profile', {
          state: { chatId: newChat.data.id, receiver: item.user },
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className='card'>
      <Link
        to={`/${item.id}`}
        className='imageContainer'
      >
        <img
          src={item.images[0]}
          alt=''
        />
      </Link>
      <div className='textContainer'>
        <div className='main'>
          <h2 className='title'>
            <Link to={`/${item.id}`}>{item.title}</Link>
          </h2>
          <p>
            {' '}
            <img
              className='city-icon'
              src={item.type === 'Попутчики' ? '/flight.png' : '/home.png'}
              alt='Image'
            />
            {item.city}
          </p>
        </div>

        <p className='price'>
          {item.type === 'Попутчики' ? 'Бюджет' : 'Аренда'}: {item.price} ₸{' '}
          {item.type === 'Жилье' ? 'в день' : ''}
        </p>
        <p>Вид: {item.property}</p>
        {item.type === 'Попутчики' ? (
          <p>
            Период отдыха: {item.period}{' '}
            {item.period > 4 ? 'дней' : item.period === 1 ? 'день' : 'дня'}
          </p>
        ) : (
          <p className='address'>
            <img
              src='/geo.png'
              alt=''
            />
            <span>{item.address}</span>
          </p>
        )}
        <div className='bottom'>
          <div className='features'>
            {item.type === 'Попутчики' ? (
              <>
                <div className='feature'>
                  Я
                  <img
                    style={{ width: 25, height: 25 }}
                    src={`/${item.gender}.png`}
                    alt='Image'
                  />
                </div>
                <div className='feature'>Ищу: {item.choice}</div>
              </>
            ) : (
              <>
                <div className='feature'>
                  <img
                    src='/bed.png'
                    alt=''
                  />
                  <span>
                    {item.bedroom}{' '}
                    {item.bedroom > 4
                      ? 'комнат'
                      : item.bedroom === 1
                      ? 'комната'
                      : 'комнаты'}
                  </span>
                </div>
                <div className='feature'>
                  <img
                    src='/bath.png'
                    alt=''
                  />
                  <span>
                    {item.bathroom}{' '}
                    {item.bathroom > 4
                      ? 'санузлов'
                      : item.bathroom === 1
                      ? 'санузел'
                      : 'санузла'}
                  </span>
                </div>
              </>
            )}
          </div>
          <div className='icons'>
            {!isOwner && (
              <>
                {' '}
                <div
                  className='icon'
                  title='В Избранное'
                >
                  <img
                    src='/save.png'
                    alt='Icon'
                  />
                </div>
                <div
                  className='icon'
                  title='Написать'
                  onClick={sendMessage}
                >
                  <img
                    src='/mail.png'
                    alt='Icon'
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
