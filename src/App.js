import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './routes/Home/Home';
import About from './routes/About/About';
import Article from './routes/Article/Article';
import Error from './routes/Error/Error';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/about' component={About} />
            <Route path='/article/:id' component={Article} />
            <Route component={Error} />
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
