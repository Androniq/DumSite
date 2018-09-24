import React from 'react';
import { withEverything } from '../../utilities';

class Article extends React.Component
{
    render()
    {
        return (
            <div>
                <h2>Article {this.props.match.params.id}:</h2>
                <p>{this.props.data.message}</p>
            </div>
            );
    }
}

export default withEverything(Article, '/api/article/:id');