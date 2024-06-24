import { useContext, useState, useEffect, useMemo } from 'react';
import SearchBar from '@/components/searchBar/SearchBar';
import './homePage.scss';
import { AuthContext } from '@/context/AuthContext';

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  const texts = ['Попутчика', 'Жилья'];
  const [currentText, setCurrentText] = useState('');
  const [count, setCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = texts[count];
      let updatedText = isDeleting
        ? fullText.slice(0, index - 1)
        : fullText.slice(0, index + 1);

      setCurrentText(updatedText);

      if (!isDeleting && updatedText.length === fullText.length) {
        setTimeout(() => setIsDeleting(true), 1000); // Pause before deleting
      } else if (isDeleting && updatedText.length === 0) {
        setIsDeleting(false);
        setCount((count + 1) % texts.length);
      }

      setIndex((prevIndex) => (isDeleting ? prevIndex - 1 : prevIndex + 1));
    };

    const typingInterval = setTimeout(handleTyping, 150); // Adjust typing speed here
    return () => clearTimeout(typingInterval);
  }, [currentText, index, count, isDeleting, texts]);

  return (
    <div className='homePage'>
      <div className='textContainer'>
        <div className='wrapper'>
          <h1 className='title'>ТОП сайт для поиска {currentText}</h1>
          <p>Найди попутчика и вместе открывай новые горизонты приключений!</p>
          <SearchBar />
          {/* <div className='boxes'>
            <div className='box'>
              <h1>1</h1>
              <h2>Страны</h2>
            </div>
            <div className='box'>
              <h1>0</h1>
              <h2>Попутчики</h2>
            </div>
            <div className='box'>
              <h1>0</h1>
              <h2>Жилье</h2>
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
