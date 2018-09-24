import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	state = { users: "none" };
	
	async componentDidMount()
	{
    var res = await fetch('/api/hello');
    var json = await res.json();
    this.setState({ resp: json.toString() });
    console.info(json);    
	}
	
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React-Express for Heroku boilerplate</h1>
        </header>
        <p className="App-intro">
          <button>Get some data from server</button>
			    <span>Response=</span>
			    <span>{this.state.resp}</span>
        </p>
      </div>
    );
  }
}

export default App;
