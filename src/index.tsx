import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

ReactDOM.render(
    <AuthProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AuthProvider>,
    document.getElementById('root')
);