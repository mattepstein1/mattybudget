import React from 'react';
import './Components.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Matty E's Budgeting App. All rights reserved.</p>
        </footer>
    );
};

export default Footer;