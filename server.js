const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/users', (req, res) =>
{
    res.send({message:"I am that second code3"});
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

const defaultPort = process.env.NODE_ENV === 'production' ? 3000 : 3001;
// if not in production, we should be able to run server and client on different ports simultaneously (and use proxy on client to redirect API calls).
// Anyway, if process.env.NODE_ENV === 'production', then we probably already have process.env.PORT assigned, so we won't need the default value.

const port = process.env.PORT || defaultPort;

app.listen(port);
console.log('Listening on port ' + port);