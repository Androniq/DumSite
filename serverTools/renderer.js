import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';

// import our main App component
import App from '../src/App';

const path = require("path");
const fs = require("fs");

export default (req, res, next) =>
{
    const css = new Set();
    const context = 
    {
        insertCss: (...styles) => {
            console.info(styles);
            styles.forEach(style =>
            {
                //css.add(style._getCss());
            });},
        path: req.path,
        query: req.query
    }

    // point to the html file created by CRA's build tool
    const filePath = path.resolve(__dirname, '..', 'dist', 'index.html');

    fs.readFile(filePath, 'utf8', (err, htmlData) =>
    {
        if (err)
        {
            console.error('Error on ReadFile', err);
            return res.status(404).end();
        }

        const app = (
            <StaticRouter context={context}>
                <App context={context} />
            </StaticRouter>
        );

        // render the app as a string
        const html = ReactDOMServer.renderToString(app);

        // inject the rendered app into our html and send it
        return res.send(
            htmlData.replace(
                '<div id="root1"></div>',
                `<div id="root">${html}</div>`
            )
        );
    });
}