import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	state = { users: "none" };
	
	async componentDidMount()
	{
    var res = await fetch('/api/users');
    var json = await res.json();
    this.setState({ users: json.toString() });
    console.info(json);    
	}
	
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
			    <span>Users=</span>
			    <span>{this.state.users}</span>
        </p>
      </div>
    );
  }
}

export default App;
