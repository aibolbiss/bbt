import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiRequest from '@/lib/apiRequest';
import './register.scss';

function Register() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    const email = e.target.value;
    setEmail(email);
    setIsValid(validateEmail(email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const formData = new FormData(e.target);

    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      await apiRequest.post('/auth/register', {
        username,
        email,
        password,
      });

      if (isValid) {
        alert('Аккаунт успешно создан');
      } else {
        alert('Пожалуйста, введите корректный адрес электронной почты.');
      }

      navigate('/login');
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='registerPage'>
      <div className='formContainer'>
        <form onSubmit={handleSubmit}>
          <h1>Создать аккаунт</h1>
          <input
            name='username'
            type='text'
            minLength={3}
            maxLength={20}
            placeholder='Имя пользователя'
            autoComplete='username'
            required
          />
          <input
            name='email'
            type='email'
            placeholder='Почта'
            value={email}
            onChange={handleChange}
            autoComplete='email'
            required
          />
          {!isValid && (
            <p style={{ color: 'red' }}>
              Отсутствуют символы{' '}
              <span style={{ color: 'black', fontSize: 20 }}>@</span> и{' '}
              <span style={{ color: 'black', fontSize: 20 }}>.</span>
            </p>
          )}
          <input
            name='password'
            type='password'
            minLength={6}
            maxLength={20}
            placeholder='Пароль'
            autoComplete='current-password'
            required
          />
          <button disabled={isLoading}>Регистрация</button>
          {error && <span>{error}</span>}
          <Link to='/login'>У вас есть учетная запись?</Link>
        </form>
      </div>
      <div className='imgContainer'>
        <img
          src='/bg.png'
          alt=''
        />
      </div>
    </div>
  );
}

export default Register;
