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
              <option value='Курортный'>Курортный</option>
              <option value='Экзотический'>Экзотический</option>
              <option value='Экзотический'>Пляжный</option>
              <option value='Исторический'>Исторический</option>
              <option value='Романтический'>Романтический</option>
              <option value='Рекреационный'>Рекреационный</option>
              <option value='Лечебно-оздоровительный'>
                Лечебно-оздоровительный
              </option>
              <option value='Познавательный'>Познавательный</option>
              <option value='Деловой'>Деловой</option>
              <option value='Спортивный'>Спортивный</option>
              <option value='Этнический'>Этнический</option>
              <option value='Религиозный'>Религиозный</option>
              <option value='Транзитный'>Транзитный</option>
              <option value='Образовательный'>Образовательный</option>
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
          <label htmlFor='minPrice'>
            {query.type === 'Жилье' ? 'Цена' : 'Бюджет'}
          </label>
          <input
            type='number'
            id='minPrice'
            name='minPrice'
            placeholder='От'
            onChange={handleChange}
            defaultValue={query.minPrice}
          />
        </div>
        <div className='item'>
          <label htmlFor='maxPrice'>
            {query.type === 'Жилье' ? 'Цена' : 'Бюджет'}
          </label>
          <input
            type='number'
            id='maxPrice'
            name='maxPrice'
            placeholder='До'
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
