const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

var counter = 1;

app.get('/api/hello', (req, res) =>
{    
    res.send({ message: `Message #${counter++} from the server!` });
});

app.get('/api/article/:id', (req, res) =>
{    
    res.send({ message: `Text of article #${req.params.id}.` });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

const defaultPort = process.env.DEVMODE ? 3001 : 3000;
// if not in production, we should be able to run server and client on different ports simultaneously (and use proxy on client to redirect API calls).

const port = process.env.PORT || defaultPort;

app.listen(port);
console.log('Listening on port ' + port);