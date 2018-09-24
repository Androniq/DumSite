import React from 'react';

export default class Home extends React.Component
{
	state = { resp: "none" };

    async click()
    {
        var res = await fetch('/api/hello');
        var json = await res.json();
        this.setState({ resp: json.message });
        console.info(json);    
    }

    render()
    {
        return (
            <p className="App-intro">
                <button onClick={this.click.bind(this)}>Get some data from server</button>
                <span>Response=</span>
                <span>{this.state.resp}</span>
            </p>
            );
  }
}
