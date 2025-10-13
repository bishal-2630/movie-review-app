import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import './AuthModals.css';

const LoginModal = ({ isOpen, onClose, switchToRegister }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(credentials.email, credentials.password);
        if (result.success) {
            onClose();
        } else {
            setError(result.error);
        }
        setLoading(false);
    };
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                </form>
            </div>
        </div>
    );
};


