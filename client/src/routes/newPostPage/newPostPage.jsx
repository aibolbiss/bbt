import { useState, useEffect } from 'react';
import './newPostPage.scss';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import apiRequest from '@/lib/apiRequest';
import UploadWidget from '@/components/uploadWidget/UploadWidget';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import InputMask from 'react-input-mask';
// import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconUrl from '/geo-red.png';

function NewPostPage() {
  const [value, setValue] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState('Попутчики');

  // Map
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const getCurrentLocation = async () => {
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          setLatitude(latitude);
          setLongitude(longitude);
          reverseGeocode(latitude, longitude);
        });
      } else {
        console.error('Геолокация не поддерживается в вашем браузере');
      }
    } catch (error) {
      console.error('Ошибка при получении местоположения:', error);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      setAddress(data.display_name);
    } catch (error) {
      console.error('Ошибка при обратном геокодировании:', error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleMarkerDragEnd = (e) => {
    const marker = e.target;
    const newPosition = marker.getLatLng();
    setLatitude(newPosition.lat);
    setLongitude(newPosition.lng);
    reverseGeocode(newPosition.lat, newPosition.lng);
  };

  // Создаем иконку для метки
  const markerIcon = new L.Icon({
    iconUrl: markerIconUrl,
    iconSize: [32, 32], // Размер иконки
    iconAnchor: [16, 32], // Точка крепления иконки (центр нижней части)
    popupAnchor: [0, -32], // Позиция всплывающего окна относительно иконки
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    setIsLoading(true);

    const defaultImage = '/default.png';

    try {
      const res = await apiRequest.post('/posts', {
        postData: {
          title: inputs.title,
          type: inputs.type,
          price: parseInt(inputs.price),
          images: images.length ? images : [defaultImage],
          city: inputs.city,
          address: inputs.address,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          gender: inputs.gender,
          choice: inputs.choice,
          parking: inputs.parking,
          telephone: inputs.telephone,
          period: parseInt(inputs.period),
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate('/' + res.data.id);
    } catch (err) {
      console.log(err);
      setError(error);
    }
  };

  return (
    <div className='newPostPage'>
      <div className='formContainer'>
        <h1>Создать объявление</h1>
        <div className='wrapper'>
          <form onSubmit={handleSubmit}>
            <div className='item'>
              <label htmlFor='title'>Заголовок</label>
              <input
                minLength={5}
                maxLength={20}
                id='title'
                name='title'
                type='text'
                placeholder='Напишите заголовок'
                required
              />
            </div>
            <div className='item'>
              <label htmlFor='type'>Тип</label>
              <select
                name='type'
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option
                  value='Попутчики'
                  defaultChecked
                >
                  Попутчики
                </option>
                <option value='Жилье'>Жилье</option>
              </select>
            </div>
            <div className='item'>
              <label htmlFor='price'>
                {type === 'Попутчики' ? 'Бюджет в USD' : 'Цена'}
              </label>
              <input
                min={1}
                id='price'
                name='price'
                type='number'
                placeholder={
                  type === 'Попутчики'
                    ? 'Ваш бюджет на отдых'
                    : 'Цена аренды за сутки'
                }
                required
              />
            </div>
            <div className='item description'>
              <label htmlFor='desc'>Описание</label>
              <ReactQuill
                theme='snow'
                onChange={setValue}
                value={value}
              />
            </div>

            <div className='hint'>
              <p>
                Подсказка: Вы можете двигать красную метку{' '}
                <img
                  className='hint-img'
                  src='/geo-red.png'
                  alt='Image'
                />
                чтобы указать ваш адрес
              </p>
            </div>

            {position ? (
              <MapContainer
                center={position}
                zoom={13}
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                <Marker
                  position={position}
                  icon={markerIcon}
                  draggable={true}
                  eventHandlers={{ dragend: handleMarkerDragEnd }}
                >
                  <Popup>Ваше местоположение</Popup>
                </Marker>
              </MapContainer>
            ) : (
              ''
            )}

            <div className='item'>
              <label htmlFor='city'>Город</label>
              <input
                minLength={2}
                maxLength={30}
                id='city'
                name='city'
                type='text'
                placeholder={
                  type === 'Попутчики' ? 'Куда вы собираетесь' : 'Расположение'
                }
                required
              />
            </div>
            <div className='item'>
              <label htmlFor='address'>
                {type === 'Попутчики' ? 'Место встречи' : 'Адрес'}
              </label>
              <input
                id='address'
                name='address'
                type='text'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder='Ваш адрес'
              />
            </div>
            {type === 'Попутчики' ? (
              <div className='item'>
                <label htmlFor='property'>Вид туризма</label>
                <select name='property'>
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
            ) : (
              <div className='item'>
                <label htmlFor='property'>Вид жилья</label>
                <select name='property'>
                  <option value='Апартамент'>Апартамент</option>
                  <option value='Дом'>Дом</option>
                </select>
              </div>
            )}
            <div className='item'>
              <label htmlFor='latitude'>Широта</label>
              <input
                id='latitude'
                name='latitude'
                type='text'
                value={latitude || ''}
                readOnly
              />
            </div>
            <div className='item'>
              <label htmlFor='longitude'>Долгота</label>
              <input
                id='longitude'
                name='longitude'
                type='text'
                value={longitude || ''}
                readOnly
              />
            </div>

            {type === 'Попутчики' && (
              <>
                <div className='item'>
                  <label htmlFor='gender'>Ваш пол</label>
                  <select name='gender'>
                    <option value='man'>Муж.</option>
                    <option value='woman'>Жен.</option>
                    <option value='trans'>Трансгендер</option>
                  </select>
                </div>
                <div className='item'>
                  <label htmlFor='choice'>Кого вы ищите</label>
                  <select name='choice'>
                    <option value='Парня'>Парня</option>
                    <option value='Девушку'>Девушку</option>
                    <option value='Парней'>Парней</option>
                    <option value='Девушек'>Девушек</option>
                    <option value='Совместную пару'>Совместную пару</option>
                    <option value='Делового партнера'>Делового партнера</option>
                    <option value='Спонсора'>Спонсора</option>
                    <option value='Любую компанию'>Любую компанию</option>
                    <option value='Религиозного человека'>
                      Религиозного человека
                    </option>
                  </select>
                </div>
                <div className='item'>
                  <label htmlFor='period'>Период отдыха</label>
                  <input
                    min={1}
                    id='period'
                    name='period'
                    type='number'
                    placeholder='На сколько дней'
                    required
                  />
                </div>
              </>
            )}

            {type !== 'Попутчики' && (
              <>
                <div className='item'>
                  <label htmlFor='utilities'>Ком. услуга</label>
                  <select name='utilities'>
                    <option value='owner'>Оплачивает хозяин</option>
                    <option value='tenant'>Оплачивает гость</option>
                    <option value='shared'>Общий</option>
                  </select>
                </div>
                <div className='item'>
                  <label htmlFor='bedroom'>Кол. комнат</label>
                  <input
                    min={1}
                    id='bedroom'
                    name='bedroom'
                    type='number'
                    placeholder='Количество'
                    required
                  />
                </div>
                <div className='item'>
                  <label htmlFor='bathroom'>Кол. санузлов</label>
                  <input
                    min={1}
                    id='bathroom'
                    name='bathroom'
                    type='number'
                    placeholder='Количество'
                    required
                  />
                </div>
                <div className='item'>
                  <label htmlFor='pet'>Домашние животные</label>
                  <select name='pet'>
                    <option value='Разрешается'>Разрешается</option>
                    <option value='Не Разрешается'>Не Разрешается</option>
                  </select>
                </div>
                <div className='item'>
                  <label htmlFor='parking'>Паркинг</label>
                  <select name='parking'>
                    <option value='Есть'>Есть</option>
                    <option value='Нету'>Нету</option>
                  </select>
                </div>
                <div className='item'>
                  <label htmlFor='telephone'>Телефон</label>
                  {/* <input
                    id=''
                    name=''
                    type='number'
                    placeholder='Ваш номер телефона'
                  /> */}
                  <InputMask
                    minLength={10}
                    id='telephone'
                    name='telephone'
                    mask='+7 (999) 999-99-99'
                    placeholder='+7 (___) ___-__-__'
                    required
                  ></InputMask>
                </div>
              </>
            )}

            {/* <div className='item'>
              <label htmlFor='income'>Курить</label>
              <input
                id='income'
                name='income'
                type='text'
                placeholder='Income Policy'
              />
            </div>
            <div className='item'>
              <label htmlFor='size'>Total Size (sqft)</label>
              <input
                min={0}
                id='size'
                name='size'
                type='number'
              />
            </div>
            <div className='item'>
              <label htmlFor='school'>School</label>
              <input
                min={0}
                id='school'
                name='school'
                type='number'
              />
            </div>
            <div className='item'>
              <label htmlFor='bus'>bus</label>
              <input
                min={0}
                id='bus'
                name='bus'
                type='number'
              />
            </div>
            <div className='item'>
              <label htmlFor='restaurant'>Restaurant</label>
              <input
                min={0}
                id='restaurant'
                name='restaurant'
                type='number'
              />
            </div> */}
            <button className='sendButton'>
              {!isLoading ? 'Создать' : 'Ожидайте'}
            </button>
            {error && <span>error</span>}
          </form>
        </div>
      </div>
      <div className='sideContainer'>
        {images.map((image, index) => (
          <img
            src={image}
            key={index}
            alt='Image'
          />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: 'blablatravel',
            uploadPreset: 'blablatravel',
            maxImageFileSize: 2000000,
            folder: 'posts',
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
