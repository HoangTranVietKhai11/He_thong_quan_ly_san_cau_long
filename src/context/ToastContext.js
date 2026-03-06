import React, { createContext, useState, useContext, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, variant = 'info', duration = 3000) => {
        const id = Date.now();
        const toast = {
            id,
            message,
            variant, // success, danger, warning, info
            show: true
        };

        setToasts(prev => [...prev, toast]);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showSuccess = useCallback((message, duration) => {
        return showToast(message, 'success', duration);
    }, [showToast]);

    const showError = useCallback((message, duration) => {
        return showToast(message, 'danger', duration);
    }, [showToast]);

    const showWarning = useCallback((message, duration) => {
        return showToast(message, 'warning', duration);
    }, [showToast]);

    const showInfo = useCallback((message, duration) => {
        return showToast(message, 'info', duration);
    }, [showToast]);

    const value = {
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeToast
    };

    return (
        <ToastContext.Provider value={value}>
            {children}

            {/* Toast Container */}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        show={toast.show}
                        onClose={() => removeToast(toast.id)}
                        bg={toast.variant}
                        delay={3000}
                        autohide
                    >
                        <Toast.Header>
                            <strong className="me-auto">
                                {toast.variant === 'success' && 'Thành công'}
                                {toast.variant === 'danger' && 'Lỗi'}
                                {toast.variant === 'warning' && 'Cảnh báo'}
                                {toast.variant === 'info' && 'Thông báo'}
                            </strong>
                        </Toast.Header>
                        <Toast.Body className={toast.variant === 'success' || toast.variant === 'danger' ? 'text-white' : ''}>
                            {toast.message}
                        </Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastContext;
