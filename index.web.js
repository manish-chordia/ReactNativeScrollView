import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
var ReactDOM = require('react-dom');
import App from './App';
window.addEventListener('DOMContentLoaded', () => {
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
    let container = document.createElement('div');
    container.id = 'fk-react-native';
    container.style.height = '100%';
    document.body.appendChild(container);
    ReactDOM.render(<App />, container);
    // Remove the loader
    let loader = document.getElementById('initialLoader');
    loader && loader.parentElement.removeChild(loader);
});
