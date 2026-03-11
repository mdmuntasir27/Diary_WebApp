import React, { useState, useEffect, useContext } from 'react';
import { Moon, Sun, LogOut, Plus, Trash2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';

function Dashboard() {
    const { user, token, logout, theme, toggleTheme } = useContext(AuthContext);
    const [journals, setJournals] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const fetchJournals = async () => {
        try {
            const res = await fetch('/api/journals', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setJournals(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) fetchJournals();
    }, [token]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/journals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, content })
            });
            if (!res.ok) throw new Error('Failed to create journal');

            setTitle('');
            setContent('');
            fetchJournals();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/journals/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchJournals();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h2>My Journals</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-ghost" onClick={toggleTheme}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <button className="btn btn-danger" onClick={logout}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </header>

            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <h3>New Entry</h3>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleCreate} style={{ marginTop: '1rem' }}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <textarea
                            className="input-field"
                            placeholder="Write your thoughts..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        <Plus size={20} /> Add Journal
                    </button>
                </form>
            </div>

            <div className="journal-list">
                {journals.map(journal => (
                    <div key={journal._id} className="journal-item">
                        <div className="journal-content">
                            <div className="journal-title">{journal.title}</div>
                            <div className="journal-date">{new Date(journal.createdAt).toLocaleString()}</div>
                            <div className="journal-body">{journal.content}</div>
                        </div>
                        <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => handleDelete(journal._id)}>
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
                {journals.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No journals yet. Start writing!
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
