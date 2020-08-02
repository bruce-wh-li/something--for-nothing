import React from 'react';
// import PropTypes from 'prop-types';

import Header from '../header/HeaderComponent';
import Footer from '../footer/FooterComponent';
import './layout.css';

export default ({ children }) => (

  <main>
    <Header siteTitle="Welcome to my code code challenge" />
    {children}
    <Footer />
  </main>

);

// Layout.propTypes = {
//   children: PropTypes.node.isRequired,
// };
