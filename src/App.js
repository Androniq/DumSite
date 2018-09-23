import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import './App.css';
import Home from './routes/Home/Home';
import Article from './routes/Article/Article';
import Layout from './components/Layout/Layout';

class App extends Component
{
    render()
    {
      return (
        <BrowserRouter>
          <Layout>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/article" component={Article} />
            </Switch>
          </Layout>
        </BrowserRouter>
    );
  }
}

export default App;
