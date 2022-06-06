import ReactDOM from 'react-dom/client';
import App from './App';
import React from 'react';


import './services/firebase';

import './styles/global.scss';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//HTML dentro do JS => JSX