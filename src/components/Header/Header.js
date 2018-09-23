import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component
{
    render()
    {
        return (
            <div>Шапка. <Link to='/'>Домівка</Link><Link to='/article'>Стаття</Link></div>
        );
    }
}

export default Header;