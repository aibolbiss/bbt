import { useState } from 'react';
import './filter.scss';
import { useSearchParams } from 'react-router-dom';

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
    property: searchParams.get('property') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedroom: searchParams.get('bedroom') || '',
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    <div className='filter'>
      <h1>
        Результаты поиска: <b>{searchParams.get('city')}</b>
      </h1>
      <div className='top'>
        <div className='item'>
          <label htmlFor='city'>Город</label>
          <input
            type='text'
            id='city'
            name='city'
            placeholder='Поиск по городу'
            onChange={handleChange}
            defaultValue={query.city}
          />
        </div>
      </div>
      <div className='bottom'>
        <div className='item'>
          <label htmlFor='type'>Тип</label>
          <select
            name='type'
            id='type'
            onChange={handleChange}
            defaultValue={query.type}
          >
            {/* <option value=''>Все</option> */}
            <option value='Попутчики'>Попутчики</option>
            <option value='Жилье'>Жилье</option>
          </select>
        </div>
        {query.type === 'Попутчики' && (
          <div className='item'>
            <label htmlFor='property'>Вид</label>
            <select
              name='property'
              id='property'
              onChange={handleChange}
              defaultValue={query.property}
            >
              <option value=''>Все</option>
              <option value='turkey'>Турция</option>
              <option value='dubai'>Дубай</option>
            </select>
          </div>
        )}
        {query.type === 'Жилье' && (
          <div className='item'>
            <label htmlFor='property'>Вид</label>
            <select
              name='property'
              id='property'
              onChange={handleChange}
              defaultValue={query.property}
            >
              <option value=''>Все</option>
              <option value='turkey'>Апартаменты</option>
              <option value='dubai'>Дом</option>
            </select>
          </div>
        )}
        <div className='item'>
          <label htmlFor='minPrice'>Мин. Бюджет</label>
          <input
            type='number'
            id='minPrice'
            name='minPrice'
            placeholder='any'
            onChange={handleChange}
            defaultValue={query.minPrice}
          />
        </div>
        <div className='item'>
          <label htmlFor='maxPrice'>Макс. Бюджет</label>
          <input
            type='number'
            id='maxPrice'
            name='maxPrice'
            placeholder='any'
            onChange={handleChange}
            defaultValue={query.maxPrice}
          />
        </div>
        {query.type === 'Жилье' && (
          <div className='item'>
            <label htmlFor='bedroom'>Комнат</label>
            <input
              type='text'
              id='bedroom'
              name='bedroom'
              placeholder='количество'
              onChange={handleChange}
              defaultValue={query.bedroom}
            />
          </div>
        )}
        <button onClick={handleFilter}>
          <img
            src='/search.png'
            alt=''
          />
        </button>
      </div>
    </div>
  );
}

export default Filter;
