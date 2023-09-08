import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MyContextProvider } from './contextStore';
import { Toaster } from "react-hot-toast"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MyContextProvider>
      <div><Toaster position="top-right" /></div>
      <App />
    </MyContextProvider>
  </React.StrictMode>
);


