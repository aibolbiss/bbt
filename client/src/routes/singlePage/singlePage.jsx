import './singlePage.scss';
import Slider from '@/components/slider/Slider';
import Map from '@/components/map/Map';
import { useNavigate, useLoaderData } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import apiRequest from '@/lib/apiRequest';

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate('/login');
    }
    // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
    setSaved((prev) => !prev);
    try {
      await apiRequest.post('/users/save', { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const sendMessage = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      // Получаем все чаты текущего пользователя
      const res = await apiRequest.get('/chats');
      const existingChat = res.data.find(
        (chat) => chat.receiver.id === post.userId
      );

      if (existingChat) {
        // Если существует, перенаправляем на существующий чат
        navigate('/profile', {
          state: { chatId: existingChat.id, receiver: post.user },
        });
      } else {
        // Если не существует, создаем новый чат
        const newChat = await apiRequest.post('/chats', {
          receiverId: post.userId,
        });
        navigate('/profile', {
          state: { chatId: newChat.data.id, receiver: post.user },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='singlePage'>
      <div className='details'>
        <div className='wrapper'>
          <Slider images={post.images} />
          <div className='info'>
            <div className='top'>
              <div className='post'>
                <h1>{post.title}</h1>
                {/* <div className='address'>
                  <img
                    src='/geo.png'
                    alt='Image'
                  />
                  <span>{post.address}</span>
                </div> */}
                <p>Вид: {post.property}</p>
                <div className='price'>
                  {post.type === 'Попутчики' ? 'Бюджет' : 'Аренда'}:{' '}
                  {post.price} ₸ {post.type === 'Жилье' ? 'в день' : ''}
                </div>
              </div>
              <div className='user'>
                <img
                  src={post.user.avatar || '/noavatar.png'}
                  alt='Image'
                />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div
              className='bottom'
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className='features'>
        <div className='wrapper'>
          <div
            className='buttons'
            style={{
              display: currentUser?.id === post.userId ? 'none' : '',
            }}
          >
            <button
              className='sendMessage'
              onClick={sendMessage}
            >
              <img
                src='/mail.png'
                alt='Image'
              />
              Написать сообщение
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? '#fece51' : 'white',
              }}
            >
              <img
                src='/save.png'
                alt='Image'
              />
              {saved ? 'Сохранено' : 'Сохранить в избранное'}
            </button>
          </div>
          <div className='listVertical'>
            <div className='feature'>
              <img
                src={
                  post.type === 'Попутчики'
                    ? `/${post.gender}.png`
                    : '/city.png'
                }
                alt='Image'
              />
              <div className='featureText'>
                <span>{post.type === 'Попутчики' ? 'Я' : 'Город'}</span>
                {post.type === 'Попутчики' ? (
                  <>
                    {post.gender === 'man' ? (
                      <p>Парень/Мужчина</p>
                    ) : post.gender === 'woman' ? (
                      <p>Девушка/Женщина</p>
                    ) : (
                      <p>Трансгендер</p>
                    )}
                  </>
                ) : (
                  <p>{post.city}</p>
                )}
              </div>
            </div>
            <div className='feature'>
              <img
                src={post.type === 'Попутчики' ? '/luggage.png' : '/car.png'}
                alt='Image'
              />
              <div className='featureText'>
                <span>{post.type === 'Попутчики' ? 'Ищу' : 'Паркинг'}</span>
                {post.type === 'Попутчики' ? (
                  <p>{post.choice}</p>
                ) : (
                  <p>{post.parking}</p>
                )}
              </div>
            </div>
            <div className='feature'>
              <img
                src={post.type === 'Попутчики' ? '/time.png' : '/telephone.png'}
                alt='Image'
              />
              <div className='featureText'>
                <span>{post.type === 'Попутчики' ? 'Период' : 'Телефон'}</span>
                {post.type === 'Попутчики' ? (
                  <p>
                    {post.period}{' '}
                    {post.period > 4
                      ? 'дней'
                      : post.period === 1
                      ? 'день'
                      : 'дня'}
                  </p>
                ) : (
                  <p>{post.telephone}</p>
                )}
              </div>
            </div>
          </div>

          {post.type === 'Жилье' && (
            <>
              {/* <p className='title'>Параметры</p> */}
              <div className='sizes'>
                <div className='size'>
                  <img
                    src='/bed.png'
                    alt='Image'
                  />
                  <span>
                    {post.bedroom}{' '}
                    {post.bedroom > 4
                      ? 'комнат'
                      : post.bedroom === 1
                      ? 'комната'
                      : 'комнаты'}
                  </span>
                </div>
                <div className='size'>
                  <img
                    src='/bath.png'
                    alt='Image'
                  />
                  <span>
                    {post.bathroom}{' '}
                    {post.bathroom > 4
                      ? 'санузлов'
                      : post.bathroom === 1
                      ? 'санузел'
                      : 'санузла'}
                  </span>
                </div>
                <div className='size'>
                  <img
                    src='/pet.png'
                    alt='Image'
                  />
                  <span>{post.postDetail.pet}</span>
                </div>
              </div>
            </>
          )}

          <p className='title'>
            {post.type === 'Попутчики'
              ? 'Адрес где можем встретиться'
              : 'Местоположение'}
          </p>
          <div className='mapContainer'>
            <Map items={[post]} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
