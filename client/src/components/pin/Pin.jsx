import { Marker, Popup } from 'react-leaflet';
import './pin.scss';
import { Link } from 'react-router-dom';

function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className='popupContainer'>
          <img
            src={item.images[0]}
            alt=''
          />
          <div className='textContainer'>
            <Link to={`/${item.id}`}>{item.title}</Link>
            <span>Вид: {item.property}</span>

            <span>
              {item.type === 'Попутчики' ? 'Бюджет: ' : ''}
              <b>
                {item.price} ₸ {item.type === 'Жилье' ? 'в день' : ''}
              </b>
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
