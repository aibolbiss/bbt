import Chat from '@/components/chat/Chat';
import List from '@/components/list/List';
import './profilePage.scss';
import apiRequest from '@/lib/apiRequest';
import { Await, Link, useLoaderData, useNavigate } from 'react-router-dom';
import { Suspense, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

function ProfilePage() {
  const data = useLoaderData();

  const { updateUser, currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post('/auth/logout');
      updateUser(null);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className='profilePage'>
      <div className='details'>
        <div className='wrapper'>
          <div className='title'>
            <h1>Информация о пользователе</h1>
            <Link to='/profile/update'>
              <button>Обновить Профиль</button>
            </Link>
          </div>
          <div className='info'>
            <span>
              Аватарка:
              <img
                src={currentUser.avatar || 'noavatar.png'}
                alt=''
              />
            </span>
            <span>
              Имя пользователя: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Выйти</button>
          </div>
          <div className='title'>
            <h1>Мои посты</h1>
            <Link to='/add'>
              <button>Создать новый пост</button>
            </Link>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Ошибка при загрузке!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.userPosts} />}
            </Await>
          </Suspense>
          <div className='title'>
            <h1>Избранное</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Ошибка при загрузке!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className='chatContainer'>
        <div className='wrapper'>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
