import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './routes/Home/Home';
import About from './routes/About/About';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/about' component={About} />
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
