import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="error-page">
            <div className="container">
                <h1>403</h1>
                <h2>Không có quyền truy cập</h2>
                <p>Bạn không có quyền truy cập trang này</p>
                <Link to="/" className="btn-primary">
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
