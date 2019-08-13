import React from 'react';
import ReactDOM from 'react-dom';
import {Normalize} from 'styled-normalize';
import App from './App';
import {GlobalStyle} from './GlobalStyle';

ReactDOM.render(
  <>
    <Normalize />
    <GlobalStyle />
    <App />
  </>,
  document.getElementById('root'),
);
