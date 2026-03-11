import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Moon, Sun } from 'lucide-react';
import AuthContext from '../context/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, theme, toggleTheme } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            login(data.user, data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <button 
                className="btn btn-ghost" 
                onClick={toggleTheme}
                style={{ position: 'absolute', top: '1rem', right: '1rem' }}
            >
                {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
            <div className="glass-card auth-box">
                <h2 className="auth-title">Welcome Back</h2>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        <LogIn size={20} /> Login
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
