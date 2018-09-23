import React from 'react';
import { asyncComponent } from 'react-async-component';

class Article extends React.Component
{
    async componentDidMount()
    {
        var f = await fetch('/api/hello', { method: 'GET', headers: new Headers({ 'Content-Type': 'application/json' })});
        console.info(f);
        var j = await f.json();
        console.info(j);
    }

    render()
    {
        return (
            <div>Стаття</div>
        );
    }
}

export default asyncComponent({resolve: () =>
    {
        return Article;
    }});