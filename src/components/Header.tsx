import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../AuthContext';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Header: React.FC = () => {
    const history = useHistory();
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const themeContext = useContext(ThemeContext);
    const theme = themeContext?.theme || 'light';
    const setTheme = themeContext?.setTheme;

    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        history.push('/');
        alert('You have been logged out.');
    };

    const handleThemeToggle = () => {
        if (setTheme) {
            setTheme(theme === 'light' ? 'dark' : 'light');
        }
    };

    return (
        <header className={`navbar navbar-expand-lg ${theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} shadow-sm sticky-top`}>
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <Link className="navbar-brand fw-bold" to="/">
                    <span className="me-2 material-icons align-middle">account_balance_wallet</span>
                    Matty E's Budget App
                </Link>
                <div className="d-flex align-items-center gap-3">
                    <div className="theme-toggle-flex">
                        <span className={`material-icons theme-icon-sun${theme === 'light' ? ' active' : ''}`}>light_mode</span>
                        <label className="theme-switch-label">
                            <input
                                type="checkbox"
                                id="themeSwitch"
                                checked={theme === 'dark'}
                                onChange={handleThemeToggle}
                                className="theme-switch-input"
                            />
                            <span className="theme-switch-slider"></span>
                        </label>
                        <span className={`material-icons theme-icon-moon${theme === 'dark' ? ' active' : ''}`}>nightlight_round</span>
                    </div>
                    <ul className="navbar-nav flex-row gap-2 mb-0">
                        {!isLoggedIn ? (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    Login
                                </Link>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-danger nav-link text-white px-3"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;