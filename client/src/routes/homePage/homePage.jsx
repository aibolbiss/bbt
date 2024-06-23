import { useContext } from 'react';
import SearchBar from '@/components/searchBar/SearchBar';
import './homePage.scss';
import { AuthContext } from '@/context/AuthContext';

function HomePage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className='homePage'>
      <div className='textContainer'>
        <div className='wrapper'>
          <h1 className='title'>ТОП сайт для поиска попутчика</h1>
          <p>Найди попутчика и вместе открывай новые горизонты приключений!</p>
          <SearchBar />
          {/* <div className='boxes'>
            <div className='box'>
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className='box'>
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className='box'>
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div> */}
        </div>
      </div>
      <div className='imgContainer'>
        <img
          src='/bg.png'
          alt='Image'
        />
      </div>
    </div>
  );
}

export default HomePage;
