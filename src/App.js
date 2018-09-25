import React, { Component } from 'react';
import PropTypes from 'prop-types';
import s from './App.css';
import { Switch, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './routes/Home/Home';
import About from './routes/About/About';
import Article from './routes/Article/Article';
import Error from './routes/Error/Error';

class App extends Component
{
  static childContextTypes =
  {
    insertCss: PropTypes.func,
    path: PropTypes.string,
    query: PropTypes.object
  }

  getChildContext()
  {
    return this.props.context;
  }

  render()
  {
    return (
        <Layout>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/about' component={About} />
            <Route path='/article/:id' render={Article} />
            <Route component={Error} />
          </Switch>
        </Layout>
    );
  }
}

export default App;
