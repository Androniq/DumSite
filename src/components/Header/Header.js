import React from 'react';
import logo from '../../logo.svg';
import { Link } from 'react-router-dom';
import s from './Header.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class Header extends React.Component
{
    render()
    {
        return (
            <header className={s.AppHeader}>
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className={s.AppTitle}>React-Express for Heroku boilerplate</h1>
                <div className={s.AppNavpanel}>
                    <Link className='App-link' to='/'>Home</Link>
                    <Link className='App-link' to='/about'>About</Link>
                    <Link className='App-link' to='/article/1'>Article 1</Link>
                    <Link className='App-link' to='/article/2'>Article 2</Link>
                    <Link className='App-link' to='/article/3'>Article 3</Link>
                </div>
            </header>
            );
    }
}

export default withStyles(s)(Header);