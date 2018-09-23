import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import logo from '../../logo.svg';

class Layout extends React.Component
{
    render()
    {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">На цьому місці буде зведено сайт, присвячений українській мові.</h1>
                </header>
                <Header />
                <div>{this.props.children}</div>
                <Footer />
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
            </div>
        );
    }
}

export default Layout;