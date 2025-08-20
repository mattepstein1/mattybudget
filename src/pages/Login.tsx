import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const { setIsLoggedIn } = useAuth(); // Use the AuthContext

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
            localStorage.setItem('token', response.data.token); // Save the token in localStorage
            setIsLoggedIn(true); // Update the login state globally
            alert('Login successful!');
            history.push('/dashboard'); // Redirect to the dashboard
        } catch (err) {
            alert('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Login</h1>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;