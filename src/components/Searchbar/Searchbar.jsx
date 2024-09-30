import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Searchbar.module.css';
import SearchForm from 'components/SearchForm/SearchForm';

const Searchbar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleChange = event => {
    setQuery(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }
    onSubmit(query);
  };

  return (
    <header className={styles.Searchbar}>
      <SearchForm
        onSubmit={handleSubmit}
        onChange={handleChange}
        query={query}
      />
    </header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
