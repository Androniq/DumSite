import React, { Component } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './routes/Home/Home';
import About from './routes/About/About';
import Article from './routes/Article/Article';
import Error from './routes/Error/Error';

class App extends Component {
  render() {
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
