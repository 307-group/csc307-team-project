// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyApp from './MyApp';
import './main.css';

const root = document.getElementById('root');

// Create a root
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <MyApp />
  </BrowserRouter>
);
