import { Link } from 'react-router-dom';
import './card.scss';

function Card({ item }) {
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
              className='flight'
              src='/flight.png'
              alt='Image'
            />
            {item.city}
          </p>
        </div>
        {/* <p className='address'>
          <img
            src='/geo.png'
            alt=''
          />
          <span>{item.address}</span>
        </p> */}

        <p className='price'>Бюджет: {item.price} $</p>
        <p>Вид: {item.property}</p>
        <p>
          Период отдыха: {item.period}{' '}
          {item.period > 4 ? 'дней' : item.period === 1 ? 'день' : 'дня'}
        </p>
        <div className='bottom'>
          <div className='features'>
            {item.type === 'Попутчики' ? (
              <>
                <div className='feature'>
                  Я
                  <img
                    style={{ width: 25, height: 25 }}
                    src={
                      item.gender === 'male'
                        ? '/man.png'
                        : item.gender === 'female'
                        ? '/woman.png'
                        : '/trans.png'
                    }
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
            <div className='icon'>
              <img
                src='/save.png'
                alt=''
              />
            </div>
            <div className='icon'>
              <img
                src='/chat.png'
                alt=''
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
