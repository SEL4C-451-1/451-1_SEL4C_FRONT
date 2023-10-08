import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Admin from './pages/Admin';
import Login from './pages/Login';
import MetricsPanel from './pages/MetricsPanel';
import Profile from './pages/Profile';
import NoPage from './pages/NoPage';
import { Navibar } from './components/Navibar';
import { removeToken, isAdmin } from './models/token';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        isAdmin()
            .then(result => {
                setIsAuthenticated(result);
                if (result === false) {
                    removeToken();
                }
            })
            .catch(error => {
                console.error('Error checking authentication:', error);
            });
    }, []);

    const onLogin = () => {
        setIsAuthenticated(true);
    };

    const onLogout = () => {
        removeToken();
        setIsAuthenticated(false);
    };

    return (
        <BrowserRouter>
            <Navibar isAuthenticated={isAuthenticated} onLogout={onLogout} />
            <Routes>
                <Route
                    path=""
                    element={
                        isAuthenticated ? (
                            <MetricsPanel />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="admin"
                    element={
                        isAuthenticated ? (
                            <Admin />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="login"
                    element={<Login onLogin={onLogin} />}
                />
                <Route
                    path="profile"
                    element={
                        isAuthenticated ? (
                            <Profile />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route path="*" element={<NoPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;