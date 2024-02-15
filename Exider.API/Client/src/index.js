import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Loading from './services/accounts/pages/confirm/Loading';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import './translation';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <BrowserRouter basename={baseUrl}>
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </BrowserRouter>);

serviceWorkerRegistration.unregister();

reportWebVitals();
