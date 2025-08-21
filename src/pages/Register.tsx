import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5000/api/users/register', { username, password });
            alert('Registration successful! You can now log in.');
            history.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed.');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Register</h1>
            <form onSubmit={handleRegister} className="add-expense-form glass-card" style={{ maxWidth: 400, margin: '0 auto' }}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger mt-2">{error}</div>}
                <button type="submit" className="btn btn-primary btn-block mt-3">Register</button>
            </form>
        </div>
    );
};

export default Register;
export {};