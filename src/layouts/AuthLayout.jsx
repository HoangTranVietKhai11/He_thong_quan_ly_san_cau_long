import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const AuthLayout = () => {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <Container>
                <Outlet />
            </Container>
        </div>
    );
};

export default AuthLayout;
