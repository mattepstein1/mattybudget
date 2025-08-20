import React, { useContext } from 'react';
import heroImgLight from './assets/hero-banner-light.png';
import heroImgDark from './assets/hero-banner-dark.png';
import { AuthProvider, ThemeProvider, ThemeContext } from './AuthContext';
import './styles/Home.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ParticleBackground from './components/ParticleBackground';

const App: React.FC = () => {
    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <ThemeProvider>
            <AuthProvider>
                <ThemeContext.Consumer>
                    {(themeContext) => {
                        const theme = themeContext?.theme || 'light';
                        return (
                            <>
                                <ParticleBackground />
                                <Router>
                                    <Header />
                                    <Switch>
                                        <Route path="/login" component={Login} />
                                        <Route
                                            path="/dashboard"
                                            render={() => (isLoggedIn ? <Dashboard /> : <Redirect to="/login" />)}
                                        />
                                        <Route path="/" exact>
                                            <div className="home-hero-container">
                                                <img src={theme === 'dark' ? heroImgDark : heroImgLight} alt="Hero" />
                                                <h1>Welcome to Matty E's Budget App</h1>
                                                <p className="lead">
                                                    Take control of your finances with a beautiful, modern dashboard and easy expense tracking.
                                                </p>
                                            </div>
                                        </Route>
                                    </Switch>
                                    <Footer />
                                </Router>
                            </>
                        );
                    }}
                </ThemeContext.Consumer>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;