import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import store from './Redux/Store';

import App from './App.tsx';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
