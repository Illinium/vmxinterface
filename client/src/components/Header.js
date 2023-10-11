// import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css'

function Header() {
    return (
        <header>
            <Link to="/"><h2>VMXInterface</h2></Link>
            <div className='navbar'>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/logs">Logs</Link></li>
                </ul>
            </div>
        </header>
    ) 
}

export default Header;