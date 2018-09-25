import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';

require('@babel/polyfill');

var app = (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

var isInitialRender = false;

var renderMethod = isInitialRender ? ReactDOM.hydrate : ReactDOM.render;

renderMethod(app, document.getElementById('root'));

registerServiceWorker();
