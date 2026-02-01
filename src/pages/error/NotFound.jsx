import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="error-page">
            <div className="container">
                <h1>404</h1>
                <h2>Không tìm thấy trang</h2>
                <p>Trang bạn đang tìm kiếm không tồn tại</p>
                <Link to="/" className="btn-primary">
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
