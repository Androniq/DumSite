import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

export default class Layout extends React.Component
{
    render()
    {
        return (
            <div className="App">
                <Header />
                {this.props.children}
                <Footer />
            </div>
            );
  }
}
