import React from 'react';
// import PropTypes from 'prop-types';
import gif from './load.gif';
import './spinner.css';

const gifStyle = {
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '10%',
};

const Spinner = ({ loading }) => {
  return (
    loading ? <img style={gifStyle} src={gif} />
    : null
  );
};

// Spinner.propTypes = {
//   loading: PropTypes.bool.isRequired,
// };

export default Spinner;
