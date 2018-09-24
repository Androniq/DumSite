import React from 'react';

const defaultState = { message: "We didn't receive article text from the server yet." };

export default class Article extends React.Component
{
    state = defaultState;

    componentDidMount()
    {
        this.refreshData();
    }

    async componentWillReceiveProps()
    {
        await this.setState(defaultState);
        this.refreshData();
    }

    async refreshData()
    {
        var req = await fetch('/api/article/' + this.props.match.params.id);
        var json = await req.json();
        var message = json.message;
        this.setState({ message });
    }

    render()
    {
        return (
            <div>
                <h2>Article {this.props.match.params.id}:</h2>
                <p>{this.state.message}</p>
            </div>
            );
    }
}
