import React, { useState, useEffect, useCallback } from 'react';
import Searchbar from './Searchbar/Searchbar';
import Loader from './Loader/Loader';
import ImageGallery from './ImageGallery/ImageGallery';
import Scroll from './Scroll/Scroll';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import pixabayService from './service/pixabayService';
import Notiflix from 'notiflix';

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    if (query === '' || isLastPage) {
      return;
    }

    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const { images: newImages, totalHits } = await pixabayService.search(
          query,
          page
        );

        if (newImages.length === 0 && page === 1) {
          Notiflix.Notify.info('No result found for your query', {
            position: 'center-center',
            timeout: 3000,
            width: '450px',
          });
        }

        setImages(prevImages => {
          const updatedImages =
            page === 1 ? newImages : [...prevImages, ...newImages];
          setIsLastPage(
            newImages.length === 0 || updatedImages.length >= totalHits
          );
          return updatedImages;
        });
      } catch (err) {
        Notiflix.Notify.failure(`Failed to fetch images: ${err.message}`, {
          position: 'center-center',
          timeout: 3000,
          width: '450px',
        });
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [query, page, isLastPage]);

  const handleSubmit = useCallback(
    newQuery => {
      if (newQuery.trim() !== query) {
        setQuery(newQuery.trim());
        setImages([]);
        setPage(1);
        setIsLastPage(false);
        setError(null);
      }
    },
    [query]
  );

  const handleImageClick = useCallback(image => {
    setSelectedImage(image);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleModalClose = () => {
    setSelectedImage(null);
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <>
      <Searchbar onSubmit={handleSubmit} />
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {isLoading ? (
        <Loader />
      ) : (
        images.length > 0 && !isLastPage && <Button onClick={loadMore} />
      )}
      {showModal && <Modal image={selectedImage} onClose={handleModalClose} />}
      <Scroll />
    </>
  );
};

export default App;
