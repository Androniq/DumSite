import React from 'react';

export default class Article extends React.Component
{
    render()
    {
        console.info(this.props);
        return (
            <div>
                <h2>Article {this.props.match.params.id}:</h2>
                <p>Lorem ipsum dolor sit amet...</p>
            </div>
            );
    }
}
