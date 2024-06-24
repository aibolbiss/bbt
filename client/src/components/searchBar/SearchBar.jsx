import { useState, useEffect } from 'react';
import axios from 'axios';
import './searchBar.scss';
import { Link, useNavigate } from 'react-router-dom';

const types = ['Попутчики', 'Жилье'];

const GEOLOCATION_API_URL =
  'https://api.bigdatacloud.net/data/reverse-geocode-client';

function SearchBar() {
  const [query, setQuery] = useState({
    type: 'Попутчики',
    city: '',
    minPrice: 0,
    maxPrice: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `${GEOLOCATION_API_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=ru`
          );
          const city =
            response.data.city ||
            response.data.locality ||
            response.data.principalSubdivision;
          setQuery((prev) => ({ ...prev, city }));
        } catch (error) {
          console.error('Ошибка при получении данных о местоположении:', error);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Ошибка при определении местоположения:', error);
        setIsLoading(false);
      }
    );
  }, []);

  // Aibol

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = (e) => {
    if (!query.city || !query.minPrice || !query.maxPrice) {
      e.preventDefault();
      alert('Заполните все обязательные поля');
    } else {
      navigate(
        `/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`
      );
    }
  };

  return (
    <div className='searchBar'>
      <div className='type'>
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? 'active' : ''}
          >
            {type}
          </button>
        ))}
      </div>
      <form onSubmit={handleSearch}>
        <input
          type='text'
          name='city'
          placeholder='Город'
          onChange={handleChange}
          defaultValue={query.city}
          disabled={isLoading}
        />
        <input
          type='number'
          name='minPrice'
          min={0}
          max={10000000}
          placeholder='Мин. Бюджет'
          onChange={handleChange}
        />
        <input
          type='number'
          name='maxPrice'
          min={0}
          max={10000000}
          placeholder='Макс. Бюджет'
          onChange={handleChange}
        />
        <Link
          to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
        >
          <button>
            <img
              src='/search.png'
              alt=''
            />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
