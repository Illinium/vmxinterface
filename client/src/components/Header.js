// import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div>
            <h1>VMXInterface</h1>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/logs">Logs</Link></li>
                </ul>
            </nav>
        </div>
    ) 
}

export default Header;