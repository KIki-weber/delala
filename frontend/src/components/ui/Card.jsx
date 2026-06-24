import React from 'react';

const Card = ({ children, className = '', onClick }) => {
    return (
        <div 
            onClick={onClick}
            className={`border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;