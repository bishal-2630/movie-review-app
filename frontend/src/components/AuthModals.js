import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModals.css';

const AuthModals = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { login, register } = useAuth();

    const resetForm = () => {
        setFormData({
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
        });
        setError('');
        setSuccess('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (mode === 'login') {
                if (!formData.email || !formData.password) {
                    throw new Error('Please fill in all fields');
                }

                const result = await login(formData.email, formData.password);
                if (result.success) {
                    setSuccess('Login successful');
                    setTimeout(() => {
                        handleClose();
                    }, 1000);
                } else {
                    throw new Error(result.error);
                }
            } else {
                if (!formData.email || !formData.username || !formData.password) {
                    throw new Error('Please fill in all fields');
                }
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                if (formData.password.length < 6) {
                    throw new Error('Password must be at least 6 characters');
                }
                const result = await register({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password
                });

                if (result.success) {
                    setSuccess('Registration successful! You are now logged in.');
                    setTimeout(() => {
                        handleClose();
                    }, 1500);
                } else {
                    throw new Error(result.error);
                }
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        resetForm();
    };
    if (!isOpen) return null;

    return (
        <div className='auth-modal-overlay' onClick={handleClose}>
            <div className='auth-modal' onClick={(e) => e.stopPropagation()}>
                <button className='close-button' onClick={handleClose}>×</button>

                <div className='auth-modal-header'>
                    <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>{mode === 'login' ? 'Sign in to your account' : 'Join our movie community'}</p>
                </div>
                {error && <div className='error-message'>{error}</div>}
                {success && <div className='success-message'>{success}</div>}

                <form onSubmit={handleSubmit} className='auth-form'>
                    {mode === 'register' && (
                        <div className='form-group'>
                            <label htmlFor='username'>Username</label>
                            <input
                                type='text'
                                id='username'
                                name='username'
                                value={formData.username}
                                onChange={handleChange}
                                placeholder='Chhose a username'
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='your@email.com'
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            disabled={loading}
                        />
                    </div>

                    {mode === 'register' && (
                        <div className='form-group'>
                            <label htmlFor='confirmPassword'>Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                disabled={loading}
                            />
                        </div>
                    )}

                    <button
                        type='submit'
                        className='submit-button'
                        disabled={loading}
                    >
                        {loading ? (
                            <div className='loading-spinner'></div>
                        ) : mode === 'login' ? (
                            'Sign In'
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>
                <div className='auth-switch'>
                    <p> {mode === 'login' ? "Don't have an account?" : "Already have an account?"}

                        <button className='switch-link' onClick={switchMode}>
                            {mode === 'login' ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModals;