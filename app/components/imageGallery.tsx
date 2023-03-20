import { useSwipeable } from 'react-swipeable';
import styles from '../styles/imageGallery.module.css';
import config from 'next/config';

function ImageGallery({ images, currentImageIndex, setCurrentImageIndex, t }) {
    const handleNext = () => {
        setCurrentImageIndex((currentImageIndex + 1) % images.length);
      };
    
      const handlePrev = () => {
        setCurrentImageIndex((currentImageIndex + images.length - 1) % images.length);
      };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventScrollOnSwipe: true,
    trackMouse: true,
    ...config,
  });

  return (images.length > 0 ? <div className={styles.container}>
    <div className={styles.inner_container}>
    {images.length > 1 ? <button className={styles.gallery_button} onClick={handlePrev}>
      <img src='/icons/arrow_left.svg' />
    </button> : null}
    <div className={styles.image_gallery_container}>
        <div {...handlers}>
            <div className={styles.image_gallery} >
                <img className={styles.image} src={images[currentImageIndex]} />
            </div>
        </div>
    </div>
    {images.length > 1 ? <button className={styles.gallery_button} onClick={handleNext}>
        <img src='/icons/arrow_right.svg' />
    </button> : null}
    </div>
    <text>{t('image')} {currentImageIndex + 1}</text>
</div> : null
  )
}

export default ImageGallery