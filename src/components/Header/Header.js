import React from 'react';
import logo from '../../logo.svg';
import { Link } from 'react-router-dom';

export default class Header extends React.Component
{
    render()
    {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">React-Express for Heroku boilerplate</h1>
                <div className="App-navpanel">
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
