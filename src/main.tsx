import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;
rootElement.classList.add('dark');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
