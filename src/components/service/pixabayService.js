import axios from 'axios';
import Notiflix from 'notiflix';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '45180979-107bff5819a4dc169e4529cb0';

const options = {
  position: 'center-center',
  timeout: 4000,
  width: '750px',
  fontSize: '30px',
};

const pixabayService = {
  async search(query, page = 1, perPage = 12) {
    try {
      const params = {
        q: query,
        page,
        key: API_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        per_page: perPage,
      };

      const { data } = await axios.get('/', { params });

      const { hits, totalHits } = data;

      if (!Array.isArray(hits)) {
        Notiflix.Notify.failure(
          'Invalid format, hits should be an array!',
          options
        );
        return { images: [], totalHits: 0 };
      }

      if (hits.length === 0) {
        Notiflix.Notify.info(
          'Sorry, there is no content matching your request ^_^',
          options
        );
        return { images: [], totalHits: 0 };
      }

      const formattedHits = hits.map(
        ({ id, tags, webformatURL, largeImageURL }) => ({
          id,
          tags,
          webformatURL,
          largeImageURL,
        })
      );

      return { images: formattedHits, totalHits };
    } catch (error) {
      console.error('Pixabay Search Error:', error);
      Notiflix.Notify.failure(`Error: ${error.message}`, options);
      return { images: [], totalHits: 0 };
    }
  },
};

export default pixabayService;
